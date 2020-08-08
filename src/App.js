import React from 'react';
import './App.css';

export class Pomodoro extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      session: true,
      timeLeft: 1500,
      paused: true
    }
    this.progressBar = this.progressBar.bind(this);
    this.countdown = this.countdown.bind(this);
    this.alarm = React.createRef();
  }

  handleBreak(arg) {
    if (arg == "increment" && this.state.breakLength < 60 && this.state.paused == true) {
      return(
        this.setState({
          breakLength: this.state.breakLength + 1
        })
      )
    }
    else if (arg == "decrement" && this.state.breakLength > 1 && this.state.paused == true) {
      return(
        this.setState({
          breakLength: this.state.breakLength - 1
        })
      )
    }
  }

  handleSession(arg) {
    if (arg == "increment" && this.state.sessionLength < 60 && this.state.paused == true) {
      return(
        this.setState({
          sessionLength: this.state.sessionLength + 1,
          timeLeft: (this.state.sessionLength + 1) * 60
        })
      )
    }
    else if (arg == "decrement" && this.state.sessionLength > 1 && this.state.paused == true) {
      return(
        this.setState({
          sessionLength: this.state.sessionLength - 1,
          timeLeft: (this.state.sessionLength - 1) * 60
        })
      )
    }
  }

  handleTimer(arg) {
    if (arg == "start") {
      this.countdown(arg);
      document.getElementById("reset").style.animation = "none"
      return (
        this.setState({
          paused: false
        })
      )
    }
    else if (arg == "stop") {
      this.countdown(arg);
      return (
        this.setState({
          paused: true
        })
      )
    }
    else {//for reseting clock
      document.getElementById("reset").style.animation = "spin 1s";
      clearInterval(this.timer);
      this.alarm.pause();
      this.alarm.currentTime = 0;
      return (
        this.setState({
          breakLength: 5,
          sessionLength: 25,
          session: true,
          timeLeft: 1500,
          paused: true
        })
      )
    }
  }

  countdown(command) {
    if (command == "start") {//start
      var self = this;
      this.timer = setInterval(function () {
        if (self.state.timeLeft == 0) {
          self.alarm.play();
          return (
            self.setState({
              session: !self.state.session,
              timeLeft: self.state.breakLength * 60
            })
          )
        }
        else {
          return (
            self.setState({
              timeLeft: self.state.timeLeft - 1
            })
          )
        }
      }, 1000)
    }
    else {//pause
      clearInterval(this.timer);
    }
  }

  progressBar() {

  }

  render() {
    return (
      <div id="clock-rim">
        <div id="time-progress-bar">
          <div id="clock-container">
            <h1 id="title">POMODORO CLOCK</h1>
            <div id="lengths-panel" className="row">
              <Break breakLength={this.state.breakLength} callback={this.handleBreak.bind(this)} />
              <Session sessionLength={this.state.sessionLength} callback={this.handleSession.bind(this)} />
            </div>
            <Timer
              session={this.state.session}
              paused={this.state.paused}
              timeLeft={this.state.timeLeft}
              callback={this.handleTimer.bind(this)}
            />
            <h6 id="author"><a href="https://github.com/blubbers122">by blubbers122</a></h6>
            <audio
              id="beep"
              preload="auto"
              src="http://soundbible.com/grab.php?id=2197&type=wav"
              ref={(audio) => {this.alarm = audio}}
            />
          </div>
        </div>
      </div>
    )
  }
}

const Break = props => {
  return (
    <div id="break-container">
      <p id="break-label">Break Length</p>
      <div id="break-row" className="row">
        <i id="break-decrement" onClick={() => props.callback("decrement")} className="fas fa-sort-down hvr-grow"></i>
        <h4 id="break-length">{props.breakLength}</h4>
        <i id="break-increment" onClick={() => props.callback("increment")} className="fas fa-sort-up hvr-grow"></i>
      </div>
    </div>
  )
}

const Session = props => {
  return (
    <div id="session-container">
      <p id="session-label">Session Length</p>
      <div id="session-row" className="row">
        <i id="session-decrement" onClick={() => props.callback("decrement")} className="fas fa-sort-down hvr-grow"></i>
        <h4 id="session-length">{props.sessionLength}</h4>
        <i id="session-increment" onClick={() => props.callback("increment")} className="fas fa-sort-up hvr-grow"></i>
      </div>
    </div>
  )
}

const Timer = props => {
  return (
    <div>
      <div id="timer-container">
        <h4 id="timer-label">{props.session ? "Session" : "Break"}</h4>
        <h1 id="time-left">{Math.floor(props.timeLeft / 60) < 10 ? "0" : ""}{Math.floor(props.timeLeft / 60)}:{props.timeLeft % 60 < 10 ? "0" : ""}{props.timeLeft % 60}</h1>
      </div>
      <div id="start-stop-reset-panel">
        { props.paused &&
        <i id="start_stop" onClick={() => props.callback("start")} className="fas fa-play hvr-grow"></i>
        }
        { !props.paused &&
        <i id="start_stop" onClick={() => props.callback("stop")} className="fas fa-pause hvr-grow"></i>
        }
        <i id="reset" onClick={() => props.callback("reset")} className="fas fa-sync-alt hvr-grow"></i>
      </div>
    </div>
  )
}
