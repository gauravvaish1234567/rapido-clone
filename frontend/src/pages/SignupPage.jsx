import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', roles: ['rider'] });

  const onSubmit = async (e) => {
    e.preventDefault();
    const { data } = await client.post('/auth/signup', form);
    login(data);
    navigate('/dashboard');
  };

  return (
    <div className="auth-card">
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <label>
          <input
            type="checkbox"
            onChange={(e) => setForm({ ...form, roles: e.target.checked ? ['driver', 'rider'] : ['rider'] })}
          />
          I want to drive and ride
        </label>
        <button type="submit">Create account</button>
      </form>
      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
