import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaPlus, FaTimes, FaUserAlt, FaUserCircle } from "react-icons/fa"
import { AiFillCaretDown, AiOutlineRight } from "react-icons/ai"
import { BiLogOutCircle } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../states/userSlice';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { name } = useSelector((state) => state.user)
    const logged = localStorage.getItem("logged");
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [smallNav, setSmallNav] = useState(false)
    return (
        <header className=" bg-blue-600 border-b py-4 min-h-[64px]">
            <nav className="container mx-auto flex justify-between items-center gap-2">
                <div>
                    <Link to="/" className="text-white text-lg font-semibold">InterviewPrepHub</Link>
                </div>
                <div className='text-white hidden md:block flex-1'>
                    <ul className='flex items-center justify-center gap-4'>
                        <li>
                            <NavLink to="/all-categories" className="">All Categories</NavLink>
                        </li>
                    </ul>
                </div>

                <button type="button" onClick={() => setSmallNav(!smallNav)}>
                    {smallNav ? <FaTimes className='text-white block md:hidden text-xl' /> : <FaBars className='text-white block md:hidden text-xl' />}
                </button>

                <ul className="space-x-4 hidden md:flex">
                    {
                        logged ?
                            (
                                <>
                                    <button type='button' className='text-xl text-white flex items-center gap-2' onClick={() => setShowSubMenu(!showSubMenu)} >
                                        <FaUserCircle className='text-3xl' />
                                        <span className='capitalize'>{name}</span>
                                        <AiFillCaretDown className='mt-2' />
                                    </button>
                                    <Link to="/add-quiz" className="bg-blue-400 text-white inline-flex w-10 text-2xl items-center justify-center p-2">
                                        <FaPlus />
                                    </Link>
                                    {
                                        showSubMenu && (
                                            <div className='z-[10000] absolute rounded-lg shadow-lg bg-blue-100 w-[340px] max-w-[90%] sm:max-w-[340px] p-8 right-3 top-16 text-black'>
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex item-center justify-center gap-3">
                                                        <FaUserCircle className='text-3xl' />
                                                        <h2 className='text-xl font-bold capitalize'>{name}</h2>
                                                    </div>
                                                    <Link to="/profile" className="flex items-center justify-between font-medium">
                                                        <div className="flex items-center gap-2"><FaUserAlt />My account</div>
                                                        <AiOutlineRight />
                                                    </Link>
                                                    <button onClick={() => {
                                                        setShowSubMenu(false);
                                                        dispatch(logout());
                                                        navigate("/login");
                                                    }} className="flex items-center justify-between font-medium">
                                                        <div className="flex items-center gap-2"><BiLogOutCircle /> Logout</div>
                                                        <AiOutlineRight />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
                            )
                            :
                            (
                                <>
                                    <li><Link to="/login" className="bg-gray-600 px-5 text-white py-2 rounded-lg hover:shadow-lg hover:brightness-125 duration-200">Login</Link></li>
                                    <li><Link to="/register" className="bg-slate-200 px-5 text-black py-2 rounded-lg hover:shadow-lg hover:brightness-125 duration-200">Register</Link></li>
                                </>
                            )
                    }
                </ul>
                <aside className={`sidebar shadow-2xl rounded-r-2xl flex md:hidden ${smallNav ? "show" : ""} z-[100000000]`}>
                    <div className="flex flex-col gap-5 flex-1 mt-5 ">
                        <NavLink to="/all-categories" className=" bg-indigo-400 px-4 py-2 hover:rounded-r-2xl hover:bg-indigo-300 duration-300">All Categories</NavLink>
                    </div>
                    <div className="flex flex-col gap-4 border-t pt-2 px-4">
                        {
                            logged ?
                                (
                                    <>
                                        <div className="flex item-center justify-center gap-2">
                                            <FaUserCircle className='text-3xl' />
                                            <h2 className='text-xl font-bold capitalize'>{name}</h2>
                                        </div>
                                        <Link to="/profile" className="flex items-center justify-between font-medium">
                                            <div className="flex items-center gap-2"><FaUserAlt />My account</div>
                                            <AiOutlineRight />
                                        </Link>
                                        <button onClick={() => {
                                            setShowSubMenu(false);
                                            dispatch(logout());
                                            navigate("/login");
                                        }} className="flex items-center justify-between font-medium">
                                            <div className="flex items-center gap-2"><BiLogOutCircle /> Logout</div>
                                            <AiOutlineRight />
                                        </button>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Link to="/login" className="bg-gray-600 px-5 text-white py-2 rounded-lg hover:shadow-lg hover:brightness-125 duration-200 text-center">Login</Link>
                                        <Link to="/register" className="bg-slate-200 px-5 text-black py-2 rounded-lg hover:shadow-lg hover:brightness-125 duration-200 text-center">Register</Link>
                                    </>
                                )
                        }
                    </div>

                </aside>
            </nav>
        </header>
    );
}

export default Header;
