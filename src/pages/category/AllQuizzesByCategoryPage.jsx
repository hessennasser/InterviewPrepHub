import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';


const AllQuizzesByCategoryPage = () => {
    const db = getFirestore();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategoriesAndQuizzes = async () => {
            const categoriesCollectionRef = collection(db, 'categories');
            const categoriesQuerySnapshot = await getDocs(categoriesCollectionRef);
            const categoriesData = categoriesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesData);

            setLoading(true);
            const quizzesCollectionRef = collection(db, 'quizzes');
            const quizzesQuerySnapshot = await getDocs(quizzesCollectionRef);
            const quizzesData = quizzesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLoading(false);

            // Assign quizzes to categories
            const categoriesWithQuizzes = categoriesData.map(category => ({
                ...category,
                quizzes: quizzesData.filter(quiz => quiz.category.id === category.id)
            }));
            setCategories(categoriesWithQuizzes);
        };

        fetchCategoriesAndQuizzes();
    }, [db]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="py-10">
            <div className="container">
                {categories.map(category => {
                    if (category.quizzes.length > 0) {
                        return (
                            <div key={category.id} className="mb-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">{category.title}</h2>
                                    <Link className='text-blue-400 font-bold' to={`/category/${category.id}`}>View All Quizzes</Link>
                                </div>
                                <p className="my-4 text-center">{category.description}</p>
                                <Swiper
                                    pagination={{
                                        dynamicBullets: true,
                                    }}
                                    modules={[Pagination]}
                                    className="mySwiper py-5"
                                    breakpoints={{
                                        // when window width is >= 640px
                                        0: {
                                            slidesPerView: 1,
                                            spaceBetween: 20,
                                        },
                                        560: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        },
                                        740: {
                                            slidesPerView: 3,
                                            spaceBetween: 20,
                                        },
                                        960: {
                                            slidesPerView: 3,
                                            spaceBetween: 20,
                                        },
                                    }}
                                    centeredSlidesBounds
                                >
                                    {category.quizzes.map(quiz => (
                                        <SwiperSlide>
                                            <li key={quiz.id} className="bg-gray-100 p-4 rounded-md shadow-md grid gap-2">
                                                <h2 className="text-lg font-semibold mb-2">
                                                    {quiz.title.length > 20 ? `${quiz.title.slice(20)}..` : quiz.title}
                                                </h2>
                                                <p className='flex items-center justify-between'><b>Author: </b>{quiz.AuthorName ? quiz.AuthorName : "unknown"}</p>
                                                <p className='flex items-center justify-between'><b>Total Questions: </b>{quiz.questions.length}</p>
                                                <Link to={`/quizzes/${quiz.id}`} className='bg-blue-500 text-white py-2 px-5 rounded-md shadow-md w-fit mx-auto'>View Quiz</Link>
                                            </li>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        );
                    }
                    return null; // Return null if no quizzes in the category
                })}
            </div>
        </section>

    );
};

export default AllQuizzesByCategoryPage;
