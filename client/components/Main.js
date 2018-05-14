import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Routes, Navbar } from './nav';
import { Load } from './load';
import { getDimensions } from '../store/motionDetection';
import { getRooms } from '../store/rooms';

const Main = () => {
  return (
    <div id="main">
      <Navbar />
      <Routes />
      <ReactAudioPlayer
        className="port-sounds"
        src="/audio/port.mp3"
        autoPlay
        loop
        volume={0.1}
      />
    </div>
  );
};

const mapDispatch = dispatch => ({
  load: async () => {
    await dispatch(getRooms());
  },
  getDimensions: (width, height) => dispatch(getDimensions(width, height))
});

export default compose(withRouter, connect(null, mapDispatch), Load)(Main);
