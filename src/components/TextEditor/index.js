import React from "react";
import Editor from "rich-markdown-editor";
import { Button } from "reactstrap";

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }
  handleChange = value => {
    this.setState({ text: value() });
  };

  handleSave = () => {
    const { text } = this.state;
    this.props.handleSave(text);
  };

  render() {
    return (
      <div>
        <Editor
          onChange={this.handleChange}
          placeholder="# Write some markdown here!"
        />
        <Button onClick={this.handleSave} color="primary">
          Save
        </Button>
      </div>
    );
  }
}

export default TextEditor;
