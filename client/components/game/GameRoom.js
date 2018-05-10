import React from 'react';
import { connect } from 'react-redux';
import SelfVideo from './SelfVideo';
import ScorePanel from './ScorePanel';
import ConnectControls from './ConnectControls';
import CallerVideo from './CallerVideo';
import { getWidgets } from '../../store/widgets';
import { getCommand } from '../../store/commands';
import {
  getContextSource,
  getContextBlended,
  getVideo
} from '../../store/motionDetection';
import {
  connectToEasyRTC,
  drawVideo,
  blend,
  checkAreas
} from '../../../scripts/';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);

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
    this.socket.on('send player widgets', widgets => {
      //console.log('sent the widgets!', widgets);
      const newWidgets = new Array(6);
      newWidgets.fill(null);
      let index = 0;
      while (index < widgets.length) {
        const newIndex = Math.floor(Math.random() * 6);
        if (!newWidgets[newIndex]) {
          newWidgets[newIndex] = widgets[index];
          index++;
        }
      }
      this.props.getWidgets(newWidgets);
    });
    this.socket.on('issue command', command => {
      //console.log('issuing commands', command);
      this.props.getCommand(command);
    });

    this.socket.on('move status', payload => console.log(payload));

    this.canvasSourceRef = React.createRef();
    this.canvasBlendedRef = React.createRef();
    this.videoRef = React.createRef();

    this.state = {
      isPlayerOne: false,
    };
  }

  detectMotion = () => {
    const {
      width,
      height,
      contextSource,
      contextBlended,
      video,
      lastImageData,
      widgets
    } = this.props;
    const { socket } = this;
    drawVideo(+width, +height, video, contextSource);
    blend(+width, +height, contextSource, contextBlended, lastImageData);
    checkAreas(+width, +height, contextBlended, widgets, socket);
    this.interval = requestAnimationFrame(this.detectMotion);
  };

  async componentDidMount() {
    const { canvasSourceRef, canvasBlendedRef, videoRef } = this;
    const {
      width,
      height,
      getContextSource,
      getContextBlended,
      getVideo
    } = this.props;
    await Promise.all([
      getContextSource(canvasSourceRef.current.getContext('2d')),
      getContextBlended(canvasBlendedRef.current.getContext('2d')),
      getVideo(videoRef.current)
    ]);
    connectToEasyRTC(+width, +height);
    this.detectMotion();
  }

  async componentWillUnmount() {
    this.socket.emit('disconnect');
    this.socket.disconnect();
    cancelAnimationFrame(this.interval);
    await easyrtc.disconnect();
  }

  render() {
    const { canvasSourceRef, canvasBlendedRef, videoRef } = this;
    return (
      <div id="game">
        <SelfVideo
          canvasSourceRef={canvasSourceRef}
          canvasBlendedRef={canvasBlendedRef}
          videoRef={videoRef}
        />
        <div id="bottom-panel">
          <ScorePanel />
          <ConnectControls />
          <CallerVideo />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getWidgets: widgets => dispatch(getWidgets(widgets)),
  getCommand: command => dispatch(getCommand(command)),
  getContextSource: contextSource => dispatch(getContextSource(contextSource)),
  getContextBlended: contextBlended => dispatch(getContextBlended(contextBlended)),
  getVideo: video => dispatch(getVideo(video))
});

const mapStateToProps = state => ({
  widgets: state.widgets,
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height,
  contextSource: state.motionDetection.contextSource,
  contextBlended: state.motionDetection.contextBlended,
  video: state.motionDetection.video,
  lastImageData: state.motionDetection.lastImageData
});

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);

