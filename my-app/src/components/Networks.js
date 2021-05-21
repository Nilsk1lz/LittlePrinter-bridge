import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

export default class Networks extends Component {
  state = {
    network: this.props.networks[0],
    password: null,
  };

  submitForm = () => {
    if (!this.state.password) {
      this.setState({ alert: 'Please enter password' });
    }
  };

  render() {
    const { networks } = this.props;
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'></div>
          <div className='col-md-6'>
            <h3 className='mt-5'>Networks</h3>
            <Form>
              <Form.Group controlId='networks'>
                {this.state.alert && <Alert variant={'danger'}>{this.state.alert}</Alert>}
                <Form.Label>Select Network:</Form.Label>
                <Form.Control
                  as='select'
                  value={this.state.network}
                  onChange={({ target }) => {
                    this.setState({ network: target.value });
                  }}>
                  {networks.map((network, index) => {
                    return <option key={index}>{network.ssid}</option>;
                  })}
                </Form.Control>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={({ target }) => {
                    this.setState({ password: target.value, alert: '' });
                  }}
                />
              </Form.Group>

              <Button className='button-login' variant='primary' onClick={this.submitForm}>
                Connect
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
