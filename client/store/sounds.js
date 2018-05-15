import { loadSound } from '../utils';

const GOT_SOUNDS = 'GOT_SOUNDS';
const initialState = {}

const gotSound = sound => ({
  type: GOT_SOUNDS,
  sound
});

export const bufferSound = sound => {
  return async (dispatch) => {
    const soundName = sound.split('/')[1].slice(0, -4);
    const buffer = await loadSound(sound);
    dispatch(gotSound({[soundName]: buffer}));
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_SOUNDS:
      return {
        ...state,
        ...action.sound
      };
    default:
      return state;
  }
}
