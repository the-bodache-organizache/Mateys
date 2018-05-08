import React from 'react';
import SelfVideo from './SelfVideo';
import ScorePanel from './ScorePanel';
import ConnectControls from './ConnectControls';
import CallerVideo from './CallerVideo';
import { connectToEasyRTC, motionDetection } from '../../../scripts/';

class GameRoom extends React.Component {
  constructor() {
    super();

    this.socket = io(window.location.origin);
    this.socket.emit('request game start');
    this.socket.on('the box was pressed!', payload => {
      console.log('the box was pressed!!!!');
    });
    this.socket.on('set sail', payload => {
      console.log('set sail!!!!!');
    });
    this.socket.on('notify player one', payload => {
      console.log('notify player one', payload);
      this.setState({ isPlayerOne: true });
    });

    this.width = `${Math.floor(window.innerWidth * 0.5)}`;
    this.height = `${Math.floor(window.innerHeight * 0.5)}`;

    this.state = {
      contextSource: null,
      contextBlended: null,
      isPlayerOne: false,
      lastImageData: {
        data: []
      },
      widgets: [
        null,
        null,
        { name: 'cannon', command: 'The cannon needs to be loaded!' },
        null,
        { name: 'poopDeck', command: 'Quickly, Swab the poop deck!' },
        null
      ]
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
    this.interval = requestAnimationFrame(this.update);
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
    for (let r = 0; r < 6; ++r) {
      let sx = 0,
        sy = 1 / 3 * r * height,
        sw = 50,
        sh = height * 0.3;
      if (r >= 1) {
        sy = 1 / 3 * r * height + height * 0.05;
      }
      if (r >= 3) {
        sx = width - 50;
        sy = 1 / 3 * (r - 3) * height;
      }
      if (r >= 4) {
        sy = 1 / 3 * (r - 3) * height + height * 0.05;
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
        let widget = this.state.widgets[r];
        if (widget) {
          console.log(widget.name);
          this.socket.emit('press box', widget);
        }
      }
    }
  };

  componentDidMount() {
    const { width, height } = this;
    connectToEasyRTC(+width, +height);
    this.update();
  }

  componentWillUnmount() {
    this.socket.disconnect();
    cancelAnimationFrame(this.interval);
    easyrtc.disconnect();
  }

  render() {
    const { width, height } = this;

    return (
      <div id="game">
        <SelfVideo width={width} height={height} />
        <div id="bottom-panel">
          <ScorePanel />
          <ConnectControls />
          <CallerVideo width={width} height={height} />
        </div>
      </div>
    );
  }
}

export default GameRoom;
