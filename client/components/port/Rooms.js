import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Room from './Room';
import { getMyRoom } from '../../store/myRoom';
import { getRooms } from '../../store/rooms';
import { playSound } from '../../utils';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.requestRoomEnter = this.requestRoomEnter.bind(this);
    this.props.socket.on('RERENDER_PAGE', () => {
      this.props.getRooms();
    });
  }


  handleClick (room) {
    const { getMyRoom } = this.props;
    getMyRoom(room);
    this.requestRoomEnter(room);
  }

  requestRoomEnter (room) {
    const { socket, history } = this.props;
    socket.emit('REQUEST_ROOM_ENTER', room);
    socket.on('ROOM_ENTER_RESPONSE', response => {
      if (response) {
        this.props.history.push('/game');
      } else {
        alert("TOO MANY PEOPLE YOU IDIOT!!!!!");
      }
      socket.removeAllListeners('ROOM_ENTER_RESPONSE');
    });

  }

  render() {
    const { rooms } = this.props;
    const { click } = this.props.sounds;
    return (
      <div id="crew-list">

        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => this.handleClick(room)}
            onMouseEnter={() => {
              playSound(click);
            }}
          >
            <Room room={room} />
          </button>
        ))}
      </div>
    );
  }
}

{/* <div id="crew-list">

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
); */}

const mapStateToProps = (state, ownProps) => ({
  rooms: state.rooms,
  sounds: state.sounds,
  history: ownProps.history
});

const mapDispatchToProps = dispatch => ({
  getMyRoom: (room) => dispatch(getMyRoom(room)),
  getRooms: () => dispatch(getRooms())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Rooms));
