function checkCommon {
    if [ -z "${INSTANCEID}" ]; then
        echo "You do not have an INSTANCEID variable set in your environment"
        exit 1
    else
        echo "INSTANCEID=${INSTANCEID}"
    fi

    if [ -z "${APIKEY}" ]; then
        echo "You do not have an APIKEY variable set in your environment"
        exit 1
    else
        echo "APIKEY=${APIKEY}"
    fi

    if [ -z "${PERFHOSTNAME}" ]; then
        hostname=${PERFHOSTNAME}
    else
        export PERFHOSTNAME="http://localhost:6565"
    fi

 #   export PERFHOSTNAME
    echo perfhost is=${PERFHOSTNAME}
}

function buildUrl {
#TODO remove the explicit cmd line argument and parse the the test name
#TODO For example post-github-commits if
    case $1 in
        "bitbucket")
            echo "Processing Bitbucket!"
            productID="${BITBUCKETID}"
            echo BitbucketInboxId "${BITBUCKETID}"
            export productID
         ;;
        "github")
            echo "Processing GH"
            productID="${GITHUBINBOXID}"
            echo Git inbox ID "${GITHUBINBOXID}"
            export productID
         ;;
        *)
            echo "Cant determine what test you are running exiting buildUrl()"

        ;;
    esac
    url=${PERFHOSTNAME}
    url+='/api/'
    url+=${INSTANCEID}
    url+='/inboxes/'
    url+=${productID}
    url+='/commits?apiKey='
    url+=${APIKEY}
    export url
    echo url= $url
}


