import api from '../../auth/api/axios';
import { useQuery } from '@tanstack/react-query';

interface TravelPlan {
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
    createdByUserId : number;
    travelMode:string;
    tripType:string;
    Id :number,
     CreatedAt : Date;
}


const fetchPlans = async () :Promise<TravelPlan[]>=>{
    const response = await api.get<TravelPlan[]>('/TravelPlan');
     console.log(response)
    return response.data;
}

export const usePlans = () => {
    return useQuery<TravelPlan[],Error>({
        queryKey : ['TravelPlans'],
        queryFn : fetchPlans,
    });
}

export default usePlans;