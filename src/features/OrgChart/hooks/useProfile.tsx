import { useQuery } from "@tanstack/react-query";
import api from "../../auth/api/axios";

export interface UserProfileDisplayDto {
  userProfileId: number;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  managerId: number;
  age: number;
  department: string;
  favouriteSport: string;
  joinDate: string; 
  isActive: boolean;
}


const fetchAllEmployeesProfile = async():Promise<UserProfileDisplayDto[]>=>{
    const response = await api.get<UserProfileDisplayDto[]>(`/UserProfile`);
    console.log("All Employee Profile : " , response.data);
    return response.data;
}

// const fetchEmployeesProfile = async(id:number):Promise<UserProfileDisplayDto[]>=>{
//     const response = await api.get<UserProfileDisplayDto[]>(`/UserProfile/${id}`);
//     console.log("Employee Profile : " , response.data);
//     return response.data;
// }

const useProfile = () =>{
    return useQuery<UserProfileDisplayDto[], Error>({
        queryKey: ['fetchuserProfile'],
        queryFn: () => fetchAllEmployeesProfile(),
    });
}
export default  useProfile;