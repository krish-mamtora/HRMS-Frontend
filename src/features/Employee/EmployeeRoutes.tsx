import React, { Children } from 'react'
import Jobs from './JobListing/Jobs';
import Games from './Games/Games';
import Social from './Social/Social';
import TravelPlans from './TravelandExpense/TravelPlans';
import TravelPlanDetails from './TravelandExpense/TravelPlanDetails';

const EmployeeRoutes = [

  {
    path: 'travel',
    element: <TravelPlans />,
    // children:[
    //   {
    //     path :  ':id',
    //     element : <TravelPlanDetails/>
    //   }
    // ]
  },
  {
    path : 'travel/:id',
    element : <TravelPlanDetails/>
  },
  {
    path: 'social',
    element: <Social />,
  },
  
  {
    path : 'games',
    element : <Games/>
  },
   {
    path: 'jobs',
    element: <Jobs />,
    // children:[
    //   {
    //     path:'create',
    //     element : <CreateJob/>
    //   }
    // ]
  },
]
export default EmployeeRoutes;