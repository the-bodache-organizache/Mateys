const MY_ROOM = 'MY_ROOM';
const LEAVE_ROOM = 'LEAVE_ROOM';
const initialState = {};

export const myRoom = room => ({
  type: MY_ROOM,
  room
});

export const leaveRoom = () => ({
  type: LEAVE_ROOM,
  room: {}
});

export default (state = initialState, action) => {
  switch (action.type) {
    case MY_ROOM:
      return action.room;
    case LEAVE_ROOM:
      return action.room;
    default:
      return state;
  }
}