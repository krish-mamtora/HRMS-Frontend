import React, { useEffect, useState, FormEvent } from 'react';
import api from '../../auth/api/axios';
import { useParams } from 'react-router-dom';
import useExpense from '../hooks/useExpense';

export const TravelExpense = () => {
    const [expenseType, setexpenseType] = useState('');
    const [amount, setAmount] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [travelAssignId, setTravelAssignId] = useState('');
    const [description, setDescription] = useState('');
    const [lastDateforExpense, setlastDateforExpense] = useState(null);
    var allowExpense = false;
    const { id } = useParams();
    const numPlanId = id ? Number(id) : 0;
    const EmpId = localStorage.getItem('id');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/TravelPlan/date/${numPlanId}`);
                setlastDateforExpense(response.data);
            } catch (error) {
                console.error("Error fetching travel last date :", error);
            }
        };
        if (numPlanId) fetchData();
    }, [numPlanId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/Expense/getId?EmpId=${EmpId}&PId=${numPlanId}`);
                setTravelAssignId(response.data);
            } catch (error) {
                console.error("Error fetching travel assign id:", error);
            }
        };
        if (EmpId && numPlanId) fetchData();
    }, [EmpId, numPlanId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please upload proof");

        try {
            const expenseData = {
                expenseType: Number(expenseType),
                amount: Number(amount),
                travelAssignId: Number(travelAssignId),
                description: description
            };

            const expenseResponse = await api.post('/Expense', expenseData);

            if (expenseResponse.status >= 200 && expenseResponse.status < 300) {

                const newExpenseId = expenseResponse.data.id;
                // console.log('new expense id : ',newExpenseId)
                const fileData = new FormData();
                fileData.append('ProofDocument', file);
                fileData.append('TravelExpenseId', newExpenseId);

                await api.post('/ExpenseProof', fileData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Expense and Document submitted!");
            }
        } catch (error) {
            console.error("Error submitting expense:", error);
            alert("Submission failed.");
        }
    };



    const { data, isLoading, isError, error } = useExpense(Number(travelAssignId));
    console.log('Previous Expenses : ', data);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    const handleDownload = async (e: React.MouseEvent, proofUrl: string) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:7035/api/ExpenseProof/download-expense-proof/${proofUrl}`);
            if (!response.ok) {
                throw new Error('Could not download the file. Please check if the file exists.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const fileName = proofUrl.includes('_') ? proofUrl.split('_').slice(1).join('_') : proofUrl;
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

    function compareDateWithOffset(targetDateString: string , currentDate) {
        // const currentDate = new Date();
        const targetDate = new Date(targetDateString);
        if (isNaN(targetDate.getTime())) {
            return false;
        }
        const offsetDays = 10;
        const tenDaysInMilliseconds = offsetDays * 24 * 60 * 60 * 1000;
        const targetDatePlusTenDays = new Date(targetDate.getTime() + tenDaysInMilliseconds);
        return targetDatePlusTenDays;
    }
    const currentDate = new Date();
    var DisplayMessageForExpenseWindow;
    const targetDatePlusTenDays = compareDateWithOffset(lastDateforExpense , currentDate);
    if(currentDate > targetDatePlusTenDays){
        DisplayMessageForExpenseWindow = "Expense wondow closed !!";
       allowExpense = false;
    }else{
       allowExpense = true;
         DisplayMessageForExpenseWindow = "Last Date for Expense Submission is : "+ targetDatePlusTenDays ;
    }
   
        
    // console.log(canCreateExpenseRequest);
    return (
        <>
            <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default p-5">
                <h4 className='text-red-500'>{DisplayMessageForExpenseWindow}</h4>
                <br />
                <form onSubmit={handleSubmit} className="w-full flex">
                    <label htmlFor="expenseType">Expense Type : </label>
                    <select name="expenseType" id="expenseType" onChange={(e) => setexpenseType(e.target.value)} required >
                        <option value="">Select</option>
                        <option value="1">Food Expense</option>
                        <option value="2">Transportation Expense</option>
                        <option value="3">Accommodation Expenses</option>
                    </select>
                    <br />
                    <label htmlFor="Description">Description : </label>
                    <input type="text" name='Description' placeholder="Description" onChange={(e) => setDescription(e.target.value)} required />
                    <br />
                    <label htmlFor="Amount">Amount : </label>
                    <input type="number" name='Amount' placeholder="Amount" onChange={(e) => setAmount(e.target.value)} required />
                    <br />
                    <label htmlFor="proofDocument">Proof Document : </label>
                    <input type="file" accept=".pdf,.doc,.docx" name='proofDocument' onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                    <br />
                    <button type="submit"  disabled={!allowExpense}  className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded">Add Expense</button>
                </form>
            </div>

            <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                <table id="search-table" className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="bg-neutral-secondary-soft border-b border-default">
                        <tr>
                            <th className="px-6 py-3 font-medium">Expense Type : </th>
                            <th className="px-6 py-3 font-medium">Amount : </th>
                            <th className="px-6 py-3 font-medium">Description :</th>
                            <th className="px-6 py-3 font-medium">Created At :</th>

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
                                        ? "Travel" : item.expenseType === 3 ? "Accommodation" : "Unknown"}
                                </td>
                                <td className="px-6 py-4">{item.amount}</td>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4">{item.createdAt}</td>
                                <td className="px-6 py-4 col ">
                                    <a

                                        //  onClick={(e) => handleDownload()} 
                                        className='font-medium text-blue-600 hover:underline flex items-center'
                                    >
                                        Proof Document
                                    </a>
                                </td >
                                <td className="px-6 py-4">{item.status}</td>
                                <td className="px-6 py-4">{item.approvedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </>
    );
};

export default TravelExpense;
