import React from 'react';

const Room = (props) => {
  const { room } = props;
  return (
    <div id="room-link">
      <h1>{room.name}</h1>
    </div>
  )
}

export default Room;
