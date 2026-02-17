import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../../auth/api/axios';
import type { ShareJob } from './types';

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

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Update form data when jobId changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      JobId: jobId,
      EmpId: parseInt(localStorage.getItem('id') || '0'),
    }));
  }, [jobId, isOpen]); // Added isOpen to refresh data on open

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await api.post("/ShareJob", formData);
      setMessage('Job shared successfully!');
      
      // Reset form fields
      setFormData((prev) => ({
        ...prev,
        ReceiverMail: '',
        Subject: '',
        Message: '',
      }));

      // Close after delay
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage('Failed to share job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop overlay for better modal feel
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
        <h3 className="font-bold text-2xl mb-2">Share Job: {jobTitle}</h3>
        <p className="text-gray-600 mb-6">Please enter your friend's details below</p>
        
        {message && (
          <div className={`p-3 mb-4 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReceiverMail">
              Friend's Email
            </label>
            <input
              value={formData.ReceiverMail}
              onChange={handleChange}
              id="ReceiverMail"
              type="email"
              name='ReceiverMail'
              placeholder="friend@example.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Subject">
              Subject
            </label>
            <input
              value={formData.Subject}
              onChange={handleChange}
              id="Subject"
              type="text"
              name='Subject'
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Check out this job!"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Message">
              Message
            </label>
            <textarea
              value={formData.Message}
              onChange={handleChange}
              id="Message"
              name='Message'
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Tell your friend why they should apply..."
            />
          </div>

          <div className='flex justify-end gap-3'>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharejobModal;
