import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  FormText,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import { saveTransaction, arweave } from "../../util";

import academicSchema from "../../schemas/ar-academic";
import arweaveIdSchema from "../../schemas/arweave-id";
import arweaveBlogSchema from "../../schemas/arweave-blog";
import socialGraphSchema from "../../schemas/social-graph";

const schemas = [
  socialGraphSchema,
  arweaveBlogSchema,
  academicSchema,
  arweaveIdSchema
];

const DropDownSelect = ({ items, name, onChange }) => {
  return (
    <Input name={name} onChange={onChange} type="select">
      {items.map(({ value, description }) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Input>
  );
};

const SchemaFormTag = ({ tag, onChange }) => {
  const { key, value, options, description } = tag;

  let input = options ? (
    <DropDownSelect name={`tag:${key}`} items={options} onChange={onChange} />
  ) : (
    <Input
      name={`tag:${key}`}
      value={value}
      disabled={!!value}
      onChange={onChange}
    />
  );
  return (
    <div>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>{key}:</InputGroupText>
        </InputGroupAddon>
        {input}
      </InputGroup>
      <FormText color="muted">{description}</FormText>
      <br />
    </div>
  );
};

const getStateFromProps = props => {
  const { schema } = props.dataObject;

  return {
    data: "",
    tags: schema.tags.reduce((acc, tag) => {
      const value = tag.value || (tag.options && tag.options[0].value);
      acc[tag.key] = value;
      return acc;
    }, {})
  };
};

class SchemaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromProps(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const { value, name } = target;

    const tag = name.split("tag:")[1];

    if (tag) {
      const oldTags = this.state.tags;
      this.setState({
        tags: Object.assign(oldTags, {
          [tag]: value
        })
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleSubmit(event) {
    this.props.handleSubmit(this.state);
    event.preventDefault();
  }
  render() {
    const { dataObject } = this.props;
    const { schema, appLink, githubLink } = dataObject;

    const { data, tags } = schema;
    const { data: dataState } = this.state;

    return (
      <Row>
        <Col>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <legend>Description</legend>
              <p>{dataObject.appDescription}</p>
              {appLink ? (
                <p>
                  <a href={appLink}>Launch app</a>
                </p>
              ) : null}
              {githubLink ? (
                <p>
                  <a href={githubLink}>{githubLink}</a>
                </p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <legend>Data</legend>
              <Input
                type="textarea"
                name="data"
                onChange={this.handleChange}
                value={dataState}
              />
              <FormText color="muted">{data.description}</FormText>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>Tags</legend>
              {tags.map(tag => (
                <SchemaFormTag
                  key={tag.key}
                  tag={tag}
                  onChange={this.handleChange}
                />
              ))}
            </FormGroup>
            {!!this.props.handleSubmit ? (
              <Button color="primary">Submit</Button>
            ) : (
              <Button disabled>Submit</Button>
            )}
          </Form>
        </Col>
      </Row>
    );
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.inputFileRef = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }
  handleButtonClick = e => {
    this.inputFileRef.current.click();
    e.preventDefault();
  };

  handleFileChange = e => {
    e.preventDefault();

    const file = this.inputFileRef.current.files[0];
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
  };

  render() {
    const { user, handleLogout } = this.props;
    return (
      <Navbar color="light" light expand="md" style={{ marginBottom: "2rem" }}>
        <Container>
          <NavbarBrand href="/">
            {" "}
            <strong>ARWEAVE</strong> transaction composer
          </NavbarBrand>
          {user ? (
            <Nav pills>
              <NavItem>
                <NavLink
                  active
                  href={`https://explorer.arweave.co/address/${user.address}`}
                >
                  Wallet
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={handleLogout}>
                  Log out
                </NavLink>
              </NavItem>
            </Nav>
          ) : (
            <Nav>
              <NavItem>
                <NavLink href="#" active onClick={this.handleButtonClick}>
                  Log in with wallet
                </NavLink>
                <input
                  ref={this.inputFileRef}
                  type="file"
                  style={{ display: "none" }}
                  accept="application/json"
                  onChange={this.handleFileChange}
                />
              </NavItem>
            </Nav>
          )}
        </Container>
      </Navbar>
    );
  }
}

function SavedTxMessage({ savedTx }) {
  const { id } = savedTx;
  return (
    <Container>
      <Row>
        <Col>
          <p>
            Transaction <strong>{id}</strong> has been broadcast to the Arweave
            network.
          </p>
          <p>
            After it is mined, you can view it on the App Explorer{" "}
            <a href={`https://explorer.arweave.co/transaction/${id}`}>here</a>.
          </p>
          <p>
            <a href="/">Compose new transaction.</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

class AppSelector extends React.Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);
    const selectedApp = urlParams.get("appName");

    this.state = {
      selectedValue: selectedApp,
      selectedSchema: schemas.find(s => s.appName === selectedApp),
      user: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({
      selectedValue: value,
      selectedSchema: schemas.find(schema => schema.appName === value)
    });
    if (window.history.pushState) {
      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        `?appName=${value}`;
      window.history.pushState({ path: newurl }, "", newurl);
    }
  }

  async handleSubmit(state) {
    const { user } = this.state;
    const tx = await saveTransaction(user, state);
    this.setState({ savedTx: tx });
  }

  handleUser(user) {
    this.setState({ user });
  }

  handleLogout() {
    this.setState({ user: null });
  }

  render() {
    const { selectedSchema, selectedValue, user, savedTx } = this.state;
    return (
      <div style={{ marginBottom: 20 }}>
        <Header
          handleUser={this.handleUser}
          arweave={arweave}
          user={user}
          handleLogout={this.handleLogout}
        />
        {savedTx ? (
          <SavedTxMessage savedTx={savedTx} />
        ) : (
          <Container>
            <Row>
              <Col>
                <FormGroup>
                  <legend>App</legend>
                  <Input
                    type="select"
                    value={selectedValue}
                    onChange={this.handleChange}
                  >
                    <option value="" disabled selected hidden>
                      Select an app
                    </option>
                    {schemas.map(({ appName }) => (
                      <option key={appName} value={appName}>
                        {appName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {selectedSchema ? (
              <SchemaForm
                key={selectedSchema.appName}
                dataObject={selectedSchema}
                handleSubmit={user ? this.handleSubmit : null}
              />
            ) : (
              <FormGroup>
                <legend>FAQ</legend>
                <p>
                  <strong>What is the Arweave transaction composer?</strong>
                  <br />
                  This site demonstrates how transactions in Arweave apps are
                  constructed and aims to inspire developers to experiment with
                  and build new applications on Arweave. Select an app above to
                  get started. Built by{" "}
                  <a href="https://twitter.com/Iiterature">@Iiterature</a>.
                </p>
                <p>
                  <strong>What is Arweave?</strong>
                  <br />
                  Arweave is a blockchain-based storage network that enables
                  permanently hosting arbitrary data.
                </p>
                <p>
                  Arweave allows tagging its data-carrying transactions with
                  arbitrary key-value pairs. Leveraging the tags feature, a
                  standard has emerged in the Arweave community for using
                  Arweave as an open, neutral, decentralized, and autonomous
                  backend for Internet-scale social applications.
                </p>
                <p>
                  <strong>How do Arweave apps work?</strong>
                  <br />
                  In order to distinguish one app's data from another app's,
                  Arweave apps rely on tagging their transactions with a common 
                  <code>App-Name</code>.
                </p>
                <p>
                  For example, 
                  <a href="https://bkxqaor2dlei.arweave.net/pvmiu4SZKQGWAYjrLWzE_mI70u1-v8zIzQ8WaxIYURk">
                    Arweave Board
                  </a>
                   tags all of its transactions with 
                  <code>App-Name: ArBoard</code>, along with other
                  application-specific 
                  <a href="https://explorer.arweave.co/app/ArBoard">tags</a>, to
                  create a hierarchy between transactions that represent 
                  <code>Categories</code>, <code>Posts</code>, and 
                  <code>Replies</code>.
                </p>
                <p>
                  Data can then be queried by <code>App-Name</code> to
                  reconstruct a holistic view of the application.
                </p>
                <p>
                  To make an analogy to traditional database management systems,
                  transactions grouped by <code>App-Name</code> can be thought
                  of as all the records in the canonical database of some
                  internet service. Records organized by <code>App-Name</code>{" "}
                  can be further grouped using additional tags that are more
                  specific, allowing developers to emulate familiar database
                  constructs, such as tables or relationships.
                </p>
                <p>
                  <strong>
                    What about dynamic queries and user interfaces?
                  </strong>
                  <br />
                  Although data hosted on Arweave can encode any arbitrary
                  relationships between records and/or users, the network itself
                  offers no dynamic querying capabilities. Yet, query support is
                  critical for building usable and fimiliar end-user focused
                  applications.
                </p>
                <p>
                  In order to build scalable and functional applications on
                  Arweave, we propose adopting a conceptual model that separates
                  an application's "data layer" from its "view layer".
                </p>
                <p>
                  Traditionally, a standard Web 2.0 application tightly couples
                  its data and view layers. Developers operate and maintain the
                  underlying compute infrastructure of a service and thereby own
                  the application data, including the social graph, and also
                  maintain a proprietary interface via a website or mobile app.
                </p>
                <p>
                  In order to make the data layer neutral and also scalable,
                  Arweave only persists the data record itself, without being
                  aware of the structure or relationships encoded in the record.
                </p>
                <p>
                  Yet, since Arweave is permissionless and neutral, anyone can
                  read the data from Arweave, interpret the encoded
                  relationships in a record, and render their own user-friendly
                  "view" of the data (a web app, mobile app, or even a
                  rudimentary{" "}
                  <a href="http://explorer.arweave.co/">block explorer</a>).
                </p>
                <p>
                  A useful architectural analogy is how{" "}
                  <a href="https://jamstack.wtf">Static Site Generators</a>{" "}
                  work. In a statically generated site, a collection of source
                  files, often Markdown files, are "transformed" to a
                  functional, familiar website with links, buttons, and pages.
                  They are easy to build, run extremely fast, and cheap to host.
                </p>
                <p>
                  A draw-back of SSGs has been the single-player nature of their
                  data source. They are usually backed by data that lives in a
                  git repo hosted on GitHub, where only a single entity (e.g. a
                  blogger or a business) has permission to write or edit.
                </p>
                <p>
                  Static Site Generators in their current form couldn't be used
                  to build truly social, Internet-scale applications, because
                  they don't plug in to a backend that supports unrestricted
                  multiplayer read and write access.
                </p>
                <p>
                  We think that Arweave is the perfect backend for the next
                  generation of multi-user Statically Generated Sites. This
                  architecture of a decoupled "data layer" (Arweave) from the
                  "view layer" (SSG) gives the best of both worlds: a neutral,
                  decentralized backend and a performant, familiar front-end
                  leveraging a widely-adopted Web development stack.
                </p>
                <p>
                  <strong>
                    What are the benefits of using Arweave as an application
                    backend?
                  </strong>
                  <br />
                  Arweave allows building applications that are open, neutral,
                  decentralized, and autonomous, while still operating at
                  Internet-scale.
                </p>
                <p>
                  Because Arweave is a blockchain network, Arweave apps have no
                  centralized operator or owner. The blockchain itself serves as
                  the datastore, meaning that apps don't require a developer or
                  company to provision or maintain any computing infrastructure.
                  Arweave apps are instead governed by their communities and
                  sustained by the AR token. Developers and users know the rules
                  of the platform up-front and can be confident that they won't
                  change as the platform scales, as is common with Web 2.0
                  services.
                </p>
              </FormGroup>
            )}
          </Container>
        )}
      </div>
    );
  }
}

export default AppSelector;
