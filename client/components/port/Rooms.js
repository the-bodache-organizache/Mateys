import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Room from './Room';
import { myRoom } from '../../store/myRoom';
import { getRooms } from '../../store/rooms';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.props.socket.on('RERENDER_PAGE', () => {
      console.log('rerender the page!');
      this.props.getRooms();
    });
  }

  handleClick (room) {
    this.props.myRoom(room);
    console.log(room);
  }

  render () {
    const { rooms } = this.props;
    return (
      <div id="crew-list">
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
  myRoom: (room) => dispatch(myRoom(room)),
  getRooms: () => dispatch(getRooms())
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
