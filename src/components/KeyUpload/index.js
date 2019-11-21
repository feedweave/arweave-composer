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
      <form onSubmit={this.handleSubmit}>
        <label>
          Log in with Arweave wallet:
          <input type="file" ref={this.fileInput} accept="application/json" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default KeyUpload;
