import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      // show a link to sign out
      return;
    } else {
      // show a link to sign in or sign up
      return [
        <li className="nav-item m-r-1" key={2} style = {{float:"right", color: 'white'}}>
          <Link className="nav-link" to="/signup">Register</Link>
        </li>,
        <li className="nav-item m-r-2" key={1} style = {{float:"right", color: 'white'}}>
          <Link className="nav-link" to="/signin">Login</Link>
        </li>
      ];
    }
  }

  renderLogin() {
    if (!this.props.authenticated) {
        return <Link style = {{float:"right"}} className="navbar-brand" to="/signin">Login</Link>
    }
  }

  renderFeatureLink() {
    if(this.props.authenticated) {
      return (
        [<li className="nav-item" key = {1}>
          <Link className="nav-link" to="/mainmenu">Main Menu</Link>
        </li>,
        <li className="nav-item m-r-1" key = {2} style = {{float:"right"}}>
          <Link className="nav-link" to="/signout">Sign Out</Link>
        </li>]
      );
    }
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-primary navbar-full">
        <Link to="/" className="navbar-brand">iLocalize</Link>
        {this.renderLogin()}
        <ul className="nav navbar-nav">
          {this.renderLinks()}
          {this.renderFeatureLink()}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);
