for i in `seq 1 $1`;
do
curl -i -X GET  'http://localhost:6565/api/instances/NOTHINGHERE?apiKey=blah'
done