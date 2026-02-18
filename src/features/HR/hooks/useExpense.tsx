import { useQuery } from "@tanstack/react-query";
import api from "../../auth/api/axios";

export interface Expense{
    travelAssignId : number , 
    expenseType : number , 
    amount  :number ,
    status: string , 
    hrRemarks : string , 
    createdAt : Date,
    approvedBy : number 
}


const fetchAssignedEmployees = async(planIdNum:number):Promise<Expense[]>=>{
    try{
         const response = await api.get<Expense[]>(`/Expense/travelassign/${planIdNum}`);
        console.log("asigned employees : " , response.data , typeof(response.data));
        return response.data;
    }catch(error){
        console.error("error occured" , error);
        throw error;
    }
   
}

const useExpense = (planIdNum:number) =>{
    return useQuery<Expense[], Error>({
        queryKey: ['fetchExpenses' , planIdNum],
        queryFn: () => fetchAssignedEmployees(planIdNum),
    });
}
export default  useExpense;