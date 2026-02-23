// ManagerRoutes.tsx
import TeamPeople from './team/TeamPeople';
import ListUser from '../OrgChart/ListUser';
import EmpTravelPlans from './travel/EmpTravelPlans';
import  EmpTravelExpense  from './travel/EmpTravelExpense';
import EmpTravelDocuments from './travel/EmpTravelDocuments';

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
    element: <EmpTravelPlans />
  },
    {
    path: 'employee-plans/expense/:empProfileId/:planid',
    element: <EmpTravelExpense />
  },
   {
    path: 'employee-plans/documents/:empProfileId/:id',
    element: <EmpTravelDocuments />
  }
];

export default ManagerRoutes;
