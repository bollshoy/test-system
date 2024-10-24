import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {db, auth} from "../../../firebase.js";
import {doc, getDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import Header from "../../components/Header/Header.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import './_Profile.scss'

const Profile = () => {
	const [userDetails, setUserDetails] = useState(null);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const navigate = useNavigate();

	const fetchUserDate = async (user) => {
		try {
			if (user) {
				const docRef = doc(db, 'User', user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setUserDetails(docSnap.data());
				} else {
					toast.error('Користувацьких даних не знайдено')
				}
			} else {
				toast.error('Користувач не увійшов до системи')
				navigate('/login');
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			fetchUserDate(user);
		});

		return () => unsubscribe();
	}, [])

	const handleLogount = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);

		try {
			await auth.signOut();
			navigate('/');
		} catch (error) {
			toast.error('Помилка виходу з системи: ' + error.message);
		} finally {
			setIsLoggingOut(false);
		}
	}
	return (
			<>
				<Header />
				<section className="profile">
					<div className="profile__container container">
						{userDetails ? (
								<>
									<div className="profile__left">
									</div>
									<div className="profile__right">
										<h3 className="profile__title">Вітаємо {userDetails.firstName}!</h3>
										<p className="profile__item">Email: {userDetails.email}</p>
										<p className="profile__item">Прізвище: {userDetails.firstName}</p>
										<p className="profile__item">Ім'я: {userDetails.lastName}</p>
										<div className="profile__btn" onClick={handleLogount}>
											<button disabled={isLoggingOut}>Вийти</button>
										</div>
									</div>
								</>
						) : (
								<div><Loading/></div>
						)}
					</div>
				</section>
			</>
	);
};

export default Profile;