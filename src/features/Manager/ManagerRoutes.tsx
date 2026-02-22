// ManagerRoutes.tsx
import TeamPeople from './team/TeamPeople';
import ListUser from '../OrgChart/ListUser';
import TravelPlans from './travel/TravelPlans';
import TravelExpense from './travel/TravelExpense';

const ManagerRoutes = [
  {
    path: 'team-members',
    element: <TeamPeople />,
   
  },
  {
    path: 'organization',
    element: <ListUser />, 
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
