const axios = require('axios');
const ROOT_ROOT_URL = process.env.CS_ROOT_URL || 'https://v1-cs-test.azurewebsites.net';
const requireDir = require('require-dir');

const families = requireDir('./families', {recurse: true});

const getData = (family, name = 'commitData', message = null) => families[family][name](message);

const getHeaders = family => families[family].httpHeaders;

module.exports = class BaseAPI {
    constructor() {
        this.rootRootUrl = ROOT_ROOT_URL;
        this.rootUrl = this.rootRootUrl + '/api/';
        this.instanceUrl = this.rootUrl + 'instances';
        this.isMultiProject = false;
        this.isOnPrem = false;
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

    createDigest({instanceId, apiKey, digestDescription}) {
        let digestUrl = this.rootUrl + instanceId + '/digests?apiKey=' + apiKey;
        return axios.post(digestUrl,
            {
                description: digestDescription
            },
            {
                headers: {'Content-type': 'application/json'}
            })
    }

    getDigestCommits({instanceId, digestId, apiKey}) {
        let digestCommitsUrl = this.rootUrl + instanceId + '/digests/' + digestId + '/commits?apiKey=' + apiKey;
        return axios.get(digestCommitsUrl)
    }

    getDigestInboxes({instanceId, digestId, apiKey}) {
        let digestInboxesUrl = `${this.rootUrl}${instanceId}/digests/${digestId}/inboxes?apiKey=${apiKey}`;
        return axios.get(digestInboxesUrl)
    }

    createInbox({instanceId, apiKey, digestId, inboxFamily, inboxName, repoUrl}) {
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
        if (!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'test-event': 'no'}
            })
    }

    _pushFamilyCommit({instanceId, apiKey, inboxId, validPayload}, family, dataFunctionName = 'commitData', message = null) {
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

    pushGitHubCommit(options) {
        return this._pushFamilyCommit(options, 'GitHub');
    }

    pushGitLabCommit(options) {
        return this._pushFamilyCommit(options, 'GitLab');
    }

    pushBitbucketCommit(options) {
        return this._pushFamilyCommit(options, 'Bitbucket');
    }

    pushVsoGitCommit(options, isOnPrem = false) {
        return this._pushFamilyCommit(options, 'VsoGit', isOnPrem ? 'commitData' : 'onPremCommitData');
    }

    pushVsoTfvcCommit(options, isMultiProject = false) {
        return this._pushFamilyCommit(options, 'VsoTfvc', isMultiProject ? 'multiProjectData' : 'singleProjectData');
    }

    pushVsoTfvcCommitBeta(options, dataSet) {
        return this._pushFamilyCommit(options, 'VsoTfvc', dataSet);
    }

    pushSVNCommit(options) {
        return this._pushFamilyCommit(options, 'Svn');
    }

    pushGitSwarmCommit(options) {
        return this._pushFamilyCommit(options, 'GitSwarm');
    }

    pushP4VCommit(options) {
        return this._pushFamilyCommit(options, 'P4V');
    }

    pushDeveoGitCommit(options) {
        return this._pushFamilyCommit(options, 'Deveo', 'gitCommitData');
    }

    pushDeveoMercurialCommit(options) {
        return this._pushFamilyCommit(options, 'Deveo', 'mercurialCommitData');
    }

    pushDeveoSVNCommit(options) {
        return this._pushFamilyCommit(options, 'Deveo', 'svnCommitData');
    }

    pushDeveoWebdavCommit(options) {
        return this._pushFamilyCommit(options, 'Deveo', 'webdavCommitData');
    }

    pushCtfGitCommit(options) {
        return this._pushFamilyCommit(options, 'CtfGit', 'commitData', 'I am the CtfGit message');
    }

    pushCtfSvnCommit(options) {
        return this._pushFamilyCommit(options, 'CtfSvn', 'commitData', 'I am the CtfSvn message');
    }

    expectedInstanceResult(instanceId, apiKey) {
        return {
            "_links": {
                "self": {
                    "href": this.rootUrl + "instances/" + instanceId
                },
                "digests": {
                    "href": this.rootUrl + instanceId + "/digests"
                },
                "digest-create": {
                    "href": this.rootUrl + instanceId + "/digests",
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
            "count": 1,
            "digest": {
                "description": digest.description,
                "digestId": digest.digestId
            },
            "_embedded": {
                "inboxes": [{
                    "_links": {
                        "self": {
                            "href": this.rootUrl + instanceId + "/inboxes/" + inbox.inboxId
                        },
                        "add-commit": {
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
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits'
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
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits'
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
                    "href": this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits'
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
            "_links": {
                "self": {
                    "href": this.rootUrl + instanceId + "/inboxes/" + inboxId + "/commits"
                },
                "digest-parent": {
                    "href": this.rootUrl + instanceId + "/digests/" + digestId
                },
                "digest-query": {
                    "href": this.rootUrl + instanceId + "/digests/" + digestId + "/commits"
                },
                "instance-query": {
                    "href": this.rootUrl + instanceId + "/commits/tags/versionone/workitems/:workitems"
                }
            },
            "message": "The commits have been added to the CommitStream inbox."
        }
    }

    expectedAllDigestCommits() {
        let data = require('./allDigestCommitsResponseData.json');
        data.commits = data.commits.map(i => {
            i.commitDate = "1999-12-31";
            i.timeFormatted = "The end of time";
            return i;
        })
        return data;
    }

    expectedInvalidPayloadCommitResult({vcsType, isScriptBased}) {
        if (vcsType != 'VSTS') {
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