import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useExpense from '../hooks/useExpense';
import useProofDocument from '../hooks/useProofDocument';
import api from '../../auth/api/axios';

type Props = {}

const ExpenseList = (props: Props) => {

    
    const navigate = useNavigate();
  const openProofPage = (id:number) => {
  
         let temp =  id.toString();
         console.log(typeof(temp), temp);
                navigate(`/hr/travel/expense/proof/${temp}`);
        
        };

    const { planId, empId } = useParams<{ planId: string, empId: string }>();

    const { data, isLoading, isError, error } = useExpense(planId, empId);
   console.log(data);
    if (!data) {
        return <h2>No Expense Found..</h2>
    }
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // useEffect(()=>{
    //     console.log("h");
    // },[])

    const ApproveExpense = async (itemId: number) => {
        // const response = await api.put(`/Expense/${itemId}`);
        console.log(itemId);
    }
    const rejectExpense = (itemId: number) => {
        console.log(itemId);
    }


    const activeApprove = "mt-2 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors";
    const disabledApprove = "mt-2 mr-2 bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors";
    const activeReject = "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition";
    const disabledReject = "bg-red-300 text-white px-4 py-2 rounded hover:bg-red-400 transition";

    return (
        <>
            <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>ExpenseList  </div>

            <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                <table id="search-table" className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="bg-neutral-secondary-soft border-b border-default">
                        <tr>
                            <th className="px-6 py-3 font-medium">Expense Type </th>
                            <th className="px-6 py-3 font-medium">Amount  </th>
                            <th className="px-6 py-3 font-medium">Description </th>
                            <th className="px-6 py-3 font-medium">Document</th>
                            <th className="px-6 py-3 font-medium">Status </th>
                            <th className="px-6 py-3 font-medium">Updated By </th>
                            <th className="px-6 py-3 font-medium">HR Remarks</th>
                            <th className="px-6 py-3 font-medium">Action</th>
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
                                <td className="px-6 py-4 col ">
                                    <button
                                          onClick={()=>openProofPage(item.id)}
                                        className='font-medium text-blue-600 hover:underline flex items-center'
                                    >
                                      {/* {item.id} */}
                                        Proof Document
                                    </button>
                                </td >
                                <td className="px-6 py-4">{item.status}</td>

                                <td className="px-6 py-4">{item.approvedBy}</td>
                              <td className="px-6 py-4">{item.hrRemarks}</td>
                                <td>
                                    <button onClick={() => ApproveExpense(item.id)} className={item.status === "Approved" ? disabledApprove: activeApprove } disabled={item.status === "Approved"} >Approve</button>
                                    <button onClick={() => rejectExpense(item.id)}  className={item.status === "Rejected" ? disabledReject: activeReject } disabled={item.status === "Rejected"}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </>

    )
}
export default ExpenseList;