export default (base, context) => {
	const family = 'GitHub';
	return [
		{
			name: `${family}: Can I create an inbox?`,
			test: async t => {
				const {instanceId, apiKey, digestId} = context; // Must destructure just-in-time
				const response = await base.createInbox({instanceId, apiKey, digestId,
					inboxFamily: 'GitHub', inboxName: 'GitHubGlobal', repoUrl: 'https://github.com/user/genericTest'});
				t.is(response.status, 201, "Uh oh...");
				const inbox = response.data;
				const expected = base.expectedInboxResult({
					instanceId,
					apiKey,
					digestId,
					inboxId: inbox.inboxId,
					inboxFamily: 'GitHub',
					inboxName: 'GitHubGlobal',
					repoUrl: 'https://github.com/user/genericTest'
				});
				inbox.should.not.differentFrom(expected);
				context.inbox = inbox;
				context.gitHubInboxId = inbox.inboxId;
			}
		},		
		{
			name: `${family}: Can I make a commit?`,
			test: async t => {
				const {instanceId, apiKey, digestId} = context; // Must destructure just-in-time
				let response = await base.pushGitHubCommit({instanceId, apiKey, inboxId: context.gitHubInboxId, validPayload: true});
				t.is(response.status, 201, "Uh oh...");
				let commit = response.data;
				let expected = base.expectedCommitResult({
					instanceId,
					digestId,
					inboxId: context.gitHubInboxId
				});
				commit.should.not.differentFrom(expected);
			}
		},
		{
			name: `${family}: Expect 400 response and error message for invalid commit headers to inbox`,
			test: async t => {
				const {instanceId, apiKey, digestId} = context; // Must destructure just-in-time
				try {
					await base.pushCommitInvalidHeaders({instanceId, apiKey, inboxId: context.gitHubInboxId, validPayload: true});
				}
				catch(error) {
					let response = error.response;
					t.is(response.status, 400, "Uh oh...");
					let commit = response.data;
					let expected = base.expectedInvalidHeadersCommitResult();
					commit.should.not.differentFrom(expected);
				}
			}
		},
		{
			name: `${family}: Expect 400 response and error message for invalid commit payload to inbox`,
			test: async t => {
				const {instanceId, apiKey, digestId} = context; // Must destructure just-in-time
				try {
					await base.pushGitHubCommit({instanceId, apiKey, inboxId: context.gitHubInboxId, validPayload: false});
				}
				catch(error) {
					let response = error.response;
					t.is(response.status, 400, "Uh oh...");
					let commit = response.data;
					let expected = base.expectedInvalidPayloadCommitResult({
						vcsType: 'GitHub',
						isScriptBased: false
					});
					JSON.stringify(commit).should.not.differentFrom(JSON.stringify(expected));
				}
			}
		}
	];
};