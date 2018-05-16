import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setSocket } from '../store/connection';
import { connect } from 'react-redux';
import { getRooms } from '../store/rooms';

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.socket = io(window.location.origin);
    this.props.setSocket(this.socket);
    this.socket.on('RERENDER_PAGE', () => {
      this.props.getRooms();
    });
  }
  
  render () {
    return (
      <div id="welcome">
        <Link to='/port'>
          <h1>Port</h1>
        </Link>
      </div>
    );
  }
  
};

const mapDispatchToProps = dispatch => ({
  setSocket: socket => dispatch(setSocket(socket)),
  getRooms: () => dispatch(getRooms()),
});

export default connect(null, mapDispatchToProps)(Welcome);
