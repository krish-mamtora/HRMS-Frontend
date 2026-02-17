import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../../auth/api/axios';
import type { ReferalCreate } from './types';

interface ModalProps {
    jobId: number;
    jobTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

const ReferralModal: React.FC<ModalProps> = ({ jobId, jobTitle, isOpen, onClose }) => {
    const [formData, setFormData] = useState<ReferalCreate>({
        JobId: jobId,
        ReffMail: '',
        ReffResume: null,
        ReffName: '',
        EmpId: parseInt(localStorage.getItem('id') || '0'),
        Description: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value , type } = e.target;
        if(e.target instanceof HTMLInputElement && e.target.type === 'file'){
            const fileInput = e.target as HTMLInputElement;
            setFormData((prev) => ({ 
                ...prev, 
                [name]: fileInput.files ? fileInput.files[0] : null 
            }));
        }else{
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.EmpId || !formData.JobId || !formData.ReffMail || !formData.ReffName || !formData.ReffResume) {
            alert('Please fill required fields!!');
            return;
        }
        try {
               const data = new FormData();
                data.append('JobId', formData.JobId.toString());
                data.append('ReffName', formData.ReffName);
                data.append('ReffMail', formData.ReffMail);
                data.append('ReffResume', formData.ReffResume);
                data.append('EmpId', formData.EmpId.toString());
                data.append('Description', formData.Description);
                // console.log("Received Date: ",data);
                     for (let pair of (data as any).entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
                const res = await api.post('/Referal', data , {
                     headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                });
                
            if (res.status >= 200 && res.status < 300) {
                alert('Friend Referred !!');
                onClose();
            }       
        } catch (err: any) {
            alert(err.message);
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
                            Name
                        </label>
                        <input value={formData.ReffName} onChange={handleChange} id="ReffName" name='ReffName' type="text" placeholder="Name of your Friend.." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffName">
                            Email
                        </label>
                        <input value={formData.ReffMail} onChange={handleChange} id="ReffName" type="email" name='ReffMail' placeholder="Email address of your Friend.." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffResume">
                            Resume (PDF/DOCX)
                        </label>
                        <input 
                            onChange={handleChange} 
                            id="ReffResume" 
                            name="ReffResume" 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            required 
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffResumeUrl">
                            Resume
                        </label>
                        <input value={formData.ReffResumeUrl} onChange={handleChange} id="ReffResumeUrl" name='ReffResumeUrl' type="text" placeholder="Resume of your Friend.." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div> */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Description">
                            Note
                        </label>
                        <input value={formData.Description} onChange={handleChange} id="Description" type="text" name='Description' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Name of your Friend.." />
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
                            Refer !
                        </button>
                    </div>
                </form>
            
            </div>
        </dialog>
    );
};

export default ReferralModal;
