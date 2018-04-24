import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {Routes, Navbar} from './nav'
import {Load} from './load'
import {me} from '../store/user'

const Main = () => {
  return (
    <div id='main' className='fill-xy column'>
      <Navbar />
      <Routes />
    </div>
  )
}

const mapDispatch = dispatch => ({
  load: () => dispatch(me())
})

export default compose(
  withRouter,
  connect(null, mapDispatch),
  Load
)(Main)
