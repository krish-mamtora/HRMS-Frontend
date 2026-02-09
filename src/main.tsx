import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from '../src/features/auth/pages/LoginPage'
import RegisterPage from '../src/features/auth/pages/RegisterPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateJob from '../src/features/JobListing/CreateJob.tsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path:'/CreateJob',
    element:<CreateJob/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
