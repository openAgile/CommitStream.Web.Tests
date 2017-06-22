for i in `seq 1 $1`;
do

time curl -i -X GET  'https://commitstream-staging.azurewebsites.net/api/instances/NOTHINGHERE?apiKey=blah'

done