const GOT_ROOMS = 'GOT_ROOMS';
const CREATED_ROOM = 'CREATED_ROOM';
const initialState = [];

export const gotRooms = rooms => ({
  type: GOT_ROOMS,
  rooms
});

export const createdRoom = room => ({
  type: CREATED_ROOM,
  room
});

export const getRooms = () => {
  return async (dispatch, _, {axios}) => {
    await axios.get('/api/rooms')
      .then(res => res.data)
      .then(rooms => dispatch(gotRooms(rooms)))
      .catch(console.error.bind(console));
  }
}

export const createRoom = (room) => {
  return async (dispatch, _, {axios}) => {
    await axios.post('/api/rooms', room)
      .then(res => res.data)
      .then(room => dispatch(createdRoom(room)))
      .catch(console.error.bind(console));
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_ROOMS:
      return action.rooms;
    case CREATED_ROOM:
      return [...state, action.room];
    default:
      return state;
  }
}
