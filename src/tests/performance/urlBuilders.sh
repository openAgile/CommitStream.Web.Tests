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

function queryInstanceEs
{
# non http://localhost:2113/projection/instance/state?partition=instance-NOTHINGISHERE
# real http://localhost:2113/projection/instance/state?partition=instance-04687d4f-8bdc-45c0-8df7-95b6646cc621'
    local url=${CS_ROOT_URL}
    url+='/projection/instance/state?partition=instance-'

    if [ $1 == "non"  ]; then
       url+='-NOTHINGISHERE'
    else
       url+=${INSTANCEID}
    fi
    echo "$url"
}

function queryInstance
{
# non 'http://localhost:6565/api/instances/NOTHINGHERE?apiKey=blah'
# real http://localhost:6565/api/instances/04687d4f-8bdc-45c0-8df7-95b6646cc621?apiKey=9a4c25d1-e614-43a8-8a0c-ee8b2cb75435'

    local url=${CS_ROOT_URL}
    url+='/api/instances/'
    local tempAPIKey ='fakeApiKey'

    if [ $1 == "non"  ]; then
        url+='-NOTHINGISHERE'
    else
        url+=${INSTANCEID}
        tempAPIKey = ${APIKEY}
    fi
    url+=$tempAPIKey

    echo "$url"
}

function queryV1
{
#'https://v1-cs-test.azurewebsites.net/api/public'
    local url=${CS_ROOT_URL}
    url+='/api/public'
    echo "$url"
}

