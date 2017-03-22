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
    t.is(response.status, 201, "Uh oh...");
    instance = response.data;
    response.data.should.deep.equal(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    apiKey = instance.apiKey;
    instanceId = instance.instanceId;
    console.log(`instanceId: ${instanceId}, apiKey: ${apiKey}`);
});

test.serial("Can I query an instance?", async t => {
    let response = await base.getInstance({instanceId, apiKey});
    console.log(instanceId, apiKey);
    t.is(response.status, 200, "Uh oh...");
    response.data.should.deep.equal(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    console.log(`instanceId: ${instanceId}, apiKey: ${apiKey}`);
});

test.serial("Can I create a digest", async t => {
    let response = await base.createDigest({instanceId, apiKey, digestDescription: "SOMETHING"});
    t.is(response.status, 201, "Uh oh...");
    digest = response.data;
    let expected = base.expectedDigestResult({
        digestId: digest.digestId,
        instanceId,
        apiKey,
        digestDescription: "SOMETHING"
    });
    console.log(`The digest TeamRoom view URL: ${digest._links["teamroom-view"].href}&apiKey=${apiKey}`);
    JSON.stringify(digest).should.deep.equal(JSON.stringify(expected));
    digestId = digest.digestId;
});

test.serial("Can I query all the inboxes for a Digest without an inbox created?", async t => {
    const response = await base.getDigestInboxes({instanceId, digestId, apiKey});
    t.is(response.status, 200, `What response status did I Get ${response.status}`);
    digestInboxes = response.data;
    const expected = base.expectedZeroDigestInboxes({instanceId, digest});
    JSON.stringify(digestInboxes).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I query digest for 0 commits?", async t => {
    let response = await base.getDigestCommits({instanceId, digestId, apiKey});
    t.is(response.status, 200, "What response status did I get?: " + response.status);
    digestCommits = response.data;
    let expected = base.expectedZeroDigestCommits();
    JSON.stringify(digestCommits).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
    gitHubInboxId = inbox.inboxId;
});

test.serial("Can I query all the inboxes for a Digest with one inbox created?", async t => {
    const response = await base.getDigestInboxes({instanceId, digestId, apiKey});
    t.is(response.status, 200, `What response status did I Get ${response.status}`);
    digestInboxes = response.data;
    const expected = base.expectedDigestInboxes({instanceId, digest, inbox});
    JSON.stringify(digestInboxes).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a VSTS repo?", async t =>              {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'VsoGit', inboxName: 'VsoGitGlobal', repoUrl: 'https://vsts.com/user/msRepo'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoGit',
        inboxName: 'VsoGitGlobal',
        repoUrl: 'https://vsts.com/user/msRepo'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify((inbox).should.deep.equal(JSON.stringify(expected)));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify((expected)));
});

test.serial("Can I make a commit for MULTIPLE projects to a TFVC inbox?", async t => {
    let response = await base.pushTFVCCommit({instanceId: instanceId, apiKey: apiKey, inboxId: vsoTfvcInboxId, validPayload: true, isMultiProject: true});
    t.is(respone.status, 201, "Commit unsuccessful to multiple projects!");
    let commit = response.data;
    let expected = base.expectedCommitResult({
        instanceId: instanceId,
        digestId: digestId,
        inboxId: vsoTfvcInboxId
    });
    JSON.stringify(commit).should.deep.equal(JSON.stringify((expected)));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Expect 400 response and error message for invalid commit payload to TFVC inbox.", async t => {
    try {
        await base.pushTFVCCommit({instanceId: instanceId, apiKey: apiKey, instanceId: vsoTfvcInboxId, validPayload: false});
    }
    catch(error) {
        let response = error.response;
        t.is(response.status, 400, "Uh oh...");
        let commit = response.data;
        let expected = base.expectedInvalidPayloadCommitResult({
            vcsType: 'VSTS',
            isScriptBased: false
        });
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a TFSOnPrem repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'VsoGit', inboxName: 'TFSOnPremGlobal', repoUrl: 'http://tctfs05:8080/tfs/TayCommCFT'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'VsoGit',
        inboxName: 'TFSOnPremGlobal',
        repoUrl: 'http://tctfs05:8080/tfs/TayCommCFT'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
});

test.serial("Can I create an inbox for a Subversion repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Svn', inboxName: 'SvnGlobal', repoUrl: 'https://subversion.com/user/svnDepot'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedSVNInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Svn',
        inboxName: 'SvnGlobal',
        repoUrl: 'https://subversion.com/user/svnDepot'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a GitSwarm repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'GitSwarm', inboxName: 'GitSwarmGlobal', repoUrl: 'https://gitswarm.com/user/swarmThis'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'GitSwarm',
        inboxName: 'GitSwarmGlobal',
        repoUrl: 'https://gitswarm.com/user/swarmThis'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a Perforce P4V repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'P4V', inboxName: 'P4VGlobal', repoUrl: 'http://perforce.com/user/p4vDepot'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedP4VInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'P4V',
        inboxName: 'P4VGlobal',
        repoUrl: 'http://perforce.com/user/p4vDepot'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a DeveoGit repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoGitGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoGit'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoGitGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoGit'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a DeveoMercurial repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoMercurialGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoMercurial'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoMercurialGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoMercurial'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a DeveoSubversion repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoSubversionGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoSubversion'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoSubversionGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoSubversion'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I create an inbox for a DeveoWebdav repo?", async t => {
    let response = await base.createInbox({instanceId, apiKey, digestId,
        inboxFamily: 'Deveo', inboxName: 'DeveoWebdavGlobal', repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoWebdav'});
    response.status.should.equal(201);
    inbox = response.data;
    let expected = base.expectedInboxResult({
        instanceId,
        instanceId,
        digestId,
        inboxId: inbox.inboxId,
        inboxFamily: 'Deveo',
        inboxName: 'DeveoWebdavGlobal',
        repoUrl: 'https://deveo.com/sample/code/overview/test/repositories/deveoWebdav'
    });
    JSON.stringify(inbox).should.deep.equal(JSON.stringify(expected));
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
    JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
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
        JSON.stringify(commit).should.deep.equal(JSON.stringify(expected));
    }
});

test.serial("Can I query the digest for all commits?", async t => {
    let response = await base.getDigestCommits({instanceId, digestId, apiKey});
    t.is(response.status, 200, "What response status did I get?: " + response.status);
    digestCommits = response.data;
    let expected = base.expectedAllDigestCommits();
    let digestCommitsText = JSON.stringify(digestCommits);
    digestCommitsText = digestCommitsText.replace(/"commitDate":".*?"/g, '"commitDate":"1999-12-31"');
    digestCommitsText = digestCommitsText.replace(/"timeFormatted":".*?"/g, '"timeFormatted":"The end of time"');
    digestCommitsText.should.deep.equal(JSON.stringify(expected));
});

