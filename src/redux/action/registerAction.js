import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, db } from '../../../firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

const checkEmailExists = async (email) => {
	const authInstance = getAuth();
	const methods = await fetchSignInMethodsForEmail(authInstance, email);
	return methods.length > 0;
};

export const register = (email, password, lastName, firstName, phone) => {
	return async (dispatch) => {
		dispatch({ type: REGISTER_REQUEST });

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			await setDoc(doc(db, 'User', user.uid), {
				lastName,
				firstName,
				phone,
				email: user.email,
			});

			toast.success('Реєстрація пройшла успішно! Перейдіть на сторінку входу')
			const navigate = useNavigate();
			navigate('/register');

			dispatch({ type: REGISTER_SUCCESS });
		} catch (error) {
			console.error("Registration error: ", error);
			dispatch({ type: REGISTER_FAILURE, payload: error.message });

			toast.error(`Помилка: ${error.message}`);
		}
	};
};
