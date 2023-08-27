import { Button, Modal } from 'flowbite-react'
import React from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi"
const QuestionModal = ({ openModal, setOpenModal, setQuizStart, to, message, handleSubmit, quizDocId, categoryId }) => {
    return (
        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
            <Modal.Header />
            <Modal.Body >
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        {message}
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="success" onClick={() => {
                            setOpenModal(false);
                            if (to === "start") {
                                setQuizStart(true);
                                return;
                            } else if (to === "cancel") {
                                setQuizStart(false);
                                return;
                            } else if (to === "submit") {
                                handleSubmit();
                                setQuizStart(false);
                                return;
                            } else if (to === "delete item") {
                                
                            }
                        }}>
                            Yes, I'm sure
                        </Button>
                        <Button color="gray" onClick={() => setOpenModal(false)}>
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default QuestionModal
