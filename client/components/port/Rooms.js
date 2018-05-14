import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Room from './Room';

const Rooms = (props) => {
  const { rooms } = props;
  return (
    <div id="crew-list">
      {
        rooms.map(room => (
          <Link key={room.id} to={`/game/${room.name}`}>
            <Room room={room}/>
          </Link>
        ))
      }
    </div>
  );
}

const mapStateToProps = state => ({
  rooms: state.rooms
});

export default connect(mapStateToProps)(Rooms);
