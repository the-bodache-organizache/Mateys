const GET_CONTEXT_SOURCE = 'GET_CONTEXT_SOURCE';
const GET_CONTEXT_BLENDED = 'GET_CONTEXT_BLENDED';

const initialState = {
  contextSource: null,
  contextBlended: null
}

export const getContextSource = (contextSource) => ({
  type: GET_CONTEXT_SOURCE,
  contextSource
});

export const getContextBlended = (contextBlended) => ({
  type: GET_CONTEXT_BLENDED,
  contextBlended
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTEXT_SOURCE:
      return {
        ...state,
        contextSource: action.contextSource
      }
    case GET_CONTEXT_BLENDED:
      return {
        ...state,
        contextBlended: action.contextBlended
      }
    default:
      return state;
  }
}
