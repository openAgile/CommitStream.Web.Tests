for i in `seq 1 $1`;
do

time curl -i -X GET "$2"
#'http://localhost:6565/api/instances/04687d4f-8bdc-45c0-8df7-95b6646cc621?apiKey=9a4c25d1-e614-43a8-8a0c-ee8b2cb75435'

done