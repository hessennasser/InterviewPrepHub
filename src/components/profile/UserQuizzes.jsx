import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiLogIn } from "react-icons/fi";
import { BsSendCheck } from "react-icons/bs";
import { BiTrash } from "react-icons/bi";
import ShareBox from '../shareBox/ShareBox';
import noQuizzes from "../../assets/images/quiz.svg"
import DeleteQuizModal from '../modals/DeleteQuizModal';
import { FaShare } from 'react-icons/fa';
import LoaderInComponent from '../loaderInComponent/LoaderInComponent';

const UserQuizzes = () => {
    const { uid } = useSelector((state) => state.user);
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showShareBox, setShowShareBox] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);

    const [quizDocIdToDelete, setQuizDocIdToDelete] = useState(null);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

    useEffect(() => {
        const fetchUserQuizzes = async () => {
            const db = getFirestore();
            const quizzesCollectionRef = collection(db, 'quizzes');
            const userQuizzesQuery = query(quizzesCollectionRef, where('addedBy', '==', uid));

            try {
                setLoading(true);
                const querySnapshot = await getDocs(userQuizzesQuery);
                const userQuizzesData = [];

                for (const doc of querySnapshot.docs) {
                    const docRef = doc.ref;
                    const quizData = { id: doc.id, ...doc.data(), docId: docRef.id };
                    userQuizzesData.push(quizData);
                }

                setUserQuizzes(userQuizzesData);
            } catch (error) {
                console.error('Error fetching user quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserQuizzes();
    }, [uid]);

    const handleShareClick = (quizId) => {
        setSelectedQuizId(quizId);
        setShowShareBox(!showShareBox);
    };

    const handleDeleteClick = async (quizDocId, categoryId) => {
        try {
            setLoading(true);
            const db = getFirestore();
            const quizRef = doc(db, 'quizzes', quizDocId);

            // Remove quiz from categories
            const categoryQuizzesQuery = query(collection(db, 'categories', categoryId, 'categoryQuizzes'), where('quizId', '==', quizDocId));
            const categoryQuizzesSnapshot = await getDocs(categoryQuizzesQuery);
            const removeCategoryQuizzesPromises = [];
            categoryQuizzesSnapshot.forEach((categoryQuizDoc) => {
                removeCategoryQuizzesPromises.push(deleteDoc(categoryQuizDoc.ref));
            });
            await Promise.all(removeCategoryQuizzesPromises);

            // Delete the quiz document
            await deleteDoc(quizRef);

            // Delete the quiz from user quizResults
            const usersCollectionRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);

            const deleteQuizFromUserResultsPromises = [];

            usersSnapshot.forEach(async (userDoc) => {
                const userRef = doc(db, 'users', userDoc.id);
                const quizResultsCollectionRef = collection(userRef, 'quizResults');

                const quizResultQuerySnapshot = await getDocs(quizResultsCollectionRef);
                quizResultQuerySnapshot.forEach((quizResultDoc) => {
                    const quizResultData = quizResultDoc.data();
                    console.log(quizResultData);
                    if (quizResultData.quizId === quizDocId) {
                        deleteQuizFromUserResultsPromises.push(deleteDoc(quizResultDoc.ref));
                    }
                });
            });

            await Promise.all(deleteQuizFromUserResultsPromises);

            // Update the userQuizzes state to remove the deleted quiz
            setUserQuizzes(prevUserQuizzes => prevUserQuizzes.filter(quiz => quiz.docId !== quizDocId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <article className='bg-white rounded-lg shadow-md w-full md:min-h-[360px] pb-8 px-3 overflow-hidden'>
            {loading ? (
                <LoaderInComponent />
            ) : (
                <>
                    <div className="flex items-start justify-between border-b-2 pb-2 bg-white sticky top-0 h-fit pt-8 px-8">
                        <h2 className="text-sm sm:text-lg md:text-2xl font-semibold leading-relaxed">Your Own Quizzes</h2>
                        <Link to="/add-quiz" className='bg-blue-400 text-white py-2 px-5 text-sm'>Add New Quiz</Link>
                    </div>
                    {userQuizzes.length === 0 ? (
                        <div className="flex flex-col gap-5 items-center justify-center">
                            <img src={noQuizzes} className='w-1/4 mx-auto' alt="You Have Not Quizzes Until Now!" />
                            <p className='text-red-500 text-lg text-center'>You Have Not Quizzes Until Now!</p>
                            <Link to="/add-quiz" className='bg-green-400 text-white py-2 px-5 rounded-md shadow-md'>Add New Quiz</Link>

                        </div>
                    ) : (
                        <div className="overflow-x-auto scroll-list">
                            <ul className="space-y-2 overflow-y-auto max-h-[280px] min-w-[500px] m-4 scroll-list">
                                {userQuizzes.map((quiz, index) => {
                                    return <li key={quiz.id} className='bg-green-200 flex items-center justify-between gap-2 flex-wrap'>
                                        <span className='bg-blue-400 text-white inline-flex w-10 items-center justify-center p-2'>
                                            {`${index + 1}`}
                                        </span>
                                        <span className='flex-1'>{quiz.title}</span>
                                        <div className='flex'>
                                            <Link to={`/quizzes/${quiz.docId}`} className="bg-blue-800 text-white inline-flex w-10 text-2xl items-center justify-center p-2">
                                                <FiLogIn />
                                            </Link>
                                            <Link to={`/quizzes/results/${quiz.docId}`} className="bg-blue-800 text-white inline-flex w-10 text-2xl items-center justify-center p-2 border-l">
                                                <BsSendCheck />
                                            </Link>
                                            <button
                                                onClick={() => handleShareClick(quiz.id)}
                                                className="bg-blue-800 text-white inline-flex items-center justify-center p-2 border-l"
                                            >
                                                <FaShare />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setQuizDocIdToDelete(quiz.docId)
                                                    setCategoryIdToDelete(quiz.category.id);
                                                    setDeleteModal(true);
                                                }}
                                                className="bg-red-800 text-white inline-flex items-center justify-center p-2 border-l"
                                            >
                                                <BiTrash />
                                            </button>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    )}
                </>
            )}
            {
                deleteModal && (
                    <DeleteQuizModal openModal={deleteModal} setOpenModal={setDeleteModal} handleDelete={() => handleDeleteClick(quizDocIdToDelete, categoryIdToDelete)} />
                )
            }
            {showShareBox && (
                <ShareBox link={`https://interview-prep-hub-etgy.vercel.app/quizess${selectedQuizId}`} message={"Share this quiz:"} buttonText={"Copy Link"} showShareBox={showShareBox} setShowShareBox={setShowShareBox} />
            )}
        </article>
    );
};

export default UserQuizzes;
