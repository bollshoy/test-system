import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Login from "./pages/Login/Login.jsx";
import {auth} from "./firebase/firebase.js";
import Home from "./pages/Home/Home.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import {ToastContainer} from "react-toastify";
import Loading from "./components/Loading/Loading.jsx";
import Register from "./pages/Register/Register.jsx";
import Olympiads from "./pages/Olympiads/Olympiads.jsx";
import './scss/style.css';
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";

const App = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			setUser(user);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	if (loading) {
		return <Loading/>;
	}

	return (
			<Router>
				<Routes>
					<Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
					<Route path='/login' element={<Login/>}></Route>
					<Route path="/register" element={<Register/>}></Route>
					<Route path="/olympiads" element={<Olympiads/>}></Route>
					<Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
					<Route path={'/reset'} element={<ResetPassword/>}></Route>
				</Routes>
				<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						closeOnClick
						pauseOnHover
						draggable
						pauseOnFocusLoss
						theme="colored"
				/>
			</Router>
	);
};

export default App;