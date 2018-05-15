import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Routes, Navbar } from './nav';
import { Load } from './load';
import { getDimensions } from '../store/motionDetection';
import { getRooms } from '../store/rooms';
import { bufferSound } from '../store/sounds';
import { playSound } from '../utils';

const Main = (props) => {
  const { port } = props.sounds;
  console.log(props);
  return (
    <div id="main">
      <Navbar />
      <Routes />
      { playSound(port, true, 0.1) }
    </div>
  );
};

const mapDispatch = dispatch => ({
  load: async () => {
    await dispatch(getRooms());
    await Promise.all([
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
