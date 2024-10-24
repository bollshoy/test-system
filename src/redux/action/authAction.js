import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../../../firebase.js";
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const login = (email, password) => {
	return async (dispatch) => {
		dispatch({type: LOGIN_REQUEST});
		try {
			await signInWithEmailAndPassword(auth, email, password);
			dispatch({type: LOGIN_SUCCESS})
		} catch (error) {
			dispatch({type: LOGIN_FAILURE, payload: error.message})
		}
	};
};