const schema = {
  appName: "social-graph",
  appVersion: "0.0.1",
  appDescription:
    "A social graph between Arweave addresses. A user can follow another user by publishing a transaction with that user's wallet address in the `data` field and the tag `Action: Follow`. Optionally, users can follow an address's activity within a specific app by including the app's name in the `App-Filter` tag.",
  schema: {
    data: {
      description: "Arweave address to follow or unfollow (see `Action` tag)",
      type: "string"
    },
    tags: [
      {
        key: "App-Name",
        value: "social-graph",
        description: "Globally unique application name within Arweave"
      },
      {
        key: "App-Version",
        value: "0.0.1",
        description: "Version of data schema for application"
      },
      {
        key: "Action",
        description: "Specifies whether to follow or unfollow an address",
        options: [
          {
            value: "follow"
          },
          {
            value: "unfollow"
          }
        ]
      },
      {
        key: "App-Filter",
        description:
          "Specifies the `App-Name` of Arweave app to follow user in (leave blank to follow globally)"
      }
    ]
  }
};

export default schema;
