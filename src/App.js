import React from "react";
import Arweave from "arweave/web";

import TextEditor from "./components/TextEditor";
import KeyUpload from "./components/KeyUpload";

import "./App.css";

const arweave = Arweave.init();

const APP_NAME = `arweave-blog-0.0.1`;

const addPost = async (post, user) => {
  const { address, wallet } = user;
  const tx = await arweave.createTransaction({ data: post }, wallet);

  tx["last_tx"] = await arweave.api.get("/tx_anchor").then(x => x.data);

  const tags = {
    "App-Name": APP_NAME
  };

  for (const [tagKey, tagValue] of Object.entries(tags)) {
    tx.addTag(tagKey, tagValue);
  }

  await arweave.transactions.sign(tx, wallet);
  await arweave.transactions.post(tx);

  tx["owner"] = address;
  tx["tags"] = tags;

  return tx;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this.handleUser = this.handleUser.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleUser(user) {
    this.setState({ user });
  }

  async handleSave(post) {
    const { user } = this.state;
    await addPost(post, user);
  }

  render() {
    const { user } = this.state;
    return (
      <div className="App">
        {user ? (
          <TextEditor user={user} handleSave={this.handleSave} />
        ) : (
          <KeyUpload handleUser={this.handleUser} arweave={arweave} />
        )}
      </div>
    );
  }
}

export default App;
