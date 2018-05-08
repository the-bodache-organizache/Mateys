import React, { Component } from 'react';
import Widget from './Widget';

const SelfVideo = props => {
  const { width, height } = props;
  const container = { width };
  const rightWidgets = { right: +width - 75 };
  const leftWidgets = { right: 0 };

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
      <div id="right-widgets" style={rightWidgets}>
        <Widget width={width} height={height} />
      </div>
      <div id="left-widgets" style={leftWidgets}>
        <Widget width={width} height={height} />
      </div>
    </div>
  );
};

export default SelfVideo;
