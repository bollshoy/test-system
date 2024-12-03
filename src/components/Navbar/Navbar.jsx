import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {auth} from "/firebase.js";
import './_Navbar.scss';

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, []);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
			<nav className="header__menu">
				<div className={`burger ${open ? 'open' : ''}`} onClick={handleClick}>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<ul className={`header__list ${open ? 'open' : ''}`}>
					<li>
						<NavLink to="/" className="header__link">Головна</NavLink>
					</li>
					<li>
						<NavLink to="/testing" className="header__link">Тести</NavLink>
					</li>

					{user ? (
							<li>
								<NavLink to="/profile" className="header__link">Профіль</NavLink>
							</li>
					) : (
							<>
								<li>
									<NavLink to="/register" className="header__link">Реєстрація</NavLink>
								</li>
								<li>
									<NavLink to="/login" className="header__link">Авторизація</NavLink>
								</li>
							</>
					)}
				</ul>
			</nav>
	);
};

export default Navbar;
