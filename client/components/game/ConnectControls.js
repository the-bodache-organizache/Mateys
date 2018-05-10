import React from 'react';
import { connect } from 'react-redux';

const ConnectControls = (props) => {
  const button = (props.isConnected && props.isPlayerOne) ?
    ( <div id="start-game">
        <button>Start game</button>
      </div>
    ) : undefined;
  return (
  <div id="connectControls">
    <div id="iam">Not yet connected...</div>
    <br />
    <strong>Connected users:</strong>
    <div id="otherClients" />
    { button }
  </div>
  )
};

const mapStateToProps = (state) => ({
  isConnected: state.connected.isConnected,
  isPlayerOne: state.connected.isPlayerOne
});

export default connect(mapStateToProps)(ConnectControls);
