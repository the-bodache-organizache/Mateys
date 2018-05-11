import React from 'react';
import { connect } from 'react-redux';
import Rooms from './Rooms';
import { createRoom } from '../../store/rooms';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(window.location.origin);
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.emit('disconnect');
    socket.disconnect();
  }

  render() {
    const { createRoom } = this.props;
    return (
      <div id="game">
        <button
          type="button"
          onClick={() => {
            const { id } = this.socket;
            createRoom(id);
            this.socket.emit('create room');
          }
        }>Create Room
        </button>
        <Rooms />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: (room) => dispatch(createRoom(room))
});

export default connect(null, mapDispatchToProps)(Lobby);
