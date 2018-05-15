import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Room from './Room';
import { myRoom } from '../../store/myRoom';
import { getRooms } from '../../store/rooms';
const play = require('audio-play');
const load = require('audio-loader');

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.props.socket.on('RERENDER_PAGE', () => {
      console.log('rerender the page!');
      this.props.getRooms();
    });
    this.audioRef = React.createRef();
    this.buffer = null;
    this.playSound = this.playSound.bind(this);
    this.loadSounds = this.loadSounds.bind(this);
  }

  async loadSounds() {
    this.buffer = await load('audio/click.mp3')
      .catch(error => console.error.bind(error));
  }

  async componentDidMount() {
    await this.loadSounds();
  }

  playSound(buffer) {
    play(buffer, {
      start: 0,
      end: buffer.duration
    });
  }

  handleClick(room) {
    this.props.myRoom(room);
    console.log(room);
  }

  render() {
    const { rooms } = this.props;
    const { audioRef } = this;
    console.log(this.buffer);
    return (
      <div id="crew-list">
        {/* <audio ref={audioRef}>
          <source src="audio/click.mp3" />
        </audio> */}
        {rooms.map(room => (
          <Link
            key={room.id}
            to={`/game/${room.name}`}
            onClick={() => this.handleClick(room)}
            onMouseEnter={() => {
              this.playSound(this.buffer);
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
  rooms: state.rooms
});

const mapDispatchToProps = dispatch => ({
  myRoom: room => dispatch(myRoom(room)),
  getRooms: () => dispatch(getRooms())
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
