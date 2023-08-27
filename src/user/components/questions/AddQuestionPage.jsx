import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from 'flowbite-react';
import QuizForm from './QuizForm';
import QuestionBlock from './QuestionBlock';
import { v4 as uniqueId } from 'uuid';
import { BallTriangle } from 'react-loader-spinner';

const AddQuestionPage = () => {
    const navigate = useNavigate();

    const { logged, name } = useSelector(state => state.user);
    console.log(name);
    useEffect(() => {
        if (!logged) {
            navigate("/")
            return;
        }
    }, [logged])

    const [loading, setLoading] = useState(false);

    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizCategory, setQuizCategory] = useState('');
    const [questions, setQuestions] = useState([
        {
            id: uniqueId(),
            question: '',
            answers: [
                { id: 1, content: '', isCorrect: true },
                { id: 2, content: '', isCorrect: false },
                { id: 3, content: '', isCorrect: false },
                { id: 4, content: '', isCorrect: false }
            ],
            time: 30
        }
    ]);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const db = getFirestore();
        const categoriesCollectionRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return categories;
    };

    useEffect(() => {
        async function fetchCategoriesData() {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        }
        fetchCategoriesData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quizTitle || !quizDescription || !quizCategory || questions.some(q => !q.question || !q.answers.every(a => a.content) || !q.time)) {
            toast.info('Please fill in all required fields');
            return;
        }
        setLoading(true);
        const db = getFirestore();
        const quizzesCollectionRef = collection(db, 'quizzes');
        const categoriesCollectionRef = collection(db, 'categories');
        const usersCollectionRef = collection(db, 'users'); // Add this line

        const newQuiz = {
            title: quizTitle,
            description: quizDescription,
            addedBy: auth.currentUser.uid,
            questions: questions,
            category: {
                id: quizCategory,
                title: categories.find(cat => cat.id === quizCategory)?.title || ''
            },
            AuthorName: name,
        };

        try {
            const newQuizDocRef = await addDoc(quizzesCollectionRef, newQuiz);
            const categoryId = quizCategory;
            const categoryQuizzesCollectionRef = collection(categoriesCollectionRef, categoryId, 'categoryQuizzes');

            await addDoc(categoryQuizzesCollectionRef, {
                title: quizTitle,
                description: quizDescription,
                quizId: newQuizDocRef.id,
                addedBy: auth.currentUser.uid,
                AuthorName: name,
            });

            // Store the quiz ID in the user's ownQuizzes
            const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
            await updateDoc(userDocRef, {
                ownQuizzes: arrayUnion(newQuizDocRef.id),
            });

            toast.success('Quiz added successfully');
            // Clear form or navigate to another page
        } catch (error) {
            toast.error('Error adding quiz: ', error);
            console.log(error);
        } finally {
            setLoading(false);
            navigate("/profile");
        }
    };



    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'isCorrect' && value === true) {
            // Unselect other answers as correct for the same question
            updatedQuestions[questionIndex].answers.forEach((answer, idx) => {
                if (idx !== answerIndex) {
                    answer.isCorrect = false;
                }
            });
        }

        updatedQuestions[questionIndex].answers[answerIndex][field] = value;
        setQuestions(updatedQuestions);
    };

    const addNewQuestion = () => {
        const updatedQuestions = [...questions];
        updatedQuestions.push({
            id: uniqueId(),
            question: '',
            answers: [
                { id: 1, content: '', isCorrect: true },
                { id: 2, content: '', isCorrect: false },
                { id: 3, content: '', isCorrect: false },
                { id: 4, content: '', isCorrect: false }
            ],
            time: 30
        });
        setQuestions(updatedQuestions);
    };

    const handleTimeChange = (questionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].time = value;
        setQuestions(updatedQuestions);
    };

    // Function to remove a question
    const removeQuestion = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(questionIndex, 1);
        setQuestions(updatedQuestions);
    };

    return (
        <section className="container">
            <div className="p-6 bg-white shadow-md rounded-lg my-10">
                <h2 className="text-xl font-semibold mb-4">Add a New Quiz</h2>
                <p className='mb-4 font-light'>Enter your ques main information and complete to add you questions and its answers</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {loading && (
                        <div className='bg-gray-800/20 fixed inset-0 flex items-center justify-center z-100'>
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
                    )}
                    <QuizForm
                        quizTitle={quizTitle}
                        quizDescription={quizDescription}
                        quizCategory={quizCategory}
                        categories={categories}
                        setQuizTitle={setQuizTitle}
                        setQuizDescription={setQuizDescription}
                        setQuizCategory={setQuizCategory}
                    />
                    <div className="bg-gray-200 p-5 grid gap-5">
                        <h2 className="text-xl font-semibold mb-4">Add your question</h2>
                        <p className='mb-4 font-light'>Write the question header and then put four different answers and select the correct answer among them, with specifying the time for the answer</p>
                        {questions.map((q, questionIndex) => (
                            <QuestionBlock
                                key={q.id}
                                questionsLength={questions.length}
                                questionIndex={questionIndex}
                                question={q.question}
                                time={q.time}
                                answers={q.answers}
                                handleQuestionChange={handleQuestionChange}
                                handleTimeChange={handleTimeChange}
                                handleAnswerChange={handleAnswerChange}
                                removeQuestion={removeQuestion}
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        {loading ? <Spinner className='mx-auto' color="success" /> : "Add Quiz"}
                    </button>
                    <button
                        type="button"
                        onClick={addNewQuestion}
                        disabled={loading}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mx-4"
                    >
                        Add New Question
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AddQuestionPage;
