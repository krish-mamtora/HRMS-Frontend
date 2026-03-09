import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useJobs, useUpdateJob } from '../hooks/useJobs';
import type { Job } from '../../Employee/JobListing/types';

type Props = {}

export interface JobCreate {
    Id: number;
    Title: string;
    Description: string;
    Status: string;
    ExpYearsReq: number;
    Role: string;
    TotalPositions: number;
    ReviewerEmail: string;
    JdUrl: string;
    ContactMail: string
    ManagedBy: number;
}

const Jobs = (props: Props) => {

    const navigate = useNavigate();
    const location = useLocation();
    const isCreating = location.pathname.includes('/create');

    const handleRedirect = () => {
        navigate('/hr/jobs/create');
    }
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const { mutate, isPending } = useUpdateJob();

    const { data, isLoading, error } = useJobs();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    console.log(typeof (data));

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleDownload = async (e: React.MouseEvent, JdUrl: string) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:7035/api/jobListing/downloadJD/${JdUrl}`);
            if (!response.ok) {
                throw new Error('Could not download the file. Please check if the file exists.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const fileName = JdUrl.includes('_') ? JdUrl.split('_').slice(1).join('_') : JdUrl;
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download proof. Please try again.");
        }
    };
    const handleApplications = (id: number) => {

        navigate(`/hr/jobs/${id}`)
    }
    const handleEditClick = (job: Job) => {
        setEditingJob(job);
        setSelectedFile(null);
    };
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingJob) {
            return;
        }
        const formData = new FormData();
        formData.append('Title', editingJob.title);
        formData.append('Description', editingJob.description);
        formData.append('Role', editingJob.role);
        formData.append('ExpYearsReq', editingJob.expYearsReq.toString());
        formData.append('TotalPositions', editingJob.totalPositions.toString());
        formData.append('ContactMail', editingJob.contactMail);
        formData.append('ReviewerEmail', editingJob.reviewerEmail);
        formData.append('Status', editingJob.status);

        if (selectedFile) {
            formData.append('JdUrl', selectedFile);
        }

        mutate({ id: editingJob.id, updatedJob: formData }, {
            onSuccess: () => {
                setEditingJob(null);
                setSelectedFile(null);
            },
        }
        );
    };

    return (
        <>
        <div className='p-4'>
         <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Job Creation and Refferal</div>
            <div className='flex justify-end'>
                {!isCreating && (
                    <button
                        onClick={handleRedirect}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Create New
                    </button>
                )}
            </div>
            <div>
                <Outlet />
            </div>

            {editingJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
                    <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-xl my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Position: {editingJob.title}</h2>
                            <button onClick={() => setEditingJob(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm">Close</button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" value={editingJob.title} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={editingJob.description} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                                    <input type="number" value={editingJob.expYearsReq} onChange={(e) => setEditingJob({ ...editingJob, expYearsReq: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input type="text" value={editingJob.role} onChange={(e) => setEditingJob({ ...editingJob, role: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={editingJob.status} onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white" required>
                                        <option value="Open">Open</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Openings</label>
                                    <input type="number" value={editingJob.totalPositions} onChange={(e) => setEditingJob({ ...editingJob, totalPositions: parseInt(e.target.value) || 1 })} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Email</label>
                                    <input type="email" value={editingJob.reviewerEmail} onChange={(e) => setEditingJob({ ...editingJob, reviewerEmail: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input type="email" value={editingJob.contactMail} onChange={(e) => setEditingJob({ ...editingJob, contactMail: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-blue-600">Update JD (Optional)</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full border border-gray-300 rounded-md px-3 py-2" accept=".pdf,.doc,.docx" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow disabled:bg-gray-400 transition">
                                    {isPending ? 'Updating Position...' : 'Update Job Opening'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="p-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.map((job) => (
                        <li key={job.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-slate-900">Title : {job.title}</h2>
                            <p className="text-sm text-sky-700 font-medium">Role : {job.role}</p>
                            <p className="text-sm text-sky-700 font-medium">JD : {job.description}</p>
                            <p className="text-sm text-sky-700 font-medium">Exp: {job.expYearsReq}</p>
                            <h2>Contact Mail : {job.contactMail}</h2>
                            <h2>Reviewer Mail : {job.reviewerEmail}</h2>
                            <h2>No of Positions : {job.totalPositions}</h2>
                            <a onClick={(e) => handleDownload(e, job.jdUrl)} className='font-medium text-blue-600 hover:underline flex items-center'>
                                Job Description Document
                            </a>
                            <h2>Status : {job.status}</h2>
                            <button onClick={() => handleApplications(job.id)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition duration-200">Manage</button>
                            <button onClick={() => handleEditClick(job)} className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition duration-200">Edit</button>
                        </li>
                    ))}
                </ul>
            </div>

            </div>
        </>
    )
}

export default Jobs;