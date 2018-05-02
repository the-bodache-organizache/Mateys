import React, {Component} from 'react'

const AuthError = OtherComponent => class ErrorHandler extends Component {
  state = {
    error: false
  }

  handleSubmit = (evt) => {
    this.props.handleSubmit(evt)
      .catch(error => {
        this.setState({error: error.response.data})
      })
  }

  render () {
    return <OtherComponent {...this.props} {...this.state} handleSubmit={this.handleSubmit} />
  }
}

export default AuthError
