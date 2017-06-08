for i in `seq 1 $1`;
do

time curl -i -X GET  $2
#'http://localhost:2113/projection/instance/state?partition=instance-04687d4f-8bdc-45c0-8df7-95b6646cc621'

done



