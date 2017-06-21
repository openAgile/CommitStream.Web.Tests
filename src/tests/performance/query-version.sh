for i in `seq 1 $1`;
do

time curl -i -X GET "$2"
#'https://v1-cs-test.azurewebsites.net/api/public'

done