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
let inbox;
let bitbucketInboxId;

test.serial("Can I create an instance?", async t => {
    let response = await base.createInstance();
    t.is(response.status, 201, "Uh oh..." + response.status);
    instance = response.data;
    response.data.should.not.differentFrom(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    apiKey = instance.apiKey;
    instanceId = instance.instanceId;
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

test.serial("Can I fail from a pull-request to Bitbucket inbox?", async t=> {
/*
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
*/
    for (let i = 0; i < 1000; i++) {
        try {
            await base.pushBitbucketPullRequest({instanceId, apiKey, inboxId: bitbucketInboxId});
        }
        catch (error) {
            t.is(error.response.status, 400, "Uh oh...");
        }
    }
});