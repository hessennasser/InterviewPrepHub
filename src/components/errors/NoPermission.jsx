import React from 'react'
import img from "../../assets/images/noPermission.svg";
import { Link } from 'react-router-dom';
const NoPermission = () => {
    return (
        <div className='container flex flex-col items-center justify-center py-10 gap-5'>
            <img className='w-48 md:max-w-sm' src={img} alt="You do not have permission to view this quiz's attempts!" />
            <p className="text-red-500 text-xl text-center">
                You do not have permission to view this quiz's attempts!
            </p>
            <Link to="/profile" className='bg-green-400 text-white py-2 px-5 rounded-md shadow-md'>Go To Your Profile</Link>
        </div>
    )
}

export default NoPermission
