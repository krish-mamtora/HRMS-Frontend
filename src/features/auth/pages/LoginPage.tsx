import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../api/axios';
import  useAuth from '../hooks/useAuth';
import axios, { AxiosError } from 'axios';


export default function LoginPage(){
      const [form , setForm] = useState({
            Email : "" , password : "",
        });
        const [feedback, setFeedback] = useState({ message: '', error: '' });
        const navigate = useNavigate();
        const {login} = useAuth();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        const handleSubmit = async (e:React.FormEvent) =>{
            e.preventDefault();
            setFeedback({ message: '', error: '' });
            if (!form.Email || !form.password) {
                setFeedback(prev => ({ ...prev, error: 'Please enter both Email and password.' }));
                return;
            }
            console.log(form.Email , form.password );
            try{
                const res = await api.post("/auth/login" , form);
                  console.log("check : 1" ,res.data ," 2 ", res.data.accessToken , " 3 ", res.data.role);
                if(res.data && res.data.accessToken && res.data.role){
                    login(res.data.accessToken , res.data.role);
                }
                if(res.data.role === 'Employee'){
                    console.log("reached--------")
                     navigate("/employee");
                }
                else if(res.data.role ==='HR'){
                    navigate("/hr");
                }
                else if(res.data.role ==="Manager"){
                   navigate("/manager");
                }
            }catch(err){
                 if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<{ message: string }>;
                        setFeedback(prev => ({ ...prev, error: axiosError.response?.data?.message || 'Login failed due to an unexpected error.' }));
                } else {
                        setFeedback(prev => ({ ...prev, error: 'An unknown error occurred.' }));
                }
            }
        }

    return (
        <div>
             {feedback.message && <p style={{ color: 'green' }}>{feedback.message}</p>}
                {feedback.error && <p style={{ color: 'red' }}>{feedback.error}</p>}
            <h1>Login</h1>
            
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
            <div>
                <label htmlFor="Email">Email:</label>
                <input type="text" id="Email" value={form.Email} name="Email"   onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={form.password} name="password"  onChange={handleChange} required />
            </div>
            <button type="submit">Login</button>
            
    </form>
        </div>
    )
}
