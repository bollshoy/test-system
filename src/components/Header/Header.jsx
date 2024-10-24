import React from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import logo from '../../assets/logo.jpg';
import './_Header.scss'

const Header = () => {
	return (
			<header className="header">
				<div className="header__container container">
					<div className="header__logo">
						<a href="#" className="logo">
							<img src={logo} alt="logo" className="logo__img"/>
						</a>
					</div>
					<Navbar/>
				</div>
			</header>
	)
}

export default Header