import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

'use strict';

class MainMenu extends Component {
  componentWillMount() {
    this.props.fetchUser();
  }

  loadUser() {
    if (this.props.user != undefined){
      return <div>Hello {this.props.user.settings.name}</div>;
    } else {
      return (
        <div className = "v1">
          <div className = "v2">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className = "mt-2">
        <h3 className = "text-md-center">Main Menu</h3>

        <center>
          <div className ="btn-group-vertical btn-group-lg">
            <Link to = "/evalmode" className = "btn btn-secondary" key = {1}>Evaluation</Link>
            <Link to = "/practicemode" className = "btn btn-secondary" key = {2}>Timed Practice</Link>
            <Link to = "/settings" className = "btn btn-secondary" key = {3}>Settings</Link>
            <Link to = "/history" className = "btn btn-secondary" key = {4}>History</Link>
          </div>
        </center>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.auth.message,
    user: state.auth.user
  };
}

export default connect(mapStateToProps, actions)(MainMenu);
