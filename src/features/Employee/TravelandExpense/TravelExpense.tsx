import React, { useEffect, useState} from 'react';
import api from '../../auth/api/axios';
import { useParams } from 'react-router-dom';

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
      {/* <input type="text" placeholder="Type" onChange={(e) => setexpenseType(e.target.value)} required /> */}
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

</div>
    </>
  );
};

export default TravelExpense;
