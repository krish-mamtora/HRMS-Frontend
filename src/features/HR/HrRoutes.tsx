import React, { Children } from 'react'
import HRHomePage from './HRHomePage';
import TravelPlans from './TravelandExpense/TravelPlans';
import Jobs from './JobListing/Jobs';
import Social from './Social/Social';
import Games from './Games/Games';
import AddPlanForm from './TravelandExpense/AddPlanForm';
import CreateJob from './JobListing/CreateJob';
import AssignEmployees from './TravelandExpense/AssignEmployees';
import JobApplications from './JobListing/JobApplications';
import ManageTravel from './TravelandExpense/ManageTravel';
import TravelDocument from './TravelandExpense/TravelDocument';
type Props = {}

const HrRoutes = [

  {
    path: 'travel',
    element: <TravelPlans />,
    children:[
      {
        path :  'create',
        element : <AddPlanForm/>
      },
 
    ]
  },
        {
        path:'travel/expense/:planId',
        element : <ManageTravel/>
      }
     ,
      {
        path:'travel/documents/:planId',
        element : <TravelDocument/>
      }
     ,
    {
    path : 'travel/:planId',
    element : <AssignEmployees/>
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
      } , 
    ]
  },
{
  path:'jobs/:jobId',
  element :<JobApplications/>
}
]
export default HrRoutes;