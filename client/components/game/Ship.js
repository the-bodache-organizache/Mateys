import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Ship = (props) => {
  const { myRoom } = props;
  return myRoom.name;
}

const mapStateToProps = (state, ownProps) => {
  // const { roomId } = ownProps.match.params;
  return {
    myRoom: state.myRoom
  }
}

export default withRouter(connect(mapStateToProps)(Ship));

