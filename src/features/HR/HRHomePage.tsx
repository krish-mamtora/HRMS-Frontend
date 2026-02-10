import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';
type Props = {}

const HRHomePage = (props: Props) => {
  return (
    <>
    <div>
        <nav>
            <div>
                {/* <NavLink to="/"
                    className = {({isActive})=>
                        isActive ? "text-yellow-400":""
                    }
                    >
                        Home
                </NavLink> */}
                    <NavLink to="/hr/travel"
                    className = {({isActive})=>
                        isActive ? "text-yellow-400":""
                    }
                    >
                        Travel
                </NavLink>

                <NavLink to="/hr/social"
                    className = {({isActive})=>
                        isActive ? "text-yellow-400":""
                    }
                    >
                        Social 
                </NavLink>
                  <NavLink to="/hr/games"
                    className = {({isActive})=>
                        isActive ? "text-yellow-400":""
                    }
                    >
                        Games 
                </NavLink>
                    
                      <NavLink to="/hr/jobs"
                    className = {({isActive})=>
                        isActive ? "text-yellow-400":""
                    }
                    >
                        Jobs 
                </NavLink>
            </div>
        </nav>
       
    </div>
    <Outlet/>
     </>
  )
}
export default  HRHomePage;