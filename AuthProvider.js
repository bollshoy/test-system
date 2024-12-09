import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {setUser} from "@/redux/action/authAction.js";
import { auth } from './firebase.js';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                dispatch(setUser({
                    uid: user.uid,
                    email: user.email,
                }));
            } else {
                dispatch(setUser(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return children;
};

export default AuthProvider;
