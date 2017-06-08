for i in `seq 1 $1`;
do

time curl -i -X POST \
   -H "Content-Type:application/json" \
   -H "x-github-event:push" \
   -d \
'{
             "ref": "refs/heads/master",
             "commits": [{
                 "id": "1234567",
                 "distinct": true,
                 "message": "S-04026 Testing Commit functionality!",
                 "timestamp": "2014-10-03T15:57:14-03:00",
                 "url": "https://repourl",
                 "author": {
                     "name": "yourName",
                     "email": "you@mail.com",
                     "username": "theuser"
                 },
                 "committer": {
                     "name": "yourName",
                     "email": "you@mail.cm",
                     "username": "theuser"
                 },
                 "added": [],
                 "removed": [],
                 "modified": ["README.md"]
             }],
             "repository": {
                 "id": 246810,
                 "name": "therepo"
             }
         }' \
 'https://v1-cs-test.azurewebsites.net/api/e7ce21c0-270e-4ea2-be09-0e89801ac29d/inboxes/09d8a352-9922-4c17-92e2-05d9d3713ac6/commits?apiKey=e189d885-bd5c-4140-8c1a-24e286cfc0db'

done