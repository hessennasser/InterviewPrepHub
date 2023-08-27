import React from 'react';

const AnswerInput = ({ answerIndex, questionIndex, answer, handleAnswerChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                placeholder={`Answer ${answerIndex + 1}`}
                value={answer.content}
                onChange={(e) =>
                    handleAnswerChange(questionIndex, answerIndex, 'content', e.target.value)
                }
                className="w-full p-2 border rounded"
            />
            <input
                type="checkbox"
                checked={answer.isCorrect}
                onChange={(e) =>
                    handleAnswerChange(questionIndex, answerIndex, 'isCorrect', e.target.checked)
                }
                className="h-full w-1/12 ml-2 cursor-pointer"
            />
        </div>
    );
};

export default AnswerInput;
