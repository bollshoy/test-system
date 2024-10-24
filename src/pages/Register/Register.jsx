import React, {useCallback, useState, useEffect} from 'react';
import {register} from "../../redux/action/registerAction.js";
import {NavLink, useNavigate} from "react-router-dom";
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {useSelector, useDispatch} from "react-redux";
import {eye} from 'react-icons-kit/feather/eye'
import {toast} from "react-toastify";
import {Icon} from 'react-icons-kit';
import './_Register.scss';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [type, setType] = useState('password');
	const [icon, setIcon] = useState(eyeOff);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {loading, error, isRegistered} = useSelector(state => state.auth);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();

		if (!email || !email.includes('@')) {
			toast.error('Електронна пошта не може бути порожньою і повинна містити "@"');
			return;
		}

		if (password.length < 9) {
			toast.error('Пароль повинен містити щонайменше 9 символів');
			return;
		}

		if (!fname.trim() || !lname.trim()) {
			toast.error('Ім\'я та прізвище не можуть бути порожніми');
			return;
		}

		dispatch(register(email, password, lname, fname));
	}, [dispatch, email, password, fname, lname]);


	useEffect(() => {
		if (isRegistered) {
			toast.success('Реєстрація успішна! Перейдіть на сторінку входу');
			navigate('/login');
		}
	}, [isRegistered, navigate]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const handleToggle = useCallback(() => {
		setType(prevType => prevType === 'password' ? 'text' : 'password');
		setIcon(prevIcon => prevIcon === eyeOff ? eye : eyeOff);
	}, []);

	return (<div className="register">
		<div className="register__container container">
			<h3 className="form__title">Реєстрація</h3>
			<form className="form" onSubmit={handleSubmit}>
				<div className="email__form form__item">
					<label htmlFor='email'>Електронна Пошта</label>
					<input
							className='form__input'
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="password__form form__item">
					<label htmlFor="password">Пароль</label>
					<input
							className='form__input'
							type={type}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
					/>
					<span className="show-password" onClick={handleToggle}>
            <Icon className="absolute mr-10" icon={icon} size={25}/>
					</span>
				</div>
				<div className="lname__form form__item">
					<label htmlFor="lname">Прізвище</label>
					<input
							type="text"
							className='form__input'
							value={lname}
							onChange={(e) => setLname(e.target.value)}
					/>
				</div>
				<div className="fname__form form__item">
					<label htmlFor="fname">Ім'я</label>
					<input
							type="text"
							className='form__input'
							value={fname}
							onChange={(e) => setFname(e.target.value)}
					/>
				</div>
				<NavLink to='/login' className='register__link'>Вхід</NavLink>
				<div className="form__btn">
					<button type='submit' className='form-btn' disabled={loading}>
						{loading ? 'Завантаження...' : 'Зареєструватися'}
					</button>
				</div>
			</form>
		</div>
	</div>);
};

export default Register;
