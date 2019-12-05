import React from "react";
class KeyUpload extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();

    const file = this.fileInput.current.files[0];
    const reader = new FileReader();

    const { handleUser, arweave } = this.props;

    reader.onload = () => {
      try {
        const data = reader.result;
        const wallet = JSON.parse(data);
        arweave.wallets.jwkToAddress(wallet).then(address => {
          handleUser({ wallet, address });
        });
      } catch (error) {
        alert(error.toString());
      }
    };
    reader.readAsText(file);
  }

  render() {
    return (
      <div>
        <p>
          This page demonstrates publishing a markdown file to the Arweave
          blockchain so it can be rendered in a statically generated blogging
          app.
        </p>
        <p>
          Your transaction will be tagged with{" "}
          <code>App-Name: arweave-blog-0.0.1</code>.
        </p>
        <p>
          After less than a minute, you should see your transaction in our "app
          explorer" for{" "}
          <a
            href="https://explorer.arweave.co/app/arweave-blog-0.0.1"
            rel="noopener noreferrer"
          >
            <code>arweave-blog</code>
          </a>
          .
        </p>
        <p>
          <a href="https://explorer.arweave.co/" rel="noopener noreferrer">
            Arweave App Explorer
          </a>{" "}
          lets you explore the raw data of apps that are using Arweave as a
          decentralized backend.
        </p>

        <p>
          Under the hood, the explorer is a statically generated site, fed by
          data persisted on Arweave, and hosted on Netlify. When new
          transactions are published to the chain, a new build of the explorer
          is automatically triggered.
        </p>
        <p>
          <i>
            Coming soon: a statically generated multi-user blogging platform fed
            by the same data.
          </i>
        </p>
        <p>
          Log in with your existing Arweave JSON wallet (or get free tokens{" "}
          <a
            href="https://tokens.arweave.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          ) and try it out:
        </p>

        <form onSubmit={this.handleSubmit}>
          <p>
            <input type="file" ref={this.fileInput} accept="application/json" />
          </p>
          <p>
            <button type="submit">Submit</button>
          </p>
        </form>
      </div>
    );
  }
}

export default KeyUpload;
