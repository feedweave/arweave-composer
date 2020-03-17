const schema = {
  appName: "transaction-comment",
  appVersion: "0.0.1",
  appDescription: "Post a comment on a transaction.",
  appLink: "",
  githubLink: "",
  schema: {
    data: {
      description: "Text of comment post as Markdown.",
      type: "string"
    },
    tags: [
      {
        key: "App-Name",
        value: "transaction-comment",
        description: "Globally unique application name within Arweave"
      },
      {
        key: "App-Version",
        value: "0.0.1",
        description: "Version of data schema for application"
      },
      {
        key: "Transaction-ID",
        description: "ID of transaction you're commenting on."
      },
      {
        key: "Parent-App-Name",
        description: "App-Name of parent app. (e.g. FEEDweave)"
      }
    ]
  }
};

export default schema;
