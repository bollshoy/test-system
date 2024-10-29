import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from '../../../firebase.js';
import {doc, setDoc} from 'firebase/firestore';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const register = (email, password, lastName, firstName, phone, role = 'user') => {
    return async (dispatch) => {
        dispatch({type: REGISTER_REQUEST});
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'User', user.uid), {
                lastName,
                firstName,
                phone,
                role,
                email: user.email,
            });

            dispatch({type: REGISTER_SUCCESS});
        } catch (error) {
            dispatch({type: REGISTER_FAILURE, payload: error.message});
        }
    };
};

const initialState = {
    loading: false,
    error: null,
    isRegistered: false,
};

const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
            return {...state, loading: true, error: null};
        case REGISTER_SUCCESS:
            return {...state, loading: false, error: null, isRegistered: true};
        case REGISTER_FAILURE:
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

export default registerReducer;
