import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import useJobs from '../hooks/useJobs';
import api from '../../auth/api/axios';
type Props = {}

export interface JobCreate {
  Id : number;
  Title: string;
  Description: string;
  Status : string;
  ExpYearsReq: number;
  Role: string;
  TotalPositions: number;
  JdUrl:string;
  ContactMail:string
  ManagedBy : number;
}

export interface ReferalCreate{
    JobId :number,
    ReffName : string ,
    ReffMail : string , 
    ReffResumeUrl : string , 
    EmpId : number , 
    Description : string ,  
}
const Jobs = (props: Props) => {

    const [formData , setFormData] = useState<ReferalCreate>({
        JobId:0,
        ReffMail:'',
        ReffResumeUrl:'',
        ReffName:'',
        EmpId: parseInt(localStorage.getItem('id')||'0'),
        Description:'',
    });

      const {data , isLoading , isError , error} = useJobs();
    
        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
  
        const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
            const {name , value} = e.target;
            setFormData ((prevData)=>({
                ...prevData , [name]:value,
            }))
        }
       const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
            e.preventDefault();
            console.log(formData);

            if(!formData.EmpId||!formData.JobId||!formData.ReffMail||!formData.ReffName||!formData.ReffResumeUrl){
                alert("Please fill required fields!!");
                return ;
            }
            try{
                const res = await api.post("/Referal" ,formData);
                if(res.status >= 200 && res.status < 300){
                     alert("Friend Reffered !!")
                }
            }catch(err){
               alert(err.message);
            }
       }
        const openModal = (jobId: number) => {
            setFormData(prev => ({...prev, JobId: jobId}));
            (document.getElementById(`refer_friend_model_${jobId}`) as HTMLDialogElement)?.showModal();
        };
        const closeModal = (jobId: number) => {
            (document.getElementById(`refer_friend_model_${jobId}`) as HTMLDialogElement)?.close();
        };

  return (
    <>
        <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Job Position</div>
         
       <div className="p-4">
             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((job) => (
                
                <li key={job.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold text-slate-900">Title : {job.title}</h2>
                    <p className="text-sm text-sky-700 font-medium">Role : {job.role}</p>
                   <p className="text-sm text-sky-700 font-medium">JD : {job.description}</p>
                   <p className="text-sm text-sky-700 font-medium">Exp: {job.expYearsReq}</p>
                    <h2>Contact Mail : {job.contactMail}</h2>
                    <h2>No of Positions : {job.totalPositions}</h2>
                    <h2>Job Url : {job.jdUrl}</h2>
                    <h2>Status : {job.status}</h2>
                    <div>
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mr-5 mt-2"
                        onClick={()=>openModal(job.id)}
                        >Refer Friend</button>

                        <dialog id={`refer_friend_model_${job.id}`}  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-26">
                            <div className="w-full max-w-xs">
                                <h3 className="font-bold text-lg">Refer Friend for : {job.title}</h3>
                                <p className="py-4">Please enter your friends detials below</p>
                                <div className="modal-action">
                                <form method="dialog" onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffName">
                                            Name
                                        </label>
                                        <input value={formData.ReffName} onChange={handleChange} id="ReffName" name='ReffName'  type="text" placeholder="Name of your Friend.."  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffName">
                                            Email
                                        </label>
                                        <input value={formData.ReffMail} onChange={handleChange} id="ReffName" type="email" name='ReffMail' placeholder="Email address of your Friend.." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                                    </div>
                                     <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReffResumeUrl">
                                            Resume
                                        </label>
                                        <input value={formData.ReffResumeUrl} onChange={handleChange} id="ReffResumeUrl" name='ReffResumeUrl' type="text" placeholder="Resume of your Friend.." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Description">
                                            Note
                                        </label>
                                        <input value={formData.Description} onChange={handleChange} id="Description" type="text" name='Description' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Name of your Friend.."/>
                                    </div>
                                    <input type="hidden" />
                                   <div className='flex justify-end'>
                                    <button type="button" className="mr-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={()=>closeModal(job.id)}  >Close</button> 
                                    <button  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Refer !</button>
                                 </div>
                                </form>
                                </div>
                            </div>
                        </dialog>

                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Share Job</button>
                    </div>
                </li>
                ))}
            </ul>
         </div>
    </>
  )
}

export default Jobs;