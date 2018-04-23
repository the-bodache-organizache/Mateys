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
  return (dispatch, _, {axios}) => {
    return axios.get('/auth')
      .then(res => {
        dispatch(gotUser(res.data || defaultUser))
      })
  }
}

export const auth = (credentials, method) => {
  return (dispatch, _, {axios, history}) => {
    return axios[method](`/auth/local`, credentials)
      .then(res => {
        dispatch(gotUser(res.data))
        history.push('/home')
      }, authError => { // rare example: a good use case for parallel (non-catch) error handler
        dispatch(gotUser({error: authError.response.data}))
      })
      .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))
  }
}

export const logout = () =>
  (dispatch, _, {axios, history}) =>
    axios.delete('/auth')
      .then(() => {
        dispatch(removeUser())
      })
      .catch(err => console.log(err))

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
