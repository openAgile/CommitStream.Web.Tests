#!/usr/bin/bash

#usage: ./runner <performance-script-name> <Number of concurrent spawns>

source envInit.sh


for ((c=1; c<=$1; c++))
do
#Call the current performance script with the url as the argument
output=`$2 $url &`&&(echo -e "-----\n";echo $output)

echo "************* ================== >>>>>>>>>> HERE IS MY SEQUENCE NUMBER: $c"
done