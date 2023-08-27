import React, { useEffect, useState } from 'react';
import ProfileInfo from '../../components/profile/ProfileInfo';
import UserQuizzes from '../../components/profile/UserQuizzes';
import { useNavigate } from 'react-router-dom';
import QuizHistoryComponent from '../../components/profile/QuizHistoryComponent';
import UserInfo from '../../components/profile/UserInfo';

const Profile = () => {
    const logged = localStorage.getItem("logged");
    const navigate = useNavigate();
    useEffect(() => {
        if (!logged) {
            navigate("/login")
            return;
        }
    }, [logged])


    return (
        <main className="min-h-screen bg-gray-100 py-10">
            <div className="container">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <ProfileInfo />
                    <UserQuizzes />
                </div>
                <UserInfo />
                <QuizHistoryComponent />
            </div>

        </main>
    );
};

export default Profile;
