#!/usr/bin/bash
for i in `seq 1 $1`;
do

    curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "description": "Digest!" 
}' "$2"
done
# http://localhost:6565/api/888827a2-06ef-4f18-b53f-885d1fc5394c/digests?apiKey=0e8b1681-5e3a-423a-a481-dacf31fe3191'


