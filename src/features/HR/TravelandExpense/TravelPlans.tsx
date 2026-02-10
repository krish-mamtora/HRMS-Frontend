import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import api from '../../auth/api/axios';
import type { AxiosError } from 'axios';
import axios from 'axios';
type Props = {}

export interface TravelPlanData {
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
    createdByUserId : number;
}

const TravelPlans = (props: Props) => {

    const [feedback , setFeedback]= useState({message:'' , error:''});
    
    const [formData , setFormData] = useState<TravelPlanData>({
        startDate : '',
        endDate : '',
        destination : '',
        purpose : '',
        createdByUserId :0
    });

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
       const {name , value} = e.target;
        setFormData ((prevData)=>({
            ...prevData , [name]:value,
        }))
    }

    const handleSubmit =async (e:FormEvent<HTMLFormElement>)=>{
       e.preventDefault();
       console.log(formData);
       if(!formData.startDate||!formData.createdByUserId||!formData.destination||!formData.endDate||!formData.purpose){
            setFeedback(prev => ({ ...prev, error: 'Please enter all fields' }));
                return;
       }try{
            const res = await api.post("/TravelPlan" , formData)
            if(res.status === 200){
                alert("Plan created");
            }
        }catch(err){
            if(axios.isAxiosError(err)){
                const axiosError = err as AxiosError<{message:string}>;
                setFeedback(prev=>({...prev , error:axiosError.response?.data?.message || 'failed to add plan'}))
            }else{
                setFeedback(prev=>({...prev , error:'An error occured'}));
            }
       }
    }
  return (
    <>
        <div>TravelPlans</div>

        <form onSubmit={handleSubmit}>
            <label htmlFor="destination">Destination : </label>
            <input type="text" id="destination" name="destination" value={formData.destination} onChange={handleChange} required />
               <label htmlFor="purpose">purpose : </label>
            <input type="text" id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required />
               <label htmlFor="startDate">startdate : </label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required/>
               <label htmlFor="endDate">enddate : </label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required/>
              <label htmlFor="createdByUserId">createdby : </label>
            <input type="number" id="createdByUserId" name="createdByUserId" value={formData.createdByUserId} onChange={handleChange} required/>
            <button type='submit'>Create Plan</button>
        </form>
    </>
  )
}

export default TravelPlans;