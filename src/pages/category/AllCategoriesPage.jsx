import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { BallTriangle } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

const AllCategoriesPage = () => {
    const db = getFirestore();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCollectionRef = collection(db, 'categories');

            try {
                setLoading(true);
                const querySnapshot = await getDocs(categoriesCollectionRef);
                const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [db]);

    return (
        <section className="py-10 min-h-screen">
            <div className="container">
                <h2 className="text-2xl font-bold mb-4">All Categories</h2>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
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
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {categories.map(category => (
                            <li key={category.id} className="bg-gray-100 p-4 rounded-md shadow-md h-full grid items-end">
                                <h3 className="text-lg font-semibold">{category.title}</h3>
                                <p className='font-light'>{category.description}</p>
                                <Link className='text-blue-400' to={`/category/${category.id}`}>See Quizzes</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default AllCategoriesPage;
