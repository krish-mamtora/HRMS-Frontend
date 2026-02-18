import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../../auth/api/axios';
import type {  ShareJob } from './types';

interface ModalProps {
    jobId: number;
    jobTitle: string;
    isOpen: boolean;
    onClose: () => void;
}
const SharejobModal: React.FC<ModalProps> = ({ jobId, jobTitle, isOpen, onClose }) => {
    const [formData, setFormData] = useState<ShareJob>({
        JobId: jobId,
        ReceiverMail: '',
        Subject: '',
        Message: '',
        EmpId: parseInt(localStorage.getItem('id') || '0'),
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      
    //   console.log(formData);
    // };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await api.post('/ShareJob', formData);
        if (response.status === 200) {
            alert("Email sent successfully!");
            onClose(); 
        }
    } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send email. Check console for details.");
    }
};

    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-26">
            <div className="w-full max-w-xs">
                <h3 className="font-bold text-lg">Refer Friend for : {jobTitle}</h3>
                <p className="py-4">Please enter your friends details below</p>
                <form method="dialog" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffName">
                            Email
                        </label>
                        <input value={formData.ReceiverMail} onChange={handleChange} id="ReceiverMail" type="email" name='ReceiverMail' placeholder="Email address of your Friend.." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Subject">
                            Subject
                        </label>
                        <input value={formData.Subject} onChange={handleChange} id="Subject" type="text" name='Subject' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Subject" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Message">
                            Message
                        </label>
                        <input value={formData.Message} onChange={handleChange} id="Message" type="text" name='Message' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Message" />
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type="button"
                            className="mr-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Send Email !
                        </button>
                    </div>
                </form>
            
            </div>
        </dialog>
    );
};

export default SharejobModal;