import fastAbs from './fastAbs';
import threshold from './threshold';

const differenceAccuracy = (target, data1, data2) => {
  if (data1.length != data2.length) return null;
  let i = 0;
  while (i < data1.length * 0.25) {
    let average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
    let average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
    let diff = threshold(fastAbs(average1 - average2));
    target[4 * i] = diff;
    target[4 * i + 1] = diff;
    target[4 * i + 2] = diff;
    target[4 * i + 3] = 0xff;
    ++i;
  }
}

export default differenceAccuracy;
