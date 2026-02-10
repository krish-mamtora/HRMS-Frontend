import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../api/axios';
import  useAuth from '../hooks/useAuth';
import axios, { AxiosError } from 'axios';

export default function RegisterPage(){
    const [form , setForm] = useState({
        Email : "" , password : "",
    });

    const [feedback , setFeedback]= useState({message:'' , error:''});
   
    const navigate = useNavigate();
    const {login} = useAuth();

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setFeedback({message:'' , error:''});

         if (!form.Email || !form.password) {
                setFeedback(prev => ({ ...prev, error: 'Please enter both Email and password.' }));
                return;
        }
        try{
            const res = await api.post("/auth/register" , form);
            if(res.data && res.data.email){
                alert("register successfully please login!");
                navigate("/login");
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
            <h1>Register</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
            <div>
                <label htmlFor="Email">Email:</label>
                <input type="text" id="Email" value={form.Email} name="Email"   onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={form.password} name="password"  onChange={handleChange} required />
            </div>
            <button type="submit">Register</button>
               
    </form>
        </div>
    )
}
