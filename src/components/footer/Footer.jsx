import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-blue-600 py-5 text-white'>
            <p className="text-center text-lg">Copyright © {new Date().getFullYear()} <a className='underline' href="https://sm8rtdev.online/">Hessen Nasser</a></p>
        </footer>
    )
}

export default Footer
