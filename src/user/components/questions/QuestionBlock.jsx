import React from 'react';
import AnswerInput from './AnswerInput';

const QuestionBlock = ({
    questionIndex,
    questionsLength,
    question,
    time,
    answers,
    handleQuestionChange,
    handleTimeChange,
    handleAnswerChange,
    removeQuestion,
}) => {
    return (
        <div className="space-y-2 pb-2 border-slate-800 border-b question-block">
            <div className="flex flex-col sm:flex-row gap-5">
                <textarea
                    placeholder={`Question ${questionIndex + 1}`}
                    value={question}
                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                    className="flex-1 p-2 border rounded min-h-[50px] max-h-28"
                />
                <input
                    placeholder="time (seconds)"
                    type="number"
                    min="1"
                    value={time}
                    onChange={(e) => handleTimeChange(questionIndex, e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {answers.map((answer, answerIndex) => (
                    <AnswerInput
                        key={answerIndex}
                        questionIndex={questionIndex}
                        answerIndex={answerIndex}
                        answer={answer}
                        handleAnswerChange={handleAnswerChange}
                    />
                ))}
            </div>
            {questionsLength > 1 && (
                <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 mx-auto block w-fit"
                >
                    Remove Question
                </button>
            )}
        </div>
    );
};

export default QuestionBlock;
