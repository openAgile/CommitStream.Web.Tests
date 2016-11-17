var axios = require('axios');

module.exports = class BaseAPI {
    constructor() {
        this.rootRootUrl = 'https://v1-cs-test.azurewebsites.net';
        this.rootUrl = 'https://v1-cs-test.azurewebsites.net/api/';
        this.instanceUrl = this.rootUrl + '/instances';
        this.commitGitHubData = {
            "ref": "refs/heads/master",
            "commits": [{
                "id": "1234567",
                "distinct": true,
                "message": "S-04026 Testing Commit functionality!",
                "timestamp": "2014-10-03T15:57:14-03:00",
                "url": "https://repourl",
                "author": {
                    "name": "yourName",
                    "email": "you@mail.com",
                    "username": "theuser"
                },
                "committer": {
                    "name": "yourName",
                    "email": "you@mail.cm",
                    "username": "theuser"
                },
                "added": [],
                "removed": [],
                "modified": ["README.md"]
            }],
            "repository": {
                "id": 246810,
                "name": "therepo"
            }
        };
        this.commitGitLabData = {
            "object_kind": "push",
            "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
            "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
            "ref": "refs/heads/master",
            "user_id": 4,
            "user_name": "John Smith",
            "user_email": "john@example.com",
            "project_id": 15,
            "repository": {
                "name": "Diaspora",
                "url": "git@example.com:mike/diasporadiaspora.git",
                "description": "",
                "homepage": "http://example.com/mike/diaspora",
                "git_http_url": "http://example.com/mike/diaspora.git",
                "git_ssh_url": "git@example.com:mike/diaspora.git",
                "visibility_level": 0
            },
            "commits": [{
                "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
                "message": "Update Catalan translation to e38cb41.",
                "timestamp": "2011-12-12T14:27:31+02:00",
                "url": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
                "author": {
                    "name": "Jordi Mallach",
                    "email": "jordi@softcatala.org"
                }
            }],
            "total_commits_count": 1
        };
        this.commitBitbucketData = {
            "push": {
                "changes": [{
                    "new": {
                        "name": "master",
                        "target": {
                            "hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
                            "author": {
                                "raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
                                "user": {
                                    "display_name": "Mariano Kunzi",
                                    "uuid": "{ebc966b1-5081-461c-98dc-b297d932d25b}",
                                    "username": "kunzimariano",
                                    "type": "user",
                                    "links": {
                                        "html": {
                                            "href": "https://bitbucket.org/kunzimariano/"
                                        },
                                        "self": {
                                            "href": "https://api.bitbucket.org/2.0/users/kunzimariano"
                                        },
                                        "avatar": {
                                            "href": "https://bitbucket.org/account/kunzimariano/avatar/32/"
                                        }
                                    }
                                }
                            },
                            "type": "commit",
                            "parents": [{
                                "hash": "2bc4f8d850c67adf9d061755d4cf387cf63ce0dd",
                                "type": "commit",
                                "links": {
                                    "html": {
                                        "href": "https://bitbucket.org/kunzimariano/test/commits/2bc4f8d850c67adf9d061755d4cf387cf63ce0dd"
                                    },
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commit/2bc4f8d850c67adf9d061755d4cf387cf63ce0dd"
                                    }
                                }
                            }],
                            "date": "2015-08-18T18:43:11+00:00",
                            "message": "just another day",
                            "links": {
                                "html": {
                                    "href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
                                },
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commit/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
                                }
                            }
                        },
                        "type": "branch",
                        "links": {
                            "html": {
                                "href": "https://bitbucket.org/kunzimariano/test/branch/master"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/refs/branches/master"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commits/master"
                            }
                        }
                    },
                    "commits": [{
                        "hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
                        "author": {
                            "raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
                            "user": {
                                "display_name": "Mariano Kunzi",
                                "username": "kunzimariano"
                            }
                        },
                        "links": {
                            "html": {
                                "href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
                            }
                        },
                        "message": "something happened"
                    }]
                }]
            },
            "repository": {
                "full_name": "kunzimariano/test",
                "uuid": "{9ad3f4a8-99d8-4b50-be5c-807459179855}",
                "links": {
                    "html": {
                        "href": "https://bitbucket.org/kunzimariano/test"
                    },
                    "self": {
                        "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test"
                    },
                    "avatar": {
                        "href": "https://bitbucket.org/kunzimariano/test/avatar/16/"
                    }
                },
                "name": "test",
                "type": "repository"
            }
        };
        this.commitVSTSData = {
            "subscriptionId": "10e850da-3543-4e7a-88af-2a30d274473b",
            "notificationId": 3,
            "id": "982d6ab9-430e-4297-8dd2-16e2a3997647",
            "eventType": "git.push",
            "publisherId": "tfs",
            "message": {
                "text": "Daniel Gruesso pushed updates to branch master of CommitStream Git\r\n(https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/#version=GBmaster)",
                "html": "Daniel Gruesso pushed updates to branch <a href=\"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/#version=GBmaster\">master</a> of <a href=\"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/\">CommitStream Git</a>",
                "markdown": "Daniel Gruesso pushed updates to branch [master](https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/#version=GBmaster) of [CommitStream Git](https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/)"
            },
            "detailedMessage": {
                "text": "Daniel Gruesso pushed 1 commit to branch master of CommitStream Git\r\n - Updated README.md S-01004 42bf55b2 (https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/commit/42bf55b256c46f716f0192e9216f1db5c37ea1f2)",
                "html": "Daniel Gruesso pushed 1 commit to branch <a href=\"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/#version=GBmaster\">master</a> of <a href=\"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/\">CommitStream Git</a>\r\n<ul>\r\n<li>Updated README.md S-01004 <a href=\"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/commit/42bf55b256c46f716f0192e9216f1db5c37ea1f2\">42bf55b2</a></li>\r\n</ul>",
                "markdown": "Daniel Gruesso pushed 1 commit to branch [master](https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/#version=GBmaster) of [CommitStream Git](https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/)\r\n* Updated README.md S-01004 [42bf55b2](https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git/commit/42bf55b256c46f716f0192e9216f1db5c37ea1f2)"
            },
            "resource": {
                "commits": [{
                    "commitId": "42bf55b256c46f716f0192e9216f1db5c37ea1f2",
                    "author": {
                        "name": "Daniel Gruesso",
                        "email": "gruesso@hotmail.com",
                        "date": "2016-03-10T15:42:31Z"
                    },
                    "committer": {
                        "name": "Daniel Gruesso",
                        "email": "gruesso@hotmail.com",
                        "date": "2016-03-10T15:42:31Z"
                    },
                    "comment": "New user sign-up API route update S-01004",
                    "url": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437/commits/42bf55b256c46f716f0192e9216f1db5c37ea1f2"
                }],
                "refUpdates": [{
                    "name": "refs/heads/master",
                    "oldObjectId": "dc5c58fa815298c24ec1d51608a6d485a9d345dc",
                    "newObjectId": "42bf55b256c46f716f0192e9216f1db5c37ea1f2"
                }],
                "repository": {
                    "id": "b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437",
                    "name": "CommitStream Git",
                    "url": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437",
                    "project": {
                        "id": "af48b75e-4eb1-46f2-8b4f-319b5041e3cc",
                        "name": "CommitStream",
                        "url": "https://openagile.visualstudio.com/DefaultCollection/_apis/projects/af48b75e-4eb1-46f2-8b4f-319b5041e3cc",
                        "state": "wellFormed"
                    },
                    "defaultBranch": "refs/heads/master",
                    "remoteUrl": "https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/CommitStream%20Git"
                },
                "pushedBy": {
                    "id": "e925a176-096d-4adc-85cd-06acbe3fdbd1",
                    "displayName": "Daniel Gruesso",
                    "uniqueName": "gruesso@hotmail.com",
                    "url": "https://openagile.vssps.visualstudio.com/_apis/Identities/e925a176-096d-4adc-85cd-06acbe3fdbd1",
                    "imageUrl": "https://openagile.visualstudio.com/DefaultCollection/_api/_common/identityImage?id=e925a176-096d-4adc-85cd-06acbe3fdbd1"
                },
                "pushId": 5,
                "date": "2016-03-10T15:42:30.7577822Z",
                "url": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437/pushes/5",
                "_links": {
                    "self": {
                        "href": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437/pushes/5"
                    },
                    "repository": {
                        "href": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437"
                    },
                    "commits": {
                        "href": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437/pushes/5/commits"
                    },
                    "pusher": {
                        "href": "https://openagile.vssps.visualstudio.com/_apis/Identities/e925a176-096d-4adc-85cd-06acbe3fdbd1"
                    },
                    "refs": {
                        "href": "https://openagile.visualstudio.com/DefaultCollection/_apis/git/repositories/b0ba0a13-2b94-4af5-81d3-a0b5cf8fd437/refs"
                    }
                }
            },
            "resourceVersion": "1.0",
            "resourceContainers": {
                "collection": {
                    "id": "d0b6c0ab-796c-4e1a-b36d-35a94b287516"
                },
                "account": {
                    "id": "d626c5fe-e739-48a4-8d04-09e89b4aacde"
                },
                "project": {
                    "id": "af48b75e-4eb1-46f2-8b4f-319b5041e3cc"
                }
            },
            "createdDate": "2016-03-10T15:42:33.0614372Z"
        };
        this.commitSVNData = {
            "repository": "http://v1commitstream.cloudapp.net:9090/svn/ProjectA",
            "committer": {
                "name": "admin",
                "date": "2016-09-12 03:52:55 +1300 (Mon, 16 Sep 2016)"
            },
            "pretext": "Commit completed:  rev. 12",
            "revision": "12",
            "author": "admin",
            "changes": [
                "U   mariano.txt"
            ],
            "message": "S-01001 SMA Tests",
            "html_url": "http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r12"
        };
        this.commitGitSwarmData = {
            "object_kind": "push",
            "event_name": "push",
            "before": "bf2c20bc7824a3da6bda5b301560cc0bdfe1b557",
            "after": "6f1268102193085e512b3e13a701d201ce522e85",
            "ref": "refs/heads/master",
            "checkout_sha": "6f1268102193085e512b3e13a701d201ce522e85",
            "message": null,
            "user_id": 1,
            "user_name": "Administrator",
            "user_email": "admin@example.com",
            "user_avatar": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
            "project_id": 1,
            "project": {
                "name": "api-testing",
                "description": "API testing with Postman",
                "web_url": "http://gitswarm.cloudapp.net/root/api-testing",
                "avatar_url": null,
                "git_ssh_url": "git@gitswarm.cloudapp.net:root/api-testing.git",
                "git_http_url": "http://gitswarm.cloudapp.net/root/api-testing.git",
                "namespace": "root",
                "visibility_level": 0,
                "path_with_namespace": "root/api-testing",
                "default_branch": "master",
                "homepage": "http://gitswarm.cloudapp.net/root/api-testing",
                "url": "git@gitswarm.cloudapp.net:root/api-testing.git",
                "ssh_url": "git@gitswarm.cloudapp.net:root/api-testing.git",
                "http_url": "http://gitswarm.cloudapp.net/root/api-testing.git"
            },
            "commits": [
                {
                    "id": "6f1268102193085e512b3e13a701d201ce522e85",
                    "message": "Added file",
                    "timestamp": "2016-09-22T11:21:18+00:00",
                    "url": "http://gitswarm.cloudapp.net/root/api-testing/commit/6f1268102193085e512b3e13a701d201ce522e85",
                    "author": {
                        "name": "Administrator",
                        "email": "admin@example.com"
                    },
                    "added": [
                        "ReadMe2.md"
                    ],
                    "modified": [],
                    "removed": []
                }
            ],
            "total_commits_count": 1,
            "repository": {
                "name": "api-testing",
                "url": "git@gitswarm.cloudapp.net:root/api-testing.git",
                "description": "API Testing with Postman",
                "homepage": "http://gitswarm.cloudapp.net/root/api-testing",
                "git_http_url": "http://gitswarm.cloudapp.net/root/api-testing.git",
                "git_ssh_url": "git@gitswarm.cloudapp.net:root/api-testing.git",
                "visibility_level": 0
            }
        };
        this.commitP4VData = {
            "pretext":"Commit completed: rev. 178",
            "committer":{
                "name":"v1deploy@v1deploy",
                "date":"2016/10/28 16:04:17"
            },
            "author":"v1deploy@v1deploy",
            "revision":"178",
            "message":" changes inthe bin?",
            "changes":[
                "... //depot/Test/Test2#52 edit"
            ],
            "repository":"http://perforce.com/doesNotUseUrl",
            "html_url":"PLACE BASE URL TO INSPECT YOUR REVISIONS178"
        };
        this.commitDeveoGitData = {
            "after": "67ec79c2cc2737eec07b649555b3da32c47d095b",
            "ref": "refs/heads/master",
            "before": "c58a421ed77556d217abc7638de9ba9b3589b36d",
            "compare": "",
            "forced": false,
            "created": false,
            "deleted": false,
            "project": {
                "uuid": "c788fd2a-788c-4888-8673-90e027b1b849",
                "name": "Test project",
                "url": "https://deveo.com/example/code/diff/test"
            },
            "repository": {
                "uuid": "ff8f33e9-d619-493e-872d-be7dd4a10235",
                "name": "website",
                "type": "git",
                "url": "https://deveo.com/example/code/overview/test/repositories/website",
                "https_url": "https://deveo.com/example/projects/test/repositories/git/website",
                "ssh_url": "deveo@deveo.com:deveo/projects/test/repositories/git/website",
                "owner": {
                    "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                    "name": "chuck",
                    "email": "chuck@deveo.com"
                }
            },
            "pusher": {
                "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                "name": "chuck",
                "display_name": "Chuck Norris"
            },
            "commit_count": 1,
            "commits": [{
                "distinct": true,
                "removed": [],
                "message": "Update readme",
                "added": [],
                "timestamp": "2015-01-30T12:17:56Z",
                "modified": ["readme"],
                "url": "https://deveo.com/example/code/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
                "author": {
                    "name": "Chuck Norris",
                    "email": "chuck@deveo.com"
                },
                "id": "67ec79c2cc2737eec07b649555b3da32c47d095b"
            }]
        };
        this.commitDeveoMercurialData = {
            "after": "67ec79c2cc2737eec07b649555b3da32c47d095b",
            "ref": "refs/heads/master",
            "before": "c58a421ed77556d217abc7638de9ba9b3589b36d",
            "compare": "",
            "forced": false,
            "created": false,
            "deleted": false,
            "project": {
                "uuid": "c788fd2a-788c-4888-8673-90e027b1b849",
                "name": "Test project",
                "url": "https://deveo.com/example/code/diff/test"
            },
            "repository": {
                "uuid": "ff8f33e9-d619-493e-872d-be7dd4a10235",
                "name": "website",
                "type": "mercurial",
                "url": "https://deveo.com/example/code/overview/test/repositories/website",
                "https_url": "https://deveo.com/example/projects/test/repositories/git/website",
                "ssh_url": "deveo@deveo.com:deveo/projects/test/repositories/git/website",
                "owner": {
                    "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                    "name": "chuck",
                    "email": "chuck@deveo.com"
                }
            },
            "pusher": {
                "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                "name": "chuck",
                "display_name": "Chuck Norris"
            },
            "commit_count": 1,
            "commits": [{
                "distinct": true,
                "removed": [],
                "message": "Update readme",
                "added": [],
                "timestamp": "2015-01-30T12:17:56Z",
                "modified": ["readme"],
                "url": "https://deveo.com/example/code/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
                "author": {
                    "name": "Chuck Norris",
                    "email": "chuck@deveo.com"
                },
                "id": "67ec79c2cc2737eec07b649555b3da32c47d095b"
            }]
        };
        this.commitDeveoSVNData = {
            "after": "67ec79c2cc2737eec07b649555b3da32c47d095b",
            "ref": "refs/heads/master",
            "before": "c58a421ed77556d217abc7638de9ba9b3589b36d",
            "compare": "",
            "forced": false,
            "created": false,
            "deleted": false,
            "project": {
                "uuid": "c788fd2a-788c-4888-8673-90e027b1b849",
                "name": "Test project",
                "url": "https://deveo.com/example/code/diff/test"
            },
            "repository": {
                "uuid": "ff8f33e9-d619-493e-872d-be7dd4a10235",
                "name": "website",
                "type": "subversion",
                "url": "https://deveo.com/example/code/overview/test/repositories/website",
                "https_url": "https://deveo.com/example/projects/test/repositories/git/website",
                "ssh_url": "deveo@deveo.com:deveo/projects/test/repositories/git/website",
                "owner": {
                    "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                    "name": "chuck",
                    "email": "chuck@deveo.com"
                }
            },
            "pusher": {
                "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                "name": "chuck",
                "display_name": "Chuck Norris"
            },
            "commit_count": 1,
            "commits": [{
                "distinct": true,
                "removed": [],
                "message": "Update readme",
                "added": [],
                "timestamp": "2015-01-30T12:17:56Z",
                "modified": ["readme"],
                "url": "https://deveo.com/example/code/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
                "author": {
                    "name": "Chuck Norris",
                    "email": "chuck@deveo.com"
                },
                "id": "67ec79c2cc2737eec07b649555b3da32c47d095b"
            }]
        };
        this.commitDeveoWebdavData = {
            "after": "67ec79c2cc2737eec07b649555b3da32c47d095b",
            "ref": "refs/heads/master",
            "before": "c58a421ed77556d217abc7638de9ba9b3589b36d",
            "compare": "",
            "forced": false,
            "created": false,
            "deleted": false,
            "project": {
                "uuid": "c788fd2a-788c-4888-8673-90e027b1b849",
                "name": "Test project",
                "url": "https://deveo.com/example/code/diff/test"
            },
            "repository": {
                "uuid": "ff8f33e9-d619-493e-872d-be7dd4a10235",
                "name": "website",
                "type": "webdav",
                "url": "https://deveo.com/example/code/overview/test/repositories/website",
                "https_url": "https://deveo.com/example/projects/test/repositories/git/website",
                "ssh_url": "deveo@deveo.com:deveo/projects/test/repositories/git/website",
                "owner": {
                    "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                    "name": "chuck",
                    "email": "chuck@deveo.com"
                }
            },
            "pusher": {
                "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                "name": "chuck",
                "display_name": "Chuck Norris"
            },
            "commit_count": 1,
            "commits": [{
                "distinct": true,
                "removed": [],
                "message": "Update readme",
                "added": [],
                "timestamp": "2015-01-30T12:17:56Z",
                "modified": ["readme"],
                "url": "https://deveo.com/example/code/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
                "author": {
                    "name": "Chuck Norris",
                    "email": "chuck@deveo.com"
                },
                "id": "67ec79c2cc2737eec07b649555b3da32c47d095b"
            }]
        };
        this.commitInvalidPayloadData = {
            "noway": "should this work"
        };
        this.validPayload = true;
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

    pushGitHubCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitGitHubData;
        if(!validPayload) {
          commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-github-event': 'push'}
            })
    }

    pushGitLabCommit({instanceId, apiKey, inboxId, valiPayload}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitGitLabData,
            {
                headers: {'Content-type': 'application/json', 'x-gitlab-event': 'Push Hook'}
            })
    }

    pushBitbucketCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitBitbucketData,
            {
                headers: {'Content-type': 'application/json', 'x-event-key': 'repo:push'}
            })
    }

    pushVSTSCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitVSTSData,
            {
                headers: {'Content-type': 'application/json'}
            })
    }

    pushSVNCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitSVNData,
            {
                headers: {'Content-type': 'application/json', 'CS-SVN-Event': 'Commit Event'}
            })
    }

    pushGitSwarmCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitGitSwarmData,
            {
                headers: {'Content-type': 'application/json', 'x-gitlab-event': 'Push Hook', 'X-Gitswarm-Event': 'Push Hook'}
            })
    }

    pushP4VCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitP4VData,
            {
                headers: {'Content-type': 'application/json', 'CS-P4V-Event': 'Commit Event'}
            })
    }

    pushDeveoGitCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitDeveoGitData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
            })
    }

    pushDeveoMercurialCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitDeveoMercurialData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
            })
    }

    pushDeveoSVNCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitDeveoSVNData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
            })
    }

    pushDeveoWebdavCommit({instanceId, apiKey, inboxId}) {
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            this.commitDeveoWebdavData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
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
                    "href": this.rootRootUrl + "/?instanceId=" + instanceId + "&digestId=" + digestId
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

    expectedInvalidPayloadCommitResult({instanceId, digestId, inboxId}) {
        return {
            "errors": [
                "There was an unexpected error when processing your GitHUb push event."
            ]
        };
    }
}