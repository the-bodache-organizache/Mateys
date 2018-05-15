const load = require('audio-loader');

const loadSound = async (src) => {
  return await load(src)
    .catch(error => console.error.bind(error));
}

export default loadSound;
