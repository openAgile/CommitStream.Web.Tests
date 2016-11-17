import Glance from "glance-webdriver";
import test from 'ava';
import chai from 'chai';
import selenium from '../dependencies/selenium';
import fs from 'fs';
import _ from 'lodash';
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
test.after('saveInboxes', t=> {
    fs.writeFileSync('../../config/inboxes.json',JSON.stringify(inboxes, null, "\t"));
});
test.after.always("Cleanup", t => {
    return glance.end().then(selenium.stop)
});

let title;
let inboxesJSON = fs.readFileSync('../../config/inboxes.json', 'utf-8');
let inboxes = JSON.parse(inboxesJSON);

let changeInboxWebhook=(family, webhook) => {
    let vcsInbox = _.find(inboxes, {'family': family});
    vcsInbox['_links']['add-commit']['href']=webhook;
}

test("Login to VersionOne-SMA Instance", t=> {
    return glance.url("http://localhost/VersionOne/")
        .set("browser:size", "maximize")
        .cast({
            'username>input':'admin',
            'password>input':'admin'
        })
        .click('Login')
        .click('My Home')
        .click('Getting Started')
        // .get("page-title").then(function(title) {
        //     console.log('Title was: ' + title);
        //     t.is(title, "Let's Get Started", "This test was an utter failure.");
        //     return glance
        // })
        .click('ADMIN#1')
        .pause(1000)
        .click('DevOps')
        .pause(1000)
        .click('CommitStream')
        .pause(1000)
        .click('Disabled')
        .pause(2000)
        .click('GitHub')
        .set('inboxUrl>input', 'https://github.com/user/genericTest')
        .click("Add")
        .pause(1000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header);
            return glance
        })
        .get('genericTest>input').then(function(gitHubUrl) {
            console.log("GitHub URL is: ", gitHubUrl);
            gitHubUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + gitHubUrl);
            changeInboxWebhook('GitHub', gitHubUrl);
            return glance
        })
        .click('GitLab')
        .set('inboxUrl>input', 'https://gitlab.com/user/localFox')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
                console.log('Table header was: ', header);
                t.is(header, "Active Repositories", "What value did I get then?: " + header);
                return glance
            })
        .get('localFox>input').then(function(gitLabUrl) {
                console.log("GitLab URL is: ", gitLabUrl);
                gitLabUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + gitLabUrl);
                changeInboxWebhook('GitLab', gitLabUrl);
                return glance
            })
        .click('Bitbucket')
        .set('inboxUrl>input', 'https://bitbucket.org/user/blueTub')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
             console.log('Table header was: ', header);
             t.is(header, "Active Repositories", "What value did I get then?: " + header);
             return glance
             })
        .get('blueTub>input').then(function(bitBucketUrl) {
             console.log("Bitbucket URL is: ", bitBucketUrl);
             bitBucketUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + bitBucketUrl);
             changeInboxWebhook('Bitbucket', bitBucketUrl);
             return glance
             })
        .click('VSTS')
        .set('inboxUrl>input', 'https://microsoft.vsogit.com/user/microSoft')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header);
            return glance
            })
        .get('microSoft>input').then(function(vsoGitUrl) {
            console.log("VSTS URL is: ", vsoGitUrl);
            vsoGitUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + vsoGitUrl);
            changeInboxWebhook('VsoGit', vsoGitUrl);
            return glance
            })
        .click('Subversion')
        .set('inboxUrl>input', 'https://subversion.com/user/depotNum1')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header);
            return glance
        })
        .get('depotNum1>input').then(function(svnRepoUrl) {
            console.log("SVN URL is: ", svnRepoUrl);
            svnRepoUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + svnRepoUrl);
            changeInboxWebhook('SVN', svnRepoUrl);
            return glance
        })
        .click('GitSwarm')
        .set('inboxUrl>input', 'http://gitswarm.com/company/globalSwarm')
        .click('Add')
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header);
            return glance
        })
        .get('globalSwarm>input').then(function(gitSwarmUrl) {
            console.log("GitSwarm URL is: ", gitSwarmUrl);
            gitSwarmUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + gitSwarmUrl);
            changeInboxWebhook('GitSwarm', gitSwarmUrl);
            return glance
        })
         //clean up
        // .click('genericTest>iconRemove')
        // .click('modal>button^Remove')
        // .click('localFox>iconRemove')
        // .click('modal>button^Remove')
        // .click('blueTub>iconRemove')
        // .click('modal>button^Remove')
        // .click('microSoft>iconRemove')
        // .click('modal>button^Remove')
        // .click('depotNum1>iconRemove')
        // .click('modal>button^Remove')
        // .click('globalSwarm>iconRemove')
        // .click('modal>button^Remove')
        // .click('Enabled')
        // .click('Back to Main')
        // .click('My Home')
        // .click('Getting Started')
        // .get("page-title").then(function(title) {
        //     console.log('Title was: ' + title);
        //     t.is(title, "Let's Get Started", "This test was an utter failure.")
        // })
});

