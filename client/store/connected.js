const CONNECTED = 'CONNECTED';
const SET_PLAYER_ONE = 'SET_PLAYER_ONE';

const initialState = {
  isConnected: false,
  isPlayerOne: false
};

export const connected = (isConnected) => ({
  type: CONNECTED,
  isConnected
});

export const setPlayerOne = (isPlayerOne) => ({
  type: SET_PLAYER_ONE,
  isPlayerOne
})

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTED:
      return {
        ...state,
        isConnected: action.isConnected
      }
    case SET_PLAYER_ONE:
      return {
        ...state,
        isPlayerOne: action.isPlayerOne
      }
    default:
      return state;
  }
}

