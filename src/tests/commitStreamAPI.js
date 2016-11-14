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
    response.status.should.equal(201);
    instance = response.data;
    response.data.should.deep.equal(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    apiKey = instance.apiKey;
});

test.serial("Can I create a digest", async t => {
    let response = await base.createDigest({instanceId:instance.instanceId, apiKey: instance.apiKey, digestDescription: "SOMETHING"});
    response.status.should.equal(201);
    digest = response.data;
    let expected = base.expectedDigestResult({
        digestId: digest.digestId,
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestDescription: "SOMETHING"
    });
    JSON.stringify(digest).should.deep.equal(JSON.stringify(expected));
    digestId = digest.digestId;
});

test.serial("Can I create an inbox for a GitHub repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'GitHub', inboxName: 'GitHubGlobal', repoUrl: 'https://github.com/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitHub',
        inboxName: 'GitHubGlobal',
        repoUrl: 'https://github.com/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitHubInboxId = inbox.inboxId;
});

// test.serial("Can I make a commit to GitHub inbox?", async t => {
//     let response = await base.pushGitHubCommit(({instanceId: instance.instanceId, apiKey: instance.apiKey, inboxId: gitHubInboxId}));
//     console.log(response.data);
//     response.status.should.equal(201);
// });


test.serial("Can I create an inbox for a GitLab repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'GitLab', inboxName: 'GitLabGlobal', repoUrl: 'https://gitlab.com/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitLab',
        inboxName: 'GitLabGlobal',
        repoUrl: 'https://gitlab.com/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitLabInboxId = inbox.inboxId;
});

test.serial("Can I create an inbox for a Bitbucket repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'Bitbucket', inboxName: 'BitbucketGlobal', repoUrl: 'https://bitbucket.org/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Bitbucket',
        inboxName: 'BitbucketGlobal',
        repoUrl: 'https://bitbucket.org/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    bitbucketInboxId = inbox.inboxId;
});

test.serial("Can I create an inbox for a VSTS repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'VsoGit', inboxName: 'VsoGitGlobal', repoUrl: 'https://vsts.com/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoGit',
        inboxName: 'VsoGitGlobal',
        repoUrl: 'https://vsts.com/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    vsoGitInboxId = inbox.inboxId;
});

test.serial("Can I create an inbox for a Subversion repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'Svn', inboxName: 'SvnGlobal', repoUrl: 'https://subversion.com/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedSVNInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Svn',
        inboxName: 'SvnGlobal',
        repoUrl: 'https://subversion.com/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    subversionInboxId = inbox.inboxId;
});

test.serial("Can I create an inbox for a GitSwarm repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'GitSwarm', inboxName: 'GitSwarmGlobal', repoUrl: 'https://gitswarm.com/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitSwarm',
        inboxName: 'GitSwarmGlobal',
        repoUrl: 'https://gitswarm.com/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitSwarmInboxId = inbox.inboxId;
});

test.serial("Can I create an inbox for a Perforce P4V repo?", async t => {
    let response = await base.createInbox({instanceId: instance.instanceId, apiKey: instance.apiKey, digestId: digest.digestId,
        inboxFamily: 'P4V', inboxName: 'P4VGlobal', repoUrl: 'http://perforce.com/user/repo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedP4VInboxResult({
        instanceId: instance.instanceId,
        apiKey: instance.apiKey,
        digestId: digest.digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'P4V',
        inboxName: 'P4VGlobal',
        repoUrl: 'http://perforce.com/user/repo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    perforceP4VInboxId = inbox.inboxId;
});

