import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { auth, db } from "/firebase.js";

export const PROFILE_REQUEST = 'PROFILE_REQUEST';
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
export const PROFILE_FAILURE = 'PROFILE_FAILURE';
export const TEST_RESULTS_SUCCESS = 'TEST_RESULTS_SUCCESS';

export const profile = () => {
	return async (dispatch) => {
		dispatch({ type: PROFILE_REQUEST });
		try {
			const user = auth.currentUser;
			if (user) {
				const docRef = doc(db, 'User', user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					dispatch({ type: PROFILE_SUCCESS, payload: docSnap.data() });

					const response = await axios.get(`http://localhost:3000/test-results/${user.uid}`);
					dispatch({ type: TEST_RESULTS_SUCCESS, payload: response.data });
				} else {
					dispatch({ type: PROFILE_FAILURE, payload: 'No user data found' });
				}
			} else {
				dispatch({ type: PROFILE_FAILURE, payload: 'User is not logged in' });
			}
		} catch (error) {
			dispatch({ type: PROFILE_FAILURE, payload: error.message });
		}
	};
};

