import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getWidgets } from '../../store/widgets';
import { getCommand } from '../../store/commands';
import { setPlayerOne, setSocket } from '../../store/connection';
import { socketEvents } from '../../../scripts';
import { getGameStatus } from '../../store/game-status';

class ConnectControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
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
    socket.on(GAME_OVER, () => this.props.getCommand('Game Over'));
    socket.on(MOVE_STATUS, status => this.props.getGameStatus(status));
  };

  render() {
    const { REQUEST_GAME_START } = socketEvents;
    const { isConnected, isPlayerOne, setSocket } = this.props;
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
              webSocket.emit(REQUEST_GAME_START);
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
  getGameStatus: status => dispatch(getGameStatus(status))
});

const mapStateToProps = state => ({
  isConnected: state.connection.connected,
  isPlayerOne: state.connection.isPlayerOne,
  socket: state.connection.socket,
  status: state.status
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectControls);
