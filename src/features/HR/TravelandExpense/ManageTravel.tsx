import React from 'react'
import { useParams } from 'react-router-dom';
import useExpense from '../hooks/useExpense';
type Props = {}

const ManageTravel = (props: Props) => {
    const { planId } = useParams<{ planId: string }>();

    const planIdNum = planId ? Number(planId) : 0;
    
    console.log("from use : ", planId, typeof (planId));
    const { data, isLoading, isError, error } = useExpense(planIdNum);
    if (!data) {
        return <h2>No Expense Found..</h2>
    }
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    console.log("Received : ",data)
    return (
           <>
    <div>
            <div  className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Expenses for </div>

                <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                    <table id="search-table" className="w-full text-sm text-left rtl:text-right text-body">
                        <thead className="bg-neutral-secondary-soft border-b border-default">
                            <tr>
                                <th className="px-6 py-3 font-medium">Id</th>
                                <th className="px-6 py-3 font-medium">approvedBy</th>
                                <th className="px-6 py-3 font-medium">amount </th>
                                <th className="px-6 py-3 font-medium">hrRemarks </th>
                                <th className="px-6 py-3 font-medium">Status </th>
                                <th className="px-6 py-3 font-medium">expenseType</th>
                                   <th className="px-6 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data)&& data?.map((item, index) => (
                                
                                <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                    {/* <td className="px-6 py-4">{item.id}</td>
                                    <td className="px-6 py-4">{item.approvedBy}</td>
                                    <td className="px-6 py-4">{item.amount}</td>
                                    <td className="px-6 py-4">{item.hrRemarks}</td>
                                     <td className="px-6 py-4">{item.status}</td>
                                    <td className='px-6 py-4'>{item.expenseType}</td>
                                    <td  className="px-6 py-4">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600">Verify</button>
                                    </td> */}
                                    hii
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
   </>

    )
}
export default ManageTravel;