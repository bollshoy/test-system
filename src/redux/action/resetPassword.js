import { sendPasswordResetEmail } from 'firebase/auth';
import {auth} from "../../firebase/firebase.js";
import {toast} from "react-toastify";

export const resetPassword = (email) => {
	return (dispatch) => {
		sendPasswordResetEmail(auth, email)
				.then(() => {
					dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
					toast.success('Лист для скидання пароля надіслано вам на ел. пошту!')
				})
				.catch((error) => {
					dispatch({ type: 'RESET_PASSWORD_ERROR', error });
					toast.error(`Помилка: ${error.message}`);
				});
	};
};
