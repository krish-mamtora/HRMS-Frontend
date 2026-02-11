import React, { Children } from 'react'
import HRHomePage from './HRHomePage';
import TravelPlans from './TravelandExpense/TravelPlans';
import Jobs from './JobListing/Jobs';
import Social from './Social/Social';
import Games from './Games/Games';
import AddPlanForm from './TravelandExpense/AddPlanForm';
import CreateJob from './JobListing/CreateJob';
type Props = {}

const HrRoutes = [

  {
    path: 'travel',
    element: <TravelPlans />,
    children:[
      {
        path :  'create',
        element : <AddPlanForm/>
      }
    ]
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
    children:[
      {
        path:'create',
        element : <CreateJob/>
      }
    ]
  },
]
export default HrRoutes;