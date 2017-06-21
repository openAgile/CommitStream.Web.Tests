#!/usr/bin/bash

#Prep Section
source ./envInit.sh
initx
checkCommon
switchUrl v1-cs-test

#Runner Section
buildUrl bitbucket
./runner.sh 1 "./post-bitbucket-pull-request.sh 1"

buildUrl github
./runner.sh 1 "./post-github-commits.sh 1"

buildUrl postNewDigest
./runner.sh 1 "./post-new-digest.sh 1"

buildUrl queryEsNonExistentInstance
./runner.sh 1 "./query-es-non-existent.sh 1"

buildUrl queryEsRealInstance
./runner.sh 1 "./query-es-real-instance.sh 1"

buildUrl queryNonExistentInstance
./runner.sh 1 "./query-non-existent-instance.sh 1"

buildUrl queryRealInstance
./runner.sh 1 "./query-real-instance.sh 1"

buildUrl queryVersion
./runner.sh 1 "./query-version.sh 1"