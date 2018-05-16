import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Routes, Navbar } from './nav';
import { Load } from './load';
import { getDimensions } from '../store/motionDetection';
import { getRooms } from '../store/rooms';
import { bufferSound } from '../store/sounds';
import { playSound } from '../utils';
import { setSocket } from '../store/connection';

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.socket = io(window.location.origin);
    this.props.setSocket(this.socket);
    this.socket.on('RERENDER_PAGE', () => {
      this.props.getRooms();
    });

  }
  render () {
    const { port } = this.props.sounds;
    return (
      <div id="main">
        <Navbar />
        <Routes />
        { playSound(port, true, 0.1) }
      </div>
    );
  }
};

const mapDispatch = dispatch => ({
  setSocket: socket => dispatch(setSocket(socket)),
  getRooms: () => dispatch(getRooms()),
  load: async () => {
    await Promise.all([
      dispatch(getRooms()),
      dispatch(bufferSound('audio/click.mp3')),
      dispatch(bufferSound('audio/correct.wav')),
      dispatch(bufferSound('audio/gameover.wav')),
      dispatch(bufferSound('audio/levelup.mp3')),
      dispatch(bufferSound('audio/port.mp3')),
      dispatch(bufferSound('audio/wrong.wav'))
    ])
  },
  getDimensions: (width, height) => dispatch(getDimensions(width, height))
});

const mapStateToProps = state => ({
  sounds: state.sounds
});


export default compose(withRouter, connect(mapStateToProps, mapDispatch), Load)(Main);
