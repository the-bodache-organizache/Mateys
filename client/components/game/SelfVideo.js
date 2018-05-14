import React, { Component } from 'react';
import { connect } from 'react-redux';
import WidgetColumn from './WidgetColumn';

const SelfVideo = props => {
  const {
    width,
    height,
    canvasSourceRef,
    canvasBlendedRef,
    videoRef,
    command
  } = props;
  const container = { width: +width };
  const commandDiv = { top: +height * 0.75 };
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
        <WidgetColumn id="right-widgets" add={0} />
        <WidgetColumn id="left-widgets" add={3} />
      </div>
      <div id="commands" style={commandDiv}>
        <p id="commandParagraph">{command}</p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height,
  command: state.commands
});

export default connect(mapStateToProps)(SelfVideo);
