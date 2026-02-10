import React, { Children } from 'react'
import HRHomePage from './HRHomePage';
import TravelPlans from './TravelandExpense/TravelPlans';
import Jobs from './JobListing/Jobs';
import Social from './Social/Social';
import Games from './Games/Games';
type Props = {}

const HrRoutes = [

  {
    path: 'travel',
    element: <TravelPlans />,
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
    // Children: [
    //     {
    //         index : true,
    //         element:(
    //             <Vie/>
    //         )
    //     }
    // ]
  }
]
export default HrRoutes;