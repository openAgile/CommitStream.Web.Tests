#!/usr/bin/bash -x

#usage: ./runner <performance-script-name> <Number of concurrent spawns>

source envInit.sh

#checkCommon
#We need to know what kind of URL to build
#buildUrl $3

for i in `seq 1 $1`;
do
#Call the current performance script with the url as the argument
`$2 $url`&
echo "************* ================== >>>>>>>>>> HERE IS MY SEQUENCE NUMBER: $i"
done

wait;