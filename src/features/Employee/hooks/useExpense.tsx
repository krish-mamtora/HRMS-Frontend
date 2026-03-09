import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../auth/api/axios";

export interface ExpenseData {
    TravelAssignId : number , 
    ExpenseType : number , 
    Amount  :number ,
    Status: string , 
    Description : string,
    HrRemarks : string , 
    CreatedAt : Date,
    ApprovedBy : number ,
    Expensedate : Date,
}
interface CreateExpensePayload {
    expenseData: Partial<ExpenseData>;
    file: File;
}
const fetchExpenseDetailsfromPlanAssignId = async(id : number):Promise<ExpenseData[]>=>{
    const response = await api.get<ExpenseData[]>(`/Expense/getExpensesByTravelAssignedId/${id}`);
     console.log(response)
    return response.data;
}

const useExpense = (id: number) => {
   return useQuery<ExpenseData[],Error>({
        queryKey : ['ExpenseDetailsfromPlanAssignId' ,id ],
        queryFn :()=> fetchExpenseDetailsfromPlanAssignId(id),
        
    });
}
export default useExpense


export const useCreateExpense = (travelAssignId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateExpensePayload) => {
            const expenseResponse = await api.post('/Expense', payload.expenseData);
            const newExpenseId = expenseResponse.data.id;

            const fileData = new FormData();
            fileData.append('ProofDocument', payload.file);
            fileData.append('TravelExpenseId', newExpenseId);

            await api.post('/ExpenseProof', fileData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const notificationData = {
                travelExpenseId: newExpenseId,
                recipientEmail: "micosaf532@him6.com", 
                senderId: Number(localStorage.getItem('id')),
                subject: "New Expense Claim Submitted",
                body: `New expense claim for ${payload.expenseData.Amount} has been submitted.`
            };
            await api.post('/Expense/notifyExpenseCreate', notificationData);

            return expenseResponse.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ExpenseDetailsfromPlanAssignId', travelAssignId] });
        },
         onError: (error: any) => {
                const serverMessage = error.response?.data?.message || "Submission failed.";
                alert(serverMessage);
        }
    });
};