'use strict';

var chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('request'),
  uuid = require('uuid-v4'),
  EventStore = require('eventstore-client');

chai.use(sinonChai);
chai.config.includeStack = true;

let baseUrl = process.env.baseUrl;
//TODO: remove this
baseUrl = 'https://v1-cs-test.azurewebsites.net';

let apiKey;
let instanceId;
let urlToCreateDigest;
let digestId;
let urlToCreateInbox;

let inbox1Id;
let urlToPushCommitToInbox1;
let urlToGetInbox1Info;

let inbox2Id;
let urlToPushCommitToInbox2;
let urlToGetInbox2Info;

let digestIdA;
let urlToCreateInboxA;
let urlToPushCommitToInboxA;


describe('you need a digest to associate to the inboxes that will be created', function() {

  /* TODO update this for instanceId support and move to sad path tests
  it('should return error message with 401 Unauthorized response when request is made without a key.', function(done) {
    request({
      //TODO: should this uri be api/digests?
      uri: "http://localhost:6565/api/digest?workitem=S-11111",
      method: "POST",
      body: JSON.stringify({
        description: "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(401);
      res.body.should.equal('API key parameter missing or invalid');
      done();
    })
  });

  it('should return error when request is made with incorrect key.', function(done) {
    request({
      //TODO: should this uri be api/digests?
      uri: "http://localhost:6565/api/digest?key=S-11111",
      method: "POST",
      body: JSON.stringify({
        description: "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(401);
      res.body.should.equal('API key parameter missing or invalid');
      done();
    })
  });
  */

  it('creates the instance', function(done) {
    request({
      uri: baseUrl + "/api/instances",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: ''
    }, function(err, res, body) {
      should.not.exist(err);
      instanceId = JSON.parse(body).instanceId;
      apiKey = JSON.parse(body).apiKey;
      urlToCreateDigest = JSON.parse(body)._links['digest-create'].href;

      should.exist(instanceId);
      should.exist(apiKey);
      should.exist(urlToCreateDigest);
      done();
    });
  });

  it('creates the digest', function(done) {
    request({
      uri: urlToCreateDigest + '?apiKey=' + apiKey,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        description: "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      digestId = JSON.parse(body).digestId;
      urlToCreateInbox = JSON.parse(body)._links['inbox-create'].href;

      should.exist(digestId);
      should.exist(urlToCreateInbox);
      done();
    });
  });

  it('creates the inbox', function(done) {
    request({
      uri: urlToCreateInbox + '?apiKey=' + apiKey,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Inbox 1",
        digestId: digestId,
        family: "GitHub"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      inbox1Id = JSON.parse(body).inboxId;
      urlToPushCommitToInbox1 = JSON.parse(body)._links['add-commit'].href;
      urlToGetInbox1Info = JSON.parse(body)._links.self.href;

      should.exist(inbox1Id);
      should.exist(urlToPushCommitToInbox1);
      should.exist(urlToGetInbox1Info);
      done();
    });
  });
  it('creates another inbox in the same digest', function(done) {
    request({
      uri: urlToCreateInbox + '?apiKey=' + apiKey,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Inbox 2",
        digestId: digestId,
        family: "GitHub"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      inbox2Id = JSON.parse(body).inboxId;
      urlToPushCommitToInbox2 = JSON.parse(body)._links['add-commit'].href;

      should.exist(inbox2Id);
      should.exist(urlToPushCommitToInbox2);
      done();
    });
  });
});

describe('api/inboxes', function() {
  it('the first inbox should accept a valid payload and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInbox1 + '?apiKey=' + apiKey,
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox1)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('The commits have been added to the CommitStream inbox.');
      done();
    });
  });
  it('The second inbox should accept a valid payload and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInbox2 + '?apiKey=' + apiKey,
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox2)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('The commits have been added to the CommitStream inbox.');
      done();
    });
  });
  it('The secound inbox should accept a valid payload with no mention of a workitem and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInbox2 + '?apiKey=' + apiKey,
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox2WithOutMention)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('The commits have been added to the CommitStream inbox.')
      done();
    });
  });
});

describe('api/:instanceId/digests/:digestId/commits?apiKey after POST', function() {
  it('should return 3 commits.', function(done) {
    let digestCommitsUrl = baseUrl + '/api/' + instanceId + '/digests/' +
      digestId + '/commits?apiKey=' + apiKey;

    request({
      uri: digestCommitsUrl,
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      JSON.parse(res.body).commits.length.should.equal(3);
      done();
    });
  });

  it('should accept a valid payload and return commit details for the specified workitem.', function(done) {
    this.timeout(5000);
    let workItemCommitsUrl = baseUrl + '/api/' + instanceId +
      '/commits/tags/versionone/workitem?numbers=S-11111&apiKey=' + apiKey;

    console.log(workItemCommitsUrl);
    setTimeout(function() {
      request({
        uri: workItemCommitsUrl,
        method: "GET"
      }, function(err, res, body) {
        should.not.exist(err);
        res.statusCode.should.equal(200);

        // Need to remove the 'timeFormatted' field from the response body as
        // we can not rely on that value staying constant as time moves on. It will
        // change because we are using the timeago package to transform it into values
        // like '3 months ago'. But once a month increments, then our assertion will be wrong
        // because the actual value at runtime will then be '4 months ago'
        var cleanedBody = JSON.parse(res.body);
        cleanedBody.commits = _.map(cleanedBody.commits, function(value, key, list) {
         return _.omit(value, 'timeFormatted', 'commitDate');
       });

       cleanedBody = JSON.stringify(cleanedBody);
       cleanedBody.should.equal(JSON.stringify(expectedCommits));0
        done();
      });
    }, 3000);
  });

  it('should return empty commits when request is made with correct key but incorrect workitem.', function(done) {
    let workItemCommitsUrl = baseUrl + '/api/' + instanceId + 
      '/commits/tags/versionone/workitem?numbers=1111&apiKey=' + apiKey;
      console.log(workItemCommitsUrl);
    request({
      uri: workItemCommitsUrl,
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"commits":[],"_links":{}}');
      done();
    })
  });

  it('should return error message when request is made with correct key but no workitem.', function(done) {
    let workItemCommitsUrl = baseUrl + '/api/' + instanceId + 
      '/commits/tags/versionone/workitem?numbers=&apiKey=' + apiKey;
    request({
      uri: workItemCommitsUrl,
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(400);
      res.body.should.equal('{"error":"Parameter workitem is required"}');
      done();
    })
  });
});

// describe('ACL settings', function() {
//placeholder
// });

describe('api/digests/<digestId>/inboxes', function() {

  //var key = "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7";
  let digestIdCreated;
  let inboxesToCreate = ["Inbox 11", "Inbox 22"];
  let inboxMap = {};
  let inboxesUrl = baseUrl + '/api/digests' + digestId + '/inboxes&apiKey=' + apiKey;

  function getExpectedResponse(digestId, inboxMap) {
    return {
      "_links": {
        "self": {
          "href": baseUrl + "/api/digests/" + digestId + "/inboxes",
        },
        "digest": {
          "href": baseUrl + "/api/digests/" + digestId
        },
        "inbox-create": {
          "href": baseUrl + "/api/inboxes",
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
        }
      },
      "count": 2,
      "digest": {
        "description": "Digest with Inboxes",
        "digestId": digestId
      },
      "_embedded": {
        "inboxes": [{
          "_links": {
            "self": {
              "href": baseUrl + "/api/inboxes/" + inboxMap['Inbox 11']
            },
            "inbox-commits": {
              "href": baseUrl + "/api/inboxes/" + inboxMap['Inbox 11'] + "/commits",
              "method": "POST"
            }
          },
          "inboxId": inboxMap['Inbox 11'],
          "family": "GitHub",
          "name": "Inbox 11"
        }, {
          "_links": {
            "self": {
              "href": baseUrl + "/api/inboxes/" + inboxMap['Inbox 22']
            },
            "inbox-commits": {
              "href": baseUrl + "/api/inboxes/" + inboxMap['Inbox 22'] + "/commits",
              "method": "POST"
            }
          },
          "inboxId": inboxMap['Inbox 22'],
          "family": "GitHub",
          "name": "Inbox 22"
        }]
      }
    }
  }

  before(function(done) {
    request({
      uri: baseUrl + "/api/digests&apiKey=" + apiKey,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        description: "Digest with Inboxes"
      })
    }, function(err, res, body) {
      var digestData = JSON.parse(body);
      digestIdCreated = digestData.digestId;
      var urlToCreateInbox = digestData._links['inbox-create'].href;

      inboxesToCreate.forEach(function(inbox) {
        request({
          uri: urlToCreateInbox + "&apiKey=" + apiKey,
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name: inbox,
            digestId: digestIdCreated,
            family: "GitHub"
          })
        }, function(err, res, body) {
          inboxMap[inbox] = JSON.parse(body).inboxId;
          if (_.keys(inboxMap).length === inboxesToCreate.length) done();
        });
      });
    });
  });

  it('should return the expected response body.', function(done) {
    setTimeout(function() {
      request.get({
          uri: baseUrl + "/api/digests/" + digestIdCreated + "/inboxes&apiKey=" + apiKey,
          method: "POST",
          headers: {
            "content-type": "application/json"
          }
        },
        function(err, res) {
          var expected = getExpectedResponse(digestIdCreated, inboxMap);
          var actual = JSON.parse(res.body);
          if (actual._embedded.inboxes[0].name === 'Inbox 22') {
            expected._embedded.inboxes = expected._embedded.inboxes.reverse();
          }
          actual.should.deep.equal(expected);
          done();
        });
    }, 5);
  });
});

describe('api/digests GET', function() {
  var key = "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7";

  before(function(done) {
    request({
      uri: "http://localhost:2113/streams/digests",
      headers: {
        'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
      },
      method: 'DELETE'
    }, function(err, res) {
      done();
    });
  });

  it('should return an empty array for no digests created.', function(done) {
    setTimeout(function() {
      request.get({
        uri: "http://localhost:6565/api/digests" + key,
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      }, function(err, res) {
        var expected = {
          "_links": {
          "self": {
            "href": "http://localhost:6565/api/digests",
            }
          },
          "count": 0,
          "_embedded": {
            "digests": []
          }
        };
        var actual = JSON.parse(res.body);
        actual.should.deep.equal(expected);
        done();
      });
    }, 0);
  });

  describe('when 3 digests are available: ', function() {
    //var key = "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7";
    var digestMap = {};
    var digestsToCreate = ['First Digest', 'Second Digest', 'Third Digest'];
  var commitStreamdigestsUrl = baseUrl + "/api/digests";
  var eventStoreDigestsStreamUrl = "http://localhost:2113/streams/digests";

    function getExpectedResponse(digestMap) {
       return {
        "_links": {
          "self": {
            "href": baseUrl + "/api/digests",
          }
        },
        "count": 3,
        "_embedded": {
          "digests": [{
            "_links": {
              "self": {
                "href": baseUrl + "/api/digests/" + digestMap['Third Digest']
              }
            },
            "digestId": digestMap['Third Digest'],
            "description": "Third Digest"
          }, {
            "_links": {
              "self": {
                "href": baseUrl + "/api/digests/" + digestMap['Second Digest']
              }
            },
            "digestId": digestMap['Second Digest'],
            "description": "Second Digest"
          }, {
            "_links": {
              "self": {
                "href": baseUrl + "/api/digests/" + digestMap['First Digest']
              }
            },
            "digestId": digestMap['First Digest'],
            "description": "First Digest"
          }]
        }
      };
    }


    function digestCreate(index, done) {
      var digest = digestsToCreate[index];
      request({
        uri: commitStreamdigestsUrl + key,
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          description: digest
        })
      }, function(err, res, body) {
        var digestData = JSON.parse(body);
        digestIdCreated = digestData.digestId;
        digestMap[digest] = digestIdCreated;
        if (_.keys(digestMap).length === digestsToCreate.length) {
          done();
        } else {
          if (index + 1 < digestsToCreate.length) digestCreate(index + 1, done);
        }
      });
    }


      uri: "http://localhost:2113/streams/digests",
    before(function(done) {
      digestCreate(0, done);
    });

    it('should return a response body with 3 digests, when 3 are available.', function(done) {
      request.get({
        uri: commitStreamdigestsUrl + "&apiKey=" + apiKey,
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      }, function(err, res) {
        var expected = getExpectedResponse(digestMap);
        var actual = JSON.parse(res.body);
        actual.should.deep.equal(expected);
        done();
      });
    });
  });
});

describe('api/inboxes/:uuid GET', function() {
  //var key = undefined;
  //var expected = undefined;

  before(function() {
    //key = "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7";
    expected = {
      "_links": {
        "self": {
          "href": urlToGetInbox1Info
        },
        "digest-parent": {
          "href": baseUrl + "/api/digests/" + digestId
        }
      },
      "family": "GitHub",
      "name": "Inbox 1"
    };
  });

  it('it should return the expected response body', function(done) {

    request.get({
      uri: urlToGetInbox1Info + "&apiKey=" + apiKey,
      method: "GET"
    }, function(err, res) {
      var actual = JSON.parse(res.body);
      actual.should.deep.equal(expected);
      done();
    });
  });

});

var expectedCommits = {
  "commits": [{
    "author": "kunzimariano",
    "sha1Partial": "d31d17",
    "family": "GitHub",
    "action": "committed",
    "message": "S-11111 Modified UI validations!",
    "commitHref": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "repo": "kunzimariano/CommitService.DemoRepo",
    "branch": "master",
    "branchHref": "https://github.com/kunzimariano/CommitService.DemoRepo/tree/master",
    "repoHref": "https://github.com/kunzimariano/CommitService.DemoRepo"
  }, {    
    "author": "laureanoremedi",
    "sha1Partial": "d31d17",
    "family": "GitHub",
    "action": "committed",
    "message": "S-11111 initial Commit to backend functionality!",
    "commitHref": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "repo": "kunzimariano/CommitService.DemoRepo",
    "branch": "master",
    "branchHref": "https://github.com/kunzimariano/CommitService.DemoRepo/tree/master",
    "repoHref": "https://github.com/kunzimariano/CommitService.DemoRepo"
  }],
  "_links": {}
};

var commitInbox1 = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "S-11111 initial Commit to backend functionality!",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "author": {
      "name": "laureanoremedi",
      "email": "laureanoremedi@gmail.com",
      "username": "laureanoremedi"
    },
    "committer": {
      "name": "laureanoremedi",
      "email": "laureanoremedi@gmail.com",
      "username": "laureanoremedi"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }],
  "repository": {
    "id": 23355501,
    "name": "CommitService.DemoRepo"
  }
};

var commitInbox2 = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "S-11111 Modified UI validations!",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "author": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }],
  "repository": {
    "id": 23355501,
    "name": "CommitService.DemoRepo"
  }
};

var commitInbox2WithOutMention = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "Actualize Documentation",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "author": {
      "name": "matiasHeffel",
      "email": "matiasheffel@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "matiasHeffel",
      "email": "matiasHeffel@gmail.com",
      "username": "matiasHeffel"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }],
  "repository": {
    "id": 23355501,
    "name": "CommitService.DemoRepo"
  }
};

var commitInboxA = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "b42c285e1506edac965g92573a2121700fc92f8b",
    "distinct": true,
    "message": "S-11111 Updated Happy Path Validations!",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b",
    "author": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "username": "shawnmarie"
    },
    "committer": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "username": "shawnmarie"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }],
  "repository": {
    "id": 23355501,
    "name": "CommitService.DemoRepo"
  }
};
