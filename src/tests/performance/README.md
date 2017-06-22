# How to use these scripts

## Setup
First of all, you will need to change the URLs in some of the scripts that need specific, locally-available instanceIds and inboxIds, apiKey, etc.

I find an easy way to do this is to run the `npm run ca` scripts, and then grab the instanceId, digestId, and apiKey. But you will also need an inbox url, so I tend to make a request for `api/{instanceId}/digests/{digestId}/inboxes?apiKey={apiKey}` and then pluck one out of
there. It might be better for us to just output the urls when `npm run ca` is running.

## Running

`runner.sh` lets you run concurrent shells for a target command script. Each of the command scripts takes the number of times to execute its logic.

For running a command with the wrapper `runner.sh`, you pass two parameters. The first one is a number for how many shells to run concurrently, and the second one is double-quoted for the actual script, like this:

`time ./runner.sh 20 "./post-bitbucket-pull-request.sh 150"`

That will create 20 bash processes and run curl 150 times each in each window, for a total of 3000 requests!



##Addendum
Introduction to pScripts

Overall scheme

PScripts is a set of Bash shell scripts written to test various performance aspects of Commitstream.  It contains a set
of scripts that test things like the creation of new digests or the testing of how the system reacts to undefined
parameters.  The scripts work together to create an execution environment that dynamically creates the proper urls needed
to execute a particular test.  The tests can create extra processes and generate a flood of requests whereby simulating
multiple computers sending and attempting to execute and test Commitstream functionality.

When running the Commitstream tests (ie. npm run ca) a file performanceData.txt is generated in the folder
CommitStream.Web.Tests/config.  This file contains a list of the VCSs that Commitstream supports.  Each VCS is prepended
with the linux command "export" and appended with " '=SOME_IDENTIFIER' "

For example,

export APIKEY=24494d0e-c4df-4fd5-bac1-a234c5c58224
export INSTANCEID=ac977fd2-6515-4dd3-a6ee-020c79c881d8
export DIGESTID=f6bb4a01-fd01-43a8-b34d-3817868f120e
.
.

This file is executed such that it becomes a part of the environment so that the need for hardcoding urls and values is
reduced to the trivial case.


pScripts can be used in a batch fashion or cmdline.

1) Batch - Examine the masterRunner.sh file.  You will see two sections Prep and Runner.  Modify to fit your flavor.  As the
batch script executes, it will create an environment, do all of the processing and running of the scripts then terminate.
All you need to do is enter the following

./masterRunner.sh

If you would like to see more detail during your execution, to be precise, the what is going on with the shell that is
executing your script ,then

bash -x ./masterRunner.sh

This execution is somewhat a closure in the sense that scope is the shell context where the script executes. Once this
masterRunner.sh terminates, the environment variables will fall out of scope and disapper leaving your command
environment non polluted.

2) CmdLine - This is a more manual testing technique.  The use case when using this methodology is when you need to look
up close and personal at the execution and results of an individual test.

Here is a typical series of commands needed to run a single test manually.

source ./envInit.sh
initx
checkCommon

buildUrl bitbucket
./runner.sh 1 "./post-bitbucket-pull-request.sh 1"

I will explain the role and goal of each line

1) source ./envInit.sh - This takes the contents of the script and loads it into your local environment.  This module
  envInit.sh contains the following functions
  a) initx - This
  b) clean
  c) checkCommon
  d) buildUrl

2) initx - This function's role is to
  a) Copy the performanceData.txt to the working folder
  b) Initialize the environment with the environment variables needed to run tests against VCS and CS instances in general.

3) checkCommon - This confirms the existence of INSTANCEID, APIKEY AND CS_ROOT_URL

4) buildUrl bitbucket - This builds a url when the Bitbucket.  This url gets pulled into each test that gets executed.
  In some cases we will have tests that are not vendor VCS specific but test instances.  These get built here as well.

Helper Tools

These are additional tools to help maintain the pscript environment
 1) pserver - This gets your instance id
    usage: pserver

 2) pdelete - This removes an environment
    usage: pdelete <environment variable>

 3) pshow - This shows all of the Commitstream related environment variables
    usage: pshow

 4) pSwitchRoot - This changes the CS_ROOT_URL to point to the appropriate url
    usage pSwitchRoot <test | staging | local>
    The argments represent https://v1-cs-test.azurewebsites.net, https://commitstream-staging.azurewebsites.net and http://localhost:6565
    respectively.

How to run specific tests

Usually when running a test such as

./runner.sh 1 "./post-bitbucket-pull-request.sh 1"

This contains a sufficient number of arguments in order to run the test.  This is not the case for some tests.  For
example, the test query-es-non-existent-instance.sh

In a nutshell, this test works not against Commitstream but against Eventstore, the backing store for Commitstream.
It simply checks for non existing instance by querying for a non-existing partition.

 The function that handles this is called queryInstance().  This function is also overloaded to handle the
 query-es-real-instance.sh by adding an argument like this

 ./runner.sh 1 "./query-es-real-instance.sh 1" real

 This will build the url accordingly.

WIP
 There is another case where the same princple of explicitly overloading the function but there is another trick that
 required to use the same function.  The script query-real-instance-v1-cs-test.sh requires that we use the same
 queryInstance() but we also have to confirm that the URL is changed to point to v1-cs-test.  This script will not run
 unless the user runs with yet another argument to allow to switch of the CS_ROOT_URL to point to v1-cs-test.

 ./runner.sh 1 "./query-real-instance-v1-cs-test.sh 1" real "pSwitchRoot v1-cs-test"




Q&A

1) Q: How do I run post-bitbucket-pull-request-v1-cs-test.sh?
   A: This is a test that specifically uses the v1-cs-test Commitstream instance as the target instance.
      This is the default instance value for the CS_ROOT_URL environment variable. So technically you get
      the same results when you run post-bitbucket-pull-request.  The output range of these scripts
      are a function (no pun intended)
      of the CS_ROOT_URL.

2) Q: How do I run post-github-pull-request-v1-cs-test.sh?
   A: This is is the same situation as 1).  In fact the same goes for any other test that contains
   v1.cs-test in its name with exception of tests that have real instances and fake instance.
   ( the name of script contains the text "real" and "non-existence respectively")  There is a twist to tests that have "non-existent" in their name. In order

3) Q: How do I handle scripts with "non-existence" in their name?
   A: Lets use the query-non-existent-instance-v1cs-test.sh. The solution can be described as having two parts
      (a) The words non-existence - This indicates that the test has the form
         ${CS_ROOT_URL}/api/instances/NOTHINGHERE?apiKey=blah'
          or
          ${CS_ROOT_URL}/projection/instance/state?partition=instance-NOTHINGISHERE

      (b) The words v1-cs-test - refers to the value of ${CS_ROOT_URL}, the test instance.  This

    so in order to set this up, your Master runner needs the following lines
    
