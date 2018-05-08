import React from 'react';

const CallerVideo = (props) => {
  const { width, height } = props;
  return (
    <div id="caller-video-div">
      <video
        autoPlay="autoplay"
        id="callerVideo"
        width={width / 4}
        height={height / 4}
      />
    </div>
  );
}

export default CallerVideo;
