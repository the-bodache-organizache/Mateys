import React, { Component } from 'react';
import { connect } from 'react-redux';
import Widget from './Widget';

const SelfVideo = (props) => {
  const { width, height, canvasSourceRef, canvasBlendedRef, videoRef } = props;
  const container = { width: +width };
  return (
    <div id="self-video-div" style={container}>
      <video
        ref={videoRef}
        autoPlay="autoplay"
        className="easyrtcMirror"
        id="selfVideo"
        muted="muted"
        volume="0"
        width={width}
        height={height}
      />
      <canvas
        ref={canvasSourceRef}
        id="canvas-source"
        width={width}
        height={height}
      />
      <canvas
        ref={canvasBlendedRef}
        id="canvas-blended"
        width={width}
        height={height}
      />
      <div id="widgets-div" style={container}>
        <Widget id="right-widgets" add={0} />
        <Widget id="left-widgets" add={3} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height
});

export default connect(mapStateToProps)(SelfVideo);
