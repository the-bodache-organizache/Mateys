import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { NoMatch } from '../nav'
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
  checkAreas,
  socketEvents
} from '../../utils/';
import Ship from './Ship';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.canvasSourceRef = React.createRef();
    this.canvasBlendedRef = React.createRef();
    this.videoRef = React.createRef();
    this.cleanUp = this.cleanUp.bind(this);
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
    drawVideo(+width, +height, video, contextSource);
    blend(+width, +height, contextSource, contextBlended, lastImageData);
    checkAreas(+width, +height, contextBlended, widgets, easyrtc.webSocket);
    this.interval = requestAnimationFrame(this.detectMotion);
  };

  componentWillMount() {

  }

  async componentDidMount() {
    window.addEventListener('beforeunload', this.cleanUp);
    const { ENTER_ROOM } = socketEvents;
    const { canvasSourceRef, canvasBlendedRef, videoRef } = this;
    const {
      width,
      height,
      getContextSource,
      getContextBlended,
      getVideo,
      isConnected,
      myRoom,
    } = this.props;
    const roomNoSpaces = myRoom.name.split(' ').join('');
    await Promise.all([
      getContextSource(canvasSourceRef.current.getContext('2d')),
      getContextBlended(canvasBlendedRef.current.getContext('2d')),
      getVideo(videoRef.current)
    ]);
    await connectToEasyRTC(+width, +height, roomNoSpaces);
    isConnected(true);
    this.detectMotion();
    console.log(this.props.socket);
    this.props.socket.emit(ENTER_ROOM, myRoom.name);
  }

  componentWillUnmount() {
    this.cleanUp();
    window.removeEventListener('beforeunload', this.cleanUp);
  }

  cleanUp () {
    const socket = this.props.socket || easyrtc.webSocket;
    if (socket) {
      const { DISCONNECT, EDIT_ROOM } = socketEvents;
      socket.emit(EDIT_ROOM);
      socket.emit(DISCONNECT);
      socket.disconnect();
      easyrtc.disconnect();
    }
    cancelAnimationFrame(this.interval);
  }

  render() {
    const { canvasSourceRef, canvasBlendedRef, videoRef } = this;
    const { myRoom } = this.props;
    return myRoom.name ? (
      <div id="game" className="main-panel">
        <div id="ship-name">
          <Ship />
        </div>
        <div id="game-area">
          <SelfVideo
            canvasSourceRef={canvasSourceRef}
            canvasBlendedRef={canvasBlendedRef}
            videoRef={videoRef}
          />
          <div id="bottom-panel" className="sub-panel">
            <CallerVideo />
            <ConnectControls />
            <ScorePanel />
          </div>
        </div>
      </div>
    ) : (
      <NoMatch />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getContextSource: contextSource => dispatch(getContextSource(contextSource)),
  getContextBlended: contextBlended => dispatch(getContextBlended(contextBlended)),
  getVideo: video => dispatch(getVideo(video)),
  isConnected: connected => dispatch(isConnected(connected))
});

const mapStateToProps = (state, ownProps) => {
  // const roomId = ownProps.match.params.roomId;
  return {
    widgets: state.widgets,
    width: state.motionDetection.dimensions.width,
    height: state.motionDetection.dimensions.height,
    contextSource: state.motionDetection.contextSource,
    contextBlended: state.motionDetection.contextBlended,
    video: state.motionDetection.video,
    lastImageData: state.motionDetection.lastImageData,
    socket: state.connection.socket,
    myRoom: state.myRoom
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameRoom));
