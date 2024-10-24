import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {resetPassword} from "../../redux/action/resetPassword.js";
import './_ResetPassword.scss'
import {NavLink} from "react-router-dom";

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = useCallback((e) => {
		e.preventDefault();
		dispatch(resetPassword(email));
	})

	return (
			<div className="resetPassword">
				<div className="resetPassword__container container">
					<h3 className="form__title">Скидання пароля</h3>
					<form className="form" onSubmit={handleSubmit}>
						<div className="email__form form__item">
							<label htmlFor="email">Ел. Пошта</label>
							<input
									className='form__input'
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
							/>
							<NavLink to='/login' className='resetPassword__link'>Вхід</NavLink>
						</div>
						<div className="form__btn">
							<button type="submit" className='form-btn'>Скинути пароль</button>
						</div>
					</form>
				</div>
			</div>


	);
};

export default ResetPassword;