import React, { useState, useEffect } from 'react';

const QuestionComponent = ({ question, order, onSelectAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const handleSelectAnswer = (answer) => {
        setSelectedAnswer(answer);
        onSelectAnswer(answer); // Notify the parent component about the selected answer
    };

    return (
        <div className="border p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-2 bg-gray-600 text-white p-4 flex items-center">
                <span className='bg-blue-400 rounded-full inline-flex w-9 h-9 mr-2 items-center justify-center'>
                    {`${order}`}
                </span>
                {question.question}
            </h3>
            <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-5">
                {question.answers.map((answer) => (
                    <label
                        key={answer.id}
                        className={`block p-3 cursor-pointer rounded border ${selectedAnswer === answer ? 'bg-blue-200 border-blue-500' : 'border-gray-300 hover:bg-gray-100'}`}
                        onClick={() => handleSelectAnswer(answer)}

                    >
                        <input
                            type="radio"
                            name="answer"
                            value={answer.id}
                            checked={selectedAnswer === answer}
                            className="hidden"
                            onChange={() => handleSelectAnswer(answer)}

                        />
                        <span className="ml-2">{answer.content}</span>
                    </label>
                ))}
            </ul>

        </div>
    );
};

export default QuestionComponent;
