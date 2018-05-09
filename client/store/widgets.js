const GET_WIDGETS = 'GET_WIDGETS';
const TOGGLE_READY = 'TOGGLE_READY';

const initialState = [];

export const getWidgets = widgets => ({
  type: GET_WIDGETS,
  widgets
});

export const toggleReady = widget => {
  widget.ready = !widget.ready;
  return {
    type: TOGGLE_READY,
    widget
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WIDGETS:
      return action.widgets;
    case TOGGLE_READY:
      return state.map(widget => (widget && widget.id === action.widget.id ? action.widget : widget));
    default:
      return state;
  }
};
