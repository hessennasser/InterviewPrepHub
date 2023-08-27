import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import LoaderInComponent from '../loaderInComponent/LoaderInComponent';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

const UserResultsComponent = ({ uidForUser }) => {
    const { uid: userId } = useSelector(state => state.user);
    const [userResults, setUserResults] = useState([]);
    const db = getFirestore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserResults = async () => {
            setLoading(true);
            const userResultsCollectionRef = collection(db, 'users', uidForUser ? uidForUser : userId, 'quizResults');
            const userResultsQuery = query(userResultsCollectionRef);
            const userResultsSnapshot = await getDocs(userResultsQuery);

            const userResultsData = [];
            userResultsSnapshot.forEach((doc) => {
                userResultsData.push({ id: doc.id, ...doc.data() });
            });

            setUserResults(userResultsData);
            setLoading(false)
        };

        fetchUserResults();
    }, [db, userId]);
    console.log(userResults);
    return (
        <div className="mt-8 bg-white border rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">User Quiz Results</h2>
            {
                loading ? (
                    <LoaderInComponent />
                )
                    :
                    (
                        <div className="overflow-x-auto scroll-list">
                            <table className="w-full border-collapse border min-w-[800px]">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Quiz Title</th>
                                        <th className="border p-2">Percentage</th>
                                        <th className="border p-2">Score</th>
                                        <th className="border p-2">Timestamp</th>
                                        {
                                            (uidForUser === userId || !uidForUser) && (
                                                <th className="border p-2">Actions</th>
                                            )
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {userResults.map((result) => (
                                        <tr key={result.id} className="odd:bg-gray-100 hover:bg-gray-200">
                                            <td className="border p-2">{result.quizData.title}</td>
                                            <td className="border p-2">{result.percentage}%</td>
                                            <td className="border p-2">{result.score}</td>
                                            <td className="border p-2">{result.timestamp.toDate().toLocaleString()}</td>
                                            {
                                                (uidForUser === userId || !uidForUser) && (
                                                    <td className="border p-2 text-center">
                                                        <Link to={`/quizzes/${result.quizId}`} className="bg-blue-800 text-white inline-flex w-10 text-2xl items-center justify-center p-2">
                                                            <FiLogIn />
                                                        </Link>
                                                    </td>
                                                )
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
            }

        </div>
    );
};

export default UserResultsComponent;
