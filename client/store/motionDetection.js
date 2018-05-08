const GET_CONTEXT_SOURCE = 'GET_CONTEXT_SOURCE';
const GET_CONTEXT_BLENDED = 'GET_CONTEXT_BLENDED';
const GET_VIDEO = 'GET_VIDEO';

const initialState = {
  contextSource: null,
  contextBlended: null,
  video: null
}

export const getContextSource = (contextSource) => ({
  type: GET_CONTEXT_SOURCE,
  contextSource
});

export const getContextBlended = (contextBlended) => ({
  type: GET_CONTEXT_BLENDED,
  contextBlended
});

export const getVideo = (video) => ({
  type: GET_VIDEO,
  video
})

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
    case GET_VIDEO:
      return {
        ...state,
        video: action.video
      }
    default:
      return state;
  }
}
