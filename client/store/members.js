// ACTION TYPES
const GOT_MEMBERS = 'GOT_MEMBERS'

// INITIAL STATE
const defaultMembers = {}

// ACTION CREATORS
const gotMembers = members => ({type: GOT_MEMBERS, members})

// THUNK CREATORS
export const fetchMembers = () => {
  return async (dispatch, _, {axios}) => {
    const {data} = await axios.get('/api/members')
    dispatch(gotMembers(data))
  }
}

const byId = array => array.reduce((obj, next) => {
  obj[next.id] = next
  return obj
}, {})

// REDUCER
export default (state = defaultMembers, action) => {
  switch (action.type) {
    case GOT_MEMBERS:
      return {
        ...state,
        ...byId(action.members)
      }
    default:
      return state
  }
}
