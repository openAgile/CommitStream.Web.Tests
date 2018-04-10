#!/usr/bin/bash

source ./urlBuilders.sh
source ./cmdLineTools.sh

function fPostNewDigest
{
    for i in `seq 1 $1`;
    do

        curl -i -X POST \
       -H "Content-Type:application/json" \
       -d \
    '{
      "description": "Digest!"
    }' "$2"
    printf  "\n************* ================== >>>>>>>>>>ITERATION=%s\n" "$i"
    done
}


function initx {

    export PDATAPATH="../../../config/performanceData.txt"
    cp  $PDATAPATH .
    . ./performanceData.txt
    env | grep  ID
    #TODO create unsetPerformanceData.txt
}

function clean
{
    echo "Deleting performanceData.txt file.  You will have to run initx again in order to get a copy of it"
    rm ./performanceData.txt
    unset PRODUCTID
    unset CS_ROOT
    source unsetPerformanceData.txt
}

function switchUrl
{
    case $1 in
        "localhost")
            echo "Switching url to localhost:6565!"
            export CS_ROOT_URL="http://localhost:6565"
            set CS_ROOT_UL
         ;;
        "v1-cs-test")
            echo "Switching url to test instance https://v1-cs-test.azurewebsites.net !"
            export CS_ROOT_URL="https://v1-cs-test.azurewebsites.net"
         ;;
        "staging")
            echo "Switching url to staging instance https://v1-cs-test.azurewebsites.net !"
            export CS_ROOT_URL="https://v1-cs-test.azurewebsites.net"
         ;;
         *)
            echo "Cant determine what host you are trying to switch to"
            return 1
         ;;
    esac
}

function checkCommon {
    if [ -z "${INSTANCEID}" ]; then
        echo "You do not have an INSTANCEID variable set in your environment"
        exit 1
    else
        echo "Successful capture of INSTANCEID=${INSTANCEID}"
    fi
    if [ -z "${DIGESTID}" ]; then
        echo "You do not have a DIGESTID variable set in your environment"
        exit 1
    else
        echo "Successful capture of DIGESTID=${DIGESTID}"
    fi

    if [ -z "${APIKEY}" ]; then
        echo "You do not have an APIKEY variable set in your environment"
        exit 1
    else
        echo "Successful capture of APIKEY=${APIKEY}"
    fi
    if [ -z "${BITBUCKETID}" ]; then
        echo "You do not have an BITBUCKETID variable set in your environment"
        exit 1
    else
        echo "Successful capture of BITBUCKETID=${BITBUCKETID}"
    fi
    if [ -z "${GITHUBINBOXID}" ]; then
        echo "You do not have an GITHUBINBOXID variable set in your environment"
        exit 1
    else
        echo "Successful capture of GITHUBINBOXID=${GITHUBINBOXID}"
    fi

    if [  -z "${CS_ROOT_URL}" ]
    then
       echo "Assuming since you dont have CS_ROOT_URL, this is cs-test instance."
       echo "CS_ROOT_URL pointing to https://v1-cs-test.azurewebsites.net/version."
       export CS_ROOT_URL="https://v1-cs-test.azurewebsites.net/version"
    else
       echo "Looks like you have CS_ROOT"
    fi


}

function buildUrl {
#TODO remove the explicit cmd line argument and parse the the test name
#TODO For example post-github-commits if
    echo "In build url scm=$1"
    case $1 in
        "invalidbitbucket")
            echo "Processing Invalid Bitbucket Pull Request!"
            PRODUCTID="${BITBUCKETID}"
            echo BitbucketInboxId is "${BITBUCKETID}"
            export PRODUCTID
            url=`basicUrl`
         ;;
        "github")
            echo "Processing Github!"
            PRODUCTID="${GITHUBINBOXID}"
            echo GitInox is "${GITHUBINBOXID}"
            export PRODUCTID
            url=`basicUrl`
         ;;
         "postNewDigest")
             echo "Processing Post New Digest!"
             #Has no function purpose Just because I dont want it to be null
             PRODUCTID="General"
             export PRODUCTID
             url=`newDigestUrl`
         ;;
         "queryEsNonExistentInstance")
             echo "Processing query-es-non-existent-instance!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryInstanceEs non`
        ;;
        "queryEsRealInstance")
             echo "Processing query-es-real-instance!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryInstanceEs`
        ;;
        "queryRealInstance")
             echo "Processing query-real-instance!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryInstance`
         ;;
         "queryVersion")
             echo "Processing query-version!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryVersion`
        ;;
        *)
            echo "Cant determine what test you are specifying to run, exiting buildUrl()"
            return 1
        ;;
    esac

    export url
    echo "Successfully buildUrl=${url}"
    return 0
}


