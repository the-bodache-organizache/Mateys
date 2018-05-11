import React from 'react';
import { connect } from 'react-redux';
import Rooms from './Rooms';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(window.location.origin);
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.emit('disconnect');
    socket.disconnect();
  }

  render() {

    return (
      <div id="game">
        <button type="button" onClick={() => this.socket.emit('create room', this.socket.id)} />
        <Rooms />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
