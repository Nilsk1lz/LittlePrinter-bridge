import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Axios from 'axios';
import { slide as Menu } from 'react-burger-menu';
import { Button } from 'react-bootstrap';

class Header extends Component {
  render() {
    return (
      <>
        {this.props.isMobile && (
          <Menu htmlClassName='hide-desktop' pageWrapId={'page-wrap'}>
            <a id='home' className='menu-item' href='/'>
              Home
            </a>
            <a id='about' className='menu-item' href='/shop'>
              Shop
            </a>
            <a id='contact' className='menu-item' disabled href='/account'>
              My Account
            </a>
          </Menu>
        )}
        <div className='header'>
          <div
            onClick={() => {
              this.props.history.push('/');
            }}
            className='header-title'>
            Happy Printer
          </div>
        </div>
        <div className='header-shadow'></div>
      </>
    );
  }
}

export default withRouter(Header);
