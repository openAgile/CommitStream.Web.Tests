#!/usr/bin/bash


#Prep Section


if [ "$#" -ne 2 ]
then
    echo "Since there are less than 2 args, we are going to run with both process and iterations set to 1"
    PROCESS_COUNTER=1
    ITERATION_COUNTER=1

else
    PROCESS_COUNTER=$1
    ITERATION_COUNTER=$2
fi


source ./envInit.sh
initx
checkCommon
switchUrl v1-cs-test

#Runner Section
buildUrl bitbucket
./runner2.sh ${PROCESS_COUNTER} "./post-bitbucket-pull-request.sh ${ITERATION_COUNTER}"
echo "**************************************************************"
exit 1
buildUrl github
./runner2.sh ${PROCESS_COUNTER} "./post-github-commits.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

buildUrl postNewDigest
./runner2.sh ${PROCESS_COUNTER} "./post-new-digest.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

buildUrl queryEsNonExistentInstance
./runner2.sh ${PROCESS_COUNTER} "./query-es-non-existent-instance.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

buildUrl queryEsRealInstance
./runner2.sh ${PROCESS_COUNTER} "./query-es-real-instance.sh ${ITERATION_COUNTER}"
echo "**************************************************************"
#wip
#buildUrl queryNonExistentInstance
#./runner2.sh 1 "./query-non-existent-instance.sh 1"
#echo "**************************************************************"

buildUrl queryRealInstance
#BROKEN ./runner2.sh 1 "./query-real-instance.sh 1"
echo "**************************************************************"

buildUrl queryVersion
./runner2.sh ${PROCESS_COUNTER} "./query-version.sh ${ITERATION_COUNTER}"