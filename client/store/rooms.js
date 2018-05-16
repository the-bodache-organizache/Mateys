const GOT_ROOMS = 'GOT_ROOMS';
const CREATED_ROOM = 'CREATED_ROOM';
const UPDATE_ROOM = 'UPDATE_ROOM';
const DELETED_ROOM = 'DELETED_ROOM';

const initialState = [];

export const gotRooms = rooms => ({
  type: GOT_ROOMS,
  rooms
});

export const createdRoom = room => ({
  type: CREATED_ROOM,
  room
});


export const updatedRoom = room => ({
  type: UPDATE_ROOM,
  room
});

export const deletedRoom = room => ({
  type: DELETED_ROOM,
  room
});

export const getRooms = () => {
  return async (dispatch, _, {axios}) => {
    await axios.get('/api/rooms')
      .then(res => res.data)
      .then(rooms => dispatch(gotRooms(rooms)))
      .catch(console.error.bind(console));
  }
};

export const createRoom = (room) => {
  return async (dispatch, _, {axios}) => {
    await axios.post('/api/rooms', room)
      .then(res => res.data)
      .then(room => dispatch(createdRoom(room)))
      .catch(console.error.bind(console));
  }
};


export const updateRoom = room => {
  return async (dispatch, _, {axios}) => {
    await axios.put('api/rooms', room)
      .then(res => res.data)
      .then(room => dispatch(updatedRoom(room)))
      .catch(console.error.bind(console))
  }
};

export const deleteRoom = (room) => {
  console.log(room);
  return async (dispatch, _, {axios}) => {
    await axios.delete(`/api/rooms/${room.id}`)
      .then(() => dispatch(deletedRoom(room)))
      .catch(console.error.bind(console));
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_ROOMS:
      return action.rooms;
    case CREATED_ROOM:
      return [...state, action.room];
    case UPDATE_ROOM:
      return state.map(room => ((room.id !== action.room.id) ? room : action.room));
    case DELETED_ROOM:
      return state.filter(room => room.name !== action.room.name);
    default:
      return state;
  }
};
