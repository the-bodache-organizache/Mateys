import React from 'react'
import {Routes, Navbar} from './nav'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
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

export default withRouter(connect(null, mapDispatch)(Load(Main)))
