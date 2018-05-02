import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Load } from '../load';
import { fetchMembers } from '../../store/members';

const MembersList = ({ members }) => {
  return (
    <ul id="members">
      {members.map(member => <li key={member.id}>{member.email}</li>)}
    </ul>
  );
};

const mapState = state => {
  return {
    members: Object.values(state.members)
  };
};

const mapDispatch = dispatch => {
  return {
    load: () => dispatch(fetchMembers())
  };
};

export default compose(connect(mapState, mapDispatch), Load)(MembersList);
