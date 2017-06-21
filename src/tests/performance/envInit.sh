#!/usr/bin/bash

source ./urlBuilders.sh
source ./cmdLineTools.sh

function initx {

    export PDATAPATH="../../../config/performanceData.txt"
    cp  $PDATAPATH .
    . ./performanceData.txt
    env | grep  ID
    #TODO create unsetPerformanceData.txt
}

function clean
{
    echo "Deleting $PDATAPATH"
    rm ./performanceData.txt
    unset PRODUCTID
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
        break
    else
        echo "Successful capture of INSTANCEID=${INSTANCEID}"
    fi
    if [ -z "${DIGESTID}" ]; then
        echo "You do not have a DIGESTID variable set in your environment"
        break
    else
        echo "Successful capture of INSTANCEID=${DIGESTID}"
    fi

    if [ -z "${APIKEY}" ]; then
        echo "You do not have an APIKEY variable set in your environment"
        break
    else
        echo "Successful capture of APIKEY=${APIKEY}"
    fi
    if [ -z "${BITBUCKETID}" ]; then
        echo "You do not have an BITBUCKETID variable set in your environment"
        break
    else
        echo "Successful capture of BITBUCKETID=${BITBUCKETID}"
    fi
    if [ -z "${GITHUBINBOXID}" ]; then
        echo "You do not have an GITHUBINBOXID variable set in your environment"
        break
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
        "bitbucket")
            echo "Processing Bitbucket!"
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
        "queryNonExistentInstance")
             echo "Processing query-non-existent-instance!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryInstance non`
        ;;
        "queryRealInstance")
             echo "Processing query-real-instance!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryInstance`
         ;;
         "queryVersion")
             echo "Processing query-v1!"
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


