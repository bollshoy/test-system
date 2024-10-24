const initialState = {
	error: null,
	success: false,
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'RESET_PASSWORD_SUCCESS':
			return {...state, success: true, error: null};
		case 'RESET_PASSWORD_FAILURE':
			return {...state, error: action.payload.error};
		default:
			return state;
	}
}

export default authReducer;