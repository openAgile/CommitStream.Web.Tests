const axios = require('axios');
const ROOT_ROOT_URL = process.env.CS_ROOT_URL || 'https://v1-cs-test.azurewebsites.net';

module.exports = class BaseAPI {
    constructor() {
        this.rootRootUrl = ROOT_ROOT_URL;
        this.rootUrl = this.rootRootUrl + '/api/';
        this.instanceUrl = this.rootUrl + 'instances';
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
        this.commitTFVCDataSingleProject = {
            "subscriptionId": "20019a9b-3534-4705-a755-198d23de2ed7",
            "notificationId": 6,
            "id": "b72be65b-614d-4652-9ca9-11d2942a5c91",
            "eventType": "tfvc.checkin",
            "publisherId": "tfs",
            "scope": "all",
            "message": {
                "text": "Josh Gough checked in changeset 17: Updated README.md S-12345",
                "html": "Josh Gough checked in changeset <a href=\"https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&amp;cs=17\">17</a>: Updated README.md S-12345",
                "markdown": "Josh Gough checked in changeset [17](https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&cs=17): Updated README.md S-12345"
            },
            "detailedMessage": {
                "text": "Josh Gough checked in changeset 17: Updated README.md S-12345",
                "html": "Josh Gough checked in changeset <a href=\"https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&amp;cs=17\">17</a>: Updated README.md S-12345",
                "markdown": "Josh Gough checked in changeset [17](https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&cs=17): Updated README.md S-12345"
            },
            "resource": {
                "hasMoreChanges": true,
                "teamProjectIds": [
                    "b70385b4-ae0f-4afd-b166-6aff62bfd0b0"
                ],
                "changesetId": 17,
                "url": "https://v1platformtest.visualstudio.com/_apis/tfvc/changesets/17",
                "author": {
                    "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
                    "displayName": "Josh Gough",
                    "uniqueName": "jsgough@gmail.com",
                    "url": "https://app.vssps.visualstudio.com/A95780de7-c7d8-4742-a6e7-12e311437415/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
                    "imageUrl": "https://v1platformtest.visualstudio.com/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
                },
                "checkedInBy": {
                    "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
                    "displayName": "Josh Gough",
                    "uniqueName": "jsgough@gmail.com",
                    "url": "https://app.vssps.visualstudio.com/A95780de7-c7d8-4742-a6e7-12e311437415/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
                    "imageUrl": "https://v1platformtest.visualstudio.com/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
                },
                "createdDate": "2017-01-20T16:28:45Z",
                "comment": "Updated README.md S-12345"
            },
            "resourceVersion": "1.0",
            "resourceContainers": {
                "collection": {
                    "id": "6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67",
                    "baseUrl": "https://v1platformtest.visualstudio.com/"
                },
                "account": {
                    "id": "95780de7-c7d8-4742-a6e7-12e311437415",
                    "baseUrl": "https://v1platformtest.visualstudio.com/"
                }
            },
            "createdDate": "2017-01-20T16:28:47.755774Z"
        };
        this.commitTFVCDataMultiProject = {
            "subscriptionId": "5a5419f9-8deb-46ca-8c9b-825e80311c6c",
            "notificationId": 1,
            "id": "b396843b-6f58-408d-b6dd-468be8d7a615",
            "eventType": "tfvc.checkin",
            "publisherId": "tfs",
            "scope": "all",
            "message": {
                "text": "Sally Ann Cavanaugh checked in changeset 22",
                "html": "Sally Ann Cavanaugh checked in changeset <a href=\"https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&amp;cs=22\">22</a>",
                "markdown": "Sally Ann Cavanaugh checked in changeset [22](https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&cs=22)"
            },
            "detailedMessage": {
                "text": "Sally Ann Cavanaugh checked in changeset 22",
                "html": "Sally Ann Cavanaugh checked in changeset <a href=\"https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&amp;cs=22\">22</a>",
                "markdown": "Sally Ann Cavanaugh checked in changeset [22](https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&cs=22)"
            },
            "resource": {
                "hasMoreChanges": true,
                "teamProjectIds": ["70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e", "fdc49ee6-ec19-43a4-bd08-55800484b342"],
                "changesetId": 22,
                "url": "https://testsystem.visualstudio.com/_apis/tfvc/changesets/22",
                "author": {
                    "id": "2c22451e-cd97-454e-aa61-bf076557ab3f",
                    "displayName": "Sally Ann Cavanaugh",
                    "uniqueName": "scavanaugh@nowhere.com",
                    "url": "https://thing.somewhere.visualstudio.com/A7d7713ab-3a77-4625-a298-2f17fba9310b/_apis/Identities/2c22451e-cd97-454e-aa61-bf076557ab3f",
                    "imageUrl": "https://testsystem.visualstudio.com/_api/_common/identityImage?id=2c22451e-cd97-454e-aa61-bf076557ab3f"
                },
                "checkedInBy": {
                    "id": "2c22451e-cd97-454e-aa61-bf076557ab3f",
                    "displayName": "Sally Ann Cavanaugh",
                    "uniqueName": "scavanaugh@nowhere.com",
                    "url": "https://thing.somewhere.visualstudio.com/A7d7713ab-3a77-4625-a298-2f17fba9310b/_apis/Identities/2c22451e-cd97-454e-aa61-bf076557ab3f",
                    "imageUrl": "https://testsystem.visualstudio.com/_api/_common/identityImage?id=2c22451e-cd97-454e-aa61-bf076557ab3f"
                },
                "createdDate": "2017-03-08T20:54:34Z",
                "comment": ""
            },
            "resourceVersion": "1.0",
            "resourceContainers": {
                "collection": {
                    "id": "80c24ec7-6164-46d7-9b2a-ab3d60d8dc71",
                    "baseUrl": "https://testsystem.visualstudio.com/"
                },
                "account": {
                    "id": "7d7713ab-3a77-4625-a298-2f17fba9310b",
                    "baseUrl": "https://testsystem.visualstudio.com/"
                }
            },
            "createdDate": "2017-03-08T20:54:37.2569716Z"
        };
        this.isMultiProject = false;
        this.commitTFSOnPremData = {
            "subscriptionId": "06748b5c-e3e5-418f-88b0-57bcdae24ebf",
            "notificationId": 175,
            "id": "6e6fcde3-2d98-4432-9301-916b2d162697",
            "eventType": "git.push",
            "publisherId": "tfs",
            "message": {
                "text": "Zhang, Xin (Northern Lights) pushed updates to branch pbi_639_2282 of SMARTworks\r\n(http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/#version=GBpbi_639_2282)",
                "html": "Zhang, Xin (Northern Lights) pushed updates to branch <a href=\"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/#version=GBpbi_639_2282\">pbi_639_2282</a> of <a href=\"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/\">SMARTworks</a>",
                "markdown": "Zhang, Xin (Northern Lights) pushed updates to branch [pbi_639_2282](http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/#version=GBpbi_639_2282) of [SMARTworks](http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/)"
            },
            "detailedMessage": {
                "text": "Zhang, Xin (Northern Lights) pushed 1 commit to branch pbi_639_2282 of SMARTworks\r\n - Added js function for story 2282. 3b9cbd24 (http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/commit/3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2)",
                "html": "Zhang, Xin (Northern Lights) pushed 1 commit to branch <a href=\"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/#version=GBpbi_639_2282\">pbi_639_2282</a> of <a href=\"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/\">SMARTworks</a>\r\n<ul>\r\n<li>Added js function for story 2282. <a href=\"http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/commit/3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2\">3b9cbd24</a></li>\r\n</ul>",
                "markdown": "Zhang, Xin (Northern Lights) pushed 1 commit to branch [pbi_639_2282](http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/#version=GBpbi_639_2282) of [SMARTworks](http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/)\r\n* Added js function for story 2282. [3b9cbd24](http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks/commit/3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2)"
            },
            "resource": {
                "commits": [
                    {
                        "commitId": "3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2",
                        "author": {
                            "name": "Zhang, Xin (Northern Lights)",
                            "email": "xinzhang@nltechdev.com",
                            "date": "2017-01-09T00:52:17Z"
                        },
                        "committer": {
                            "name": "Zhang, Xin (Northern Lights)",
                            "email": "xinzhang@nltechdev.com",
                            "date": "2017-01-09T00:52:17Z"
                        },
                        "comment": "Added js function for story 2282.\n\nRelated Work Items: #2282",
                        "url": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5/commits/3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2"
                    }
                ],
                "refUpdates": [
                    {
                        "name": "refs/heads/pbi_639_2282",
                        "oldObjectId": "0000000000000000000000000000000000000000",
                        "newObjectId": "3b9cbd2406f315bfc7f5da5b004cc32cf898dcb2"
                    }
                ],
                "repository": {
                    "id": "4e07555c-b313-40a1-9db0-64569906a0f5",
                    "name": "SMARTworks",
                    "url": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5",
                    "project": {
                        "id": "8e52738b-9a82-46e3-847c-0162bcebe2c7",
                        "name": "SMARTworks",
                        "url": "http://tctfs05:8080/tfs/TayCommCFT/_apis/projects/8e52738b-9a82-46e3-847c-0162bcebe2c7",
                        "state": "wellFormed"
                    },
                    "defaultBranch": "refs/heads/master",
                    "remoteUrl": "http://tctfs05:8080/tfs/TayCommCFT/_git/SMARTworks"
                },
                "pushedBy": {
                    "id": "d4692e8f-731e-4557-aac0-46e3c3853df2",
                    "displayName": "Zhang, Xin (Northern Lights)",
                    "uniqueName": "CORP\\xinzhang",
                    "url": "http://tctfs05:8080/tfs/TayCommCFT/_apis/Identities/d4692e8f-731e-4557-aac0-46e3c3853df2",
                    "imageUrl": "http://tctfs05:8080/tfs/TayCommCFT/_api/_common/identityImage?id=d4692e8f-731e-4557-aac0-46e3c3853df2"
                },
                "pushId": 2723,
                "date": "2017-01-09T00:52:24.3043155Z",
                "url": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5/pushes/2723",
                "_links": {
                    "self": {
                        "href": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5/pushes/2723"
                    },
                    "repository": {
                        "href": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5"
                    },
                    "commits": {
                        "href": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5/pushes/2723/commits"
                    },
                    "pusher": {
                        "href": "http://tctfs05:8080/tfs/TayCommCFT/_apis/Identities/d4692e8f-731e-4557-aac0-46e3c3853df2"
                    },
                    "refs": {
                        "href": "http://tctfs05:8080/tfs/TayCommCFT/_apis/git/repositories/4e07555c-b313-40a1-9db0-64569906a0f5/refs"
                    }
                }
            },
            "resourceVersion": "1.0",
            "resourceContainers": {
                "collection": {
                    "id": "16ba619e-6aa9-4b06-abf0-957eec41bd3b"
                },
                "project": {
                    "id": "8e52738b-9a82-46e3-847c-0162bcebe2c7"
                }
            },
            "createdDate": "2017-01-09T00:52:27.5743562Z"
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
            "after":"bd4a158555d69bd41fa1b6429c816031152d091d",
            "ref":"refs/heads/master",
            "before":"007c20d3bf35b19e507ecbb52dceb86a91bde173",
            "compare":"",
            "forced":false,
            "created":false,
            "deleted":false,
            "project":{
                "uuid":"f1115b9c-b165-46de-85a7-251805537746",
                "name":"demo-",
                "url":"https://app.deveo.com/Gexample/projects/demo-"},
            "repository":{
                "uuid":"7b23046e-405f-4ec5-b1c9-38875e65369f",
                "name":"gitti1",
                "type":"git",
                "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1",
                "https_url":"https://app.deveo.com/Gexample/projects/demo-/repositories/git/gitti1",
                "ssh_url":"deveo@app.deveo.com:Gexample/projects/demo-/repositories/git/gitti1",
                "owner":{
                    "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
                    "name":"doejohn",
                    "email":"ilmari@deveo.com"
                }
            },
            "pusher":{"uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
                "name":"doejohn","display_name":"John Doe"},
            "commit_count":1,
            "commits":[
                {
                    "distinct":true,
                    "removed":[],
                    "message":"S-01041 DeveoGitreadme.m",
                    "added":[],
                    "timestamp":"2016-09-07T13:58:23Z",
                    "modified":["README.md"],
                    "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1/changesets/bd4a158555d69bd41fa1b6429c816031152d091d",
                    "author":{
                        "name":"Ilmari Kontulainen",
                        "email":"ilmari@deveo.com"
                    },
                    "id":"bd4a158555d69bd41fa1b6429c816031152d091d"
                }
            ]
        };
        this.commitDeveoMercurialData = {
            "after":"5b634f103ad212848a47a29d306616b002eeb828",
            "ref":"refs/heads/default",
            "before":"",
            "compare":"",
            "forced":false,
            "created":false,
            "deleted":false,
            "project":{
                "uuid":"f1115b9c-b165-46de-85a7-251805537746",
                "name":"demo-",
                "url":"https://app.deveo.com/Gexample/projects/demo-"
            },
            "repository":{
                "uuid":"9371e395-6448-4e8d-8584-b042e3f2859b",
                "name":"foo",
                "type":"mercurial",
                "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo",
                "https_url":"https://app.deveo.com/Gexample/projects/demo-/repositories/mercurial/foo",
                "ssh_url":"ssh://deveo@app.deveo.com/Gexample/projects/demo-/repositories/mercurial/foo",
                "owner":{
                    "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
                    "name":"doejohn",
                    "email":"ilmari@deveo.com"
                }
            },
            "pusher":{
                "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
                "name":"doejohn",
                "display_name":"John Doe"
            },
            "commit_count":1,
            "commits":[
                {
                    "distinct":true,"removed":[],
                    "message":"Initial commit for DeveoMercurial.",
                    "added":["README.md"],
                    "timestamp":"2016-09-07T14:58:49Z",
                    "modified":[],
                    "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo/changesets/5b634f103ad212848a47a29d306616b002eeb828",
                    "author":{
                        "name":"Ilmari Kontulainen",
                        "email":"ilmari@deveo.com"
                    },
                    "id":"5b634f103ad212848a47a29d306616b002eeb828"
                }
            ]
        };
        this.commitDeveoSVNData = {
            "after":"2",
            "ref":"",
            "before":"1",
            "compare":"",
            "forced":false,
            "created":false,
            "deleted":false,
            "project":{
                "uuid":"f1115b9c-b165-46de-85a7-251805537746",
                "name":"demo-",
                "url":"https://app.deveo.com/Gexample/projects/demo-"
            },
            "repository":{
                "uuid":"19cf0c6f-0743-4e4f-9e28-17f504476c34",
                "name":"svn1",
                "type":"subversion",
                "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1",
                "https_url":"https://app.deveo.com/Gexample/projects/demo-/repositories/subversion/svn1",
                "ssh_url":"svn+ssh://deveo@app.deveo.com/Gexample/projects/demo-/repositories/subversion/svn1",
                "owner":{
                    "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
                    "name":"doejohn",
                    "email":"ilmari@deveo.com"
                }
            },
            "pusher":{
                "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
                "name":"doejohn",
                "display_name":"John Doe"
            },
            "commit_count":1,
            "commits":[
                {
                    "distinct":true,
                    "removed":[],
                    "message":"More text for DeveoSVN.",
                    "added":[],
                    "timestamp":"2016-09-07T15:05:20Z",
                    "modified":["README.md"],
                    "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1/changesets/2",
                    "author":{
                        "name":"doejohn",
                        "email":""
                    },
                    "id":"2"
                }
            ]
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
                "name": "OUt of this World",
                "url": "https://deveo.com/example/code/diff/outofthisworld"
            },
            "repository": {
                "uuid": "ff8f33e9-d619-493e-872d-be7dd4a10235",
                "name": "files",
                "type": "webdav",
                "url": "https://deveo.com/example/code/overview/test/repositories/website",
                "https_url": "https://deveo.com/example/projects/test/repositories/webdav/website",
                "ssh_url": "deveo@deveo.com:deveo/projects/test/repositories/webdav/website",
                "owner": {
                    "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                    "name": "Buddy",
                    "email": "buddyOne@deveo.com"
                }
            },
            "pusher": {
                "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
                "name": "Buddy",
                "display_name": "Buddy One"
            },
            "commit_count": 1,
            "commits": [{
                "distinct": true,
                "removed": [],
                "message": "Update readme for DeveoWebDav.",
                "added": [],
                "timestamp": "2015-01-30T12:17:56Z",
                "modified": ["readme"],
                "url": "https://deveo.com/example/projects/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
                "author": {
                    "name": "Buddy One",
                    "email": "buddyOne@deveo.com"
                },
                "id": "67ec79c2cc2737eec07b649555b3da32c47d095b"
            }]
        };
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
        let commitData = this.commitGitHubData;
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

    pushGitLabCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitGitLabData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-gitlab-event': 'Push Hook'}
            })
    }

    pushBitbucketCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitBitbucketData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-event-key': 'repo:push'}
            })
    }

    pushVSTSCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitVSTSData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json'}
            })
    }

    pushTFVCCommit({instanceId, apiKey, inboxId, validPayload, isMultiProject}) {
        let commitData = this.commitTFVCDataMultiProject;
        if(!isMultiProject){
            let commitData = this.commitTFVCDataSingleProject;
        }
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }

        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json'}
            })
    }

    pushTFSOnPremCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitTFSOnPremData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json'}
            })
    }

    pushSVNCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitSVNData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'CS-SVN-Event': 'Commit Event'}
            })
    }

    pushGitSwarmCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitGitSwarmData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-gitlab-event': 'Push Hook', 'X-Gitswarm-Event': 'Push Hook'}
            })
    }

    pushP4VCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitP4VData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'CS-P4V-Event': 'Commit Event'}
            })
    }

    pushDeveoGitCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitDeveoGitData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
            })
    }

    pushDeveoMercurialCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitDeveoMercurialData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
            })
    }

    pushDeveoSVNCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitDeveoSVNData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
            {
                headers: {'Content-type': 'application/json', 'x-deveo-event': 'push'}
            })
    }

    pushDeveoWebdavCommit({instanceId, apiKey, inboxId, validPayload}) {
        let commitData = this.commitDeveoWebdavData;
        if(!validPayload) {
            commitData = this.commitInvalidPayloadData;
        }
        let commitUrl = this.rootUrl + instanceId + '/inboxes/' + inboxId + '/commits?apiKey=' + apiKey;
        return axios.post(commitUrl,
            commitData,
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
                    "repo":"SMARTworks/undefined",
                    "branch":"pbi_639_2282",
                    "branchHref":"http://tctfs05:8080/tfs/TayCommCFT/_git/undefined/#version=GBpbi_639_2282",
                    "repoHref":"http://tctfs05:8080/tfs/TayCommCFT/_git/undefined",
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
                    "repo":"CommitStream%20Git/undefined",
                    "branch":"master",
                    "branchHref":"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/undefined/#version=GBmaster",
                    "repoHref":"https://openagile.visualstudio.com/DefaultCollection/CommitStream/_git/undefined",
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