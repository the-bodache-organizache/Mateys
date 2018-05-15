import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Room from './Room';
import { myRoom } from '../../store/myRoom';
import { getRooms } from '../../store/rooms';
import { playSound } from '../../utils';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.props.socket.on('RERENDER_PAGE', () => {
      this.props.getRooms();
    });
  }

  handleClick(room) {
    this.props.myRoom(room);
  }

  render() {
    const { rooms } = this.props;
    const { click } = this.props.sounds;
    return (
      <div id="crew-list">
        {rooms.map(room => (
          <Link
            key={room.id}
            to={`/game/${room.name}`}
            onClick={() => this.handleClick(room)}
            onMouseEnter={() => {
              playSound(click);
            }}
          >
            <Room room={room} />
          </Link>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  sounds: state.sounds
});

const mapDispatchToProps = dispatch => ({
  myRoom: room => dispatch(myRoom(room)),
  getRooms: () => dispatch(getRooms())
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
