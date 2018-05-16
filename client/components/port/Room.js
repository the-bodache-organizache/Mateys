import React from 'react';

const Room = (props) => {
  const { room } = props;
  return (
    <div id="room-link" className="sub-panel">
      <h1>{room.name}</h1>
      <br />
      <h3>{room.occupancy}/2</h3>
    </div>
  )
}

export default Room;
