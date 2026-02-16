import { useQuery } from "@tanstack/react-query";
import api from "../../auth/api/axios";

export interface Expense{
    TravelAssignId : number , 
    ExpenseType : number , 
    Amount  :number ,
    Status: string , 
    HrRemarks : string , 
    CreatedAt : Date,
    ApprovedBy : number 
}


const fetchAssignedEmployees = async(id:number):Promise<Expense[]>=>{
    const response = await api.get<Expense[]>(`/Expense/travelassign/${id}`);
    console.log("asigned employees : " , response.data);
    return response.data;
}

const useExpense = (id:number) =>{
    return useQuery<Expense[], Error>({
        queryKey: ['userProfiles', 'assigned', id],
        queryFn: () => fetchAssignedEmployees(id),
    });
}
export default  useExpense;