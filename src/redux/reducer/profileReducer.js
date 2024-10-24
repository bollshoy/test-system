const initialState = {
	loading: false,
	error: null,
	userDetails: null,
};

const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'PROFILE_REQUEST':
			return {...state, loading: true, error: null};
		case 'PROFILE_SUCCESS':
			return {...state, loading: false, userDetails: action.payload, error: null};
		case 'PROFILE_FAILURE':
			return {...state, loading: false, error: action.payload};
		default:
			return state;
	}
};

export default profileReducer;
