import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getWidgets } from '../../store/widgets';
import { getCommand } from '../../store/commands';
import { setPlayerOne, setSocket } from '../../store/connection';
import { connectToEasyRTC } from '../../../scripts';

class ConnectControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
  }

  setListeners = socket => {
    socket.on('send player widgets', widgets => {
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
    socket.on('issue command', command => {
      this.props.getCommand(command);
    });
    socket.on('move status', payload => console.log(payload)); // this is probably where we save score to store so we can post in scoreboard
    socket.on('next level', () => this.props.getCommand('Next Level'));
    socket.on('game over', () => this.props.getCommand('Game Over'));
  };

  render() {
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
              webSocket.emit('request game start');
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
  setSocket: socket => dispatch(setSocket(socket))
});

const mapStateToProps = state => ({
  isConnected: state.connection.connected,
  isPlayerOne: state.connection.isPlayerOne,
  socket: state.connection.socket
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectControls);
