import AuthForm from './AuthForm'
import {connect} from 'react-redux'
import {auth} from '../../store/user'
import authError from './authError'

const mapStateLogin = (state) => {
  return {
    type: 'Login'
  }
}

const mapStateSignup = (state) => {
  return {
    type: 'Sign Up'
  }
}

const mapDispatchLogin = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const email = evt.target.email.value
      const password = evt.target.password.value
      return dispatch(auth({email, password}, 'put'))
    }
  }
}

const mapDispatchSignup = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const email = evt.target.email.value
      const password = evt.target.password.value
      return dispatch(auth({email, password}, 'post'))
    }
  }
}

export const Login = connect(mapStateLogin, mapDispatchLogin)(authError(AuthForm))
export const Signup = connect(mapStateSignup, mapDispatchSignup)(authError(AuthForm))
