const schema = {
  appName: "FEEDweave",
  appVersion: "0.0.1",
  appDescription: "A blogging platform built on Arweave.",
  appLink: "https://feedweave.co",
  githubLink: "https://github.com/denisnazarov/feedweave-ui",
  schema: {
    data: {
      description: "Text of blog post as Markdown.",
      type: "string"
    },
    tags: [
      {
        key: "App-Name",
        value: "FEEDweave",
        description: "Globally unique application name within Arweave"
      },
      {
        key: "App-Version",
        value: "0.0.1",
        description: "Version of data schema for application"
      }
    ]
  }
};

export default schema;
