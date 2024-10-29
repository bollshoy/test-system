import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserRole} from './redux/action/roleAction.js';

import Login from "./pages/Login/Login.jsx";
import {auth} from "/firebase.js";
import Home from "./pages/Home/Home.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import {ToastContainer} from "react-toastify";
import Loading from "./components/Loading/Loading.jsx";
import Register from "./pages/Register/Register.jsx";
import Olympiads from "./pages/Olympiads/Olympiads.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx";
import Unauthorized from "./components/Unauthorized/Unauthorized.jsx";
import './scss/style.css';


const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userRole = useSelector((state) => state.role.role);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                dispatch(fetchUserRole());
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [dispatch]);

    if (loading) {
        return <Loading/>;
    }
    console.log("User Role:", userRole);
    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/olympiads" element={<Olympiads/>}/>
                <Route path="/profile" element={user ? <Profile/> : <Navigate to="/login"/>}/>
                <Route path="/reset" element={<ResetPassword/>}/>
                <Route path="/admin" element={userRole === 'admin' ? <AdminPanel /> : <Navigate to="/unauthorized" />} />
                <Route path="/unauthorized" element={<Unauthorized/>}/>
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
