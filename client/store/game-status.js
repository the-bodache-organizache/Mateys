const GET_GAME_STATUS = 'GET_GAME_STATUS';
const initialState = {health: 10, score: 0, level: 1};

export const getGameStatus = status => ({
  type: GET_GAME_STATUS,
  status
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GAME_STATUS:
      return action.status;
    default:
      return state;
  }
}

