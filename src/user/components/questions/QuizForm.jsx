import React from 'react';

const QuizForm = ({
    quizTitle,
    quizDescription,
    quizCategory,
    categories,
    setQuizTitle,
    setQuizDescription,
    setQuizCategory,
}) => {
    return (
        <div className="bg-slate-400 p-5 grid gap-5">
            <input
                type="text"
                placeholder="Quiz Title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <textarea
                placeholder="Quiz Description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="w-full p-2 border rounded min-h-[50px] max-h-28"
            />
            <select
                value={quizCategory}
                onChange={(e) => setQuizCategory(e.target.value)}
                className="w-full p-2 border rounded"
            >
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default QuizForm;
