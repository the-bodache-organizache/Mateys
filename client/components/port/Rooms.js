import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Room from './Room';
import { getMyRoom } from '../../store/myRoom';
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


  handleClick (room) {
    this.props.getMyRoom(room);
  }

  render() {
    const { rooms } = this.props;
    const { click } = this.props.sounds;
    return (
      <div id="crew-list">

        {rooms.map(room => (
          <Link
            key={room.id}
            to="/game"
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
  getMyRoom: (room) => dispatch(getMyRoom(room)),
  getRooms: () => dispatch(getRooms())
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
