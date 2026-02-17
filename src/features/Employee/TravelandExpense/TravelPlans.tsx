import React from 'react'
import useJobs from '../hooks/useJobs';
import usePlans from '../hooks/usePlans';
import { Outlet, useNavigate } from 'react-router-dom';

type Props = {}

const TravelPlans = (props: Props) => {
  const navigate = useNavigate();
   const {data , isLoading , isError , error} = usePlans();
    console.log(data);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
   
    const handleAssign = (id:number)=>{
      navigate(`/employee/travel/${id}`);
      console.log(id);
    }
    const handleExpense = (id:number)=>{
      navigate(`/employee/travel/expense/${id}`);
      console.log(id);
    }
    
  return (
    <>
        <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Travel Plan List</div>

        <div>

        </div>
     
        <div className="p-4">
             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((plan) => (
                <li key={plan.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold text-slate-900">Destination : {plan.destination}</h2>
                    <span className="text-sm text-sky-700 font-medium">Purpose :  </span>{plan.purpose}<br/>
                    <span className="text-sm text-sky-700 font-medium">Type : </span> {plan.tripType}<br/>
                    <span className="text-sm text-sky-700 font-medium">Start Date : </span>{plan.startDate}<br/>
                    <span className="text-sm text-sky-700 font-medium">End Date :</span> {plan.endDate}<br/>
                      <button onClick={()=>handleExpense(plan.id)} className="mr-2 mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Expenses</button>

                     <button onClick={()=>handleAssign(plan.id)} className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Details</button>
                </li>
                ))}
            </ul>
         </div>
    </>
   
  )
}
export default TravelPlans;