#!/usr/bin/bash

#Prep Section
source ./envInit.sh
initx
checkCommon

#Runner Section
buildUrl bitbucket
./runner.sh 1 "./post-bitbucket-pull-request.sh 1"

buildUrl github
./runner.sh 1 "./post-github-commits.sh 1"


