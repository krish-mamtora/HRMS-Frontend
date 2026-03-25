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
  tripType: string;
  purpose: string;
  createdByUserId: number;
  id: number;
  CreatedAt: Date;
}

const TravelPlans = (props: Props) => {
  const navigate = useNavigate();
  const [planType, setplanType] = useState("");
  const isCreating = location.pathname.includes('/create');
  const [timeStatus, setTimeStatus] = useState("");

  const handleRedirect = () => {
    navigate('/hr/travel/create');
  }

  const { data, isLoading, isError, error } = usePlans();
  if (!data) {
    return <h2>No Plan Found..</h2>
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleAssign = (planId: number) => {
    console.log("from handle : ", planId, typeof (planId));
    navigate(`/hr/travel/${planId}`);
  }

  const managePlan = (planId: number) => {
    navigate(`/hr/travel/expense/${planId}`);
    console.log(planId);
  }
  const manageDocuments = (planId: number) => {
    navigate(`/hr/travel/documents/${planId}`);
    console.log(planId);
  }

  return (
    <>
    <div className='p-4'>      
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <h2 className="font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Travel Plans
        </h2>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-row">
             <label className="text-base font-semibold text-gray-700">Plan Type</label> 
            <select className="border rounded p-2 text-sm"  value={planType} onChange={(e) => setplanType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Client Meeting">Client Meeting</option>
              <option value="Training and Development Programs">Training</option>
              <option value="Conferences and Trade Shows">Conferences</option>
            </select>
          </div>

          <div className="flex flex-row">
            <label className="text-base font-semibold text-gray-700">Status</label>
            <select className="border rounded p-2 text-sm"  value={timeStatus} onChange={(e) => setTimeStatus(e.target.value)} >
              <option value="">All Time</option>
              <option value="Past">Past</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Future">Future</option>
            </select>
          </div>

          {!isCreating && (
            <button onClick={handleRedirect} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors h-[42px]">
              Create New
            </button>
          )}
        </div>
      </div>

      <div>
        <Outlet />
      </div>

      <div className="p-4">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.filter((plan) => {
            const matchesType = planType === "" || plan.tripType === planType;
            const start = new Date(plan.startDate);
            const end = new Date(plan.endDate);
            const now = new Date();
            let matchesTime = true;
            if (timeStatus === "Past") matchesTime = end < now;
            if (timeStatus === "Ongoing") matchesTime = now >= start && now <= end;
            if (timeStatus === "Future") matchesTime = start > now;
            return matchesType && matchesTime;
          }
          ).map((plan) => (
            <li key={plan.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-slate-900">Destination : {plan.destination}</h2>
              <span className="text-sm text-sky-700 font-medium">Travel Mode :</span> {plan.travelMode} <br />
              <span className="text-sm text-sky-700 font-medium">Purpose :  </span>{plan.purpose}<br />
              <span className="text-sm text-sky-700 font-medium">Type : </span> {plan.tripType}<br />
              <span className="text-sm text-sky-700 font-medium">Start Date : </span>{new Date(plan.startDate).toLocaleDateString()}<br />
              <span className="text-sm text-sky-700 font-medium">End Date :</span> {new Date(plan.endDate).toLocaleDateString()}<br />

              <h2>Created by : {plan.createdByUserId}</h2>
              <h2>ID : {plan.id}</h2>
              <button onClick={() => managePlan(plan.id)} className="mt-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transition-colors mr-4">Membres</button>
              <button onClick={() => handleAssign(plan.id)} className="mt-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transition-colors mr-4">Assign Plan</button>
            </li>
          ))}
        </ul>
      </div>
      </div>

    </>
  )
}


export default TravelPlans;