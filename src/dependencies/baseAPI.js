/**
 * Created by sabbott on 11/10/2016.
 */
var axios = require('axios');

module.exports = class BaseAPI {
    constructor() {
        this.rootRootUrl = 'https://v1-cs-test.azurewebsites.net/';
        this.rootUrl = 'https://v1-cs-test.azurewebsites.net/api/';
        this.instanceUrl = this.rootUrl + '/instances';
        this.commitData = {"ref": "refs/heads/master",
            "commits": [{
            "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
            "distinct": true,
            "message": "S-04026 Testing Commit functionality!",
            "timestamp": "2014-10-03T15:57:14-03:00",
            "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
            "author": {
                "name": "shawnmarie",
                "email": "smaAwesome@gmail.com",
                "username": "shawnmarie"
            },
            "committer": {
                "name": "shawnmarie",
                "email": "smaAwesome@gmail.com",
                "username": "shawnmarie"
            },
            "added": [],
            "removed": [],
            "modified": ["README.md"]
        }],
            "repository": {
            "id": 28892501,
                "name": "CommitService.DemoRepo"
        }
    };
    }

    createInstance() {
        return axios.post(this.instanceUrl);
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

    pushGitHubCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        //let commitData = this.commitData;
        return axios.post(commitUrl,
            {
                data: {ref: 'refs/heads/master',
                        commits: [{
                            id: 'd31d174f0495feaf876e92573a2121700fd81e7a',
                            distinct: true,
                            message: 'S-04026 Testing Commit functionality!',
                            timestamp: '2014-10-03T15:57:14-03:00',
                            url: 'https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a',
                            author: {
                                name: 'shawnmarie',
                                email: 'smaAwesome@gmail.com',
                                username: 'shawnmarie'
                        },
                        committer: {
                            name: 'shawnmarie',
                            email: 'smaAwesome@gmail.com',
                            username: 'shawnmarie'
                        },
                        added: [],
                        removed: [],
                        modified: ['README.md']
                    }],
                    repository: {
                        id: 28892501,
                        name: 'CommitService.DemoRepo'
                    }
                }
            },
            {
                headers: {'Content-type': 'application/json', 'x-github-event': 'push'}
            })
    }

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
                    "href": this.rootRootUrl + "?instanceId=" + instanceId + "&digestId=" + digestId
                }
            },
            "description": digestDescription,
            "digestId": digestId
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
}
    // let apiKey,
    //     instanceId,
    //     digestId,
    //     digestDescription,
    //     inboxId,
    //     inboxFamily,
    //     inboxName,
    //     repoUrl,
    //     commitData;

    // let digestUrl = rootUrl + instanceId + '/digests?apiKey=' + apiKey;
    // let inboxUrl = rootUrl + instanceId + '/digests/' + digestId + '/inboxes?apiKey=' + apiKey;
    // let commitUrl = rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
    // return {
    //     rootUrl,
    //     instanceUrl,
        // ,
        // digestUrl,
        // inboxUrl,
        // commitUrl,


//         createDigest: (digestUrl, digestDescription)=> axiois.post(digestUrl,
//                 {
//                     description: digestDescription
//                 },
//                 {
//                     headers: {'Content-type': 'application/json'}
//                 }),
//         pushCommit: (commitUrl, commitData)=>axios.post(commitUrl,
//             {
//                 commitData
//             },
//             {
//                 headers: {'Content-type': 'application/json', 'x-github-event': 'push'}
//             }),
//         createInbox: (inboxUrl, digestId, inboxFamily, inboxName, repoUrl) => axios.post(inboxUrl,
//             {
//                 digestId: digestId,
//                 family: inboxFamily,
//                 name: inboxName,
//                 url: repoUrl
//             },
//             {
//                 headers: {'Content-type': 'application/json'}
//             })
//     }
// }();