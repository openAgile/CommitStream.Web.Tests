import Glance from "glance-webdriver";
import test from 'ava';
import chai from 'chai';
import selenium from '../dependencies/selenium';
import fs from 'fs';
import _ from 'lodash';
import BaseUI from '../dependencies/baseUI';
let base = new BaseUI();

chai.should();

var glance;
let teamOid = null;

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


let inboxesJSON = fs.readFileSync('../../config/inboxes.json', 'utf-8');
let inboxes = JSON.parse(inboxesJSON);

let changeInboxWebhook=(family, webhook) => {
    let vcsInbox = _.findLast(inboxes, {'family': family});
    vcsInbox['_links']['add-commit']['href']=webhook;
}


test.serial("Login to VersionOne-SMA Instance", async t=> {
    let url = await glance.url(base.instanceUrl)
        .set("browser:size", "maximize")
        .cast({
            'username>input': base.username,
            'password>input': base.password
        })
        .click('Login')
        .get("browser:url")
    url.should.include(base.instanceUrl + "Default.aspx");
});
test.serial("Set TeamRoom to have Custom CS inboxes", async t=> {
    teamOid = await glance.url(base.instanceUrl + "/Default.aspx?menu=TeamRoomsPage")
        .click('Fellowship of the Scrum')
        .get("browser:url").then(function(teamRoomUrl) {
            let pathArray = teamRoomUrl.split('/');
            return pathArray[pathArray.length - 1];
            //console.log("Team Oid is: ", teamOid);
        });
    teamOid.should.not.be.null;
});
test.serial("Can access TeamRoom settings", async t=> {
    let pageText = await glance.url(base.instanceUrl + "/Default.aspx?menu=TeamRoomsPage")
    .click('Fellowship of the Scrum')
    .get("browser:url").then(function(teamRoomUrl) {
        let pathArray = teamRoomUrl.split('/');
            teamOid = pathArray[pathArray.length-1];
            console.log("Team Oid is: ", teamOid);
        })
    .pause(1000)
    .click('CommitStream')
    .get("CommitStream Panel Options");
});
test.serial("Can add a Custom GitHub inbox", async t=> {
        await glance.click('Custom')
            .click('GitHub')
            .set('inboxUrl>input', 'https://github.com/shawnmarie/genericTest')
            .click("Add")
            .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('genericTest>input').then(function(gitHubUrl) {
            console.log("GitHub URL is: ", gitHubUrl);
            gitHubUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + gitHubUrl);
            changeInboxWebhook('GitHub', gitHubUrl);
            return glance
        })
});
test.serial("Can add a custom GitLab inbox", async t=> {
        await glance.click('GitLab')
        .set('inboxUrl>input', 'https://gitlab.com/user/localFox')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function (header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('localFox>input').then(function (gitLabUrl) {
            console.log("GitLab URL is: ", gitLabUrl);
            gitLabUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + gitLabUrl);
            changeInboxWebhook('GitLab', gitLabUrl);
            return glance
        })
});
test.serial("Can add a custom Bitbucket inbox", async t=> {
        await glance.click('Bitbucket')
        .set('inboxUrl>input', 'https://bitbucket.org/user/blueTub')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('blueTub>input').then(function(bitBucketUrl) {
            console.log("Bitbucket URL is: ", bitBucketUrl);
            bitBucketUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + bitBucketUrl);
            changeInboxWebhook('Bitbucket', bitBucketUrl);
            return glance
        })
});
test.serial("Can add a custom VSTS inbox", async t=> {
        await glance.click('VSTS')
        .set('inboxUrl>input', 'https://microsoft.vsogit.com/user/microSoft')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('microSoft>input').then(function(vsoGitUrl) {
            console.log("VSTS URL is: ", vsoGitUrl);
            vsoGitUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + vsoGitUrl);
            changeInboxWebhook('VsoGit', vsoGitUrl);
            return glance
        })
});
test.serial("Can add a custom Subversion inbox", async t=> {
        await glance.click('Subversion')
        .set('inboxUrl>input', 'https://subversion.com/user/depotNum1')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('depotNum1>input').then(function(svnRepoUrl) {
            console.log("SVN URL is: ", svnRepoUrl);
            svnRepoUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + svnRepoUrl);
            changeInboxWebhook('SVN', svnRepoUrl);
            return glance
        })
});
test.serial("Can add a custom GitSwarm inbox", async t=> {
        await glance.click('GitSwarm')
        .set('inboxUrl>input', 'https://gitswarm.com/user/gitSwarmCustom')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('gitSwarmCustom>input').then(function(gitSwarmUrl) {
            console.log("GitSwarm URL is: ", gitSwarmUrl);
            gitSwarmUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + gitSwarmUrl);
            changeInboxWebhook('GitSwarm', gitSwarmUrl);
            return glance
        })
});
test.serial("Can add a custom Perforce P4V inbox", async t=> {
        await glance.click('Perforce P4V')
        .set('inboxUrl>input', 'https://perforce.com:2225/user/p4VCustom')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('p4VCustom>input').then(function(p4vUrl) {
            console.log("P4V URL is: ", p4vUrl);
            p4vUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + p4vUrl);
            changeInboxWebhook('P4V', p4vUrl);
            return glance
        })
});
test.serial("Can add a custom Deveo inbox", async t=> {
        await glance.click('Deveo')
        .set('inboxUrl>input', 'https://app.deveo.com/versionone1/projects/smatester/repositories/smaGitCustom')
        .click("Add")
        .pause(2000)
        .get('h1#2').then(function(header) {
            console.log('Table header was: ', header);
            t.is(header, "Active Repositories", "What value did I get then?: " + header)
            return glance
        })
        .get('smaGitCustom>input').then(function(deveoUrl) {
            console.log("Deveo URL is: ", deveoUrl);
            deveoUrl.should.include('https://v1-cs-test.azurewebsites.net/api/', "This should be an inbox URL: " + deveoUrl);
            changeInboxWebhook('Deveo', deveoUrl);
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
        // .click('Enabled')
        // //.click('Back to Main')
        // .click('utility-bar>Main')
        // .click('My Home')
        // .click('Getting Started')
        // .get("page-title").then(function(title) {
        //      console.log('Title was: ' + title);
        //      t.is(title, "Let's Get Started", "This test was an utter failure.")
        // })
});

