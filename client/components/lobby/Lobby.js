import React from 'react';
import { connect } from 'react-redux';
import Rooms from './Rooms';
import { createRoom, getRooms } from '../../store/rooms';
import { socketEvents } from '../../../scripts';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(window.location.origin);
  }

  componentWillMount() {
    this.socket.emit('SEND_EVENTS', socketEvents);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    const { createRoom } = this.props;
    const { CREATE_ROOM } = socketEvents;
    return (
      <div id="game">
        <button
          type="button"
          onClick={() => {
            const { id } = this.socket;
            createRoom(id);
            this.socket.emit(CREATE_ROOM);
          }
        }>Start a crew
        </button>
        <Rooms />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: (room) => dispatch(createRoom(room)),
  getRooms: () => dispatch(getRooms())
});

export default connect(null, mapDispatchToProps)(Lobby);
