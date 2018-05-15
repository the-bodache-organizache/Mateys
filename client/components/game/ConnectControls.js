import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getWidgets } from '../../store/widgets';
import { getCommand } from '../../store/commands';
import { setPlayerOne, setSocket } from '../../store/connection';
import { socketEvents } from '../../utils';
import { getGameStatus } from '../../store/game-status';
import { leaveRoom } from '../../store/myRoom';

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
      MOVE_STATUS
    } = socketEvents;
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
      this.props.getCommand(command);
    });
    socket.on(NEXT_LEVEL, payload => this.props.getCommand(`Level ${payload.level}`));
    socket.on(MOVE_STATUS, status => this.props.getGameStatus(status));
    socket.on(GAME_OVER, () => {this.resetState()});
  };

  resetState() {
    //resetting the local state in store to pregame settings
    this.props.getCommand('Game Over');
    this.props.leaveRoom();
    setTimeout(() => {
      this.props.getGameStatus({health: 10, score: 0, level: 1});
      this.props.getCommand('');
      const resetWidgets = new Array(6);
      resetWidgets.fill(null);
      this.props.getWidgets(resetWidgets);
      this.props.history.push('/port');
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
  history: ownProps.history
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectControls));
