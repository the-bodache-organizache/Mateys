class MotionDetection {

  drawVideo = (video, contextSource) => {
    contextSource.drawImage(video, 0, 0, video.width, video.height);
  }

  blend = (width, height, contextSource, contextBlended, lastImageData) => {
    const { differenceAccuracy } = this;
    const sourceData = contextSource.getImageData(0, 0, width, height);

    if (!lastImageData) lastImageData = sourceData;

    let blendedData = contextSource.createImage(width, height);

    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);



    lastImageData = sourceData;

    return lastImageData;
  }

  differenceAccuracy = (target, data1, data2) => {
    const { fastAbs } = this;
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
  }

  fastAbs = (value) => {
    return (value ^ (value >> 31)) - (value >> 31);
  }

  threshold = (value) => {
    return value > 0x15 ? 0xff : 0;
  }
}

export default new MotionDetection();
