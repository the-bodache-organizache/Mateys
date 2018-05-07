import React from 'react';
import { connectToEasyRTC } from '../../../scripts/';

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

class MotionDetection extends React.Component {
  constructor() {
    super();

    this.socket = io(window.location.origin);
    this.socket.emit('request game start');
    this.socket.on('the box was pressed!', payload => {
      console.log('the box was pressed!!!!');
    });
    this.socket.on('start game', payload => {
      console.log('set sail!!!!!');
    });
    this.width = `${Math.floor(window.innerWidth * 0.65)}`;
    this.height = `${Math.floor(window.innerHeight * 0.65)}`;
    this.canvasSource = (
      <canvas id="canvas-source" width={this.width} height={this.height} />
    );
    this.canvasBlended = (
      <canvas id="canvas-blended" width={this.width} height={this.height} />
    );

    this.selfVideo = (
      <video
        autoPlay="autoplay"
        className="easyrtcMirror"
        id="selfVideo"
        muted="muted"
        volume="0"
        width={this.width}
        height={this.height}
      />
    );
    this.callerVideo = (
      <video
        autoPlay="autoplay"
        id="callerVideo"
        width={this.width / 4}
        height={this.height / 4}
      />
    );

    this.testButton = <button id="test-button" />;

    this.state = {
      contextSource: null,
      contextBlended: null,
      timeOut: 0,
      lastImageData: {
        data: []
      }
    };
  }

  update = async () => {
    await this.setState({
      contextSource: document.getElementById('canvas-source').getContext('2d'),
      contextBlended: document.getElementById('canvas-blended').getContext('2d')
    });
    this.drawVideo();
    this.blend();
    this.checkAreas();
    window.requestAnimFrame(this.update);
  };

  drawVideo = () => {
    const video = document.getElementById('selfVideo');
    const { contextSource } = this.state;
    contextSource.drawImage(video, 0, 0, video.width, video.height);
  };

  blend = () => {
    const { width, height, differenceAccuracy } = this;
    const { contextSource, contextBlended, lastImageData } = this.state;
    let sourceData = contextSource.getImageData(0, 0, width, height);

    // create an image if the previous image doesn’t exist
    if (!lastImageData)
      this.setState({
        lastImageData: sourceData
      });

    // create a ImageData instance to receive the blended result
    let blendedData = contextSource.createImageData(width, height);

    //blend the 2 images
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    contextBlended.putImageData(blendedData, 0, 0);
    // store the current webcam image
    this.setState({
      lastImageData: sourceData
    });
  };

  fastAbs = value => {
    // funky bitwise, equal Math.abs
    return (value ^ (value >> 31)) - (value >> 31);
  };

  threshold = value => {
    // return white or black
    return value > 0x15 ? 0xff : 0;
  };

  difference = (target, data1, data2) => {
    // blend mode difference
    if (data1.length != data2.length) return null;
    let i = 0;
    while (i < data1.length * 0.25) {
      target[4 * i] =
        data1[4 * i] == 0 ? 0 : fastAbs(data1[4 * i] - data2[4 * i]);
      target[4 * i + 1] =
        data1[4 * i + 1] == 0
          ? 0
          : fastAbs(data1[4 * i + 1] - data2[4 * i + 1]);
      target[4 * i + 2] =
        data1[4 * i + 2] == 0
          ? 0
          : fastAbs(data1[4 * i + 2] - data2[4 * i + 2]);
      target[4 * i + 3] = 0xff;
      ++i;
    }
  };

  differenceAccuracy = (target, data1, data2) => {
    if (data1.length != data2.length) return null;
    let i = 0;
    while (i < data1.length * 0.25) {
      let average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
      let average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
      let diff = this.threshold(this.fastAbs(average1 - average2));
      target[4 * i] = diff;
      target[4 * i + 1] = diff;
      target[4 * i + 2] = diff;
      target[4 * i + 3] = 0xff;
      ++i;
    }
  };

  checkAreas = () => {
    // loop over the note areas
    let { width, height } = this;
    width = +width;
    height = +height;
    const { contextBlended } = this.state;
    for (let r = 0; r < 3; ++r) {
      let sx = 0,
          sy = 1 / 3 * r * height,
          sw = 50,
          sh = height * .3
      if (r >= 1) {
        sy = (1 / 3 * r * height) + (height * .05);
      }
      let blendedData = contextBlended.getImageData(sx, sy, sw, sh);
      let i = 0;
      let average = 0;
      // loop over the pixels
      while (i < blendedData.data.length * 0.25) {
        // make an average between the color channel
        average +=
          (blendedData.data[i * 4] +
            blendedData.data[i * 4 + 1] +
            blendedData.data[i * 4 + 2]) /
          3;
        ++i;
      }
      // calculate an average between of the color values of the note area
      average = Math.round(average / (blendedData.data.length * 0.25));
      if (average > 10) {
        console.log("BING", r)
        this.socket.emit('press box', {});
      }
    }
    for (let r = 3; r < 6; ++r) {
      let sx = width - 50,
          sy = 1 / 3 * (r - 3) * height,
          sw = 50,
          sh = height * .3
      if (r >= 4) {
        sy = (1 / 3 * (r - 3) * height) + (height * .05);
      }
      let blendedData = contextBlended.getImageData(sx, sy, sw, sh);
      let i = 0;
      let average = 0;
      // loop over the pixels
      while (i < blendedData.data.length * 0.25) {
        // make an average between the color channel
        average +=
          (blendedData.data[i * 4] +
            blendedData.data[i * 4 + 1] +
            blendedData.data[i * 4 + 2]) /
          3;
        ++i;
      }
      // calculate an average between of the color values of the note area
      average = Math.round(average / (blendedData.data.length * 0.25));
      if (average > 10) {
        console.log("BING", r)
        this.socket.emit('press box', {});
      }
    }
  };

  componentDidMount() {
    const { width, height } = this;
    connectToEasyRTC(+width, +height);
    this.update();
  }

  render() {
    const { canvasSource, canvasBlended, testButton, selfVideo, callerVideo } = this;
    return (
      <div id="container">
        <div id="videos">
          <div id="self-video-div">
            {selfVideo}
            {canvasSource}
            {canvasBlended}
          </div>
          <div id="bottom-panel">
            <div id="score-panel">
              <h1>Dummy score panel</h1>
              <h2>Score bar</h2>
              <h3>Timer?</h3>
            </div>
            <div id="connectControls">
              <div id="iam">Not yet connected...</div>
              <br />
              <strong>Connected users:</strong>
              <div id="otherClients" />
            </div>
            <div id="caller-video-div">
              {callerVideo}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MotionDetection;
