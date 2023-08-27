import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { FaEnvelope, FaFacebook, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa';
import { MagnifyingGlass } from 'react-loader-spinner';
import { MdWork } from "react-icons/md"
import { ImLocation } from 'react-icons/im';
import QuizHistoryComponent from '../../components/profile/QuizHistoryComponent';

const UserProfilePage = () => {
    const { userId } = useParams();
    const db = getFirestore();

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userDocRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setUserData(userData);
            }
        };

        fetchUserData();
    }, [db, userId]);

    if (!userData) {
        return <div className="h-screen flex items-center justify-center">
            <MagnifyingGlass
                visible={true}
                height="160"
                width="160"
                ariaLabel="MagnifyingGlass-loading"
                wrapperStyle={{}}
                wrapperClass="MagnifyingGlass-wrapper"
                glassColor='#c0efff'
                color='#1c64f2'
            />
        </div>

    }

    return (
        <div className="py-10 min-h-screen">
            <div className="container">
                <div className="flex flex-col gap-4">
                    <h2 className='md:text-2xl font-semibold text-center'>{userData.username}'s Profile</h2>
                    <h3 className='text-center'>{userData.bio}</h3>
                    <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full flex flex-col gap-3">
                        <h3 className="text-lg font-bold">General Information:</h3>
                        {userData.email && (
                            <div className="flex items-center gap-2">
                                <FaEnvelope className='text-blue-400 text-2xl' />
                                <span className='text-sm md:text-lg'>{userData.email}</span>
                            </div>
                        )}
                        {userData.position && (
                            <div className="flex items-center gap-2">
                                <MdWork className='text-blue-400 text-2xl' />
                                <span className='text-sm md:text-lg'>{userData.position}</span>
                            </div>
                        )}
                    </div>
                    {
                        userData.location && userData.website && userData?.socialMedia && (
                            <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full flex flex-col gap-3">
                                <div className='flex items-center justify-between flex-wrap gap-2'>
                                    {userData.location && (
                                        <p className="flex items-center justify-center gap-2">
                                            <ImLocation /> {userData.location}
                                        </p>
                                    )}
                                    {userData.website && (
                                        <p className="flex items-center justify-center gap-2">
                                            <FaGlobe />
                                            <a href={userData.website} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>
                                                {userData.website}
                                            </a>
                                        </p>
                                    )}
                                    {userData.socialMedia?.facebook && (
                                        <p className="flex items-center justify-center gap-2">
                                            <FaFacebook />
                                            <a href={userData.socialMedia?.facebook} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>
                                                Facebook
                                            </a>
                                        </p>
                                    )}
                                    {userData.socialMedia?.linkedin && (
                                        <p className="flex items-center justify-center gap-2">
                                            <FaLinkedin />
                                            <a href={userData.socialMedia?.linkedin} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>
                                                Linkedin
                                            </a>
                                        </p>
                                    )}
                                    {userData.socialMedia?.github && (
                                        <p className="flex items-center justify-center gap-2">
                                            <FaGithub />
                                            <a href={userData.socialMedia?.github} target="_blank" rel="noopener noreferrer" className='underline text-blue-600'>
                                                GitHub
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
                <QuizHistoryComponent uidForUser={userId} />
            </div>
        </div>
    );
};

export default UserProfilePage;
