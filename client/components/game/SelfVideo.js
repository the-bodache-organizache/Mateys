import React, { Component } from 'react';
import Widget from './Widget';

const SelfVideo = props => {
  const { width, height } = props;
  const container = { width: +width };

  return (
    <div id="self-video-div" style={container}>
      <video
        autoPlay="autoplay"
        className="easyrtcMirror"
        id="selfVideo"
        muted="muted"
        volume="0"
        width={width}
        height={height}
      />
      <canvas id="canvas-source" width={width} height={height} />
      <canvas id="canvas-blended" width={width} height={height} />
      <div id="widgets-div" style={container}>
        <Widget id="right-widgets" width={width} height={height} add={0} />
        <Widget id="left-widgets" width={width} height={height} add={3} />
      </div>
    </div>
  );
};

export default SelfVideo;
