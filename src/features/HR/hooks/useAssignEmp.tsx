import React from 'react'
import api from '../../auth/api/axios';
import { useQuery } from '@tanstack/react-query';

type Props = {}

export interface UserProfile{
    address :string,
    department : string ,
    firstName : string , 
    lastName : string, 
    age:number,
    gender:string , 
    userProfileId : number, 
    isActive : boolean,
    favouriteSport:string,
    managerId : number,
}

const fetchAllUesrs = async():Promise<UserProfile[]>=>{
    const response = await api.get<UserProfile[]>('/userProfile');
     console.log("response data : ",response.data)
    return response.data;
}

const useAssignEmp = () => {
    return useQuery<UserProfile[],Error>({
        queryKey : ['UserProfile' ],
        queryFn :()=> fetchAllUesrs(),
    });
}
export default useAssignEmp;