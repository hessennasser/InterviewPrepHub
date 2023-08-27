import React, { useState } from 'react'
import img from "../../assets/images/noData.svg";
import ShareBox from '../shareBox/ShareBox';

const NoAttemptYet = ({quizId}) => {

    const [showShareBox, setShowShareBox] = useState(false);


    const handleShareClick = () => {
        setShowShareBox(!showShareBox);
    };

    return (
        <>
            <div className='container flex flex-col items-center justify-center py-10 gap-5'>
                <img className='w-48 md:max-w-sm' src={img} alt="There are no attempts on your quiz yet." />
                <p className="text-red-500 text-xl text-center">
                    There are no attempts on your quiz yet.
                </p>
                <button
                    onClick={() => handleShareClick()}
                    className="bg-blue-800 text-white inline-flex items-center justify-center p-2 border-l"
                >
                    Share Your Quiz!
                </button>
            </div>
            {showShareBox && (
                <ShareBox link={`http://your-website.com/quizzes/${quizId}`} message={"Share this quiz:"} buttonText={"Copy Link"} showShareBox={showShareBox} setShowShareBox={setShowShareBox} />
            )}
        </>
    )
}

export default NoAttemptYet
