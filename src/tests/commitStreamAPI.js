import test from 'ava';
import chai from 'chai';
import chaidiff from 'chai-diff';
import BaseAPI from '../dependencies/baseAPI';
let base = new BaseAPI();
chai.should();
chai.use(chaidiff);

let instance;
let instanceId;
let apiKey;
let digest;
let digestId;
let digestCommits;
let digestInboxes;
let inbox;
let gitHubInboxId;
let gitLabInboxId;
let bitbucketInboxId;
let vsoGitInboxId;
let vsoTfvcInboxId;
let tfsOnPremInboxId;
let subversionInboxId;
let gitSwarmInboxId;
let perforceP4VInboxId;
let deveoGitInboxId;
let deveoMercurialInboxId;
let deveoSVNInboxId;
let deveoWebdavInboxId;


test.serial("Can I create an instance?", async t => {
    let response = await base.createInstance();
    t.is(response.status, 201, "Uh oh..." + response.status);
    instance = response.data;
    response.data.should.not.differentFrom(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    apiKey = instance.apiKey;
    instanceId = instance.instanceId;
});

test.serial("Can I query an instance?", async t => {
    let response = await base.getInstance({instanceId, apiKey});
    t.is(response.status, 200, "Uh oh..." + response.status);
    response.data.should.not.differentFrom(base.expectedInstanceResult(instanceId, instance.apiKey));
});

test.serial("Can I create a digest", async t => {
    let response = await base.createDigest({instanceId, apiKey, digestDescription: "SOMETHING"});
    t.is(response.status, 201, "Uh oh..." + response.status);
    digest = response.data;
    let expected = base.expectedDigestResult({
        digestId: digest.digestId,
        instanceId,
        apiKey,
        digestDescription: "SOMETHING"
    });
    digest.should.not.differentFrom(expected);
    digestId = digest.digestId;
});

test.serial("Can I query all the inboxes for a Digest without an inbox created?", async t => {
    let response = await base.getDigestInboxes({instanceId, digestId, apiKey});
    t.is(response.status, 200, `What response status did I Get ${response.status}`);
    digestInboxes = response.data;
    let expected = base.expectedZeroDigestInboxes({instanceId, digest});
    digestInboxes.should.not.differentFrom(expected);
});

test.serial("Can I query digest for 0 commits?", async t => {
    let response = await base.getDigestCommits({instanceId, digestId, apiKey});
    t.is(response.status, 200, "What response status did I get?: " + response.status);
    digestCommits = response.data;
    let expected = base.expectedZeroDigestCommits();
    digestCommits.should.not.differentFrom(expected);
});

test.serial("Can I create an inbox for a GitHub repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'GitHub', inboxName: 'GitHubGlobal', repoUrl: 'https://github.com/user/genericTest'});
    t.is(response.status, 201, "Uh oh...");
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        apiKey,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitHub',
        inboxName: 'GitHubGlobal',
        repoUrl: 'https://github.com/user/genericTest'
    });
    inbox.should.not.differentFrom(expected);
    gitHubInboxId = inbox.inboxId;
});

test.serial("Can I query all the inboxes for a Digest with one inbox created?", async t => {
    const response = await base.getDigestInboxes({instanceId, digestId, apiKey});
    t.is(response.status, 200, `What response status did I Get ${response.status}`);
    digestInboxes = response.data;
    const expected = base.expectedDigestInboxes({instanceId, digest, inbox});
    digestInboxes.should.not.differentFrom(expected);
});

test.serial("Can I make a commit to GitHub inbox?", async t => {
    let response = await base.pushGitHubCommit({instanceId, apiKey, inboxId: gitHubInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: gitHubInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to GitHub inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: gitHubInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to GitHub inbox", async t=> {
    try {
        await base.pushGitHubCommit({instanceId, apiKey, inboxId: gitHubInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'GitHub',
            isScriptBased: false
        });
        JSON.stringify(commit).should.not.differentFrom(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a GitLab repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'GitLab', inboxName: 'GitLabGlobal', repoUrl: 'https://gitlab.com/user/theLab'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        apiKey,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitLab',
        inboxName: 'GitLabGlobal',
        repoUrl: 'https://gitlab.com/user/theLab'
    });
    inbox.should.not.differentFrom(expected);
    gitLabInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to GitLab inbox?", async t=> {
    let response = await base.pushGitLabCommit({instanceId, apiKey, inboxId: gitLabInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: gitLabInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to GitLab inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: gitLabInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to GitLab inbox", async t=> {
    try {
        await base.pushGitLabCommit({instanceId, apiKey, inboxId: gitLabInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'GitLab',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a Bitbucket repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Bitbucket', inboxName: 'BitbucketGlobal', repoUrl: 'https://bitbucket.org/user/bigBucket'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        apiKey,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Bitbucket',
        inboxName: 'BitbucketGlobal',
        repoUrl: 'https://bitbucket.org/user/bigBucket'
    });
    inbox.should.not.differentFrom(expected);
    bitbucketInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to Bitbucket inbox?", async t=> {
    let response = await base.pushBitbucketCommit({instanceId, apiKey, inboxId: bitbucketInboxId, validPayload:true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: bitbucketInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to Bitbucket inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: bitbucketInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to Bitbucket inbox", async t=> {
    try {
        await base.pushBitbucketCommit({instanceId, apiKey, inboxId: bitbucketInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'Bitbucket',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a VSTS repo?", async t =>              {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'VsoGit', inboxName: 'VsoGitGlobal', repoUrl: 'https://vsts.com/user/msRepo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoGit',
        inboxName: 'VsoGitGlobal',
        repoUrl: 'https://vsts.com/user/msRepo'
    });
    inbox.should.not.differentFrom(expected);
    vsoGitInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to VSTS inbox?", async t=> {
    let response = await base.pushVSTSCommit({instanceId, apiKey, inboxId: vsoGitInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: vsoGitInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to VSTS inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: vsoGitInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to VSTS inbox", async t=> {
    try {
        await base.pushVSTSCommit({instanceId, apiKey, inboxId: vsoGitInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'VSTS',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a TFVC repo?", async t => {
    let response = await base.createInbox({instanceId: instanceId, apiKey: apiKey, digestId: digestId,
        inboxFamily: 'VsoTfvc', inboxName: 'VsoTfvcGlobal', repoUrl: 'https://vso.tfvc.com/user/platformTest'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId: instanceId,
        apiKey: apiKey,
        digestId: digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoTfvc',
        inboxName: 'VsoTfvcGlobal',
        repoUrl: 'https://vso.tfvc.com/user/platformTest'
    });
    inbox.should.not.differentFrom(expected);
    vsoTfvcInboxId = inbox.inboxId;
});

test.serial("Can I make a commit for a SINGLE project to a TFVC inbox?", async t => {
    let response = await base.pushTFVCCommit({instanceId: instanceId, apiKey: apiKey, inboxId: vsoTfvcInboxId, validPayload: true, isMultiProject: false});
    t.is(response.status, 201, "Commit unsuccessful!");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: vsoTfvcInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Can I make a commit for MULTIPLE projects to a TFVC inbox?", async t => {
    let response = await base.pushTFVCCommit({instanceId: instanceId, apiKey: apiKey, inboxId: vsoTfvcInboxId, validPayload: true, isMultiProject: true});
    t.is(response.status, 201, "Commit unsuccessful to multiple projects!");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: vsoTfvcInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to TFVC inbox.", async t => {
    try{
        await base.pushCommitInvalidHeaders({instanceId: instanceId, apiKey: apiKey, inboxId: vsoTfvcInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to TFVC inbox.", async t => {
    try {
        await base.pushTFVCCommit({instanceId: instanceId, apiKey: apiKey, instanceId: vsoTfvcInboxId, validPayload: false, isMultiProject: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        console.log("The full response: " + JSON.stringify((response)));
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'VSTS',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
        console.log("This is the value of commit: " + JSON.stringify((commit)));
    }
});

test.serial("Can I create an inbox for a TFSOnPrem repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'VsoGit', inboxName: 'TFSOnPremGlobal', repoUrl: 'http://tctfs05:8080/tfs/TayCommCFT'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoGit',
        inboxName: 'TFSOnPremGlobal',
        repoUrl: 'http://tctfs05:8080/tfs/TayCommCFT'
    });
    inbox.should.not.differentFrom(expected);
    tfsOnPremInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to TFSOnPrem inbox?", async t=> {
    let response = await base.pushTFSOnPremCommit({instanceId, apiKey, inboxId: tfsOnPremInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: tfsOnPremInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Can I create an inbox for a Subversion repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Svn', inboxName: 'SvnGlobal', repoUrl: 'https://subversion.com/user/svnDepot'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedSVNInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Svn',
        inboxName: 'SvnGlobal',
        repoUrl: 'https://subversion.com/user/svnDepot'
    });
    inbox.should.not.differentFrom(expected);
    subversionInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to Subversion inbox?", async t=> {
    let response = await base.pushSVNCommit({instanceId, apiKey, inboxId: subversionInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: subversionInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to Subversion inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: subversionInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to Subversion inbox", async t=> {
    try {
        await base.pushSVNCommit({instanceId, apiKey, inboxId: subversionInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'Svn',
            isScriptBased: true
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a GitSwarm repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'GitSwarm', inboxName: 'GitSwarmGlobal', repoUrl: 'https://gitswarm.com/user/swarmThis'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitSwarm',
        inboxName: 'GitSwarmGlobal',
        repoUrl: 'https://gitswarm.com/user/swarmThis'
    });
    inbox.should.not.differentFrom(expected);
    gitSwarmInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to GitSwarm inbox?", async t=> {
    let response = await base.pushGitSwarmCommit({instanceId, apiKey, inboxId: gitSwarmInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: gitSwarmInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to GitSwarm inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: gitSwarmInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to GitSwarm inbox", async t=> {
    try {
        await base.pushGitSwarmCommit({instanceId, apiKey, inboxId: gitSwarmInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'GitSwarm',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a Perforce P4V repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'P4V', inboxName: 'P4VGlobal', repoUrl: 'http://perforce.com/user/p4vDepot'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedP4VInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'P4V',
        inboxName: 'P4VGlobal',
        repoUrl: 'http://perforce.com/user/p4vDepot'
    });
    inbox.should.not.differentFrom(expected);
    perforceP4VInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to Perforce P4V inbox?", async t=> {
    let response = await base.pushP4VCommit({instanceId, apiKey, inboxId: perforceP4VInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: perforceP4VInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to Perforce P4V inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: perforceP4VInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to Perforce P4V inbox", async t=> {
    try {
        await base.pushP4VCommit({instanceId, apiKey, inboxId: perforceP4VInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'P4V',
            isScriptBased: true
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a DeveoGit repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoGitGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoGit'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoGitGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoGit'
    });
    inbox.should.not.differentFrom(expected);
    deveoGitInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to a DeveoGit inbox?", async t=> {
    let response = await base.pushDeveoGitCommit({instanceId, apiKey, inboxId: deveoGitInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: deveoGitInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to DeveoGit inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: deveoGitInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to Deveo Git inbox", async t=> {
    try {
        await base.pushDeveoGitCommit({instanceId, apiKey, inboxId: deveoGitInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'Deveo',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a DeveoMercurial repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoMercurialGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoMercurial'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoMercurialGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoMercurial'
    });
    inbox.should.not.differentFrom(expected);
    deveoMercurialInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to a DeveoMercurial inbox?", async t=> {
    let response = await base.pushDeveoMercurialCommit({instanceId, apiKey, inboxId: deveoMercurialInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: deveoMercurialInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to DeveoMercurial inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: deveoMercurialInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to DeveoMercurial inbox", async t=> {
    try {
        await base.pushDeveoMercurialCommit({instanceId, apiKey, inboxId: deveoMercurialInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'Deveo',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a DeveoSubversion repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoSubversionGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoSubversion'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoSubversionGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoSubversion'
    });
    inbox.should.not.differentFrom(expected);
    deveoSVNInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to a DeveoSubversion inbox?", async t=> {
    let response = await base.pushDeveoSVNCommit({instanceId, apiKey, inboxId: deveoSVNInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: deveoSVNInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to DeveoSubversion inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: deveoSVNInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to DeveoSubversion inbox", async t=> {
    try {
        await base.pushDeveoSVNCommit({instanceId, apiKey, inboxId: deveoSVNInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'Deveo',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I create an inbox for a DeveoWebdav repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoWebdavGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoWebdav'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoWebdavGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoWebdav'
    });
    inbox.should.not.differentFrom(expected);
    deveoWebdavInboxId = inbox.inboxId;
});

test.serial("Can I make a commit to a DeveoWebdav inbox?", async t=> {
    let response = await base.pushDeveoWebdavCommit({instanceId, apiKey, inboxId: deveoWebdavInboxId, validPayload: true});
    t.is(response.status, 201, "Uh oh...");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId,
        digestId,
        inboxId: deveoWebdavInboxId
    });
    commit.should.not.differentFrom(expected);
});

test.serial("Expect 400 response and error message for invalid commit headers to DeveoWebdav inbox", async t=> {
    try {
        await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: deveoWebdavInboxId, validPayload: true});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidHeadersCommitResult();
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to DeveoWebDav inbox", async t=> {
    try {
        await base.pushDeveoWebdavCommit({instanceId, apiKey, inboxId: deveoWebdavInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'Deveo',
            isScriptBased: false
        });
        commit.should.not.differentFrom(expected);
    }
});

test.serial("Can I query the digest for all commits?", async t => {
    let response = await base.getDigestCommits({instanceId, digestId, apiKey});
    console.log("instanceId: " + instanceId + ", apiKey: " + apiKey + ", digestId: " + digestId);
    console.log(`The digest TeamRoom view URL: ${digest._links["teamroom-view"].href}&apiKey=${apiKey}`);
    t.is(response.status, 200, "What response status did I get?: " + response.status);
    digestCommits = response.data;
    let expected = base.expectedAllDigestCommits();
    let digestCommitsText = JSON.stringify(digestCommits);
    digestCommitsText = digestCommitsText.replace(/"commitDate":".*?"/g, '"commitDate":"1999-12-31"');
    digestCommitsText = digestCommitsText.replace(/"timeFormatted":".*?"/g, '"timeFormatted":"The end of time"');
    //console.log("Digest Commits output: " + JSON.stringify(digestCommitsText));
    JSON.parse(digestCommitsText).should.not.differentFrom(expected);
});