import test from 'ava';
import chai from 'chai';
import BaseAPI from '../dependencies/baseAPI';
let base = new BaseAPI();
chai.should();

let instance;
let instanceId;
let apiKey;
let digest;
let digestId;
let inbox;
let gitHubInboxId;
let gitLabInboxId;
let bitbucketInboxId;
let vsoGitInboxId;
let subversionInboxId;
let gitSwarmInboxId;
let perforceP4VInboxId;
let deveoInboxId;


test.serial("Can I create an instance?", async t => {
    let response = await base.createInstance();
    t.is(response.status, 201, "Uh oh...");
    instance = response.data;
    response.data.should.deep.equal(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    apiKey = instance.apiKey;
    instanceId = instance.instanceId;
});

test.serial("Can I create a digest", async t => {
    let response = await base.createDigest({instanceId:instanceId, apiKey: apiKey, digestDescription: "SOMETHING"});
    t.is(response.status, 201, "Uh oh...");
    digest = response.data;
    let expected = base.expectedDigestResult({
        digestId: digest.digestId,
        instanceId: instanceId,
        apiKey: apiKey,
        digestDescription: "SOMETHING"
    });
    JSON.stringify(digest).should.deep.equal(JSON.stringify(expected));
    digestId = digest.digestId;
});

test.serial("Can I create an inbox for a GitHub repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'GitHub', inboxName: 'GitHubGlobal', repoUrl: 'https://github.com/user/genericTest'});
    t.is(response.status, 201, "Uh oh...");
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitHub',
        inboxName: 'GitHubGlobal',
        repoUrl: 'https://github.com/user/genericTest'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitHubInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to GitHub inbox?", async t => {
    let response = await base.pushGitHubCommit({instanceId: instanceId, apiKey: apiKey, inboxId: gitHubInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: gitHubInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a GitLab repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'GitLab', inboxName: 'GitLabGlobal', repoUrl: 'https://gitlab.com/user/theLab'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitLab',
        inboxName: 'GitLabGlobal',
        repoUrl: 'https://gitlab.com/user/theLab'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitLabInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to GitLab inbox?", async t=> {
    let response = await base.pushGitLabCommit({instanceId: instanceId, apiKey: apiKey, inboxId: gitLabInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: gitLabInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a Bitbucket repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'Bitbucket', inboxName: 'BitbucketGlobal', repoUrl: 'https://bitbucket.org/user/bigBucket'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Bitbucket',
        inboxName: 'BitbucketGlobal',
        repoUrl: 'https://bitbucket.org/user/bigBucket'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    bitbucketInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to Bitbucket inbox?", async t=> {
    let response = await base.pushBitbucketCommit({instanceId: instanceId, apiKey: apiKey, inboxId: bitbucketInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: bitbucketInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a VSTS repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'VsoGit', inboxName: 'VsoGitGlobal', repoUrl: 'https://vsts.com/user/msRepo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoGit',
        inboxName: 'VsoGitGlobal',
        repoUrl: 'https://vsts.com/user/msRepo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    vsoGitInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to VSTS inbox?", async t=> {
    let response = await base.pushVSTSCommit({instanceId: instanceId, apiKey: apiKey, inboxId: vsoGitInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: vsoGitInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a Subversion repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'Svn', inboxName: 'SvnGlobal', repoUrl: 'https://subversion.com/user/svnDepot'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedSVNInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Svn',
        inboxName: 'SvnGlobal',
        repoUrl: 'https://subversion.com/user/svnDepot'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    subversionInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to Subversion inbox?", async t=> {
    let response = await base.pushSVNCommit({instanceId: instanceId, apiKey: apiKey, inboxId: subversionInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: subversionInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a GitSwarm repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'GitSwarm', inboxName: 'GitSwarmGlobal', repoUrl: 'https://gitswarm.com/user/swarmThis'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitSwarm',
        inboxName: 'GitSwarmGlobal',
        repoUrl: 'https://gitswarm.com/user/swarmThis'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitSwarmInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to GitSwarm inbox?", async t=> {
    let response = await base.pushGitSwarmCommit({instanceId: instanceId, apiKey: apiKey, inboxId: gitSwarmInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: gitSwarmInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a Perforce P4V repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'P4V', inboxName: 'P4VGlobal', repoUrl: 'http://perforce.com/user/p4vDepot'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedP4VInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'P4V',
        inboxName: 'P4VGlobal',
        repoUrl: 'http://perforce.com/user/p4vDepot'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    perforceP4VInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to Perforce P4V inbox?", async t=> {
    let response = await base.pushP4VCommit({instanceId: instanceId, apiKey: apiKey, inboxId: perforceP4VInboxId});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: perforceP4VInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});


