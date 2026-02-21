import React, { Children } from 'react'
import Jobs from './JobListing/Jobs';
import Games from './Games/Games';
import Social from './Social/Social';
import TravelPlans from './TravelandExpense/TravelPlans';
import TravelPlanDetails from './TravelandExpense/TravelPlanDetails';
import TravelExpense from './TravelandExpense/TravelExpense';

const EmployeeRoutes = [

  {
    path: 'travel',
    element: <TravelPlans />,
  },
  {
    path : 'travel/:id',
    element : <TravelPlanDetails/>
  },
   {
    path : 'travel/expense/:id',
    element : <TravelExpense/>
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