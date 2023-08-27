import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';

const UserAttemptedQuizzes = () => {
    const { uid } = useSelector(state => state.user);
    const db = getFirestore();
    const navigate = useNavigate();
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!uid) {
            navigate('/login');
            return;
        }

        const fetchUserQuizAttempts = async () => {
            const userQuizAttemptsCollectionRef = collection(db, 'users', uid, 'quizResults');
            const userQuizAttemptsQuery = query(userQuizAttemptsCollectionRef);

            try {
                setLoading(true);
                const querySnapshot = await getDocs(userQuizAttemptsQuery);
                const quizAttemptsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuizAttempts(quizAttemptsData);

                // Fetch quiz data for each attempt
                const quizIds = quizAttemptsData.map(attempt => attempt.quizData.id);
                const quizDataPromises = quizIds.map(async quizId => {
                    const quizDocRef = doc(db, 'quizzes', quizId);
                    const quizDocSnapshot = await getDoc(quizDocRef);
                    if (quizDocSnapshot.exists()) {
                        return { quizId, ...quizDocSnapshot.data() };
                    }
                    return { quizId };
                });
                const fetchedQuizData = await Promise.all(quizDataPromises);
                const quizDataMap = fetchedQuizData.reduce((map, quiz) => {
                    map[quiz.quizId] = quiz;
                    return map;
                }, {});

                // Fetch author data for each quiz
                const authorIds = fetchedQuizData.map(quiz => quiz.addedBy);
                const authorDataPromises = authorIds.map(async authorId => {
                    const authorDocRef = doc(db, 'users', authorId);
                    const authorDocSnapshot = await getDoc(authorDocRef);
                    if (authorDocSnapshot.exists()) {
                        return { authorId, ...authorDocSnapshot.data() };
                    }
                    return { authorId };
                });
                const fetchedAuthorData = await Promise.all(authorDataPromises);
                const authorDataMap = fetchedAuthorData.reduce((map, author) => {
                    map[author.authorId] = author;
                    return map;
                }, {});

                // Set user and quiz data
                const userData = await getUserData(uid);
                setUserData(userData);

                // Set user and quiz data in state
                const quizAttemptsWithDetails = quizAttemptsData.map(attempt => {
                    const quizId = attempt.quizData.id;
                    const quizData = quizDataMap[quizId];
                    const authorData = authorDataMap[quizData.addedBy];
                    return { ...attempt, quizData, authorData };
                });
                setQuizAttempts(quizAttemptsWithDetails);
            } catch (error) {
                console.error('Error fetching user quiz attempts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserQuizAttempts();
    }, [db, uid, navigate]);

    const getUserData = async (userId) => {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            return userDocSnapshot.data();
        }
        return {};
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="py-10 min-h-screen">
            <div className="container">
                <h2 className="text-2xl font-bold mb-4">User Attempted Quizzes</h2>
                <ul className="space-y-4">
                    {quizAttempts.map((attempt) => {
                        console.log(attempt);
                        return <li key={attempt.id} className="bg-gray-100 p-4 rounded-md shadow-md grid gap-2">
                            {attempt.quizData && (
                                <div className="text-lg font-semibold mb-2 flex md:items-center justify-between flex-col md:flex-row">
                                    <span>Quiz Title: {attempt.quizData.title}</span>
                                    <span>Attempt Date: {new Date(attempt.timestamp.toDate()).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <p><b>Percentage</b>: {attempt.percentage}%</p>
                                <p><b>Score</b>: {attempt.score}</p>
                            </div>
                            <p>Taken Time: {attempt.takenTime} seconds</p>
                            <Link
                                to={`/quizzes/${attempt.id}`} // Replace with your actual route path
                                className="text-blue-600 hover:underline"
                            >
                                Open Quiz
                            </Link>

                        </li>
                    })}
                </ul>
            </div>
        </section>
    );
};

export default UserAttemptedQuizzes;
