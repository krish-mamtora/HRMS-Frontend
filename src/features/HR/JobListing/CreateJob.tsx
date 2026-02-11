import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import api from '../../auth/api/axios';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
type Props = {}

export interface JobCreate {
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

const CreateJob = (props: Props) => {
       const [feedback , setFeedback]= useState({message:'' , error:''});
        
        const [formData , setFormData] = useState<JobCreate>({
            Title : '',
            Description : '',
            Status : '',
            ExpYearsReq : 0,
            Role: '',
            TotalPositions:0,
            JdUrl:'',
            ContactMail:'',
           ManagedBy : Number(localStorage.getItem('id'))||0
        });
    
        const handleChange = (e:ChangeEvent<HTMLInputElement| HTMLSelectElement | HTMLTextAreaElement>)=>{
           const {name , value} = e.target;
            setFormData ((prevData)=>({
                ...prevData , [name]:value,
            }))
        }
     const navigate = useNavigate();

            const handleClose = () =>{
                navigate('/hr/jobs/');
            }
    const handleSubmit =async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log("Form data : ",formData);
        console.log(localStorage.getItem('id'));
        // console.log(formData.ManagedBy);
       if(!formData.ContactMail||!formData.JdUrl||!formData.ManagedBy||!formData.Title||!formData.Description||!formData.Status||!formData.ExpYearsReq||!formData.Role||!formData.TotalPositions){
            setFeedback(prev => ({ ...prev, error: 'Please enter all fields' }));
                return;
       }try{

        console.log("Form data : ",formData);
            const res = await api.post("/jobListing" , formData)
            if(res.status === 200){
                alert("Job created");
            }
        }catch(err){
            if(axios.isAxiosError(err)){
                const axiosError = err as AxiosError<{message:string}>;
                setFeedback(prev=>({...prev , error:axiosError.response?.data?.message || 'failed to add Job'}))
            }else{
                setFeedback(prev=>({...prev , error:'An error occured'}));
            }
       }
    }

  return (
    <>
    <button onClick={handleClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Close</button>

    <div>Open Position Form</div>
    <div className="">
        <form onSubmit={handleSubmit}  className="flex items-center space-x-4  bg-gray-100">
            <label htmlFor="Title" className="block mb-2.5 text-sm font-medium text-heading">Title : </label>
            <input type="text" id="Title" name="Title" className="border border-gray-300 rounded px-2 py-1 w-full"  value={formData.Title} onChange={handleChange} required />
            
            <label htmlFor="Description"  className="block mb-2.5 text-sm font-medium text-heading">Description : </label>
            <input type="text" id="Description" name="Description" className="border border-gray-300 rounded px-2 py-1 w-full"  value={formData.Description} onChange={handleChange} required />
            
            <label htmlFor="ExpYearsReq"  className="block mb-2.5 text-sm font-medium text-heading">Experiance Required : </label>
            <input type="number" id="ExpYearsReq" name="ExpYearsReq" className="border border-gray-300 rounded px-2 py-1 w-full" value={formData.ExpYearsReq} onChange={handleChange} required/>
         
            <label htmlFor="Role"  className="block mb-2.5 text-sm font-medium text-heading">Role : </label>
            <input type="text" id="Role" name="Role" className="border border-gray-300 rounded px-2 py-1 w-full" value={formData.Role} onChange={handleChange} required/>

            <label htmlFor="Status" className="block mb-2.5 text-sm font-medium text-heading">Select Status</label>
            <select id="Status" name="Status"  value={formData.Status} onChange={handleChange} required className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                <option value="open">Open</option>
                <option value="on hold">On Hold</option>
                <option value="closed">Closed</option>
            </select>

            <label htmlFor="TotalPositions"  className="block mb-2.5 text-sm font-medium text-heading">No of Openings : </label>
            <input type="number" id="TotalPositions" name="TotalPositions" className="border border-gray-300 rounded px-2 py-1 w-full" value={formData.TotalPositions} onChange={handleChange} required/>

           <label htmlFor="JdUrl"  className="block mb-2.5 text-sm font-medium text-heading">Job Description : </label>
            <input type="text" id="JdUrl" name="JdUrl" className="border border-gray-300 rounded px-2 py-1 w-full" value={formData.JdUrl} onChange={handleChange} required/>
             
            <label htmlFor="ContactMail"  className="block mb-2.5 text-sm font-medium text-heading">Contact Mail : </label>
            <input type="email" id="ContactMail" name="ContactMail" className="border border-gray-300 rounded px-2 py-1 w-full" value={formData.ContactMail} onChange={handleChange} required/>
              
            <input type="hidden" id="ManagedBy" name="ManagedBy" value={localStorage.getItem('id')||''} required/>

            <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Create job</button>
        </form>        
    </div>

    </>
  )
}
export default CreateJob