import React from 'react'
import useAuth from './features/auth/hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
export default function MainLayout() {
    const {accessToken , logout}  = useAuth();
  return (
    <div>
        <nav>
            <div>
                <NavLink to="/"
                    className = {({isActive})=>
                        isActive ? "text-yellow-400":""
                    }
                    >
                        Home
                </NavLink>

                {
                    !accessToken && 
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="register">Register</NavLink>
                    </>
                }

                {accessToken && (
                    <button onClick={logout} className='bg-red-500 rounded'>
                        Logout
                    </button>
                )}
            </div>
        </nav>
        <Outlet/>
    </div>
  )
}