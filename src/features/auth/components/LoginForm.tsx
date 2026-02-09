import React, { useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', error: '' });

  const handleSubmit = async (event: React.FormEvent) => {


    event.preventDefault();
    setFeedback({ message: '', error: '' });
    // console.log();
    if (!username || !password) {
      setFeedback(prev => ({ ...prev, error: 'Please enter both username and password.' }));
      return;
    }

    try {
      const response = await axios.post('https://localhost:7035/api/Auth/login',{username,password});
      setFeedback({ message: response.data.message || 'Login successful!',error: '' });
    } catch (err) {
      setFeedback({message: '',error: 'Login failed. Please check credentials or server connection.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
      {feedback.message && <p style={{ color: 'green' }}>{feedback.message}</p>}
      {feedback.error && <p style={{ color: 'red' }}>{feedback.error}</p>}
    </form>
  );
};

export default LoginForm;
