import React from 'react';

const Room = (props) => {
  const { room } = props;
  return (
    <div>
      <h2>{room.name}</h2>
      <h3>{room.occupancy}/2</h3>
    </div>
  )
}

export default Room;
