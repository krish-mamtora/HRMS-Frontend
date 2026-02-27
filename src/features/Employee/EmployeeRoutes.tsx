import React, { Children } from 'react'
import Jobs from './JobListing/Jobs';
import Games from './Games/Games';
import TravelPlans from './TravelandExpense/TravelPlans';
import TravelPlanDetails from './TravelandExpense/TravelPlanDetails';
import TravelExpense from './TravelandExpense/TravelExpense';
import ListUser from '../OrgChart/ListUser';
import Profile from '../OrgChart/Profile';
import GameDetails from './Games/GameDetails';
import MyBookings from './Games/MyBookings';
import GD from './Games/GD';
import AddPost from '../Social/AddPost';
import Social from '../Social/Social';
import MyPosts from '../Social/MyPosts';

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
  },{
    path : 'social/create',
    element : <AddPost/>
  },
    ,{
    path : 'social/myposts',
    element : <MyPosts/>
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
    path: 'games/my-bookings/:userId',
    element : <MyBookings/>
  },
   {
    path: 'jobs',
    element: <Jobs />,
  },
]
export default EmployeeRoutes;