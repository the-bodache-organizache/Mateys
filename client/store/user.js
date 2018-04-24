// ACTION TYPES
const GOT_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

// INITIAL STATE
const defaultUser = {}

// ACTION CREATORS
const gotUser = user => ({type: GOT_USER, user})
const removeUser = () => ({type: REMOVE_USER})

// THUNK CREATORS
export const me = () => {
  return async (dispatch, _, {axios}) => {
    const {data} = await axios.get('/auth')
    dispatch(gotUser(data || defaultUser))
  }
}

export const auth = (credentials, method) => {
  return async (dispatch, _, {axios, history}) => {
    const {data} = await axios[method](`/auth/local`, credentials)
    dispatch(gotUser(data))
    history.push('/home')
  }
}

export const logout = () => {
  return async (dispatch, _, {axios, history}) => {
    await axios.delete('/auth')
    dispatch(removeUser())
  }
}

// REDUCER
export default (state = defaultUser, action) => {
  switch (action.type) {
    case GOT_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
