const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_USER':
			return {
				...state,
				user: action.payload,
				isAuthenticated: !!action.payload,
			};
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
