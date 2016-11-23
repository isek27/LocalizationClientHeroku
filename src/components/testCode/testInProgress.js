import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {ROOT_URL} from "../../actions/types"
import * as actions from '../../actions';
import axios from 'axios';
import dateFormat from "dateFormat";
import Moment from "moment";
import TestObject from "./testObject";
import Sound from "./sound";
import Clock from "./clock";
import "moment-duration-format";
var sounds = new Sound();
var resultString = "Choose Left or Right";
var startReaction, endReaction;

class TestInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {startGame:false, correctGuess:null, speakerPlayingSound:null};
  }

  componentWillMount() {
    this.props.fetchActiveTest();
    this.setState({speakerPlayingSound:sounds.pickRandomSide()})

    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.props.updateTest(this.props.activeTest);
  }

  tick() {
    this.props.tic(this.props.activeTest);
    this.forceUpdate();

    if(this.props.activeTest.timeLeft <= 0) {
      if(this.props.activeTest.completed == false) {
        var temp = this.props.activeTest;
        this.saveTestResults(temp);
      } else {
        clearInterval(this.timerID);
        this.props.endTest();
      }
    }
  }

  saveTestResults(completedTest) {
    completedTest.completed = true;
    completedTest.endTime = Moment();
    completedTest.avgReactionTime = Math.round((completedTest.totalReaction / completedTest.trialCount) * 100) / 100;
    this.props.updateTest(completedTest);

    const config = { headers: { authorization: localStorage.getItem('token')}};
    axios.post(ROOT_URL + "/savetest", completedTest, config);
    console.log("test saved!");

    clearInterval(this.timerID);
    this.props.endTest();
  }

  renderTime() {
    return (

        this.props.activeTest.timeLeft

    );
  }

  renderResultString() {
    if(this.state.correctGuess == false) {
      return (<div className = "btn btn-danger">Results: {resultString}</div>);
    }
    else if(this.state.correctGuess == true) {
      return (<div className = "btn btn-success">Results: {resultString}</div>);
    }
    else {
      return (<div className = "btn btn-info">Results: {resultString}</div>);
    }
  }

  playSound() {
    startReaction = new Date();
    sounds.play();
    $("#playSound").addClass("disabledbutton");
    $("#redButton").removeClass("disabledbutton");
    $("#blueButton").removeClass("disabledbutton");
  }

  determineGuess(userGuess) {

    $("#redButton").addClass("disabledbutton");
    $("#blueButton").addClass("disabledbutton");
    $("#playSound").addClass("disabledbutton");

    var temp = this.props.activeTest;
    var reactionTime = ((new Date().getTime()) - startReaction.getTime()) / 1000;
    temp.totalReaction += (temp.totalReaction + reactionTime);

    if(this.state.speakerPlayingSound == "blue") {
        temp.leftSpeakerPlay++;
    } else {
        temp.rightSpeakerPlay++;
    }

    if(userGuess == this.state.speakerPlayingSound) {
        temp.correctCount = temp.correctCount + 1;

        if(this.state.speakerPlayingSound == "blue") {
            temp.leftCorrect++;
        } else {
            temp.rightCorrect++;
        }
      this.setState({correctGuess:true});
      sounds.correctSound.play();
      resultString = "Correct! You chose the correct speaker";
    } else {
      this.setState({correctGuess:false});
      sounds.incorrectSound.play();
      resultString = "Incorrect! You chose the wrong speaker."
    }
    $("#playSound").removeClass("disabledbutton");
    temp.trialCount = temp.trialCount + 1;
    this.setState({speakerPlayingSound: sounds.pickRandomSide()});
    this.props.updateTest(temp);
    this.forceUpdate();
  }

  renderTest() {
    return (
      <div className = "m-t-2">
        {/*}<div className = ""><h3>Trial: {this.props.activeTest.trialCount}</h3></div>*/}

        {this.renderResultString()}
        <div className = "m-t-1">

        <figure style = {{display:"inline-block"}}>
          <img id = "blueButton" className = "disabledbutton btn btn-secondary btn-lg btn-outline-primary" src="images/blueSpeaker.png" height="150px" width="150px"
            value = "blue" onClick = {this.determineGuess.bind(this,"blue")}/>
          <figcaption>Left Speaker</figcaption>
        </figure>

          <figure style = {{display:"inline-block"}}>
            <img className = "btn btn-secondary m-l-1 m-r-1" src="images/userIcon.png" height="200px" width="200px" />
            <figcaption>You</figcaption>
          </figure>

          <figure style = {{display:"inline-block"}}>
            <img id = "redButton" className = "disabledbutton btn btn-secondary btn-lg btn-outline-danger" src="/static/images/redSpeaker.png" height="150px" width="150px"
              value = "red" onClick = {this.determineGuess.bind(this,"red")}/>
            <figcaption>Right Speaker</figcaption>
          </figure>

        </div>
        <div id = "playSound" className = ""><button onClick = {this.playSound.bind(this)} className = "btn btn-lg btn-primary">Play Sound</button></div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className = "text-md-center m-t-2">
          <h2 className = "text-md-center">Practice Time Remaining: <span style = {{color:"red"}}>{Moment.duration(this.props.activeTest.timeLeft, "seconds").format()}</span></h2> 
          {this.renderTest()}
          {/*}<div><button className = "btn btn-secondary btn-warning" onClick =
          {this.saveTestResults.bind(this, this.props.activeTest)}>End Test</button></div>*/}

          <Link to = "/mainmenu" onClick = {this.props.clearTest} className = "btn btn-danger m-t-2">Quit</Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    speakers: state.auth.mediaDevices,
    activeTest: state.activeTest.activeTest
  };
}

export default connect(mapStateToProps, actions)(TestInProgress);
