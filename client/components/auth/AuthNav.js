import React from 'react'
import {Link, Route, withRouter} from 'react-router-dom'
import {compose} from 'redux'
import {connect} from 'react-redux'
import AuthPrompt from './AuthPrompt'

const mapState = (state, {
  adminsOnly = false,
  guestsOnly = false,
  ...rest
}) => {
  return {
    allowed: adminsOnly
      ? state.user.isAdmin
      : guestsOnly
        ? !state.user.id
        : !!state.user.id,
    ...rest
  }
}

export const AuthLink = ({allowed, to, children}) => {
  return allowed ? <Link to={to}>{children}</Link> : null
}

export const AuthRoute = ({allowed, ...rest}) => {
  return allowed
    ? <Route {...rest} />
    : <Route {...rest} component={AuthPrompt} />
}

export const ConnectedAuthLink = compose(
  withRouter,
  connect(mapState)
)(AuthLink)
export const ConnectedAuthRoute = compose(
  withRouter,
  connect(mapState)
)(AuthRoute)
