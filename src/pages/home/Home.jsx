import React from 'react'
import HeroSection from '../../components/heroSection/HeroSection'
import AllCategoriesPage from '../category/AllCategoriesPage'
import AllQuizzesByCategoryPage from '../category/AllQuizzesByCategoryPage'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <AllCategoriesPage height={"h-fit"} />
            <AllQuizzesByCategoryPage />
        </div>
    )
}

export default Home
