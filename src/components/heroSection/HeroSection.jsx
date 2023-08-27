import React from 'react';
import HeroImage from "../../assets/images/hero.svg"
import { Link } from 'react-router-dom';
const heroSection = () => {
    return (
        <section className="bg-blue-600 text-white py-20 min-h-[calc(100vh-64px)] flex items-center">
            <div className="container grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="h-full flex flex-col justify-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Welcome to InterviewPrepHub
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Your platform for interview preparation and career growth.
                    </p>
                    <Link to="/register" className="bg-white w-fit text-blue-600 hover:bg-green-400 hover:text-white py-2 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300">
                        Get Started
                    </Link>
                </div>
                <div>
                    <img src={HeroImage} alt="interview preparation" className='w-2/3 mx-auto' />
                </div>
            </div>
        </section>
    );
};

export default heroSection;
