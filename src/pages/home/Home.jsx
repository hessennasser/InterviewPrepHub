import React from 'react'
import HeroSection from '../../components/HeroSection/HeroSection'
import AllCategoriesPage from '../category/AllCategoriesPage'
import AllQuizzesByCategoryPage from '../category/AllQuizzesByCategoryPage'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <AllCategoriesPage />
            <AllQuizzesByCategoryPage />
        </div>
    )
}

export default Home
