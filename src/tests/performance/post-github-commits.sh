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
 'localhost:6565/api/9f4b2e16-15b0-4e4c-9343-2e8c164fa543/inboxes/fe371082-de05-4df8-9820-5f24c2f4c060/commits?apiKey=f417d7cd-062b-45ae-8703-759e434752ad'

done