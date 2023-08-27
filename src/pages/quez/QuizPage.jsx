import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    collection,
    addDoc,
} from 'firebase/firestore';
import QuizDataComponent from './QuizDataComponent';
import QuizControls from './QuizControls';
import QuestionModal from '../../components/modals/QuestionModal';
import { MagnifyingGlass } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import QuizResultComponent from './QuizResultComponent';

const QuizPage = () => {
    const { quizId } = useParams();
    const [openStartModal, setOpenStartModal] = useState(false);
    const [userResponses, setUserResponses] = useState([]);
    const [quizData, setQuizData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [authorData, setAuthorData] = useState(null);
    const [formattedTime, setFormattedTime] = useState(null);
    const [time, setTimeout] = useState(null);
    const [quizStart, setQuizStart] = useState(false);
    const [userSubmitted, setUserSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageOnModal, setMessageOnModal] = useState('');
    const [methodOnModal, setMethodOnModal] = useState('');
    const [userQuizResult, setUserQuizResult] = useState(null);

    const logged = localStorage.getItem("logged");
    const { uid } = useSelector(state => state.user);
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        if (!logged) {
            navigate("/login");
            return;
        }
    }, [uid, logged])

    const fetchUserQuizResult = async () => {
        const userResultDocRef = doc(db, 'users', uid, 'quizResults', quizId);

        try {
            const userResultDocSnapshot = await getDoc(userResultDocRef);
            if (userResultDocSnapshot.exists()) {
                const userResult = userResultDocSnapshot.data();
                return userResult;
            } else {
                // User result not found
                return null;
            }
        } catch (error) {
            console.error('Error fetching user result:', error);
            return null;
        }
    };

    const fetchQuizAndCheckSubmission = async () => {
        setLoading(true);

        const quizDocRef = doc(db, 'quizzes', quizId);

        try {
            const quizDocSnapshot = await getDoc(quizDocRef);

            if (quizDocSnapshot.exists()) {
                const quiz = quizDocSnapshot.data();
                setQuizData(quiz);

                const categoryDocRef = doc(db, 'categories', quiz.category.id);
                const categoryDocSnapshot = await getDoc(categoryDocRef);

                if (categoryDocSnapshot.exists()) {
                    setCategoryData(categoryDocSnapshot.data());
                } else {
                    console.error('Category not found');
                }

                const userDocRef = doc(db, 'users', quiz.addedBy);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const user = userDocSnapshot.data();
                    setAuthorData(user);
                } else {
                    console.error('User not found');
                }

                if (uid) {
                    const userResult = await fetchUserQuizResult();
                    if (userResult) {
                        setUserSubmitted(true);
                        setUserQuizResult(userResult);
                    }
                }
            } else {
                console.error('Quiz not found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizAndCheckSubmission();
    }, [uid, quizId, userSubmitted, quizStart]);


    const calculatePercentage = () => {
        const correctAnswers = userResponses.filter(response => response.isCorrect);
        const scorePercentage = (correctAnswers.length / quizData.questions.length) * 100;
        return scorePercentage.toFixed(2); // Limit the score to 2 decimal places
    };

    const calculateScore = () => {
        const correctAnswers = userResponses.filter(response => response.isCorrect);
        const userScore = correctAnswers.length;
        return userScore;
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    };

    const totalQuestionTime = quizData?.questions.reduce((total, question) => total + parseInt(question.time), 0);
    const formattedTotalTime = formatTime(totalQuestionTime);
    let takenTime = totalQuestionTime - time;

    useEffect(() => {
        if (time === 30) {
            toast.info("There are only 30 seconds left, and the quiz ends, and your answers will be sent automatically");
        }
        if (time === 10) {
            toast.info("There are only 10 seconds left, and the quiz ends, and your answers will be sent automatically");
        }
        if (time === 0) {
            handleSubmit();
            toast.info("The exam time has expired and it will be sent automatically based on your answers");
            setQuizStart(false);
        }
    }, [time]);

    const saveUserResult = async (userResult) => {
        try {
            const userResultDocRef = doc(db, 'users', uid, 'quizResults', quizId);

            await setDoc(userResultDocRef, {
                ...userResult,
                timestamp: serverTimestamp(),
                quizId: quizId
            });

            console.log('User result saved successfully!');
        } catch (error) {
            console.error('Error saving user result:', error);
        }
    };

    const saveUserQuizAttempt = async (userResult) => {
        const quizDocRef = doc(db, 'quizzes', quizId);
        const userAttemptsCollectionRef = collection(quizDocRef, 'quizAttempts');

        try {
            await addDoc(userAttemptsCollectionRef, {
                authorUid: authorData.uid,
                userId: uid,
                percentage: userResult.percentage,
                score: userResult.score,
                timestamp: serverTimestamp(),
                takenTime: takenTime,
            });

            console.log('User quiz attempt saved successfully!');
        } catch (error) {
            console.error('Error saving user quiz attempt:', error);
        }
    };

    const handleSubmit = () => {
        if (userResponses.length < quizData.questions.length) {
            toast.info("Please answer all questions and try to submit the quiz");
            return;
        }

        const userPercentage = calculatePercentage(userResponses);
        const userScore = calculateScore(userResponses);

        const userResult = {
            quizData: quizData,
            percentage: userPercentage,
            score: userScore,
            responses: userResponses,
        };

        saveUserResult(userResult);
        saveUserQuizAttempt(userResult); // Save the user's quiz attempt

        toast.success("You have successfully submitted the quiz");
        setUserResponses([]);
        setQuizStart(false);
    };

    if (loading) {
        return (
            <div className="h-[calc(100dvh-200px)] flex items-center justify-center">
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
    return (
        <section className='min-h-screen'>
            {/* Quiz Information */}
            <div className="bg-slate-200 rounded-lg p-3 shadow-md ">
                <div className="container">
                    <h1 className="text-xl capitalize font-bold mb-4 text-center">
                        Quiz Information
                    </h1>
                    <h2 className="text-lg text-center">{quizData?.title}</h2>
                    <div className="flex items-center justify-between flex-col md:flex-row gap-3 border-y border-gray-500 py-2 my-3">
                        <p>
                            Author: <span className="mx-2 font-semibold">{authorData?.username}</span>
                        </p>
                        <p>
                            Total Question Time: <span className="mx-2 font-semibold">{formattedTotalTime}</span>
                        </p>
                        <p>
                            Category:{" "}
                            <Link to={`/category/${quizData?.category.id}`} className="mx-2 font-semibold underline">
                                {categoryData?.title}
                            </Link>
                        </p>
                    </div>
                    <p className="text-center font-light">{quizData?.description}</p>
                </div>
            </div>
            {/* Quiz Controls */}
            <div className="py-6 sticky top-0 bg-white h-fit shadow-md">
                <div className="container flex items-center justify-between">
                    <QuizControls
                        questionsLength={quizData?.questions.length}
                        percentage={userSubmitted ? userQuizResult.percentage : null}
                        score={userSubmitted ? userQuizResult.score : null}
                        quizId={quizId}
                        userSubmitted={userSubmitted}
                        quizStart={quizStart}
                        time={time}
                        formattedTime={formattedTime}
                        setOpenStartModal={setOpenStartModal}
                        setMethodOnModal={setMethodOnModal}
                        setMessageOnModal={setMessageOnModal}
                        handleSubmit={handleSubmit}
                        setUserResponses={setUserResponses}
                        setQuizStart={setQuizStart}
                    />
                </div>
            </div>
            <QuestionModal
                openModal={openStartModal}
                setOpenModal={setOpenStartModal}
                setQuizStart={setQuizStart}
                message={messageOnModal}
                handleSubmit={handleSubmit}
                to={methodOnModal}
            />
            {/* Quiz Questions */}
            <div className="container my-10">
                {quizStart &&
                    quizData.questions.map((question, index) => (
                        <QuizDataComponent
                            key={index}
                            currentQuestionIndex={question}
                            openStartModal={openStartModal}
                            order={index + 1}
                            quizData={quizData}
                            setFormattedTime={setFormattedTime}
                            setTimeout={setTimeout}
                            start={quizStart}
                            userResponses={userResponses}
                            setUserResponses={setUserResponses}
                        />
                    ))}
            </div>
            {/* result */}
            {(userSubmitted && !quizStart) && (
                <QuizResultComponent
                    userResponses={userQuizResult.responses}
                    quizData={quizData}
                />
            )}

        </section>
    );
};

export default QuizPage;
