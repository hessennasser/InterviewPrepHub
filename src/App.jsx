import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'
import Header from './components/header/header'
import Register from './user/components/auth/Register'
import Login from './user/components/auth/Login'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile';
import AddQuestionPage from './user/components/questions/AddQuestionPage';
import QuizPage from './pages/quez/QuizPage';
import QuizResultsPage from './pages/quizResults/QuizAttemptsPage';
import UserAttemptedQuizzes from './pages/quizResults/UserAttemptedQuizzes';
import CategoryQuizzesPage from './pages/Category/CategoryQuizzesPage';
import AllCategoriesPage from './pages/category/AllCategoriesPage';
import Footer from './components/footer/Footer';

function App() {

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
        theme="light"
      />

      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* Private Routes */}
        <Route path='/profile' element={<Profile />} />
        <Route path='/add-quiz' element={<AddQuestionPage />} />
        <Route path='/quizzes/:quizId' element={<QuizPage />} />
        <Route path='/quizzes/results/:quizId' element={<QuizResultsPage />} />
        <Route path='/user/attempts' element={<UserAttemptedQuizzes />} />
        <Route path='/all-categories' element={<AllCategoriesPage />} />
        <Route path='/category/:categoryId' element={<CategoryQuizzesPage />} />

      </Routes>
      <Footer />
    </>
  )
}

export default App
