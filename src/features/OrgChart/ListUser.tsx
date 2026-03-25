import React, { useState , useMemo, useEffect  } from 'react'
import useProfile, { type UserProfileDisplayDto } from './hooks/useProfile'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../auth/api/axios';
import { getRoleFromToken } from '../auth/api/getUserRoleFromToken';

type Props = {}
interface CustomJwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}

const ListUser = (props: Props) => {
      const [isAddModalOpen, setAddModalOpen] = useState(false);
      const [isManageModalOpen, setManageModalOpen] = useState(false);
      const [selectedUser , setSelectedUser] = useState(null);
      const [formData, setFormData] = useState({ Email: '', Password: '', Role: '' });
      const [managers, setManagers] = useState([]);
      const [updatePayload, setUpdatePayload] = useState({ managerId: null });

      const handleAddMember = () =>{
        setAddModalOpen(true);
      }
      const handleMember = (user:any)=>{
        setSelectedUser(user);
        setManageModalOpen(true);
      }
      const handleChange = (e)=>{
        const {name , value} = e.target;
        setFormData((prev)=>{
           if (name === 'Email') {
           return {  ...prev,  Email: value,Password: value };
        }
        return { ...prev, [name]: value };
        });
      }
        const handleUpdateChange = (e) => {
            const { value } = e.target;
            setUpdatePayload({ managerId: parseInt(value) });
        };

        const handleUpdateSubmit = async (e) => {
            e.preventDefault();
            if (!selectedUser) return;

            try {
              // console.log(selectedUser.);
                const res = await api.put(`/UserProfile/${selectedUser.id}`, updatePayload);
                 console.log(res);
                if (res.status === 200 || res.status === 204) {
                    alert("Manager updated successfully!");
                    setManageModalOpen(false);
                }
            } catch (err) {
                console.error("Update failed:", err.response?.data || err.message);
            }
        };
      useEffect(() => {
          const fetchManagers = async () => {
              try {
                  const res = await api.get('/UserProfile?role=Manager');
                  setManagers(res.data); 
              } catch (err) {
                  console.error("Error fetching managers:", err);
              }
          };
          fetchManagers();
      }, []);

      const handleSubmit = async (e)=>{
        e.preventDefault();
       try {
            const res = await api.post("/auth/register", formData);
            if (res.status === 200 || res.status === 201) {
                alert("User Added!");
                setAddModalOpen(false);

            }
        } catch (err: any) {
            console.error("Full Error Object:", err);

            if (err.response) {
                const serverError = err.response.data?.message || (typeof err.response.data === 'string' ? err.response.data : null) || "Server Error";
                console.log({ message: '', error: serverError });
            } else {
                console.log({ message: '', error: err.message });
            }
        }
      }
     const navigate = useNavigate();
     const [searchTerm, setSearchTerm] = useState('');
     const {data , isLoading , isError, error} = useProfile();
   
    const role = getRoleFromToken();
    const openOrgChart = (userProfileId:number)=>{
          navigate(`/${role}/organization/profile/${userProfileId}`);
    }

       if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredData = data?.filter((user) => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const isHR = role === 'HR';
  
  return (
    <>
    <div className='p-4'>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">All Employee Profiles</h2>
            {isHR && (
              <>
                <button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold">Add New Member</button>
              </>
           )}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Add New Member</h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input name="Email" type="email" placeholder="employee@company.com" onChange={handleChange} required className="border border-gray-300 rounded-md w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="Role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select name="Role" onChange={handleChange} required className="border border-gray-300 rounded-md w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" >
                                        <option value="">Select Role</option>
                                        <option value="Employee">Employee</option>
                                        <option value="HR">HR</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setAddModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300" >Cancel</button>
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"> Submit</button>
                                </div>
                            </form>
                    </div>
            </div>
            )}
            {isManageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Update Manager</h3>
                        <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
                            <div className="text-sm text-gray-600">
                                <p><strong>Employee:</strong> {selectedUser?.firstName} {selectedUser?.lastName}</p>
                                <p><strong>Current Manager:</strong> {selectedUser?.managerName || 'None'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select New Manager</label>
                                <select name="managerId"  onChange={handleUpdateChange} required className="border border-gray-300 rounded-md w-full py-2 px-3 focus:ring-2 focus:ring-blue-500">
                                    <option value="">Choose Manager</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setManageModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
                                <button type="submit"  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Update Manager</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

           <div className="flex flex-wrap items-center relative w-full md:w-80">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"  placeholder="Search by name or department..."  />
             <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Dept</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Age</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Sport</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Manager Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Joined</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Chart</th>

            </tr>
          </thead>
          <tbody className="divide-gray-100">
            {filteredData.map((user) => (
              <tr key={user.userProfileId} >
                <td className="px-4 py-3 font-medium text-gray-700">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{user.department || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-600">{user.age}</td>
                <td className="px-4 py-3 text-gray-600">{user.favouriteSport || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{user.managerName}</td>
                <td className="px-4 py-3  text-gray-600">{user.isActive ? 'Active' : 'Inactive'} </td>
                <td className="px-4 py-3 text-gray-500">  {user.joinDate.split('T')[0]}</td>
                <td>
                   <button onClick={()=>handleMember(user)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold mr-3">Manage Members</button>
                    <button onClick={()=>openOrgChart(user.userProfileId)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold">View Chart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default ListUser;