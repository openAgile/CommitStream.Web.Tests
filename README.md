# CommitStream.Web.Tests

###Summary
This repository contains a set of tests and tools related to CommitStream.Web. 

###Requirements
node.js 4.x.x

###Setup
Run the next commands in order and then you are ready to run the tests
```
npm install -g grunt-cli

npm install

grunt babel
```

The last command will convert the ES6 scripts inside of the \src folder into runnable ES5 scripts using the \lib folder as the output.
After making changes in any of the scripts inside of \src you will need to run
```
grunt babel
```
to transpile into ES6 once more.

An alternative is to run
```
grunt watch 
```
while working on the scripts so the files are transpiled as soon as you save changes.

###Tests currently available###
- **create-demo-data.js**: Provides the ability to create data in CommitStream
- **create-new-instance-with-digest.js**: Self descriptive.
- **happy-path-end-to-end.tests.js**: Self descriptive.
- **instance-support.tests.js**:
- **smoke.tests.js**

---
###Usage###

####create-demo-data.js:####
```
node create-demo-data.js --help
``` 

This script allows to quickly create commits in CommitStream with some variations. It has 2 main commands ***fake*** and ***sample***. Each command run with default options values that can be overwritten. In order to see those options run:

```
node create-demo-data.js fake --help
```
   
**or**

```
node create-demo-data.js sample --help
```

Fake allows you to rapidly create as many commits as needed but not necessarily related to assets present in VersionOne. It will also create instances, digests and inboxes.
The mentions that will be made can be configured in the file:

```
/config/fakeWorkItemsToMention.json
```


Sample on the other hand is not that flexible when it comes to deciding how many commits to create but it does allow to create them mentioning existing assets in a given VersionOne instance.

The assets to mention can be set in the file:
```
/config/sampleWorkItemsToMention.json
```
Since this script will only create commits you need to specify at least an already existing inbox in the next file:
```
/config/inboxes.json
```



