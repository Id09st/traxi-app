import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// sample page routing
const ManagerManagement = Loadable(lazy(() => import('views/manager-manage')));
const DriverManagement = Loadable(lazy(() => import('views/driver-manage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <ProtectedRoute roles={['manager']}>
              <DashboardDefault />
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'Manager-manage',
      element: (
        <ProtectedRoute roles={['admin']}>
          <ManagerManagement />
        </ProtectedRoute>
      )
    },
    {
      path: 'Driver-manage',
      element: (
        <ProtectedRoute roles={['manager']}>
          <DriverManagement />
        </ProtectedRoute>
      )
    }
  ]
};

export default MainRoutes;
