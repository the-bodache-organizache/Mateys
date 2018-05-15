const play = require('audio-play');

const playSounds = (buffer, loop = false, volume = 1) => {
  play(buffer, {
    start: 0,
    end: buffer.duration,
    loop,
    volume
  });
}

export default playSounds;
