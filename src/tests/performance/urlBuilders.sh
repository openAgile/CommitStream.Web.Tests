#!/usr/bin/bash
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

function queryInstance
{
    local url=${CS_ROOT_URL}
    url+='/projection/instance/state?partition=instance-'

    if [ $1 == "real"  ]; then
        url+=${INSTANCEID}
    else
        url+='-NOTHINGISHERE'
    fi
    echo "$url"
}

function queryInstances
{
#'http://localhost:6565/api/instances/NOTHINGHERE?apiKey=blah'
    local url=${CS_ROOT_URL}
    url+='/api/instances/'
    local tempAPIKey ='fakeApiKey'
    if [ $1 == "real"  ]; then
        url+=${INSTANCEID}
        tempAPI = ${APIKEY}
    else
        url+='-NOTHINGISHERE'
    fi
    url+=$tempAPIKey

    echo "$url"
}

