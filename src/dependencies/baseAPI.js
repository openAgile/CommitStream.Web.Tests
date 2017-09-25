const axios = require('axios');
const ROOT_ROOT_URL = process.env.CS_ROOT_URL || 'https://v1-cs-test.azurewebsites.net';
const requireDir = require('require-dir');

const families = requireDir('./families', {recurse:true});

const getData = (family, name='commitData', message=null) => families[family][name](message);

const getHeaders = family => families[family].httpHeaders;

module.exports = class BaseAPI {
    constructor() {
        this.rootRootUrl = ROOT_ROOT_URL;
        this.rootUrl = this.rootRootUrl + '/api/';
        this.instanceUrl = this.rootUrl + 'instances';
        this.isMultiProject = false;
        this.commitInvalidPayloadData = {
            "noway": "should this work"
        };
        this.validPayload = true;
        this.isScriptBased = true;
    }

    createInstance() {
        return axios.post(this.instanceUrl);
    }

    getInstance({instanceId, apiKey}) {
        const instanceUrl = `${this.rootUrl}instances/${instanceId}?apiKey=${apiKey}`;
        return axios.get(instanceUrl);
    }

    createDigest ({instanceId, apiKey, digestDescription}){
        let digestUrl = this.rootUrl + instanceId + '/digests?apiKey=' + apiKey;
        return axios.post(digestUrl,
                {
                    description: digestDescription
                },
                {
                    headers: {'Content-type': 'application/json'}
                })
    }

    getDigestCommits ({instanceId, digestId, apiKey}) {
        let digestCommitsUrl = this.rootUrl + instanceId + '/digests/' + digestId + '/commits?apiKey=' + apiKey;
        return axios.get(digestCommitsUrl)
    }

    getDigestInboxes ({instanceId, digestId, apiKey}) {
        let digestInboxesUrl = `${this.rootUrl}${instanceId}/digests/${digestId}/inboxes?apiKey=${apiKey}`;
        return axios.get(digestInboxesUrl)
    }

    createInbox ({instanceId, apiKey, digestId, inboxFamily, inboxName, repoUrl}){
        let inboxUrl = this.rootUrl + instanceId + '/digests/' + digestId + '/inboxes?apiKey=' + apiKey;
        return axios.post(inboxUrl,
        {
            digestId: digestId,
            family: inboxFamily,
            name: inboxName,
            url: repoUrl
        },
            {
                headers: {'Content-type': 'application/json'}
            }
        )
    }

    pushCommitInvalidHeaders({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = getData('GitHub');
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'test-event': 'no'}
            })
    }

    _pushFamilyCommit({instanceId, apiKey, inboxId, validPayload}, family, dataFunctionName='commitData', message=null) {
        let commitData = getData(family, dataFunctionName, message);
        if (!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = `${this.rootUrl}${instanceId}/inboxes/${inboxId}/commits?apiKey=${apiKey}`;
        return axios.post(commitUrl,
            commitData,
            {
                headers: getHeaders(family)
            }
        );
    }

    pushGitHubCommit(options) { return this._pushFamilyCommit(options, 'GitHub'); }

    pushGitLabCommit(options) { return this._pushFamilyCommit(options, 'GitLab'); }

    pushBitbucketCommit(options) { return this._pushFamilyCommit(options, 'Bitbucket'); }

    pushVSTSCommit(options) { return this._pushFamilyCommit(options, 'VsoGit'); }

    pushTFVCCommit(options, isMultiProject=false) { return this._pushFamilyCommit(options, 'VsoTfvc', isMultiProject ? 'multiProjectData' : 'singleProjectData'); }

    pushTFSOnPremCommit(options) { return this._pushFamilyCommit(options, 'VsoGit', 'onPremCommitData'); }

    pushSVNCommit(options) { return this._pushFamilyCommit(options, 'Svn'); }

    pushGitSwarmCommit(options) { return this._pushFamilyCommit(options, 'GitSwarm'); }

    pushP4VCommit(options) { return this._pushFamilyCommit(options, 'P4V'); }

    pushDeveoGitCommit(options) { return this._pushFamilyCommit(options, 'Deveo', 'gitCommitData'); }

    pushDeveoMercurialCommit(options) { return this._pushFamilyCommit(options, 'Deveo', 'mercurialCommitData'); }

    pushDeveoSVNCommit(options) { return this._pushFamilyCommit(options, 'Deveo', 'svnCommitData'); }

    pushDeveoWebdavCommit(options) { return this._pushFamilyCommit(options, 'Deveo', 'webdavCommitData'); }

    pushCtfGitCommit(options) { return this._pushFamilyCommit(options, 'CtfGit', 'commitData', 'I am the CtfGit message'); }

    pushCtfSvnCommit(options) { return this._pushFamilyCommit(options, 'CtfSvn', 'commitData', 'I am the CtfSvn message'); }

    expectedInstanceResult(instanceId, apiKey){
        return {
            "_links":{
                "self":{
                    "href": this.rootUrl + "instances/" + instanceId
                },
                "digests":{
                    "href":  this.rootUrl + instanceId + "/digests"
                },
                "digest-create":{
                    "href":  this.rootUrl + instanceId + "/digests",
                    "method": "POST",
                    "title": "Endpoint for creating a digest on instance " + instanceId + "."
                }
            },
            "instanceId": instanceId,
            "apiKey": apiKey
        };
    }

    expectedDigestResult({instanceId, digestId, digestDescription}) {
        return {
            "_links": {
                "self": {
                    "href": this.rootUrl + instanceId + "/digests/" + digestId
                },
                "digests": {
                    "href": this.rootUrl + instanceId + "/digests"
                },
                "inbox-create": {
                    "href": this.rootUrl + instanceId + "/digests/" + digestId + "/inboxes",
                    "method": "POST",
                    "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
                },
                "inboxes": {
                    "href": this.rootUrl + instanceId + "/digests/" + digestId + "/inboxes"
                },
                "teamroom-view": {
                    "href": this.rootRootUrl + "/?instanceId=" + instanceId + "&digestId=" + digestId
                }
            },
            "description": digestDescription,
            "digestId": digestId
        };
    }

    expectedZeroDigestInboxes({instanceId, digest}) {
        return {
          "_links": {
            "self": {
              "href": this.rootUrl + instanceId + "/digests/" + digest.digestId + "/inboxes"
            },
            "digest": {
              "href": this.rootUrl + instanceId + "/digests/" + digest.digestId
            },
            "inbox-create": {
              "href": this.rootUrl + instanceId + "/digests/" + digest.digestId + "/inboxes",
              "method": "POST",
              "title": "Endpoint for creating an inbox for a repository on digest " + digest.digestId + "."
            }
          },
          "count": 0,
          "digest": {
            "description": digest.description,
            "digestId": digest.digestId
          },
          "_embedded": {
            "inboxes": []
          }
        };
    }

    expectedDigestInboxes({instanceId, digest, inbox}) {
        return {
            "_links":{
                "self":{
                    "href": this.rootUrl + instanceId + "/digests/" + digest.digestId + "/inboxes"
                },
                "digest":{
                    "href": this.rootUrl + instanceId + "/digests/" + digest.digestId
                },
                "inbox-create":{
                    "href":this.rootUrl + instanceId + "/digests/" + digest.digestId + "/inboxes",
                    "method":"POST",
                    "title":"Endpoint for creating an inbox for a repository on digest "+ digest.digestId + "."
                }
            },
            "count":1,
            "digest":{
                "description":digest.description,
                "digestId": digest.digestId
            },
            "_embedded":{
                "inboxes":[{
                    "_links":{
                        "self":{
                            "href": this.rootUrl + instanceId + "/inboxes/" + inbox.inboxId
                        },
                        "add-commit":{
                            "href": this.rootUrl + instanceId + "/inboxes/" + inbox.inboxId + "/commits"
                        }
                    },
                    "instanceId": instanceId,
                    "inboxId": inbox.inboxId,
                    "family": inbox.family,
                    "name": inbox.name,
                    "url": inbox.url
                }
                ]
            }
        }
    }

    expectedZeroDigestCommits() {
        return {
            "commits": [],
            "_links": {}
        };
    }

    expectedInboxResult({instanceId, digestId, inboxId, inboxFamily, inboxName, repoUrl}) {
        return {
            "_links": {
                "self": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId
                },
                "digest-parent": {
                    "href": this.rootUrl + instanceId + '/digests/' + digestId
                },
                "add-commit": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId +  '/commits'
                },
                "inbox-remove": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId
                }
            },
            "inboxId": inboxId,
            "family": inboxFamily,
            "name": inboxName,
            "url": repoUrl
        }
    }

    expectedSVNInboxResult({instanceId, digestId, inboxId, inboxFamily, inboxName, repoUrl}) {
        return {
            "_links": {
                "self": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId
                },
                "digest-parent": {
                    "href": this.rootUrl + instanceId + '/digests/' + digestId
                },
                "add-commit": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId +  '/commits'
                },
                "inbox-remove": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId
                }
            },
            "inboxId": inboxId,
            "family": inboxFamily,
            "name": inboxName,
            "url": repoUrl,
            "_embedded": {
                "svn-scripts": [
                    {
                        "_links": {
                            "self": {
                                "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/script?platform=windows'
                            }
                        },
                        "platform": "windows"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/script?platform=linux'
                            }
                        },
                        "platform": "linux"
                    }
                ]
            }
        }
    }

    expectedP4VInboxResult({instanceId, digestId, inboxId, inboxFamily, inboxName, repoUrl}) {
        return {
            "_links": {
                "self": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId
                },
                "digest-parent": {
                    "href": this.rootUrl + instanceId + '/digests/' + digestId
                },
                "add-commit": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId +  '/commits'
                },
                "inbox-remove": {
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId
                }
            },
            "inboxId": inboxId,
            "family": inboxFamily,
            "name": inboxName,
            "url": repoUrl,
            "_embedded": {
                "p4v-scripts": [
                    {
                        "_links": {
                            "self": {
                                "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/script?platform=windows'
                            }
                        },
                        "platform": "windows"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/script?platform=linux'
                            }
                        },
                        "platform": "linux"
                    }
                ]
            }
        }
    }

    expectedCommitResult({instanceId, digestId, inboxId}) {
        return {
            "_links":{
                "self":{
                    "href": this.rootUrl + instanceId + "/inboxes/" + inboxId + "/commits"
                },
                "digest-parent":{
                    "href":this.rootUrl + instanceId + "/digests/" + digestId
                },
                "digest-query":{
                    "href":this.rootUrl + instanceId + "/digests/" + digestId + "/commits"
                },
                "instance-query":{
                    "href":this.rootUrl + instanceId + "/commits/tags/versionone/workitems/:workitems"
                }
            },
            "message":"The commits have been added to the CommitStream inbox."
        }
    }

    expectedAllDigestCommits() {
        return {
            "commits":[
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Buddy One",
                    "sha1Partial":"67ec79c",
                    "family":"Deveo",
                    "action":"committed",
                    "message":"Update readme for DeveoWebDav.",
                    "commitHref":"https://deveo.com/example/projects/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
                    "repo":"diff/test/website",
                    "branch":"master",
                    "branchHref":"https://deveo.com/example/projects/diff/test/repositories/website/tree/master",
                    "repoHref":"https://deveo.com/example/projects/diff/test/repositories/website",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"John Doe",
                    "sha1Partial":"2",
                    "family":"Deveo",
                    "action":"committed",
                    "message":"More text for DeveoSVN.",
                    "commitHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1/changesets/2",
                    "repo":"demo-/svn1",
                    "branchHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1/tree/undefined",
                    "repoHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Ilmari Kontulainen",
                    "sha1Partial":"5b634f1",
                    "family":"Deveo",
                    "action":"committed",
                    "message":"Initial commit for DeveoMercurial.",
                    "commitHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo/changesets/5b634f103ad212848a47a29d306616b002eeb828",
                    "repo":"demo-/foo",
                    "branch":"default",
                    "branchHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo/tree/default",
                    "repoHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Ilmari Kontulainen",
                    "sha1Partial":"bd4a158",
                    "family":"Deveo",
                    "action":"committed",
                    "message":"S-01041 DeveoGitreadme.m",
                    "commitHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1/changesets/bd4a158555d69bd41fa1b6429c816031152d091d",
                    "repo":"demo-/gitti1",
                    "branch":"master",
                    "branchHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1/tree/master",
                    "repoHref":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"v1deploy@v1deploy",
                    "sha1Partial":"r#:178",
                    "family":"P4V",
                    "action":"committed",
                    "message":" changes inthe bin?",
                    "commitHref":"PLACE BASE URL TO INSPECT YOUR REVISIONS178",
                    "repo":"doesNotUseUrl",
                    "branch":"",
                    "branchHref":"",
                    "repoHref":"http://perforce.com/doesNotUseUrl",
                    "isCommitHref":false,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Administrator",
                    "sha1Partial":"6f12681",
                    "family":"GitSwarm",
                    "action":"committed",
                    "message":"Added file",
                    "commitHref":"http://gitswarm.cloudapp.net/root/api-testing/commit/6f1268102193085e512b3e13a701d201ce522e85",
                    "repo":"root/api-testing",
                    "branch":"master",
                    "branchHref":"http://gitswarm.cloudapp.net/root/api-testing/tree/master",
                    "repoHref":"http://gitswarm.cloudapp.net/root/api-testing",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"admin",
                    "sha1Partial":"r12",
                    "family":"Svn",
                    "action":"committed",
                    "message":"S-01001 SMA Tests",
                    "commitHref":"http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r12",
                    "repo":"ProjectA",
                    "branch":"",
                    "branchHref":"",
                    "repoHref":"http://v1commitstream.cloudapp.net:9090/svn/ProjectA",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Zhang, Xin (Northern Lights)",
                    "sha1Partial":"3b9cbd24",
                    "family":"VsoGit",
                    "action":"committed",
                    "message":"Added js function for story 2282.\n\nRelated Work Items: #2282",
                    "commitHref":"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/commit/3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2",
                    "repo":"tctfs05/SMARTworks",
                    "branch":"pbi_639_2282",
                    "branchHref":"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/#version=GBpbi_639_2282",
                    "repoHref":"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author": "Sally Ann Cavanaugh",
                    "sha1Partial": "b396843",
                    "family": "VsoTfvc",
                    "action": "committed",
                    "message": "Sally Ann Cavanaugh checked in changeset 22",
                    "commitHref": [
                        "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/changeset/22",
                        "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/changeset/22"
                    ],
                    "repo": "",
                    "branch": "",
                    "branchHref": "",
                    "repoHref": {
                        "url": [
                            "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/",
                            "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/"
                        ]
                    },
                    "isCommitHref": true,
                    "isVsoTfvc": true
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author": "Sally Ann Cavanaugh",
                    "sha1Partial": "b396843",
                    "family": "VsoTfvc",
                    "action": "committed",
                    "message": "Sally Ann Cavanaugh checked in changeset 22",
                    "commitHref": [
                        "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/changeset/22",
                        "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/changeset/22"
                    ],
                    "repo": "",
                    "branch": "",
                    "branchHref": "",
                    "repoHref": {
                        "url": [
                            "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/",
                            "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/"
                        ]
                    },
                    "isCommitHref": true,
                    "isVsoTfvc": true
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Daniel Gruesso",
                    "sha1Partial":"42bf55b2",
                    "family":"VsoGit",
                    "action":"committed",
                    "message":"New user sign-up API route update S-01004",
                    "commitHref":"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/commit/42bf55b256c46f716f0192e9216f1db5c37ea1f2",
                    "repo":"openagile/CommitStream Git",
                    "branch":"master",
                    "branchHref":"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/#version=GBmaster",
                    "repoHref":"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Mariano Kunzi",
                    "sha1Partial":"24480f9",
                    "family":"Bitbucket",
                    "action":"committed",
                    "message":"something happened",
                    "commitHref":"https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
                    "repo":"kunzimariano/test",
                    "branch":"master",
                    "branchHref":"https://bitbucket.org/kunzimariano/test/branch/master",
                    "repoHref":"https://bitbucket.org/kunzimariano/test",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"Jordi Mallach",
                    "sha1Partial":"b6568db",
                    "family":"GitLab",
                    "action":"committed",
                    "message":"Update Catalan translation to e38cb41.",
                    "commitHref":"http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
                    "repo":"mike/diaspora",
                    "branch":"master",
                    "branchHref":"http://example.com/mike/diaspora/tree/master",
                    "repoHref":"http://example.com/mike/diaspora",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                },
                {
                    "commitDate":"1999-12-31",
                    "timeFormatted":"The end of time",
                    "author":"yourName",
                    "sha1Partial":"1234567",
                    "family":"GitHub",
                    "action":"committed",
                    "message":"S-04026 Testing Commit functionality!",
                    "commitHref":"https://repourl",
                    "repo":"/repourl",
                    "branch":"master",
                    "branchHref":"https://repourl/tree/master",
                    "repoHref":"https://repourl",
                    "isCommitHref":true,
                    "isVsoTfvc": false
                }
            ],"_links":{}
        };
    }

    expectedInvalidPayloadCommitResult({vcsType, isScriptBased}) {
        if(vcsType != 'VSTS') {
            let eventType = "commit";
            if (!isScriptBased) {
                eventType = "push";
            }
            return {
                "errors": [
                    "There was an unexpected error when processing your " + vcsType + " " + eventType + " event."
                ]
            };
        } else {
            return {
                "errors": [
                    "Push event could not be processed."
                ]
            };
        }
    }

    expectedInvalidHeadersCommitResult() {
        return {
            "errors": [
                "Push event could not be processed."
            ]
        };
    }
}