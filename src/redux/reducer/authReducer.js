const initialState = {
	loading: false,
	error: null,
	isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN_REQUEST':
			return { ...state, loading: true, error: null };
		case 'LOGIN_SUCCESS':
			return { ...state, loading: false, error: null, isAuthenticated: true };
		case 'LOGIN_FAILURE':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default authReducer;
