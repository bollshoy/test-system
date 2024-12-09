const initialState = {
	loading: false,
	error: null,
	userDetails: null,
	testResults: [],
};

const profileReducer = (state = initialState, action) => {
	console.log('Action received:', action);
	switch (action.type) {
		case 'PROFILE_REQUEST':
			return { ...state, loading: true, error: null };
		case 'PROFILE_SUCCESS':
			return { ...state, loading: false, userDetails: action.payload, error: null };
		case 'PROFILE_FAILURE':
			return { ...state, loading: false, error: action.payload };
		case 'TEST_RESULTS_SUCCESS':
			return { ...state, testResults: action.payload };
		default:
			return state;
	}
};

export default profileReducer;

