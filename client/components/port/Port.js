import React from 'react';
import { connect } from 'react-redux';
import Rooms from './Rooms';
import { createRoom } from '../../store/rooms';
import { setSocket } from '../../store/connection';
import { socketEvents, shipNameGenerator, pirateDictionary } from '../../utils';

class Port extends React.Component {

  componentWillUnmount() {
    this.props.socket.disconnect();
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
    const { EDIT_ROOM } = socketEvents;
    const portFull = rooms.length >= 50;
    const { warning } = this;
    return (
      <div id="port" className="main-panel">
        <button
          type="button"
          className="button"
          onClick={async () => {
            const shipName = shipNameGenerator(pirateDictionary);
            await createRoom(shipName);
            this.props.socket.emit(EDIT_ROOM);
          }}
          disabled={portFull}
        >
          Start a crew
        </button>
        {warning(portFull)}
        <h1>Join Crew:</h1>
        <Rooms socket={this.props.socket}/>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: (room) => dispatch(createRoom(room)),
  setSocket: socket => dispatch(setSocket(socket))
});

const mapStateToProps = state => ({
  rooms: state.rooms,
  socket: state.connection.socket
});

export default connect(mapStateToProps, mapDispatchToProps)(Port);
