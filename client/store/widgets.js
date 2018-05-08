const GET_WIDGETS = 'GET_WIDGETS';

const initialState = [];

export const getWidgets = (widgets) => ({
  type: GET_WIDGETS,
  widgets
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_WIDGETS:
      return action.widgets;
    default:
      return state;
  }
}
