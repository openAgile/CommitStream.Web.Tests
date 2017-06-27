for i in `seq 1 $1`;
do

time curl -i -X GET  "$2"
#'http://localhost:2113/projection/instance/state?partition=instance-NOTHINGISHERE'

done