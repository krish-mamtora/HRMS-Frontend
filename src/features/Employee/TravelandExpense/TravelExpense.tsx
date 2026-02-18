import React, { useEffect, useState} from 'react';
import api from '../../auth/api/axios';
import { useParams } from 'react-router-dom';
import useExpense from '../hooks/useExpense';

export const TravelExpense = () => {
  const [expenseType, setexpenseType] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [travelAssignId , setTravelAssignId] = useState('');
  const [description , setDescription] = useState('');
  //fetch data from local
  const { id } = useParams();
  const numPlanId = id ? Number(id) : 0; 
  const EmpId = localStorage.getItem('id');

  

  useEffect(() => {  
    const fetchData = async()=>{
      const response = await api.get(`/Expense/getId?EmpId=${EmpId}&PId=${numPlanId}`);
      setTravelAssignId(response.data);
      console.log("Travel Assign id : " , response.data);
    }
    if (EmpId && numPlanId) {
      fetchData();
    }
  }, [EmpId, numPlanId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload proof");

    const formData = new FormData();
    formData.append('expenseType', expenseType);
    formData.append('amount', amount);
    formData.append('travelAssignid' , travelAssignId);
    formData.append('description' , description);
    try {
      const response = await api.post('/Expense' , formData);
      if (response.status >= 200 && response.status<300) alert("Expense submitted!");
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };


  const {data , isLoading , isError , error} = useExpense(travelAssignId);
    console.log('Previous Expenses : ',data);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

  return (
    <>
    <div>
    <form onSubmit={handleSubmit}>
      <label htmlFor="expenseType">Expense Type : </label>
      <select name="expenseType" id="expenseType" onChange={(e) => setexpenseType(e.target.value)}>
        <option value="1">Food Expense</option>
        <option value="2">Travel Expense</option>
        <option value="3">Accommodation Expenses</option>
      </select>
      <br />
      <label htmlFor="Description">Description : </label>

      <input type="text" name='Description'  placeholder="Description" onChange={(e) => setDescription(e.target.value)} required  />
        <br /><label htmlFor="Amount">Amount : </label>

      <input type="number" name='Amount' placeholder="Amount" onChange={(e) => setAmount(e.target.value)} required />
        <br /> <label htmlFor="proofDocument">proofDocument : </label>

      <input type="file" name='proofDocument' onChange={(e) => setFile(e.target.files?.[0] || null)} required />
   <br />
      <input type="hidden"  value={travelAssignId||0} name='travelAssignId' id='travelAssignId'/>
      <button type="submit"  className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Submit Expense</button>
    </form>
</div>
<div>
  
        {/* <div className="p-4">
             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((plan) => (
                <li key={plan.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold text-slate-900">Expense for : {plan.expenseType}</h2>
                    <span className="text-sm text-sky-700 font-medium">Amount :  </span>{plan.amount}<br/>
                    <span className="text-sm text-sky-700 font-medium">Description : </span> {plan.description}<br/>
                    <span className="text-sm text-sky-700 font-medium">ApprovedBy : </span>{plan.approvedBy}<br/>
                    <span className="text-sm text-sky-700 font-medium">Status :</span> {plan.status}<br/>
                     
                </li>
                ))}
            </ul>
         </div> */}

         <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                    <table id="search-table" className="w-full text-sm text-left rtl:text-right text-body">
                        <thead className="bg-neutral-secondary-soft border-b border-default">
                            <tr>
                               <th className="px-6 py-3 font-medium">Expense Type : </th>
                                <th className="px-6 py-3 font-medium">Amount : </th>
                                <th className="px-6 py-3 font-medium">Description :</th>
                                <th className="px-6 py-3 font-medium">Document</th>
                                <th className="px-6 py-3 font-medium">Status :</th>
                                 <th className="px-6 py-3 font-medium">ApprovedBy :</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                    {/* <td className="px-6 py-4"> {item.expenseType}</td> */}
                                    <td className="px-6 py-4">
                                      {item.expenseType === 1 ? "Food" : item.expenseType === 2 
                                       ? "Travel" : item.expenseType === 3  ? "Accommodation"  : "Unknown"}
                                    </td>
                                    <td className="px-6 py-4">{item.amount}</td>
                                    <td className="px-6 py-4">{item.description}</td>
                                     <td className="px-6 py-4 col ">
                                        <a 
                        
                                        onClick={()=>{}} 
                                        className='font-medium text-blue-600 hover:underline flex items-center'
                                    >
                                         Proof Document
                                    </a>
                                    </td >
                                    <td className="px-6 py-4">{item.status}</td>
                                    <td className="px-6 py-4">{item.approvedBy}</td>
                                    {/* <td  className="px-6 py-4">  </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
</div>
    </>
  );
};

export default TravelExpense;
