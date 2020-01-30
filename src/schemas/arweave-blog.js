const schema = {
  appName: "arweave-blog",
  appVersion: "0.0.1",
  appDescription: "A blogging platform built on arweave.",
  schema: {
    data: {
      description: "Text of blog post as Markdown.",
      type: "string"
    },
    tags: [
      {
        key: "App-Name",
        value: "arweave-blog-0.0.1",
        description: "Globally unique application name within Arweave"
      }
    ]
  }
};

export default schema;
