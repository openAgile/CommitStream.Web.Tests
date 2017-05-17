for i in `seq 1 $1`;
do

time curl -i -X GET  'https://v1-cs-test.azurewebsites.net/api/instances/f2305882-d72b-4801-8a0d-6433ca97c3cd?apiKey=d9454fa7-5fc0-48b1-bbc1-70a27876a0ed'

done