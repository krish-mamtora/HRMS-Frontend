// import { useQuery } from '@tanstack/react-query';
// import React from 'react'
// import api from '../../auth/api/axios';

import { useQuery } from "@tanstack/react-query";
import api from "../../auth/api/axios";

// type Props = {}

export interface TravelDocument{
    UploadedBy :number,
    Type : string ,
    TravelAssignmentId : number , 
    TravelDocument: string;
    CreatedAt : Date , 
    Description : string ,  
   
}

// const fetchJobs = async():Promise<TravelDocument[]>=>{
//     const response = await api.get<TravelDocument[]>('/jobListing');
//      console.log(response)
//     return response.data;
// }

// const useTravelDocument = () => {
//    return useQuery<TravelDocument[],Error>({
//         queryKey : ['TravelDocument'],
//         queryFn : fetchJobs,
//          staleTime: 1000 * 60 * 5,
//            retry: 2,
//     });
// }


// const fetchAssignedEmployeesDocuments = async(planId , empId):Promise<TravelDocument[]>=>{
//     try{
//         const response = await api.get('/Document' , {
//             params :{
//                 EmpId : empId , 
//                 PId : planId
//             }
//          }); 
//         const travelassignid = response.data;
//         console.log("Travel Assign Id : " , response.data , typeof(response.data)); 
//         const DocumentList = await api.get<TravelDocument[]>(`/TravelDocument/travelassignDocs/${travelassignid}`);
//         console.log("Expenses : ",DocumentList.data);
//         return DocumentList.data;
//     }catch(error){
//         console.error("error occured" , error);
//         throw error;
//     }
// }

const fetchDocumentDetailsfromPlanAssignId = async(id : number):Promise<TravelDocument[]>=>{
    const response = await api.get<TravelDocument[]>(`/TravelDocument/travelassignDocs/${id}`);
     console.log(response)
    return response.data;
}

const useTravelDocument = (id: number) => {
   return useQuery<TravelDocument[],Error>({
        queryKey : ['DocumentDetailsfromPlanAssignId' ,id ],
        queryFn :()=> fetchDocumentDetailsfromPlanAssignId(id),
                staleTime: 1000 * 60 * 5,   
            gcTime: 1000 * 60 * 10,    
            refetchOnWindowFocus: false,
            refetchOnMount: false,      
            retry: 2,
    });
}

export default useTravelDocument;