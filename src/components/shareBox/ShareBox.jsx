import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ShareBox = ({ link, message, buttonText, showShareBox, setShowShareBox }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopySuccess(true);
            toast.success("Link successfully has copied");
            setTimeout(() => {
                setCopySuccess(false);
            }, 5000);

        } catch (error) {
            toast.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="bg-gray-800/20 fixed inset-0 flex items-center justify-center">
            <div className="bg-white px-2 py-5 shadow-lg rounded-lg w-full max-w-md grid gap-2 relative">
                <button
                    type="button"
                    className='p-2 bg-red-400 text-white w-fit absolute top-3 right-3'
                    onClick={() => setShowShareBox(false)}
                >
                    <FaTimes />
                </button>
                <p className='mt-5'>{message}</p>
                <div className='flex items-center gap-3'>
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="border rounded p-2 flex-1"
                    />
                    <button
                        type='button'
                        className='bg-green-400 text-white py-2 px-5'
                        onClick={copyToClipboard}
                        disabled={copySuccess}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShareBox;
