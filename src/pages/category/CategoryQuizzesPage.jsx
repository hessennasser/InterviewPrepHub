import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { MagnifyingGlass } from 'react-loader-spinner';
import DataNotFounded from '../../components/errors/DataNotFounded';

const CategoryQuizzesPage = () => {
    const { categoryId } = useParams();
    const db = getFirestore();
    const [categoryData, setCategoryData] = useState('');
    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            const categoriesCollectionRef = collection(db, 'categories');
            const categoryDocRef = doc(categoriesCollectionRef, categoryId);

            try {
                const categoryDocSnapshot = await getDoc(categoryDocRef);
                if (categoryDocSnapshot.exists()) {
                    setCategoryData(categoryDocSnapshot.data());
                } else {
                    setError("Category not found");
                }
            } catch (error) {
                setError("Error fetching category data");
            }
        };

        const fetchQuizzesByCategory = async () => {
            const quizzesCollectionRef = collection(db, 'quizzes');
            const quizzesQuery = query(quizzesCollectionRef, where('category.id', '==', categoryId));

            try {
                const querySnapshot = await getDocs(quizzesQuery);
                const quizzesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuizzes(quizzesData);
            } catch (error) {
                setError("Error fetching quizzes");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
        fetchQuizzesByCategory();
    }, [db, categoryId]);

    if (loading) {
        return <div className="min-h-[calc(100dvh-200px)] flex items-center justify-center">
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

    if (error) {
        return <DataNotFounded message={"Error While fetching Category data"} />;
    }

    return (
        <section className="py-10 min-h-screen">
            <div className="container">
                <h2 className="text-2xl font-bold">{categoryData.title}</h2>
                <p className='my-4'>{categoryData.description}</p>
                {
                    quizzes.length < 1 ?
                        (
                            <DataNotFounded message={"There Is No Quizzes In This Category Yet!"} />
                        )
                        :
                        <ul className="space-y-4">

                            {quizzes.map((quiz) => (
                                <li key={quiz.id} className="bg-gray-100 p-4 rounded-md shadow-md grid gap-2">
                                    <h2 className="text-lg font-semibold">
                                        {quiz.title}
                                    </h2>
                                    <p className='my-2'>
                                        {quiz.description}
                                    </p>
                                    <div className="flex sm:items-center justify-between py-2 border-y border-gray-500 flex-col sm:flex-row gap-2">
                                        <p><b>Author</b>: {quiz.AuthorName ? quiz.AuthorName : "unknown"}</p>
                                        <p><b>Total Questions</b>: {quiz.questions.length}</p>
                                    </div>
                                    <Link to={`/quizzes/${quiz.id}`} className='bg-blue-500 text-white py-2 px-5 rounded-md shadow-md w-fit mx-auto'>View Quiz</Link>
                                </li>
                            ))}
                        </ul>
                }
            </div>
        </section>
    );
};

export default CategoryQuizzesPage;
