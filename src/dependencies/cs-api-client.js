import rp from 'request-promise';
import familyPayloadExamples from './family-payload-examples';
require("babel-polyfill");

const loggingSeparator = '<hr/>';

let getLink = (obj, linkName) => obj._links[linkName].href;

let postOptions = (uri, data, extraHeaders) => {
  let headers = {
    'Content-Type': 'application/json'
  };

  if (extraHeaders) headers = Object.assign(headers, extraHeaders);

  return {
    uri,
    method: 'POST',
    headers,
    transform: body => JSON.parse(body),
    body: JSON.stringify(data)
  };
};

let postToLink = (client, halResponse, linkName, data, extraHeaders) => {
  if (client.loggingEnabled) {
    console.log('After getting this HAL response:\n\n');
    console.log('```json\n' + JSON.stringify(halResponse, ' ', 2) + '\n```\n\n');
    if (halResponse._links['teamroom-view']) {
      console.log('TEAMROOM LINK:');
      console.log(halResponse._links['teamroom-view'].href + '&apiKey=' + client.apiKey);
    }
  }
  if (halResponse.apiKey) {
    client.apiKey = halResponse.apiKey; // Cheap n dirty
    client.instanceId = halResponse.instanceId;
  }
  let link = getLink(halResponse, linkName);
  if (client.apiKey !== null) link += "?apiKey=" + client.apiKey;

  if (client.loggingEnabled) {
    console.log('We then extract the `' + linkName + '` link from the `_links` property, returning:\n\n');
    console.log('`' + link + '`.\n\n');
    console.log('And then POST the following JSON body to that link:\n\n');
    console.log('```json\n' + JSON.stringify(data, ' ', 2) + '\n```\n\n');
    console.log(loggingSeparator);
  }

  return rp(postOptions(link, data, extraHeaders));
}

let post = (client, path, data) => {
  console.log(client.baseUrl);
  console.log(client.href(path));
  return rp(postOptions(client.href(path), data));
};

let get = (client, uri, alreadyAbsolute) => {
  uri = alreadyAbsolute ? uri : client.href(uri);
  return {
    uri,
    method: 'GET',
    transform: body => JSON.parse(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

let postToInboxForFamily = (client, inbox, message, repoUrl, family, extraHeaders) => {
  return postToLink(client, inbox, 'add-commit', familyPayloadExamples[family].validWithOneCommit(message, repoUrl), extraHeaders);
}

let families = {
  GitHub : {
    commitAdd: (client, inbox, message='GitHub commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl, 'GitHub', {'x-github-event': 'push'})
  },
  GitLab : {
    commitAdd: (client, inbox, message='GitLab commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl, 'GitLab', {'x-gitlab-event': 'Push Hook'})
  },
  Bitbucket : {
    commitAdd: (client, inbox, message='Bitbucket commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl, 'Bitbucket', {'x-event-key': 'repo:push'})
  },
  VsoGit : {
    commitAdd: (client, inbox, message='VsoGit commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl,  'VsoGit')
  },
  VsoTfvc : {
    commitAdd: (client, inbox, message='VsoTfvc commit', repoUrl = 'https://gitbhu.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl, 'VsoTfvc')
  },
  SVN : {
    commitAdd: (client, inbox, message='SVN commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl,  'SVN', {'CS-SVN-Event': 'Commit Event'})
  },
  GitSwarm : {
    commitAdd: (client, inbox, message='GitSwarm commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl,  'GitSwarm', {'x-gitlab-event': 'Push Hook', 'x-gitswarm-event': 'Push Hook'})
  },
  P4V : {
    commitAdd: (client, inbox, message='P4V commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl, 'P4V', {'Content-type': 'application/json', 'CS-P4V-Event': 'Commit Event'})
  },
  Deveo : {
    commitAdd: (client, inbox, message='Deveo commit', repoUrl = 'https://github.com/openAgile/CommitStream.Web') => postToInboxForFamily(client, inbox, message, repoUrl, 'Deveo', {'Content-type': 'application/json', 'x-deveo-event': 'push'})
  }
};

class CSApiClient {
  constructor(baseUrl = 'http://localhost:6565/api', loggingEnabled = false) {
    this._baseUrl = baseUrl;
    this._loggingEnabled = loggingEnabled;
    this._instanceId = null;
    this._apiKey = null;
  }
  async instanceCreate() {
    return await Instance.create(this);
  }

  getInbox(inbox)  {
    return new Inbox(this, inbox);
  }
  get apiKey() { return this._apiKey; }
  set apiKey(val) { this._apiKey = val; }
  get instanceId() { return this._instanceId; }
  set instanceId(val) { this._instanceId = val; }
  get baseUrl() { return this._baseUrl; }
  set baseUrl(val) { this._baseUrl = val; }
  get loggingEnabled() { return this._loggingEnabled; }
  set loggingEnabled(val) { this._loggingEnabled = val; }
  href(path) {
    return `${this.baseUrl}${path}`;
  }
}

let resourceSymbol = Symbol('resource');
let clientSymbol = Symbol('client');

class Resource {
  constructor(client, resource) {
    this[clientSymbol] = client;
    this[resourceSymbol] = resource;
    Reflect.ownKeys(resource).forEach(prop => Object.defineProperty(this, prop, {
      get: function() { return resource[prop]; },
      enumerable: true,
      configurable: true
    }));
  }
  async postToLink(linkName, data, ResourceWrapperClass) {
    let resource = await postToLink(this[clientSymbol], this[resourceSymbol], linkName, data);
    return new ResourceWrapperClass(this[clientSymbol], resource);
  }
}

class Instance extends Resource {
  static async create(client) {
    let instanceResource = await post(client, '/instances', {});
    return new Instance(client, instanceResource);
  }
  async digestCreate(data) {
    return await this.postToLink('digest-create', data, Digest);
  }
};

class Digest extends Resource {
  async inboxCreate(data) {
    return await this.postToLink('inbox-create', data, Inbox);
  }
}

class Inbox extends Resource {
  async commitCreate(message, repoUrl) {
    let commitResponse = await families[this.family].commitAdd(this[clientSymbol], this[resourceSymbol], message, repoUrl);
    return commitResponse;
  }
}

export default CSApiClient;

/* NOTE: Experimental code that could drive runtime class generation

const resourceSubClassDefinitions = [
  {
    name: 'Instance',
    postToLinkMethods: [
      ['digestCreate', 'digest-create', 'Digest']
    ]
  },
  {
    name: 'Digest',
    postToLinkMethods: [
      ['inboxCreate', 'inbox-create', 'Inbox']
    ]
  }
];

resourceSubClassDefinitions.forEach(def => {
  module[def.name] = class extends Resource {};
  def.postToLinkMethods.forEach(method => {
    const [name, link, resourceWrapperClassName] = method;
    module[def.name].prototype[name] = async function(data) {
      return await this.postToLink(link, module[resourceWrapperClassName]);
    }
  })
});

module.Instance.create = async function() {
  let instanceResource = await post('/instances', {});
  return new Instance(instanceResource);
}
*/
