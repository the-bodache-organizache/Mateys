import React from 'react';
import { connectToEasyRTC } from '../../../scripts/';

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

class MotionDetection extends React.Component {
  constructor() {
    super();
    this.socket = io(window.location.origin);
    this.socket.on('the box was pressed!', (payload) => {
      console.log('the box was pressed!!!!');
    });
    this.canvasSource = (
      <canvas id="canvas-source" width="640" height="480" />
    );
    this.canvasBlended = (
      <canvas id="canvas-blended" width="640" height="480" />
    );
    this.video = (
      <video
        autoPlay="autoplay"
        className="easyrtcMirror"
        id="selfVideo"
        muted="muted"
        volume="0"
        height="480"
        width="640"
      />
    );
    this.testButton = (
      <button id="test-button"></button>
    )

    this.state = {
      contextSource: null,
      contextBlended: null,
      timeOut: 0,
      lastImageData: {
        data: []
      }
    }
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
    const { width, height } = this.canvasSource.props;
    const { contextSource, contextBlended, lastImageData } = this.state;
    const { differenceAccuracy } = this;
    let sourceData = contextSource.getImageData(0, 0, width, height);

		// create an image if the previous image doesn’t exist
		if (!lastImageData) this.setState({
      lastImageData: contextSource.getImageData(0, 0, width, height)
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


  fastAbs = (value) => {
		// funky bitwise, equal Math.abs
		return (value ^ (value >> 31)) - (value >> 31);
  };

  threshold = (value) => { // return white or black
		return (value > 0x15) ? 0xFF : 0;
  };

  difference = (target, data1, data2) => {
		// blend mode difference
		if (data1.length != data2.length) return null;
		let i = 0;
		while (i < (data1.length * 0.25)) {
			target[4*i] = data1[4*i] == 0 ? 0 : fastAbs(data1[4*i] - data2[4*i]);
			target[4*i+1] = data1[4*i+1] == 0 ? 0 : fastAbs(data1[4*i+1] - data2[4*i+1]);
			target[4*i+2] = data1[4*i+2] == 0 ? 0 : fastAbs(data1[4*i+2] - data2[4*i+2]);
			target[4*i+3] = 0xFF;
			++i;
		}
  };

  differenceAccuracy = (target, data1, data2) => {
		if (data1.length != data2.length) return null;
		let i = 0;
		while (i < (data1.length * 0.25)) {
			let average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
			let average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
			let diff = this.threshold(this.fastAbs(average1 - average2));
			target[4*i] = diff;
			target[4*i+1] = diff;
			target[4*i+2] = diff;
			target[4*i+3] = 0xFF;
			++i;
		}
  };

  checkAreas = () => {
    // loop over the note areas
    const video = document.getElementById('selfVideo');
		for (let r=0; r<1; ++r) {
			let blendedData = this.state.contextBlended.getImageData(1/8*r*video.width, 0, video.width/8, 100);
			let i = 0;
			let average = 0;
			// loop over the pixels
			while (i < (blendedData.data.length * 0.25)) {
				// make an average between the color channel
				average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
				++i;
			}
			// calculate an average between of the color values of the note area
			average = Math.round(average / (blendedData.data.length * 0.25));
			if (average > 10) {
        // console.log("BING", r)
        this.socket.emit('press box', {});
			}
		}
  }

  componentDidMount() {
    connectToEasyRTC();
    this.update();
  }

  render() {
    const { canvasSource, canvasBlended, testButton, video } = this;
    return (
      <div id="container">
        <div id="header">
          <a href="index.html">
            <img
              id="logo_easyrtc"
              src="images/easyrtc_logo.png"
              alt="EasyRTC"
            />
          </a>
        </div>
        <div id="main">
          <h2>The Demo</h2>
          <div id="demoContainer">
            <div id="connectControls">
              <div id="iam">Not yet connected...</div>
              <br />
              <strong>Connected users:</strong>
              <div id="otherClients" />
            </div>
            <div id="videos">
              <div id="self-video-div">
                { video }
                { canvasSource }
                { canvasBlended }
              </div>
                { testButton }
              <div style={{ position: 'relative', float: 'left' }}>
                <video
                  autoPlay="autoplay"
                  id="callerVideo"
                  height="480"
                  width="640"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MotionDetection;
