const drawVideo = (width, height, video, contextSource) => {
  contextSource.drawImage(video, 0, 0, width, height);
}

export default drawVideo;
