import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import Login from '../components/Login';
import Networks from '../components/Networks';
import Devices from '../components/Devices';
import Axios from 'axios';

class Home extends Component {
  state = {
    online: false,
    loading: true,
    networkErr: null,
    networks: [],
    alert: null,
    user: null,
  };

  componentDidMount = () => {
    this.checkOnline();
  };

  checkOnline = () => {
    Axios.get('/api/online')
      .then(({ data }) => {
        this.setState({ online: data, loading: !data });
        if (!data) this.getNetworks();

        // Pretend to be offline
        // this.setState({ online: false });
        // this.getNetworks();
      })
      .catch((err) => {
        this.setState({ networkErr: err });
      });
  };

  getNetworks = () => {
    Axios.get('/api/networks')
      .then(({ data }) => {
        console.log(data);
        this.setState({ networks: data, loading: false });
      })
      .catch((err) => {
        this.setState({ networkErr: err });
      });
  };

  login = (auth) => {
    Axios.get('https://happy-printer.co.uk/api/login', {
      headers: {
        Authorization: `basic ${auth.toString('base64')}`,
      },
    })
      .then(({ data }) => {
        console.log('Data:', data);
        if (data) {
          Axios.defaults.headers.common['Authorization'] = `bearer ${data.token}`;
          console.log('Got user: ', data);
          this.setState({ user: data });
          Axios.post('./api/register', { api_key: data.api_key });
        }
      })
      .catch((err) => {
        if (err.status === 401) this.setState({ alert: 'Incorrect email or password' });
      });
  };

  render() {
    return (
      <div className='Register'>
        <div className='container'>
          {this.state.online && !this.state.user && <Login login={this.login} alert={alert} />}
          {this.state.networks.length ? <Networks networks={this.state.networks} /> : null}
          <div className='row'>
            {this.state.loading && (
              <div className='col mt-5' style={{ textAlign: 'center' }}>
                <Spinner variant='secondary' animation='border' />
              </div>
            )}
            <div className='col-3 mt-5'></div>
            <div className='col-6 mt-5'>{this.state.user && <Devices user={this.state.user} />}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
