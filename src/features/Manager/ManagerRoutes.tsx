// ManagerRoutes.tsx
import TeamPeople from './team/TeamPeople';
import ListUser from '../OrgChart/ListUser';
import TravelPlans from './travel/TravelPlans';
import TravelExpense from './travel/TravelExpense';
import Social from '../Social/Social';
import AddPost from '../Social/AddPost';
import UserProfilePage from '../UserProfilePage';

const ManagerRoutes = [
  {
    path: 'team-members',
    element: <TeamPeople />,
   
  },
  {
    path: 'organization',
    element: <ListUser />, 
  }
  ,
   {
    path: 'profile',
    element: <UserProfilePage />, 
  }
  ,
  {
    path: 'social',
    element: <Social />,
  },{
    path : 'social/create',
    element : <AddPost/>
  }
  ,{
    path: 'employee-plans/:empProfileId', 
    element: <TravelPlans />
  },
    {
    path: 'employee-plans/expense/:empProfileId/:planid',
    element: <TravelExpense />
  }
];

export default ManagerRoutes;
