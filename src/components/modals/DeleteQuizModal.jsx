import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DeleteQuizModal = ({ openModal, setOpenModal, handleDelete }) => {
    return (
        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500">
                        Are you sure you want to delete this quiz?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button className="bg-red-500 hover:!bg-red-600" onClick={() => {
                            handleDelete();
                            setOpenModal(false);
                        }}>
                            Yes, delete
                        </Button>
                        <Button color="success" onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default DeleteQuizModal;
