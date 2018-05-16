import store from '../store';
import { toggleReady } from '../store/widgets';
import socketEvents from './socketEvents';

const checkAreas = (width, height, contextBlended, widgets, socket) => {
  const { WIDGET_PRESSED } = socketEvents;
  for (let r = 0; r < 6; ++r) {
    let sx = 0,
      sy = 1 / 3 * r * height,
      sw = 50,
      sh = height * 0.3;
    if (r >= 1) {
      sy = 1 / 3 * r * height + height * 0.05;
    }
    if (r >= 3) {
      sx = width - 50;
      sy = 1 / 3 * (r - 3) * height;
    }
    if (r >= 4) {
      sy = 1 / 3 * (r - 3) * height + height * 0.05;
    }
    let blendedData = contextBlended.getImageData(sx, sy, sw, sh);
    let i = 0;
    let average = 0;
    // loop over the pixels
    while (i < blendedData.data.length * 0.25) {
      // make an average between the color channel
      average +=
        (blendedData.data[i * 4] +
          blendedData.data[i * 4 + 1] +
          blendedData.data[i * 4 + 2]) /
        3;
      ++i;
    }
    // calculate an average between of the color values of the note area
    average = Math.round(average / (blendedData.data.length * 0.25));
    if (average > 10) {
      let widget = widgets[r];
      if (widget) {
        if (widget.ready) {
          store.dispatch(toggleReady(widget));
          socket.emit(WIDGET_PRESSED, widget);
          setTimeout(() => {
            store.dispatch(toggleReady(widget));
          }, 2000);
        }
      }
    }
  }
};

export default checkAreas;
