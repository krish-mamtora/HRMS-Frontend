import React, { useEffect, useState } from 'react'
import api from '../auth/api/axios';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useProfile from './hooks/useProfile';
import useOrg from './hooks/useOrg';


type Props = {}

const Profile = () => {

const { empProfileId } = useParams();
const numProfileId = empProfileId ? Number(empProfileId) : 0; 

  const {data , isLoading , isError , error} = useOrg(numProfileId);
   
     if(!data){
       return <h2>No Profile Found..</h2>
     }
     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {/* <div className="profile-container">
        <h1>Profile</h1>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p>Joined: {new Date(data.joinDate).toLocaleDateString()}</p>
          <p></p>
        </div>  */}
    <div>

    <div className="p-4">
  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {data?.map((profile) => (
      <li key={profile.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-slate-900">Name: {profile.firstName} {profile.lastName}</h2>
        <span className="text-sm text-sky-700 font-medium">Manager Id : {profile.managerId}</span><br/>
        <span className="text-sm text-sky-700 font-medium">Department: {profile.department}</span><br/>
        <span className="text-sm text-sky-700 font-medium">Age: {profile.age}</span><br/>
        <span className="text-sm text-sky-700 font-medium">Address: {profile.address}</span><br/>
        <span className="text-sm text-sky-700 font-medium">Gender: {profile.gender}</span><br/>
        <span className="text-sm text-sky-700 font-medium">Favourite Sport: {profile.favouriteSport}</span><br/>
        <span className="text-sm text-sky-700 font-medium">Status: {profile.isActive ? 'Active' : 'Inactive'}</span><br/>
      </li>

    ))}
  </ul>
</div>


    </div>
  </>
  )
}
export default Profile