import { Link } from "react-router-dom";

const QuizControls = ({
    questionsLength,
    userSubmitted,
    quizStart,
    time,
    formattedTime,
    setOpenStartModal,
    setMethodOnModal,
    setMessageOnModal,
    handleSubmit,
    setUserResponses,
    percentage,
    score
}) => (
    <>
        <span className={`font-bold text-lg ${quizStart && time <= 60 ? "text-red-500" : ""}`}>
            Timer: {quizStart ? formattedTime : "00 : 00 : 00"}
        </span>
        {
            userSubmitted ?
                (<>
                    <p>Last Percentage: <span>{percentage} %</span></p>
                    <p>Your Last Score: <span>{score} / {questionsLength}</span></p>
                </>
                )
                : (
                    <>
                        {!quizStart ?
                            (
                                <button
                                    className="bg-green-300 px-5 py-1 rounded-lg shadow-md"
                                    type="button"
                                    onClick={() => {
                                        setOpenStartModal(true);
                                        setMethodOnModal('start');
                                        setMessageOnModal('Are you sure you want to start the quiz now?');
                                    }}
                                >
                                    Start Quiz
                                </button>
                            )
                            :
                            (
                                <div className="flex items-center gap-5">
                                    <button
                                        className="bg-green-300 px-5 py-1 rounded-lg shadow-md hover:shadow-xl hover:brightness-125 duration-200"
                                        type="button"
                                        onClick={() => {
                                            setOpenStartModal(true);
                                            setMethodOnModal('submit');
                                            setMessageOnModal(
                                                'Are you sure you want to submit the quiz?'
                                            );
                                        }}
                                    >
                                        Submit Quiz
                                    </button>
                                    <button
                                        className="bg-red-300 px-5 py-1 rounded-lg shadow-md hover:shadow-xl hover:brightness-125 duration-200"
                                        type="button"
                                        onClick={() => {
                                            setOpenStartModal(true);
                                            setMethodOnModal('cancel');
                                            setMessageOnModal(
                                                'Are you sure you want to cancel the quiz?'
                                            );
                                            setUserResponses([]);
                                        }}
                                    >
                                        Cancel Quiz
                                    </button>
                                </div>
                            )
                        }
                    </>
                )
        }
    </>
);

export default QuizControls;
