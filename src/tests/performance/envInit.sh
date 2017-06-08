#!/usr/bin/bash


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


function checkCommon {
    if [ -z "${INSTANCEID}" ]; then
        echo "You do not have an INSTANCEID variable set in your environment"
        exit 1
    else
        echo "Successful capture of INSTANCEID=${INSTANCEID}"
    fi

    if [ -z "${APIKEY}" ]; then
        echo "You do not have an APIKEY variable set in your environment"
        exit 1
    else
        echo "Successful capture of APIKEY=${APIKEY}"
    fi

    if [  -z "${CS_ROOT_URL}" ]
    then
       echo "Assuming since you dont have CS_ROOT_URL, this is hosted."
       #KILLTHIS.  this is just forcing an instance locally for testing
       export CS_ROOT_URL="http://localhost:6565"
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
         "newDigest")
             echo "Processing newDigest!"
             #Has no function purpose Just because I dont want it to be null
             PRODUCTID="General"
             export PRODUCTID
             url=`newDigestUrl`
         ;;
         "queryNonExist")
             echo "Processing query-non-existent-instance!"
             PRODUCTID="General"
             export PRODUCTID
             url=`queryNonExist`
        ;;
        *)
            echo "Cant determine what test you are specifying to run, exiting buildUrl()"
            return 1
        ;;
    esac


#    url=${CS_ROOT_URL}
#    url+='/api/'
#    url+=${INSTANCEID}
#    url+='/inboxes/'
#    url+=${PRODUCTID}
#    url+='/commits?apiKey='
#    url+=${APIKEY}
#     url=`basicUrlFunc`
    export url
    echo "Successfully buildUrl=${url}"
    echo $url
    return 0
}

function basicUrl
{
    local url=${CS_ROOT_URL}
    url+='/api/'
    url+=${INSTANCEID}
    url+='/inboxes/'
    url+=${PRODUCTID}
    url+='/commits?apiKey='
    url+=${APIKEY}
    echo "$url"
}

function newDigestUrl
{
    local url=${CS_ROOT_URL}
    url+='/api/'
    url+=${INSTANCEID}
    url+='/digests'
    url+='?apiKey='
    url+=${APIKEY}
    echo "$url"
}

function queryNonExist
{
    local url=${CS_ROOT_URL}
    url+='/projection/instance/state?partition=instance-NOTHINGISHERE'
    echo "$url"
}

function queryNonExist
{
    local url=${CS_ROOT_URL}
    url+='/projection/instance/state?partition=instance-NOTHINGISHERE'
    echo "$url"
}
