import React from 'react';
import { connect } from 'react-redux';
import SelfVideo from './SelfVideo';
import ScorePanel from './ScorePanel';
import ConnectControls from './ConnectControls';
import CallerVideo from './CallerVideo';
import {
  getContextSource,
  getContextBlended,
  getVideo
} from '../../store/motionDetection';
import { isConnected } from '../../store/connection';
import {
  connectToEasyRTC,
  drawVideo,
  blend,
  checkAreas
} from '../../../scripts/';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.canvasSourceRef = React.createRef();
    this.canvasBlendedRef = React.createRef();
    this.videoRef = React.createRef();
  }

  detectMotion = () => {
    const {
      width,
      height,
      contextSource,
      contextBlended,
      video,
      lastImageData,
      widgets,
      socket
    } = this.props;
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
      getVideo,
      isConnected
    } = this.props;
    await Promise.all([
      getContextSource(canvasSourceRef.current.getContext('2d')),
      getContextBlended(canvasBlendedRef.current.getContext('2d')),
      getVideo(videoRef.current)
    ]);
    await connectToEasyRTC(+width, +height);
    isConnected(true);
    // this.detectMotion();
  }

  async componentWillUnmount() {
    const { socket } = this.props;
    socket.emit('disconnect');
    socket.disconnect();
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
  getContextSource: contextSource => dispatch(getContextSource(contextSource)),
  getContextBlended: contextBlended => dispatch(getContextBlended(contextBlended)),
  getVideo: video => dispatch(getVideo(video)),
  isConnected: connected => dispatch(isConnected(connected))
});

const mapStateToProps = state => ({
  widgets: state.widgets,
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height,
  contextSource: state.motionDetection.contextSource,
  contextBlended: state.motionDetection.contextBlended,
  video: state.motionDetection.video,
  lastImageData: state.motionDetection.lastImageData,
  socket: state.connection.socket
});

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);

