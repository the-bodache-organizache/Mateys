const GET_COMMAND = 'GET_COMMAND';
const initialState = '';

export const getCommand = command => ({
    type: GET_COMMAND,
    command
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_COMMAND:
            return action.command;
        default:
            return state;
    }
}

