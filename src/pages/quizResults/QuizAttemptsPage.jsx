import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { MagnifyingGlass } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import NoPermission from '../../components/errors/NoPermission';
import NoAttemptYet from '../../components/errors/NoAttemptYet';

const QuizAttemptsPage = () => {
    const { quizId } = useParams();
    const { uid, role } = useSelector(state => state.user); // Assuming you have a role in user state
    const db = getFirestore();
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    const logged = localStorage.getItem("logged");
    const navigate = useNavigate();

    useEffect(() => {
        if (!logged) {
            navigate("/login")
            return;
        }
    }, [logged])

    useEffect(() => {
        const fetchQuizAttempts = async () => {
            const quizAttemptsCollectionRef = collection(db, 'quizzes', quizId, 'quizAttempts');

            try {
                setLoading(true);
                const querySnapshot = await getDocs(quizAttemptsCollectionRef);
                const quizAttemptsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Filter quiz attempts based on authorUid and user role
                const filteredQuizAttempts = quizAttemptsData.filter(attempt => {
                    if (role === 'admin' || uid === attempt.authorUid) {
                        return true;
                    }
                    return false;
                });

                setQuizAttempts(filteredQuizAttempts);

                const userIds = filteredQuizAttempts.map(attempt => attempt.userId);
                const userDataPromises = userIds.map(async userId => {
                    const userDocRef = doc(db, 'users', userId);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        return { userId, ...userDocSnapshot.data() };
                    }
                    return { userId };
                });
                const fetchedUserData = await Promise.all(userDataPromises);
                const userDataMap = fetchedUserData.reduce((map, user) => {
                    map[user.userId] = user;
                    return map;
                }, {});
                setUserData(userDataMap);
            } catch (error) {
                console.error('Error fetching quiz attempts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAttempts();
    }, [db, quizId, uid, role]);



    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
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
        );
    }

    console.log(quizAttempts);

    if (!loading && quizAttempts.length > 1 && quizAttempts.every((attempt) => attempt.authorUid !== uid)) {
        console.log("no");
        return <NoPermission />;
    }
    if (!loading && quizAttempts.length < 1) {
        return <NoAttemptYet quizId={quizId} />
    }

    return (
        <section className="py-10 min-h-screen">
            <div className="container">
                <h2 className="text-2xl font-bold mb-4">Quiz Attempts</h2>
                <ul className="space-y-4">
                    {quizAttempts.map((attempt) => {
                        {
                            if (attempt.authorUid === uid) {
                                return (
                                    <li key={attempt.id} className="bg-gray-100 p-4 rounded-md shadow-md grid gap-2">
                                        {userData[attempt.userId] && (
                                            <div className="text-lg font-semibold mb-2 flex md:items-center justify-between flex-col md:flex-row">
                                                <span>From: {userData[attempt.userId].username}</span>
                                                <span>Attempt on: {new Date(attempt.timestamp.toDate()).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <p><b>Percentage</b>: {attempt.percentage}%</p>
                                            <p><b>Score</b>: {attempt.score}</p>
                                        </div>
                                        <p>Taken Time: {attempt.takenTime} seconds</p>
                                    </li>
                                );
                            }
                            return null; // Return null for attempts that don't match the condition
                        }
                    })}
                </ul>
            </div>
        </section>
    );
};

export default QuizAttemptsPage;
