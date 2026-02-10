import { RouterProvider } from 'react-router-dom';
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './features/auth/context/AuthContext';
import router from './router';
const queryClient = new QueryClient();

function App() {
  return (
   <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <RouterProvider router={router}/>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App
