export default (base, context) => {
	const {instanceId, apiKey, digestId} = context;	
	return [
		{
			name: 'Can I create an inbox for GitHub?',
			test: async t => {	
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
			name: "Can I make a commit to GitHub inbox?", 
			test: async t => {
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
		}
	];
};