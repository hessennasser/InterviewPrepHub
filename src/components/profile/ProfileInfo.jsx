import React, { useState, useEffect } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { updateUser } from '../../states/userSlice';
import { toast } from 'react-toastify';
import DataNotFounded from '../errors/DataNotFounded';

const ProfileInfo = () => {
    const dispatch = useDispatch();

    const { uid, username: initialUsername, email: initialEmail } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)

    const [password, setPassword] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const db = getFirestore();
            const userDocRef = doc(db, 'users', uid);
            try {
                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setUsername(userData.username || '');
                    setEmail(userData.email || '');
                    setPosition(userData.position || '');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(true)
            }
            setLoading(false);
        };

        fetchUserData();
    }, [uid]);

    const handleSaveChanges = async () => {
        const user = auth.currentUser;

        if (!password) {
            toast.error('Please enter your password');
            return;
        }

        const credentials = EmailAuthProvider.credential(user.email, password);

        try {
            setLoading(true);
            await reauthenticateWithCredential(user, credentials);

            const db = getFirestore();
            const userDocRef = doc(db, 'users', uid);

            try {
                await updateDoc(userDocRef, {
                    username,
                    email,
                    position
                });

                if (email !== initialEmail) {
                    await updateEmail(user, email);
                }

                if (username !== initialUsername) {
                    await updateProfile(user, {
                        displayName: username
                    });
                }

                if (email !== initialEmail || username !== initialUsername) {
                    const updatedUserData = {
                        email,
                        username
                    };
                    dispatch(updateUser(updatedUserData));
                }

                toast.success('Your data updated successfully');
                setEditMode(false);
            } catch (error) {
                toast.error('Error updating user data:', error);
                console.log(error);
            } finally {
                setLoading(false);
                setPassword('');
            }
        } catch (error) {
            toast.error('Error reauthenticating user:', error);
            console.log(error);
        } finally {
            setLoading(false);
            setPassword('');
        }
    };

    return (
        <article className="bg-white p-8 rounded-lg shadow-md w-full  min-h-screen">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <BallTriangle
                        height={100}
                        width={100}
                        radius={5}
                        color="#1c64f2"
                        ariaLabel="ball-triangle-loading"
                        wrapperClass={{}}
                        wrapperStyle=""
                        visible={true}
                    />
                </div>
            ) : (

                <div className="grid gap-4">
                    <div className="flex items-start justify-between border-b-2 pb-2">
                        <h2 className="text-lg md:text-2xl font-semibold leading-relaxed">Profile Information</h2>
                    </div>
                    {error ?
                        (
                            <DataNotFounded message={"Error While fetching user data"} />
                        )
                        :
                        (
                            <div className="grid gap-4">
                                <div className="flex flex-col sm:items-end sm:flex-row">
                                    <label className="block w-32 text-sm font-medium text-gray-700">Name:</label>
                                    <input
                                        className="flex-1 border-transparent border-b-1 border-b-blue-500"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        readOnly={!editMode}
                                    />
                                </div>
                                <div className="flex flex-col sm:items-end sm:flex-row">
                                    <label className="block w-32 text-sm font-medium text-gray-700">Email:</label>
                                    <input
                                        className="flex-1 border-transparent border-b-1 border-b-blue-500"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        readOnly={!editMode}
                                    />
                                </div>
                                <div className="flex flex-col sm:items-end sm:flex-row">
                                    <label className="block w-32 text-sm font-medium text-gray-700">Current Position:</label>
                                    <input
                                        className="flex-1 border-transparent border-b-1 border-b-blue-500"
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        readOnly={!editMode}
                                    />
                                </div>
                                {editMode && (
                                    <div className="flex items-end">
                                        <label className="block w-32 text-sm font-medium text-gray-700">Password:</label>
                                        <input
                                            className="flex-1 border-transparent border-b-1 border-b-blue-500"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-4 justify-start">
                                    {editMode && (
                                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSaveChanges}>
                                            Save Changes
                                        </button>
                                    )}
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEditMode(!editMode)}>
                                        {editMode ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </article>
    );
};

export default ProfileInfo;
