import React, {useCallback, useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {login} from "@/redux/action/authAction.js";
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import 'react-toastify/dist/ReactToastify.css';
import {eye} from 'react-icons-kit/feather/eye'
import {Icon} from 'react-icons-kit';
import {toast} from "react-toastify";
import './_Login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, error, isAuthenticated} = useSelector(state => state.auth);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (email === '' || password.length < 9) {
            toast.error('Email не може бути порожнім і пароль повинен містити не менше 9 символів');
            return;
        }
        dispatch(login(email, password));
    }, [dispatch, email, password]);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Успішний вхід у систему!');
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleToggle = useCallback(() => {
        if (type === 'password') {
            setType('text');
            setIcon(eye);
        } else {
            setType('password');
            setIcon(eyeOff);
        }
    })

    return (
        <div className="login">
            <div className="login__container container">
                <h3 className="form__title">Авторизація</h3>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="email__form">
                        <label htmlFor={'email'}>Електрона Пошта</label>
                        <input
                            className={'form__input'}
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="password__form">
                        <label htmlFor="password">Пароль</label>
                        <input
                            className={'form__input'}
                            type={type}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <span className="show-password" onClick={handleToggle}>
                <Icon className="absolute mr-10" icon={icon} size={25}/>
							</span>
                    </div>
                    <div className="login__link">
                        <NavLink to={'/register'} className={'login__register'}>Реєстрація</NavLink>
                        <NavLink to={'/reset'} className={'login__reset-password'}>Забув пароль</NavLink>
                    </div>
                    <div className="form__btn">
                        <button type={'submit'} className={'form-btn'} disabled={loading}>
                            {loading ? 'Завантаження...' : 'Вхід'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
