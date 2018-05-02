import React from 'react'
import {connect} from 'react-redux'

const Home = ({email}) => {
  return <h1>Welcome Home, {email}!</h1>
}

const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(Home)
