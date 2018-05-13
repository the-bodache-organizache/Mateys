import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Room from './Room';
import { myRoom } from '../../store/myRoom';

class Rooms extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (room) {
    this.props.myRoom(room);
    console.log(room);
  }

  render () {
    const { rooms } = this.props;
    return (
      <div id="score-panel">
        <h1>Join Room:</h1>
        <h3> List of Rooms here </h3>
        {
          rooms.map(room => (
            <Link key={room.id} to={`/game/${room.name}`} onClick={() => this.handleClick(room)}>
              <Room room={room} />
            </Link>
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms
});

const mapDispatchToProps = dispatch => ({
  myRoom: (room) => dispatch(myRoom(room))
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
