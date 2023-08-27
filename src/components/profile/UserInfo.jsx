import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { FaFacebook, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa';
import { ImLocation } from "react-icons/im"
import LoaderInComponent from '../loaderInComponent/LoaderInComponent';

const UserProfile = () => {
    const user = useSelector(state => state.user);
    const db = getFirestore();
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [facebook, setFacebook] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true)
            const userDocRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setBio(userData.bio || '');
                setLocation(userData.location || '');
                setWebsite(userData.website || '');
                setFacebook(userData.socialMedia?.facebook || '');
                setLinkedin(userData.socialMedia?.linkedin || '');
                setGithub(userData.socialMedia?.github || '');
            }
            setLoading(false)
        };

        fetchUserProfile();
    }, [db, user.uid]);

    const handleSave = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const updatedProfile = {
            ...user,
            bio,
            location,
            website,
            socialMedia: {
                facebook,
                linkedin,
                github
            }
        };

        await updateDoc(userDocRef, updatedProfile);
        setEditMode(false);
    };

    return (
        <div className="mt-8 p-6 bg-white border rounded-lg shadow-md">
            {
                loading ? (
                    <LoaderInComponent />
                )
                    :
                    (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="md:text-2xl font-bold">Your Additional Info</h2>
                                <button
                                    className="bg-blue-400 text-white py-2 px-5"
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    {editMode ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            {editMode ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                                        <textarea
                                            className="mt-1 p-2 w-full border rounded focus:ring focus:ring-blue-300"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            className="mt-1 p-2 w-full border rounded focus:ring focus:ring-blue-300"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Personal Website</label>
                                        <input
                                            type="url"
                                            className="mt-1 p-2 w-full border rounded focus:ring focus:ring-blue-300"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Facebook</label>
                                        <input
                                            type="text"
                                            className="mt-1 p-2 w-full border rounded focus:ring focus:ring-blue-300"
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Github</label>
                                        <input
                                            type="text"
                                            className="mt-1 p-2 w-full border rounded focus:ring focus:ring-blue-300"
                                            value={github}
                                            onChange={(e) => setGithub(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                                        <input
                                            type="text"
                                            className="mt-1 p-2 w-full border rounded focus:ring focus:ring-blue-300"
                                            value={linkedin}
                                            onChange={(e) => setLinkedin(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    {bio && <p className="flex items-center justify-center my-4">{bio}</p>}
                                    <div className='flex items-center justify-between flex-wrap gap-2'>
                                        {location && <p className="flex items-center justify-center gap-2"><ImLocation /> {location}</p>}
                                        {website && <p className="flex items-center justify-center gap-2"><FaGlobe />

                                            <a href={website} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>{website}</a>
                                        </p>}
                                        {facebook && <p className="flex items-center justify-center gap-2"><FaFacebook />
                                            <a href={facebook} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>Facebook</a>
                                        </p>}
                                        {linkedin && <p className="flex items-center justify-center gap-2"><FaLinkedin />
                                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>Linkedin</a>
                                        </p>}
                                        {github && <p className="flex items-center justify-center gap-2"><FaGithub />
                                            <a href={github} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>GitHUb</a>
                                        </p>}
                                    </div>
                                </>
                            )}
                        </>
                    )
            }
        </div>
    );
};

export default UserProfile;
