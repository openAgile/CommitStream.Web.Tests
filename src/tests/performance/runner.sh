#!/usr/bin/bash

#usage: ./runner <performance-script-name> <Number of concurrent spawns>

source envInit.sh


for i in `seq 1 $1`;
do
#Call the current performance script with the url as the argument
`$2 $url`&
echo "************* ================== >>>>>>>>>> HERE IS MY SEQUENCE NUMBER: $i"
done

wait;