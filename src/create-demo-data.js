'use strict';

import program from 'commander';
import CSApiClient from './lib/cs-api-client';
import R from 'ramda';
import Promise from 'bluebird';
import fs from 'fs';

const sample_work_items_to_mention = '../config/sampleWorkItemsToMention.json';
const v1_inboxes = '../config/inboxes.json';
const readFile = Promise.promisify(fs.readFile);
let number_of_instances;
let number_of_repo_iterations;
let number_of_mentions_per_workitem_per_repo;
let fake_work_items_to_mention;
let client;
let options;

let getFromJsonFile = async(fileName) => {
  let fileContent = await readFile(fileName, "utf8");
  return JSON.parse(fileContent);
}

let createMessage = (mention, inbox) => {
  return `${mention} in ${inbox.inboxId} of family = ${inbox.family}`;
}

let createCommit = async(message, inbox) => {
  let commitAddResponse = await inbox.commitCreate(message, options.repourl);
  if (options.debug) {
    console.log(commitAddResponse.message);
  }
}

let createInstanceAndDigest = async(iteration) => {
  let instance = await client.instanceCreate();
  let digest = await instance.digestCreate({
    description: `Digest for ${iteration}`
  });

  if (!options.json) {
    console.log(`The digest: ${digest._links['teamroom-view'].href}&apiKey=${client.apiKey}`);
    console.log(`#${iteration}: Populating instance ${client.instanceId} (apiKey = ${client.apiKey})`);
  }

  return {
    iteration,
    digest
  };
};

//TODO: extract this into a json file
let getInboxesToCreate = async (dto) => {
  let iteration = dto.iteration
  let inboxesToCreate = [{
    name: `GitHub Repo ${iteration}`,
    family: 'GitHub'
  }, {
    name: `GitLab Repo ${iteration}`,
    family: 'GitLab'
  }, {
    name: `Bitbucket Repo ${iteration}`,
    family: 'Bitbucket'
  }, {
    name: `VsoGit Repo ${iteration}`,
    family: 'VsoGit'
  }];
  dto.inboxesToCreate = inboxesToCreate;
  return dto;
}

let createInboxes = async (dto) => {
  dto.inboxes = [];
  for (let inboxToCreate of dto.inboxesToCreate) {
    let inbox = await dto.digest.inboxCreate(inboxToCreate);
    dto.inboxes.push(inbox);
  }
  return dto;
};

let createFakeCommits = async (dto) => {
  let inboxNum = 0;
  let workItemsToMention = await getFromJsonFile(fake_work_items_to_mention);

  fromZeroTo(number_of_repo_iterations, async (iteration) => {
    dto.inboxes.forEach(inbox => {
      let digest = dto.digest;
      let workItemsGroup = workItemsToMention[inboxNum % 4];
      let comma = (iteration === 0 && inboxNum === 0) ? '' : ',';
      inboxNum++;
      if (!options.json) {
        console.log(`Adding commits to ${inbox.inboxId} of family ${inbox.family}`);
        console.log(`${inbox._links['add-commit'].href}?apiKey=${client.apiKey}`);
      } else console.log(`${comma}"${client.baseUrl}/${client.instanceId}/commits/tags/versionone/workitem?numbers=${workItemsGroup.join(',')}&apiKey=${client.apiKey}"`);
      for (let workItem of workItemsGroup) {
        fromZeroTo(number_of_mentions_per_workitem_per_repo, async (mentionNum) => {
          let message = `${workItem} mention # ${mentionNum} on ${iteration} in  ${inbox.inboxId} of family = ${inbox.family}`;
          await createCommit(message, inbox);
        });
      }
    });
  });
}

let fromZeroTo = async(top, fun) => {
  for (let i = 0; i < top; i++) {
    await fun(i);
  }
}

let createInstanceWithFakeData = R.pipeP(
  createInstanceAndDigest,
  getInboxesToCreate,
  createInboxes,
  createFakeCommits
);

let mapInboxesAndStories = async(fun, inboxes) => {
  let sampleWorkItemsToMention = await getFromJsonFile(sample_work_items_to_mention);
  for (let inbox of inboxes) {
    for (let story of sampleWorkItemsToMention) {
      await fun(inbox, story);
    }
  }
}

let createStories = async(inbox, story) => {
  let message = createMessage(story.StoryId, inbox);
  await createCommit(message, inbox);
}

let createStoriesWithTasks = async(inbox, story) => {
  for (let task of story.Tasks) {
    let message = createMessage(`${story.StoryId} ${task}`, inbox)
    await createCommit(message, inbox);
  }
}

let createStoriesWithTests = async(inbox, story) => {
  for (let test of story.Tests) {
    let message = createMessage(`${story.StoryId} ${test}`, inbox)
    await createCommit(message, inbox);
  }
}

let createStoriesWithTestsAndTasks = async(inbox, story) => {
  let mention = `${story.StoryId} `;
  for (let test of story.Tests) {
    mention += test + ' ';
  }
  for (let task of story.Tasks) {
    mention += task + ' ';
  }
  //26 so we pass the 25 mentions total
  await fromZeroTo(26, async (i) => {
    let message = createMessage(`${mention} ${i}`, inbox)
    await createCommit(message, inbox);
  });
}

let createTests = async(inbox, story) => {
  for (let test of story.Tests) {
    let message = createMessage(`${test}`, inbox)
    await createCommit(message, inbox);
  }
}

let createTasks = async(inbox, story) => {
  for (let task of story.Tasks) {
    let message = createMessage(`${task}`, inbox)
    await createCommit(message, inbox);
  }
}

let createMultipleTests = async(inbox, story) => {
  let previousTests = '';
  for (let test of story.Tests) {
    previousTests += test + ' ';
    let message = createMessage(`${previousTests}`, inbox)
    await createCommit(message, inbox);
  }
}

let createMultipleTasks = async(inbox, story) => {
  let previousTasks = '';
  for (let task of story.Tasks) {
    previousTasks += task + ' ';
    let message = createMessage(`${previousTasks}`, inbox)
    await createCommit(message, inbox);
  }
};

let getV1Inboxes = async() => {
  let inboxes = await getFromJsonFile(v1_inboxes);
  inboxes = R.map(i => {
    console.log('About to push commmits into: ');
    console.log(i._links['add-commit'].href);
    return client.getInbox(i);
  }, inboxes);
  return inboxes;
}

let createSampleData = async() => {
  console.log('Creating instance with sample data');
  client = new CSApiClient(options.baseUrl);

  if (!options.json) console.log(`Operating against this CommitStream Service API: ${client.baseUrl}`);
  let inboxes = await getV1Inboxes();
  await mapInboxesAndStories(createStories, inboxes);
  await mapInboxesAndStories(createStoriesWithTasks, inboxes);
  await mapInboxesAndStories(createStoriesWithTests, inboxes);
  await mapInboxesAndStories(createStoriesWithTestsAndTasks, inboxes);
  await mapInboxesAndStories(createTasks, inboxes);
  await mapInboxesAndStories(createTests, inboxes);
  await mapInboxesAndStories(createMultipleTests, inboxes);
  await mapInboxesAndStories(createMultipleTasks, inboxes);
}

let createFakeData = async() => {
  console.log('Creating instance with fake data');
  number_of_instances = parseInt(options.instances);
  number_of_repo_iterations = parseInt(options.repos);
  number_of_mentions_per_workitem_per_repo = parseInt(options.mentions);
  fake_work_items_to_mention = '../config/fakeWorkItemsToMention.json';
  client = new CSApiClient(options.baseUrl);
  fromZeroTo(number_of_instances, async(instanceNumber) => {
    await createInstanceWithFakeData(instanceNumber);
  });
}

program
  .version('0.0.1');

program
  .command('sample')
  .description('Creates the commits with sample data that exists in the PR builds')
  .option('-u, --baseUrl [baseUrl]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api')
  .option('--repourl [repourl]', "Specifies the repository url that is going to be used in the commits")
  .option('-j, --json', 'Log only the JSON output with all the query URLs needed for the performance client')
  .action(function(opt) {
    options = opt;
    try {
      if (options.json) console.log('[');
      createSampleData();
      if (options.json) console.log(']');
    } catch (e) {
      console.log(e);
    }
  });

program
  .command('fake')
  .description('Creates as many instances, repositories, mentions, etc. as necessary. It does not create commits related with existing stories in VersionOne, they are just random.' )
  .option('-u, --baseUrl [baseUrl]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api')
  .option('-i, --instances [number]', 'Number of instances to create, default: 1', 1)
  .option('-r, --repos [number]', 'Number of repos creation iterations to run (creates one repo per family type during each iteration), default 1', 1)
  .option('-m, --mentions [number]', 'Number of times to post a commit with each mention (one story, 5 tasks, 5 tests in each group of workitems), default 1', 1)
  .option('-d, --debug', 'Show results of each commit, not just summary information')
  .option('-j, --json', 'Log only the JSON output with all the query URLs needed for the performance client')
  .option('--repourl [repourl]', 'Specifies the repository url that is going to be used in the commits')
  .action(function(opt){
    options = opt;
    try {
      if (options.json) console.log('[');
      createFakeData();
      if (options.json) console.log(']');
    } catch (e) {
      console.log(e);
    }
  });

program.parse(process.argv);
