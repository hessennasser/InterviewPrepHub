import React from 'react'
import img from "../../assets/images/notFound.svg";

const DataNotFounded = ({message}) => {
    return (
        <div className='container flex flex-col items-center justify-center py-10 gap-5'>
            <img className='w-48 md:max-w-sm' src={img} alt="There are no attempts on your quiz yet." />
            <p className="text-red-500 text-xl text-center">
                {message}
            </p>
        </div>
    )
}

export default DataNotFounded
