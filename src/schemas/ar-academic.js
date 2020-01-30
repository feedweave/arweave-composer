const schema = {
  appName: "Academic",
  appVersion: "0.0.1",
  appDescription:
    "High-quality Open Access publishing Arweave ÐApp for publishing academic articles which are freely available for anyone in the world to use. Be a part of the academic community, submit publications on ArAcademic under a Creative Commons license or under Open Access, original work under a CC BY-NC 4.0 license. All submitted publications can be read by everyone. An Arweave Wallet is required for writing articles.",
  appLink:
    "https://ss6puabcq3ch.arweave.net/5Yeg3wT4COQL6Bz-tdp9xlmeiwgcOO8NupjpEUDXZ5Y/index.html",
  githubLink: "https://github.com/sergejmueller/aracademic",
  schema: {
    data: {
      description: "Text of article in Markdown.",
      type: "string"
    },
    tags: [
      {
        key: "App-Name",
        value: "Academic",
        description: "Globally unique application name within Arweave"
      },
      {
        key: "Article-Title",
        type: "string",
        description: "Title of the article"
      },
      {
        key: "Article-Timestamp",
        type: "integer",
        description: "Current unix-time as integer"
      }
    ]
  }
};

export default schema;
