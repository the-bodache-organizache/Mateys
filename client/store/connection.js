const SET_CONNECTION = 'SET_CONNECTION';
const SET_PLAYER_ONE = 'SET_PLAYER_ONE';
const SET_SOCKET = 'SET_SOCKET';

const initialState = {
  isConnected: false,
  isPlayerOne: false,
  socket: null
};

export const isConnected = (connected) => ({
  type: SET_CONNECTION,
  connected
});

export const setPlayerOne = (isPlayerOne) => ({
  type: SET_PLAYER_ONE,
  isPlayerOne
});

export const setSocket = (socket) => ({
  type: SET_SOCKET,
  socket
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CONNECTION:
      return {
        ...state,
        connected: action.connected
      }
    case SET_PLAYER_ONE:
      return {
        ...state,
        isPlayerOne: action.isPlayerOne
      }
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket
      }
    default:
      return state;
  }
}

