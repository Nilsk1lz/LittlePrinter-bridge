import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Home from './screens/Home';

class App extends Component {
  state = {
    isMobile: window.innerWidth < 768,
  };

  throttledHandleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth < 768 });
  };

  componentDidMount() {
    window.addEventListener('resize', this.throttledHandleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledHandleWindowResize);
  }

  render() {
    const { isMobile } = this.state;
    return (
      <div className='App' id='outer-container'>
        <BrowserRouter basename='/'>
          <Header isMobile={isMobile}></Header>
          <Switch id='page-wrap'>
            <Route exact path='/' component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
