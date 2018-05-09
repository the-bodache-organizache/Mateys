const GET_DIMENSIONS = 'GET_DIMENSIONS';
const GET_CONTEXT_SOURCE = 'GET_CONTEXT_SOURCE';
const GET_CONTEXT_BLENDED = 'GET_CONTEXT_BLENDED';
const GET_VIDEO = 'GET_VIDEO';
const GET_LAST_IMAGE_DATA = 'GET_LAST_IMAGE_DATA';
const CREATE_SOURCE_IMAGE_DATA = 'CREATE_SOURCE_IMAGE_DATA';
const CREATE_BLENDED_IMAGE_DATA = 'CREATE_BLENDED_IMAGE_DATA';

const initialState = {
  dimensions: {
    width: 0,
    height: 0
  },
  contextSource: null,
  contextBlended: null,
  video: null,
  lastImageData: null
}

export const getDimensions = (width, height) => ({
  type: GET_DIMENSIONS,
  dimensions: {
    width,
    height
  }
});

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
});

export const getLastImageData = (lastImageData) => ({
  type: GET_LAST_IMAGE_DATA,
  lastImageData
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DIMENSIONS:
      return {
        ...state,
        dimensions: action.dimensions
      }
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
    case GET_LAST_IMAGE_DATA:
      return {
        ...state,
        lastImageData: action.lastImageData
      }
    default:
      return state;
  }
}
