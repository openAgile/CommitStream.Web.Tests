 stuff="http://localhost:6565/api/27aa2346-8e12-4869-96d7-21e90544b116/inboxes/d9e13898-45b3-4094-9942-ce2b1b689e62/commits?apiKey=7f3aeb2b-41f5-4d3f-b21c-8e7b76662d1e"
echo stuff=$stuff

for i in `seq 1 $1`;
do

time curl -i -X POST \
   -H "Content-Type:application/json" \
   -H "x-event-key:pullrequest:created" \
   -d \
'{
  "actor": {
    "type": "user",
    "links": {
      "avatar": {
        "href": "https:\/\/bitbucket.org\/account\/JoshGough\/avatar\/32\/"
      },
      "html": {
        "href": "https:\/\/bitbucket.org\/JoshGough\/"
      },
      "self": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/users\/JoshGough"
      }
    },
    "username": "JoshGough",
    "display_name": "JoshGough",
    "uuid": "{57db6787-bb0f-4b40-9d7f-ad428fb0f34c}"
  },
  "repository": {
    "scm": "git",
    "type": "repository",
    "website": "",
    "full_name": "JoshGough\/cstest",
    "links": {
      "avatar": {
        "href": "https:\/\/bitbucket.org\/JoshGough\/cstest\/avatar\/32\/"
      },
      "html": {
        "href": "https:\/\/bitbucket.org\/JoshGough\/cstest"
      },
      "self": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest"
      }
    },
    "uuid": "{a0b527e6-4317-481e-9804-0363da85760b}",
    "name": "CSTest",
    "owner": {
      "type": "user",
      "links": {
        "avatar": {
          "href": "https:\/\/bitbucket.org\/account\/JoshGough\/avatar\/32\/"
        },
        "html": {
          "href": "https:\/\/bitbucket.org\/JoshGough\/"
        },
        "self": {
          "href": "https:\/\/api.bitbucket.org\/2.0\/users\/JoshGough"
        }
      },
      "username": "JoshGough",
      "display_name": "JoshGough",
      "uuid": "{57db6787-bb0f-4b40-9d7f-ad428fb0f34c}"
    },
    "is_private": false
  },
  "pullrequest": {
    "type": "pullrequest",
    "comment_count": 0,
    "description": "It is a pull request!",
    "links": {
      "html": {
        "href": "https:\/\/bitbucket.org\/JoshGough\/cstest\/pull-requests\/1"
      },
      "self": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1"
      },
      "approve": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/approve"
      },
      "commits": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/commits"
      },
      "merge": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/merge"
      },
      "activity": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/activity"
      },
      "decline": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/decline"
      },
      "comments": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/comments"
      },
      "statuses": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/statuses"
      },
      "diff": {
        "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/pullrequests\/1\/diff"
      }
    },
    "updated_on": "2017-04-24T15:54:45.762783+00:00",
    "task_count": 0,
    "merge_commit": null,
    "closed_by": null,
    "close_source_branch": false,
    "destination": {
      "commit": {
        "hash": "391f9dac0699",
        "links": {
          "self": {
            "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/commit\/391f9dac0699"
          }
        }
      },
      "branch": {
        "name": "master"
      },
      "repository": {
        "type": "repository",
        "links": {
          "avatar": {
            "href": "https:\/\/bitbucket.org\/JoshGough\/cstest\/avatar\/32\/"
          },
          "html": {
            "href": "https:\/\/bitbucket.org\/JoshGough\/cstest"
          },
          "self": {
            "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest"
          }
        },
        "name": "CSTest",
        "full_name": "JoshGough\/cstest",
        "uuid": "{a0b527e6-4317-481e-9804-0363da85760b}"
      }
    },
    "reviewers": [

    ],
    "author": {
      "type": "user",
      "links": {
        "avatar": {
          "href": "https:\/\/bitbucket.org\/account\/JoshGough\/avatar\/32\/"
        },
        "html": {
          "href": "https:\/\/bitbucket.org\/JoshGough\/"
        },
        "self": {
          "href": "https:\/\/api.bitbucket.org\/2.0\/users\/JoshGough"
        }
      },
      "username": "JoshGough",
      "display_name": "JoshGough",
      "uuid": "{57db6787-bb0f-4b40-9d7f-ad428fb0f34c}"
    },
    "id": 1,
    "reason": "",
    "state": "OPEN",
    "participants": [

    ],
    "title": "README.md edited online with Bitbucket",
    "source": {
      "commit": {
        "hash": "1b90edfd47e8",
        "links": {
          "self": {
            "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest\/commit\/1b90edfd47e8"
          }
        }
      },
      "branch": {
        "name": "testing"
      },
      "repository": {
        "type": "repository",
        "links": {
          "avatar": {
            "href": "https:\/\/bitbucket.org\/JoshGough\/cstest\/avatar\/32\/"
          },
          "html": {
            "href": "https:\/\/bitbucket.org\/JoshGough\/cstest"
          },
          "self": {
            "href": "https:\/\/api.bitbucket.org\/2.0\/repositories\/JoshGough\/cstest"
          }
        },
        "name": "CSTest",
        "full_name": "JoshGough\/cstest",
        "uuid": "{a0b527e6-4317-481e-9804-0363da85760b}"
      }
    },
    "created_on": "2017-04-24T15:54:45.727187+00:00"
  }
}' \
'http://localhost:6565/api/ac977fd2-6515-4dd3-a6ee-020c79c881d8/inboxes/c20bd3de-d4d8-451f-8f5e-39b626caf900/commits?apiKey=24494d0e-c4df-4fd5-bac1-a234c5c58224'
#"$stuff"
#'http://localhost:6565/api/3d8f15e7-af01-4153-b5b3-7ed8deee0b12/inboxes/f0ef74e1-945f-430d-9088-a70bb6965134/commits?apiKey=02059477-9480-46d4-877d-efc7ca5db2f9'

done