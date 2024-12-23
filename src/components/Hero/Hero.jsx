import React, {useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {auth} from "/firebase.js";
import './_Hero.scss'

const Hero = () => {
	const [user, setUser] = useState(null)
	const navigate = useNavigate()
	
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setUser(user)
		})
		
		return () => unsubscribe()
	}, [])
	
	const handleClick = () => {
		if(user) {
			navigate('/testing')
		} else {
			navigate('/register')
		}
	}
	
	return (
		<section className={'hero'}>
			<div className="hero__container container">
				<h1 className="hero__title">Система олімпіадних задач та тестів</h1>
				<p className="hero__text">
					Олімпіади, організовані на нашій платформі, - це чудова можливість для
					кожного учасника перевірити свої знання, розвинути інтелектуальні
					здібності та позмагатися з однодумцями з усієї країни. Ми пропонуємо
					широкий вибір тестів і завдань для різних вікових груп та рівнів
					підготовки. Незалежно від того, чи є ви учнем початкової школи,
					студентом або просто любите інтелектуальні змагання, ми знайдемо щось
					для кожного!
				</p>
				<p className="hero__text">
					Участь в олімпіадах безкоштовна і відкрита для всіх. Вони перевіряють
					навички в різних сферах, включаючи математику, фізику, мовне
					тестування та логічні завдання. Учасники можуть зареєструватися та
					взяти участь в олімпіаді у зручний для них час, а результати
					зберігаються в особистому кабінеті.
				</p>
				<p className="hero__text">
					Система оцінювання є максимально прозорою та об'єктивною. Вона
					використовує як автоматичне виставлення балів за виконання тестових
					завдань, так і виставлення балів професійними суддями, які ретельно
					перевіряють кожне завдання. Це забезпечує справедливу оцінку знань
					кожного учасника.
				</p>
				<p className="hero__text">
					Олімпіада дає можливість не лише перевірити себе, а й отримати
					визнання. Учасники, які відзначилися, отримують дипломи та
					сертифікати, що підтверджують їхні досягнення.
				</p>
				<p className="hero__text">
					Приєднуйтесь до нашої спільноти, беріть участь у змаганнях та
					доведіть, що ви найкращі! Вирішуйте цікаві завдання, вдосконалюйте
					свої навички та отримуйте нагороди, на які ви заслуговуєте.
				</p>
				<button className="hero__btn" onClick={handleClick}>
					<NavLink to={'/register'}
					         className={'hero__btn-link'}>Розпочати!</NavLink>
				</button>
			</div>
		</section>
	)
}

export default Hero;