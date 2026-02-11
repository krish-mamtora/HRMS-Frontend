import React, { Children } from 'react'
import Jobs from './JobListing/Jobs';
import Games from './Games/Games';
import Social from './Social/Social';
import TravelPlans from './TravelandExpense/TravelPlans';

type Props = {}

const EmployeeRoutes = [

  {
    path: 'travel',
    element: <TravelPlans />,
    // children:[
    //   {
    //     path :  'create',
    //     element : <AddPlanForm/>
    //   }
    // ]
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