# pScripts Automated Test Tool

## Overall scheme

PScripts is a set of Bash shell scripts written to test various performance aspects of Commitstream.  It contains a set
of scripts that test things like the creation of new digests or the testing of how the system reacts to undefined
parameters.  The scripts work together to create an execution environment that dynamically creates the proper urls needed
to execute a particular test.  The tests can create extra processes and generate a flood of requests whereby simulating
multiple computers sending and attempting to execute and test Commitstream functionality.

When running the Commitstream tests via the `npm run ca` command a file named `performanceData.txt` is generated in the folder
`CommitStream.Web.Tests/config`.  This file contains a list of the VCSs that Commitstream supports.  Each VCS is prepended
with the bash command `export` and appended with `" '=SOME_IDENTIFIER' "`

For example:

```export APIKEY=24494d0e-c4df-4fd5-bac1-a234c5c58224
export INSTANCEID=ac977fd2-6515-4dd3-a6ee-020c79c881d8
export DIGESTID=f6bb4a01-fd01-43a8-b34d-3817868f120e
...
```

This file is executed such that it becomes a part of the environment so that the need for hardcoding urls and values is
reduced to the trivial case.

## Usage optoins

pScripts can be used in a batch fashion or with command line helper functions. Here is a list of all tests that can be run:

1) post-invalid-bitbucket-pull-request.sh
2) post-github-commits.sh
3) post new-digest.sh
4) query-new-non-existent-instance.sh
5) query-es-real-instance.sh
6) query-real-instance.sh
7) query-version.sh

### Batch approach

Examine the `masterRunner.sh` file.  You will see two sections **Prep** and **Runner**.  Modify to fit your flavor.  As the
batch script executes, it will create an environment, do all of the processing and running of the scripts then terminate.
All you need to do is enter the following:

`./masterRunner.sh`

If you would like to see more detail during your execution, to see precisely what is going on with the shell that is
executing your script, then do it like this:

`bash -x ./masterRunner.sh`

This execution is somewhat a closure in the sense that scope is the shell context where the script executes. Once this
`masterRunner.sh` terminates, the environment variables will fall out of scope and disappear leaving your command
environment non-polluted.

**Note:** While executing `masterRunner.sh`, if you do not have all of the proper environment variables set, the script will
terminate after encountering the variable.

### Command Line approach

This is a more manual testing technique.  The use case when using this methodology is when you need to look up close and personal at the execution and results of an individual test.

Here is a typical series of commands needed to run a single test manually:

```
source ./envInit.sh
initx
checkCommon

buildUrl bitbucket
./runner.sh 1 "./post-bitbucket-pull-request.sh 1"
```

Here's an in-depth breakdown of each line from above:

#### `source ./envInit.sh`

This takes the contents of the script and loads it into your local environment.  This `envInit.sh` module contains the following functions:

* initx
* clean
* checkCommon
* buildUrl

#### `initx`

This function's role is to:

* Copy the performanceData.txt to the working folder
* Initialize the environment with the environment variables needed to run tests against VCS and CS instances in general.

#### `checkCommon`

This confirms the existence of `INSTANCEID`, `APIKEY` AND `CS_ROOT_URL`

#### `buildUrl bitbucket`

This builds a url when using Bitbucket.  This url gets pulled into each test that gets executed. In some cases we will have tests that are not vendor VCS specific but test instances.  These get built here as well.

### Helper Tools

These are additional tools to help maintain the pscript environment

#### pserver

This gets your instance id
##### Usage

`pserver`

#### pdelete

This removes an environment

##### Usage

`pdelete <environment variable>`

#### pshow

This shows all of the CommitStream related environment variables

##### Usage
`pshow`

#### switchUrl

This changes the `CS_ROOT_URL` to point to the appropriate url

##### Usage

`usage pSwitchRoot <v1-cs-test | localhost>`
    
The argments represent https://v1-cs-test.azurewebsites.net, https://commitstream-staging.azurewebsites.net and http://localhost:6565
    respectively.

#### pclean

This removes all of the environment variables

##### Usage

`pclean`


### How to run individual tests

The pattern is:

```
<build a a test url>
<run a test>
```

For example:

```
buildUrl bitbucket
./runner.sh 1 "./post-bitbucket-pull-request.sh 1"
```

This will build the url accordingly and run the test.
