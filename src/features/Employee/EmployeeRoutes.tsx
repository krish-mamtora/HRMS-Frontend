import React, { Children } from 'react'
import Jobs from './JobListing/Jobs';
import Games from './Games/Games';
import Social from './Social/Social';
import TravelPlans from './TravelandExpense/TravelPlans';
import TravelPlanDetails from './TravelandExpense/TravelPlanDetails';
import TravelExpense from './TravelandExpense/TravelExpense';
import ListUser from '../OrgChart/ListUser';
import Profile from '../OrgChart/Profile';
import GameDetails from './Games/GameDetails';

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
        path:'organization',
        element : <ListUser/>
     },
          {
        path:'organization/profile/:userProfileId',
        element : <Profile/>
     },
  {
    path : 'games',
    element : <Games/>
  },
  {
    path : 'games/:gameId',
    element : <GameDetails/>
  },
   {
    path: 'jobs',
    element: <Jobs />,
  },
]
export default EmployeeRoutes;