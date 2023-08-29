import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

import { NavLink, useNavigate } from 'react-router-dom';
import { login } from '../../../states/userSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinner } from 'flowbite-react';
import Cookies from 'js-cookie';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const logged = localStorage.getItem("logged");

    useEffect(() => {
        if (logged) {
            navigate("/profile")
            return;
        }
    }, [logged])

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                toast.error('Please fill in both email and password.');
                return;
            }
            setLoading(true)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user's position from Firestore
            const db = getFirestore();
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            let userPosition = "";
            let uid = null;
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                userPosition = userData.position;
                uid = userData.uid;
                } else {
                await setDoc(userDocRef, { position: "" }, { merge: true });
            }
            dispatch(login({
                name: user.displayName,
                email: user.email,
                position: userPosition,
                token: user.accessToken,
                uid: uid,
            }));
            // Save user data in cookies
            const userData = {
                name: user.displayName,
                email: user.email,
                position: userPosition,
                uid: uid,
                token: user.accessToken // Replace with the actual access token
            };
            Cookies.set('user', JSON.stringify(userData));

            localStorage.setItem("logged", true);

            navigate("/profile");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            if (errorCode === 'auth/user-not-found') {
                toast.error('User not found. Please check your credentials.');
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="h-screen flex items-center justify-center bg-gray-100">
            <section className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <div>
                    <h1 className="text-3xl font-semibold mb-4 text-center">InterviewPrepHub</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <button
                                type='submit'
                                onClick={onLogin}
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? <Spinner className='mx-auto' color="success" /> : 'Login'}
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-gray-600 text-center">
                        No account yet?{' '}
                        <NavLink to="/register" className="text-blue-500 hover:underline">
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;
