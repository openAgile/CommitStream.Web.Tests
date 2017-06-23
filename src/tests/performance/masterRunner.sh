#!/usr/bin/bash

#Prep Section
source ./envInit.sh
initx
checkCommon
switchUrl v1-cs-test

#Runner Section
buildUrl bitbucket
./runner2.sh 1 "./post-bitbucket-pull-request.sh 1"
echo "**************************************************************"

buildUrl github
./runner2.sh 1 "./post-github-commits.sh 1"
echo "**************************************************************"

buildUrl postNewDigest
./runner2.sh 1 "./post-new-digest.sh 1"
echo "**************************************************************"

buildUrl queryEsNonExistentInstance
./runner2.sh 1 "./query-es-non-existent-instance.sh 1"
echo "**************************************************************"

buildUrl queryEsRealInstance
./runner2.sh 1 "./query-es-real-instance.sh 1"
echo "**************************************************************"
#wip
#buildUrl queryNonExistentInstance
#./runner2.sh 1 "./query-non-existent-instance.sh 1"
#echo "**************************************************************"

buildUrl queryRealInstance
#BROKEN ./runner2.sh 1 "./query-real-instance.sh 1"
echo "**************************************************************"

buildUrl queryVersion
./runner2.sh 1 "./query-version.sh 1"