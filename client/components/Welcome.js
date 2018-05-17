import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { playSound } from '../utils';

const Welcome = ({ click, history }) => {
  return (
    <div id="welcome">
      <button
        className="main-panel"
        id="room-link"
        onClick={() => history.push('/port')}
        onMouseEnter={() => playSound(click)}
      >
        <h1>Port</h1>
      </button>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  sounds: state.sounds,
  history: ownProps.history
});

export default withRouter(connect(mapStateToProps)(Welcome));
