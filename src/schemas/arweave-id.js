const schema = {
  appName: "arweave-id",
  appVersion: "0.0.1",
  appDescription: "An identity registry for Arweave addresses.",
  appLink: "https://arweave.net/fGUdNmXFmflBMGI2f9vD7KzsrAc1s1USQgQLgAVT0W0",
  githubLink: "https://github.com/shenwilly/arweaveID/",
  schema: {
    data: {
      description: "Username for identity provider specified in `Type` tag",
      type: "string"
    },
    tags: [
      {
        key: "App-Name",
        value: "arweave-id",
        description: "Globally unique application name within Arweave"
      },
      {
        key: "App-Version",
        value: "0.0.1",
        description: "Version of data schema for application"
      },
      {
        key: "Unix-Time",
        type: "integer",
        description: "Current unix-time as integer"
      },
      {
        key: "Type",
        description: "Identity provider type",
        options: [
          {
            value: "discord"
          },
          {
            value: "twitter"
          },
          {
            value: "ethereum"
          },
          {
            value: "name"
          },
          {
            value: "email"
          }
        ]
      }
    ]
  }
};

export default schema;
