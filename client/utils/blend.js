import store from '../store';
import { getLastImageData } from '../store/motionDetection';
import differenceAccuracy from './differenceAccuracy';

const blend = (width, height, contextSource, contextBlended, lastImageData) => {
  const sourceData = contextSource.getImageData(0, 0, width, height);
  let blendedData = contextSource.createImageData(width, height);

  if (!lastImageData) lastImageData = sourceData;
  differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
  contextBlended.putImageData(blendedData, 0, 0);
  lastImageData = sourceData;
  store.dispatch(getLastImageData(lastImageData));
}

export default blend;
