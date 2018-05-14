import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Ship = (props) => {
  const { roomId } = props;
  return roomId;
}

const mapStateToProps = (state, ownProps) => {
  const { roomId } = ownProps.match.params;
  return {
    roomId
  }
}

export default withRouter(connect(mapStateToProps)(Ship));

