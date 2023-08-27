import React from 'react';

const QuizResultComponent = ({ userResponses, quizData }) => {
    return (
        <div className="container">
            <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
            {quizData.questions.map((question, index) => {
                const userResponse = userResponses[index];
                const isCorrect = userResponse?.isCorrect || false;

                return (
                    <div key={index} className="border p-4 rounded shadow mb-6">
                        <h3 className="text-lg font-semibold mb-2 bg-gray-600 text-white p-4 flex items-center">
                            <span className="bg-blue-400 rounded-full inline-flex w-9 h-9 mr-2 items-center justify-center">
                                {`${index + 1}`}
                            </span>
                            {question.question}
                        </h3>
                        <ul className="list-none p-0 m-0 grid grid-cols-2 gap-5">
                            {question.answers.map((answer) => {
                                const isUserSelected = userResponse?.id === answer.id;

                                return (
                                    <li
                                        key={answer.id}
                                        className={`p-3 cursor-pointer rounded border flex items-center justify-between ${isUserSelected
                                            ? isCorrect
                                                ? 'bg-green-200 border-green-500 hover:text-white border-2'
                                                : 'bg-red-200 border-red-500'
                                            : 'border-gray-300 hover:bg-gray-100'
                                            } ${answer.isCorrect ? "bg-green-400 hover:bg-green-500 hover:text-white" : ""}`}
                                    >
                                        <span
                                            className={`ml-2 ${isUserSelected && !isCorrect ? 'line-through' : ''}`}
                                        >
                                            {answer.content}
                                        </span>
                                        {isUserSelected && isCorrect &&
                                            (
                                                <span className="ml-2 text-green-600 font-bold">✓</span>
                                            )
                                        }

                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default QuizResultComponent;
