import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "/firebase.js";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SET_USER = 'SET_USER';

export const setUser = (user) => ({
	type: SET_USER,
	payload: user
});

export const login = (email, password) => {
	return async (dispatch) => {
		dispatch({ type: LOGIN_REQUEST });
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			dispatch(setUser({
				uid: user.uid,
				email: user.email,
				// любые другие данные, которые вам нужны
			}));
			dispatch({ type: LOGIN_SUCCESS });
		} catch (error) {
			dispatch({ type: LOGIN_FAILURE, payload: error.message });
		}
	};
};
