import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '/firebase.js';

export const ROLE_REQUEST = 'ROLE_REQUEST';
export const ROLE_SUCCESS = 'ROLE_SUCCESS';
export const ROLE_FAILURE = 'ROLE_FAILURE';

export const fetchUserRole = () => {
    return async (dispatch) => {
        dispatch({ type: ROLE_REQUEST });
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'User', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("Fetched role from Firestore:", docSnap.data().role);
                    dispatch({ type: ROLE_SUCCESS, payload: docSnap.data().role });
                } else {
                    dispatch({ type: ROLE_FAILURE, payload: 'No user role found' });
                }
            } else {
                dispatch({ type: ROLE_FAILURE, payload: 'User is not logged in' });
            }
        } catch (error) {
            dispatch({ type: ROLE_FAILURE, payload: error.message });
            console.error("Error fetching user role:", error);
        }
    };
};
