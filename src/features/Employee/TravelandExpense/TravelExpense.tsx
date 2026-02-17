import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../../auth/api/axios';

export const TravelExpense = () => {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload proof");

    const formData = new FormData();
    formData.append('type', type);
    formData.append('amount', amount);
    formData.append('documentProof', file);

    try {
      const response = await api.post('/addExpense' , formData);
      if (response.ok) alert("Expense submitted!");
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Type" onChange={(e) => setType(e.target.value)} required />
      <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} required />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      <button type="submit">Submit Expense</button>
    </form>
  );
};

export default TravelExpense;
