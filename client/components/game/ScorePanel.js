import React from 'react';
import { connect } from 'react-redux';

const ScorePanel = ({ status }) => (
  <div id="score-panel">
    <h2>Level: {status.level}</h2>
    <h2>Score: {status.score}/{status.targetScore}</h2>
    <h2>Health: {status.health}</h2>
  </div>
);

const mapState = state => ({
  status: state.gameStatus
});

export default connect(mapState)(ScorePanel);
