/**
 * Created by sabbott on 11/8/2016.
 */
//var Glance = require("glance-webdriver").default;
import Glance from "glance-webdriver";
import test from 'ava';
import chai from 'chai';
import selenium from './selenium';
chai.should();

var glance;

test.before("Start selenium and init glance", t => {
    return new Promise(function (resolve, reject) {
        selenium.start(function (err, port) {
            if (err) return reject(err);

            glance = new Glance({
                driverConfig: {
                    desiredCapabilities: {
                        browserName: process.env['BROWSER_NAME'] || 'chrome'
                    },
                    port: port || 4444
                }
            });

            return resolve(glance);
        });
    });
});

test.after.always("Cleanup", t => {
    return glance.end().then(selenium.stop)
});

let title;

test("Login to VersionOne-SMA Instance", t=> {
    return glance.url("https://www8.v1host.com/ShawnMarie_DNTD/")
        .set("browser:size", "maximize")
        .cast({
            'username>input':'admin',
            'password>input':'admin'
        })
        .click('Login')
        //.click('Back to Main')
        // .click('My Home')
        // .click('Getting Started')
        // // .get("page-title").then(function(title) {
        // //     console.log('Title was: ' + title);
        // //     t.is(title, "Let's Get Started", "This test was an utter failure.")
        // // })
        // .click('ADMIN#1')
        // .pause(4000)
        // .click('DevOps')
        // .pause(3000)
        .url("https://www8.v1host.com/ShawnMarie_DNTD/Default.aspx?menu=CommitStreamPage&feat-nav=--a2#/")
        //.click('CommitStream')
        .pause(3000)
        .click('Disabled')
        .pause(2000)
        .click('GitHub')
        .set('inboxUrl>input', 'https://github.com/shawnmarie/genericTest')
        .click("Add")
        .pause(1000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
        })
        .get('genericTest>input').then(function(gitHubUrl) {
            console.log("GitHub URL is: ", gitHubUrl);
            gitHubUrl.should.include('https://commitstream.v1host.com/api/', "This should be an inbox URL: " + gitHubUrl);
        })
        .click('GitLab')
        .set('inboxUrl>input', 'https://gitlab.com/shawnmarie/localFox')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
                console.log('Table header was: ', header);
                t.is(header, "Active Repositories", "What value did I get then?: " + header)
            })
        .get('localFox>input').then(function(gitLabUrl) {
                console.log("GitLab URL is: ", gitLabUrl);
                gitLabUrl.should.include('https://commitstream.v1host.com/api/', "This should be an inbox URL: " + gitLabUrl);
            })
        .click('Bitbucket')
        .set('inboxUrl>input', 'https://bitbucket.org/shawnmarie/blueTub')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
             console.log('Table header was: ', header);
             t.is(header, "Active Repositories", "What value did I get then?: " + header)
             })
        .get('blueTub>input').then(function(bitBucketUrl) {
             console.log("Bitbucket URL is: ", bitBucketUrl);
             bitBucketUrl.should.include('https://commitstream.v1host.com/api/', "This should be an inbox URL: " + bitBucketUrl);
             })
        .click('VSTS')
        .set('inboxUrl>input', 'https://microsoft.vsogit.com/shawnmarie/microSoft')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            })
        .get('microSoft>input').then(function(vsoGitUrl) {
            console.log("VSTS URL is: ", vsoGitUrl);
            vsoGitUrl.should.include('https://commitstream.v1host.com/api/', "This should be an inbox URL: " + vsoGitUrl);
            })
        .click('Subversion')
        .set('inboxUrl>input', 'https://subversion.com/shawnmarie/depotNum1')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
        })
        .get('depotNum1>input').then(function(svnRepoUrl) {
            console.log("SVN URL is: ", svnRepoUrl);
            svnRepoUrl.should.include('https://commitstream.v1host.com/api/', "This should be an inbox URL: " + svnRepoUrl);
        })
         //clean up
        .click('genericTest>iconRemove')
        .click('modal>button^Remove')
        .click('localFox>iconRemove')
        .click('modal>button^Remove')
        .click('blueTub>iconRemove')
        .click('modal>button^Remove')
        .click('microSoft>iconRemove')
        .click('modal>button^Remove')
        .click('depotNum1>iconRemove')
        .click('modal>button^Remove')
        .click('Enabled')
        .click('Back to Main')
        .click('My Home')
        .click('Getting Started')
        .get("page-title").then(function(title) {
            console.log('Title was: ' + title);
            t.is(title, "Let's Get Started", "This test was an utter failure.")
        })
        //.end();
});

