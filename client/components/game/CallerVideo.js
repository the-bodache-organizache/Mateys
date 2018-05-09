import React from 'react';
import { connect } from 'react-redux';

const CallerVideo = (props) => {
  const { width, height } = props;
  return (
    <div id="caller-video-div">
      <video
        autoPlay="autoplay"
        id="callerVideo"
        width={+width / 4}
        height={+height / 4}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height
});

export default connect(mapStateToProps)(CallerVideo);
