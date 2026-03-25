import React, { useEffect, useState } from 'react'
import api from '../auth/api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useProfile from './hooks/useProfile';
import useOrg from './hooks/useOrg';
import useDirectCont from './hooks/useDirectCont';
import { getRoleFromToken } from '../auth/api/getUserRoleFromToken';

type Props = {}

const Profile = () => {
    const { userProfileId } = useParams();
    const navigate = useNavigate();
    const role = getRoleFromToken();
    const redirectBack = () => {
        navigate(`/${role}/organization`);
    }
     const openOrgChart = (userProfileId:number)=>{
          navigate(`/${role}/organization/profile/${userProfileId}`);
    }
    const numuserProfileId = userProfileId ? Number(userProfileId) : 0;
    const { data: directContact } = useDirectCont(numuserProfileId);
    const { data, isLoading, isError, error } = useOrg(numuserProfileId);

    if (!data) {
        return <h2 className="p-4">No Profile Found..</h2>
    }
    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4">Error: {error.message}</div>;

    return (
        <div className="flex h-screen overflow-hidden">
           <div className="flex flex-1"> 
                <button className='underline text-blue-500 self-start mb-4 absolute top-4 left-4' onClick={() => navigate(-1)}>
                    Back
                </button>

            <div className="flex flex-col items-center  p-4 overflow-y-auto bg-gray-50 w-[35%]">
                <h2 className="mb-8 text-xl font-bold text-center">Top-level managerial chain</h2>
                
                <ul className="flex flex-col-reverse items-center w-full max-w-sm">
                  {data?.map((profile, index) => (
                        <li key={profile.id} className="relative w-[230px] flex flex-col items-center" >
                            {index !== data.length - 1 && (
                                <div className="w-px h-8 bg-slate-300"></div>
                            )}
                            <div className="w-full bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"  onClick={() => openOrgChart(profile.userProfileId)}>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-xs text-sky-700 font-medium">Address: {profile.address}</p>
                                <p className="text-xs text-sky-700 font-medium">Department: {profile.department}</p>
                                <p className="text-xs text-sky-700 font-medium">Designation: {profile.designation}</p>
                            </div>
                            {index !== data.length - 1 && (
                                <div className="w-px h-8 bg-slate-300"></div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex flex-col p-4 overflow-y-auto bg-white w-[65%]">
                <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">One level of direct reports</h2>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Designation</th>
                                <th className="px-6 py-3">Address</th>  
                                <th className="px-6 py-3">Favourite Sport</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {directContact?.map((profile) => (
                                <tr key={profile.id} className="hover:bg-sky-50 transition-colors"  onClick={() => openOrgChart(profile.userProfileId)}>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {profile.firstName} {profile.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-sky-700">{profile.department}</td>
                                    <td className="px-6 py-4 text-slate-700">{profile.designation}</td>
                                    <td className="px-6 py-4 text-slate-600">{profile.address}</td>
                                      <td className="px-6 py-4 text-slate-700">{profile.favouriteSport}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            </div>
        </div>
    )
}

export default Profile;
