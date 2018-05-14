import React from 'react';
import { connect } from 'react-redux';
import Rooms from './Rooms';
import { createRoom, getRooms } from '../../store/rooms';
import { socketEvents, shipNameGenerator, pirateDictionary } from '../../../scripts';

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

  warning(portFull) {
    if (portFull) {
      return (
       <span className="port-full">Port is full! Pick a crew.</span>
      );
    }
  }

  render() {
    const { createRoom, rooms } = this.props;
    const { CREATE_ROOM } = socketEvents;
    const portFull = rooms.length >= 10;
    const { warning } = this;
    return (
      <div id="port" className="main-panel">
        <button
          type="button"
          onClick={() => {
            const shipName = shipNameGenerator(pirateDictionary);
            createRoom(shipName);
            this.socket.emit(CREATE_ROOM);
          }}
          disabled={portFull}
        >
          Start a crew
        </button>
        {warning(portFull)}
        <h1>Join Crew:</h1>
        <Rooms />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: (room) => dispatch(createRoom(room)),
  getRooms: () => dispatch(getRooms())
});

const mapStateToProps = state => ({
  rooms: state.rooms
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
