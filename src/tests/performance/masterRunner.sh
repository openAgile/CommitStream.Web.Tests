#!/usr/bin/bash


#Prep Section

isANumber='^[0-9]+$'

if [ "$#" -ne 2 ]
then
    echo "Since there are less than 2 args, we are going to run with both process and iterations set to 1"
    PROCESS_COUNTER=1
    ITERATION_COUNTER=1
else
    if [[ $1 =~ $isANumber ]]
    then
        echo "FIRST ARG IS A NUMBER "
        if [[ $2 =~ $isANumber ]]
        then
            PROCESS_COUNTER=$1
            ITERATION_COUNTER=$2
        else
            echo "Your second arg should be a number"
            exit 1
        fi
    else
        echo "Both arguments should be numeric. One or both may be non-numberic "
        echo "Usage: ./masterRunner.sh <blank blank | number number>"
        exit 1
    fi
    echo "You have entered non-numeric values for arguments "

fi


source ./envInit.sh
initx
checkCommon
switchUrl v1-cs-test

#Runner Section
buildUrl invalidbitbucket
./runner2.sh ${PROCESS_COUNTER} "./post-invalid-bitbucket-pull-request.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

buildUrl github
./runner2.sh ${PROCESS_COUNTER} "./post-github-commits.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

buildUrl postNewDigest
./runner2.sh ${PROCESS_COUNTER} "./post-new-digest.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

# buildUrl queryEsNonExistentInstance
# ./runner2.sh ${PROCESS_COUNTER} "./query-es-non-existent-instance.sh ${ITERATION_COUNTER}"
# echo "**************************************************************"

# buildUrl queryEsRealInstance
# ./runner2.sh ${PROCESS_COUNTER} "./query-es-real-instance.sh ${ITERATION_COUNTER}"
# echo "**************************************************************"

buildUrl queryRealInstance
 ./runner2.sh ${PROCESS_COUNTER} "./query-real-instance.sh ${ITERATION_COUNTER}"
echo "**************************************************************"

buildUrl queryVersion
./runner2.sh ${PROCESS_COUNTER} "./query-version.sh ${ITERATION_COUNTER}"