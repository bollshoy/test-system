import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading/Loading.jsx";
import Header from "@/components/Header/Header.jsx";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "/firebase.js";
import { toast } from "react-toastify";
import axios from 'axios';

import "./_Profile.scss";

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserData = async (user) => {
        try {
            if (user) {
                const docRef = doc(db, "User", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());

                    try {
                        const response = await axios.get(`http://localhost:3000/test-results/${user.uid}`);
                        if (response.status === 200) {
                            setTestResults(response.data);
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            setTestResults([]);
                            console.log("No test results found for this user.");
                        } else {
                            console.error("Error fetching test results:", error);
                            toast.error("Error fetching test results.");
                        }
                    }
                } else {
                    toast.error("User data not found");
                }
            } else {
                toast.error("User not logged in");
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading user data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log('Current user:', user ? user.uid : 'No user');
            fetchUserData(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            await auth.signOut();
            navigate("/");
        } catch (error) {
            toast.error("Помилка виходу: " + error.message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!userDetails) {
        return <div>Помилка: Дані користувача не знайдено</div>;
    }

    return (
        <>
            <Header />
            <section className="profile">
                <div className="profile__container container">
                    <div className="profile__content">
                        <div className="profile__content-item">
                            <h3 className="profile__title">Вітаємо, {userDetails.firstName}!</h3>
                            <p className="profile__item">Email: {userDetails.email}</p>
                            <p className="profile__item">Ім'я: {userDetails.lastName}</p>
                            <p className="profile__item">Прізвище: {userDetails.firstName}</p>
                            <p className="profile__item">Телефон: {userDetails.phone}</p>
                            <p className="profile__item">Роль: {userDetails.role}</p>
                            {userDetails.role === "admin" && (
                                <button
                                    className="profile__admin-button"
                                    onClick={() => navigate("/admin")}
                                >
                                    Админ-панель
                                </button>
                            )}
                            <div className="profile__btn" onClick={handleLogout}>
                                <button disabled={isLoggingOut}>Вийти</button>
                            </div>
                            <h4 className="profile__subtitle">Пройдені тести:</h4>
                            {testResults.length > 0 ? (
                                <ul className="profile__test-results">
                                    {testResults.map((result) => (
                                        <li key={result.id} className="profile__test-result">
                                            <p>Назва тесту: {result.testName}</p>
                                            <p>Оцінка: {result.score}%</p>
                                            <p>Кількість питань: {result.totalQuestions}</p>
                                            <p>Час
                                                проходження: {Math.floor(result.timeTaken / 60)} хв {result.timeTaken % 60} сек</p>
                                            <p>Дата: {new Date(result.date).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Ви ще не пройшли жодного тесту.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Profile;
