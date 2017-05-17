for i in `seq 1 $1`;
do

time curl -i -X GET  'https://v1-cs-test.azurewebsites.net/api/public'

done