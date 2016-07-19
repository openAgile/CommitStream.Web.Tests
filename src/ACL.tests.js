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
baseUrl = 'http://localhost:6565';

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

describe('ACL settings', function() {

  function getAuthHeader(username, password) {
    return 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  }

  var es = new EventStore({
    baseUrl: 'http://localhost:2113',
    username: 'admin',
    password: 'changeit'
  });
  var opt;
  before(function() {
    opt = {
      url: 'http://localhost:2113/streams/some-stream',
      headers: {
        'Accept': 'application/json'
      }
    }
  })

  it('should create a new stream before changing the ACL settings.', function(done) {
    var e = [{
      eventId: uuid(),
      eventType: 'some-event',
      data: {
        fooKey: 'fooValue'
      }
    }];

    es.streams.post({
      name: 'some-stream',
      events: JSON.stringify(e)
    }, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(201);
      done();
    });
  });

  it('should be able to read the just created stream without the auth header.', function(done) {
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      done();
    });
  });

  it('should get a 201 after changing the ACL settings.', function(done) {
    var aclOptions = {
      "$userStreamAcl": {
        "$r": "$admins",
        "$w": "$admins",
        "$d": "$admins",
        "$mr": "$admins",
        "$mw": "$admins"
      },
      "$systemStreamAcl": {
        "$r": "$admins",
        "$w": "$admins",
        "$d": "$admins",
        "$mr": "$admins",
        "$mw": "$admins"
      }
    };

    var settingsOpt = {
      url: 'http://localhost:2113/streams/$settings',
      headers: {
        'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
        'ES-EventType': 'SettingsUpdated',
        'ES-EventId': uuid(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aclOptions)
    }

    request.post(settingsOpt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(201);
      done();
    });
  });

  it('should not be able to read the just created stream without the auth header.', function(done) {
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(401);
      done();
    });
  });

  it('should be able to read the just created stream with the auth header.', function(done) {
    opt.headers.Authorization = getAuthHeader('admin', 'changeit');
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      done();
    });
  });

  it('should return 401 when attempting to login with correct user but no password.', function(done) {
    opt.headers.Authorization = getAuthHeader('admin', '');
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(401);
      done();
    });
  });

  it('should return 503 when attempting to login with no user but correct password.', function(done) {
    opt.headers.Authorization = getAuthHeader('', 'changeit');
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(503);
      done();
    });
  });

  it('should return 401 when attempting to login with correct user and incorrect password.', function(done) {
    opt.headers.Authorization = getAuthHeader('admin', 'changenothing');
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(401);
      done();
    });
  });

  it('should return 503 when attempting to login with incorrect user and correct password.', function(done) {
    opt.headers.Authorization = getAuthHeader('fakeuser', 'changeit');
    request.get(opt, function(error, response) {
      should.not.exist(error);
      response.statusCode.should.equal(503);
      done();
    });
  });
});