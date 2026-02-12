import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import useJobs from '../hooks/useJobs';
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

const Jobs = (props: Props) => {

   const navigate = useNavigate();

      const {data , isLoading , isError , error} = useJobs();
    
        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        const Managejobs = ()=>{
        }
  return (
    <>
        <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Job Creation and Refferal</div>
         
      <h1>Job Position List</h1>


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
                        onClick={()=>document.getElementById('refer_friend_model').showModal()}
                        >Refer Friend</button>

                        <dialog id="refer_friend_model"  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="w-full max-w-xs">
                                <h3 className="font-bold text-lg">Refer Friend for : {job.title}</h3>
                                <p className="py-4">Please enter your friends detials below</p>
                                <div className="modal-action">
                                <form method="dialog" >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                            Username
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name='username'  type="text" placeholder="Name of your Friend.." required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" name='email' placeholder="Email address of your Friend.." required/>
                                    </div>
                                     <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
                                            Resume
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="resume" name='resume' type="file" placeholder="Resume of your Friend.." required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
                                            Note
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="note" type="note" name='note' placeholder="Name of your Friend.."/>
                                    </div>
                                   <div className='flex justify-end'>
                                    <button className="mr-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" id='Close'   onClick={()=>document.getElementById('refer_friend_model').close()}>Close</button> 
                                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Refer !</button>
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