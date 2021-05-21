import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

export default class Login extends Component {
  state = {};

  componentDidUpdate = (oldProps) => {
    if (this.props.alert !== oldProps.alert) {
      this.setState({ alert: this.props.alert });
    }
  };

  submitForm = () => {
    const { login } = this.props;
    if (!this.state.email) {
      this.setState({ alert: 'Please enter a valid email' });
      return;
    }

    if (!this.state.password) {
      this.setState({ alert: 'Please enter a valid password' });
      return;
    }

    const auth = `${this.state.email}:${this.state.password}`;
    const buff = new Buffer(auth);

    login(buff);
  };

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'></div>
          <div className='col-md-6'>
            <h3 className='mt-5'>Login</h3>
            <Form>
              <Form.Group controlId='formBasicEmail'>
                {this.state.alert && <Alert variant={'danger'}>{this.state.alert}</Alert>}
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={this.state.email}
                  onChange={({ target }) => {
                    this.setState({ email: target.value, alert: '' });
                  }}
                />
              </Form.Group>

              <Form.Group controlId='formBasicPassword'>
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
                LOGIN
              </Button>
              <Link className='ml-3 btn-link' to='/register' type='submit'>
                Register
              </Link>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
