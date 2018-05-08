const drawVideo = (video, contextSource) => {
  contextSource.drawImage(video, 0, 0, video.width, video.height);
}

export default drawVideo;
