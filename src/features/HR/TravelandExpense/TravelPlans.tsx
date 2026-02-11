import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import api from '../../auth/api/axios';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { usePlans } from '../hooks/usePlans';
import AddPlanForm from './AddPlanForm';
import { Outlet, useNavigate } from 'react-router-dom';
type Props = {}

export interface TravelPlanData {
  startDate: string;
  endDate: string;
  destination: string;
  travelMode: string;
  tripType:string;
  purpose: string;
  createdByUserId : number;
  id : number;

  CreatedAt : Date;
}

const TravelPlans = (props: Props) => {
    const navigate = useNavigate();
    const handleRedirect = () =>{
        navigate('/hr/travel/create');
    }

    const {data , isLoading , isError , error} = usePlans();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    const ManageEmployees = ()=>{

    }

  return (
    <>
    <h2 className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>TravelPlans</h2>

    
     <div>
 <div className='flex justify-end'> 
                    
      <button onClick={handleRedirect} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add New Plan</button>
        <Outlet/>
      </div>
    
      <h1>Travel Plan List</h1>
        <div>
    
        </div>
     
        <div className="p-4">
             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((plan) => (
                <li key={plan.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold text-slate-900">{plan.destination}</h2>
                    <p className="text-sm text-sky-700 font-medium">{plan.purpose}</p>
                   <p className="text-sm text-sky-700 font-medium">{plan.travelMode}</p>
                   <p className="text-sm text-sky-700 font-medium">{plan.tripType}</p>
                    <div className="flex justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                      <span>{plan.startDate}</span>
                      <span>{plan.endDate}</span>
                    </div>
                    <h2>{plan.createdByUserId}</h2>
                    <h2>{plan.id}</h2>
                     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Assign</button>
                </li>
                ))}
            </ul>
         </div>
      </div>
    </>
  )
}


export default TravelPlans;