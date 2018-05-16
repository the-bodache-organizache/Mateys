import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getWidgets } from '../../store/widgets';
import { getCommand } from '../../store/commands';
import { setPlayerOne, setSocket } from '../../store/connection';
import { socketEvents } from '../../utils';
import { getGameStatus } from '../../store/game-status';
import { leaveRoom } from '../../store/myRoom';
import { playSound } from '../../utils';

class ConnectControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
    this.resetState = this.resetState.bind(this);
  }

  setListeners = socket => {
    const {
      SEND_WIDGETS,
      ISSUE_COMMAND,
      NEXT_LEVEL,
      GAME_OVER,
      MOVE_STATUS,
      RIGHT_MOVE,
      WRONG_MOVE
    } = socketEvents;
    const {
      levelup,
      gameover,
      correct,
      wrong
    } = this.props.sounds;

    socket.on(SEND_WIDGETS, widgets => {
      const newWidgets = new Array(6);
      newWidgets.fill(null);
      let index = 0;
      while (index < widgets.length) {
        const newIndex = Math.floor(Math.random() * 6);
        if (!newWidgets[newIndex]) {
          newWidgets[newIndex] = widgets[index];
          index++;
        }
      }
      this.props.getWidgets(newWidgets);
    });

    socket.on(ISSUE_COMMAND, command => {
      this.props.commandRef.current.classList.remove('fade');
      this.props.getCommand(command);
      setTimeout(() => {
        this.props.commandRef.current.classList.add('fade');
      }, 1);
    });

    socket.on(NEXT_LEVEL, payload => {
      playSound(levelup);
      this.props.getCommand(`Level ${payload.level}`);
    });

    socket.on(MOVE_STATUS, status => this.props.getGameStatus(status));
    socket.on(GAME_OVER, () => {this.resetState()});
    socket.on(RIGHT_MOVE, () => playSound(correct));
    socket.on(WRONG_MOVE, () => playSound(wrong));
  };

  resetState() {
    //resetting the local state in store to pregame settings
    playSound(this.props.sounds.gameover);
    this.props.getCommand('Game Over');
    const resetWidgets = new Array(6);
    resetWidgets.fill(null);
    this.props.getWidgets(resetWidgets);
    setTimeout(() => {
      this.props.getGameStatus({health: 10, score: 0, level: 1});
      this.props.getCommand('');
      this.props.history.push('/port');
      this.props.leaveRoom();
    }, 5000);
  }

  render() {
    const { REQUEST_GAME_START } = socketEvents;
    const { isConnected, isPlayerOne, setSocket, myRoom } = this.props;
    const { setListeners } = this;
    const { ready } = this.state;
    const button =
      isConnected && !ready ? (
        <div id="start-game">
          <button
            type="button"
            onClick={() => {
              const { webSocket } = easyrtc;
              setSocket(webSocket);
              setListeners(webSocket);
              this.setState({ ready: true });
              webSocket.emit(REQUEST_GAME_START, {socketEvents, myRoom});
            }}
          >
            Set sail!
          </button>
        </div>
      ) : (
        undefined
      );
    return (
      <div id="connectControls">
        <div id="iam">Not yet connected...</div>
        <br />
        <strong>Connected users:</strong>
        <div id="otherClients" />
        {button}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getWidgets: widgets => dispatch(getWidgets(widgets)),
  getCommand: command => dispatch(getCommand(command)),
  setPlayerOne: isPlayerOne => dispatch(setPlayerOne(isPlayerOne)),
  setSocket: socket => dispatch(setSocket(socket)),
  getGameStatus: status => dispatch(getGameStatus(status)),
  leaveRoom: () => dispatch(leaveRoom())
});

const mapStateToProps = (state, ownProps) => ({
  isConnected: state.connection.connected,
  isPlayerOne: state.connection.isPlayerOne,
  socket: state.connection.socket,
  status: state.status,
  myRoom: state.myRoom,
  history: ownProps.history,
  sounds: state.sounds
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectControls));
