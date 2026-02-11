import React from 'react'
import useAuth from './features/auth/hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
export default function MainLayout() {
    const role = localStorage.getItem('role');

    const {accessToken , logout }  = useAuth();
    const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "text-yellow-400" : "hover:text-yellow-300 transition";

  return (
    <div className="min-h-screen bg-gray-50">
        <nav className="p-4 shadow-md">
            <div className="container mx-auto flex justify-end items-center">
                
               <div className="flex gap-6 items-center mr-4">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
        
            {accessToken && role === 'HR' && (
              <div className="flex gap-4 border-l pl-4 border-gray-200">
                <NavLink to="/hr/travel" className={navLinkClass}>Travel</NavLink>
                <NavLink to="/hr/social" className={navLinkClass}>Social</NavLink>
                <NavLink to="/hr/games" className={navLinkClass}>Games</NavLink>
                <NavLink to="/hr/jobs" className={navLinkClass}>Jobs</NavLink>
              </div>
            )}

            {accessToken && role === 'Employee' && (
              <div className="flex gap-4 border-l pl-4 border-gray-200">
                <NavLink to="/employee/travel" className={navLinkClass}>Travel</NavLink>
                <NavLink to="/employee/social" className={navLinkClass}>Social</NavLink>
                <NavLink to="/employee/games" className={navLinkClass}>Games</NavLink>
                <NavLink to="/employee/jobs" className={navLinkClass}>Jobs</NavLink>
              </div>
            )}



          </div>

                <div className="flex gap-2 items-center">
                {
                    !accessToken && 
                    <>
                        <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                        <NavLink to="register" className={navLinkClass}>Register</NavLink>
                    </>
                }

                {accessToken && (
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
>
                        Logout
                    </button>
                )}
                </div>
            </div>
        </nav>
        <hr />
        <main  className="container mx-auto p-4">

        <Outlet/>
        </main>
    </div>
  )
}