# How to use these scripts

## Setup
First of all, you will need to change the URLs in some of the scripts that need specific, locally-available instanceIds and inboxIds, apiKey, etc.

I find an easy way to do this is to run the `npm run ca` scripts, and then grab the instanceId, digestId, and apiKey. But you will also need an inbox url, so I tend to make a request for `api/{instanceId}/digests/{digestId}/inboxes?apiKey={apiKey}` and then pluck one out of
there. It might be better for us to just output the urls when `npm run ca` is running.

## Running

`runner.sh` lets you run concurrent shells for a target command script. Each of the command scripts takes the number of times to execute its logic.

For running a command with the wrapper `runner.sh`, you pass two parameters. The first one is a number for how many shells to run concurrently, and the second one is double-quoted for the actual script, like this:

`time ./runner.sh 20 "./post-bitbucket-pull-request.sh 150"`

That will create 20 bash processes and run curl 150 times each in each window, for a total of 3000 requests!
