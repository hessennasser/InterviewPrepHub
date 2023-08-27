import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from 'flowbite-react';

const Register = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [position, setPosition] = useState('Frontend Developer');
    const [loading, setLoading] = useState(false);
    const logged = localStorage.getItem("logged");

    useEffect(() => {
        if (logged) {
            navigate("/profile")
            return;
        }
    }, [logged])

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!email || !password || !username) {
                toast.error('Please fill in all fields.');
                return;
            }
            setLoading(true);
            // Create user with email, password, username, and position
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = user
            console.log(uid);
            // Update additional user data (username)
            await updateProfile(user, {
                displayName: username,
            });

            // Store user info in Firestore
            const db = getFirestore();
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { position, username, email, uid }, { merge: true });

            toast.success('User registered successfully');
            navigate("/login");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            if (errorCode === 'auth/email-already-in-use') {
                toast.error('email already in use. Please login using email or create new account.');
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }

    };


    return (
        <main className="bg-gray-100 h-screen flex items-center justify-center">
            <section className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <div>
                    <h1 className="text-3xl font-semibold mb-4 text-center">InterviewPrepHub</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name='username'
                                type="text"
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name='email'
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name='password'
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                Current position
                            </label>
                            <input
                                id="position"
                                className="mt-1 p-2 w-full border rounded-md"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <button
                                type="submit"
                                onClick={onSubmit}
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? <Spinner className='mx-auto' color="success" /> : 'Sign up'}
                            </button>

                        </div>
                    </form>

                    <p className="text-sm text-gray-600 text-center">
                        Already have an account?{' '}
                        <NavLink to="/login" className="text-blue-500 hover:underline">
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Register;
