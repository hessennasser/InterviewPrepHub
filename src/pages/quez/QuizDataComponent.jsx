import React, { useState, useEffect } from 'react';
import QuestionComponent from './QuestionComponent';

const QuizDataComponent = ({ quizData, currentQuestionIndex, setTimeout, setFormattedTime, start, order, userResponses, setUserResponses, openStartModal }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer.id);
        // Update userResponses based on the order of the question
        setUserResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            updatedResponses[order - 1] = answer;
            return updatedResponses;
        });
    };



    const [quizTimer, setQuizTimer] = useState(quizData.questions.reduce((totalTime, question) => totalTime + parseInt(question.time), 0));

    useEffect(() => {
        if (start && !openStartModal) {
            const timer = setInterval(() => {
                const remainingTime = quizTimer - 1;
                setQuizTimer(remainingTime);
                if (remainingTime <= 0) {
                    clearInterval(timer);
                    return;
                    // Handle time's up for the entire quiz
                }
            }, 1000);
            setTimeout(quizTimer)
            setFormattedTime(formatTime(quizTimer))
            return () => clearInterval(timer);
        } else {
            setTimeout(quizTimer)
            setFormattedTime(formatTime(quizTimer))
        }
    }, [quizTimer, start, openStartModal]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div>
            <QuestionComponent
                order={order}
                question={currentQuestionIndex}
                onSelectAnswer={handleAnswerClick}
            />
        </div>
    );
};

export default QuizDataComponent;
