import { useState } from 'react';
import client from '../api/client';

export default function PostRidePage() {
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    startLocation: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'Start' },
    destination: { type: 'Point', coordinates: [-122.2711, 37.8044], address: 'Destination' },
    time: '',
    pricingType: 'fixed',
    price: 10,
  });

  const submit = async (e) => {
    e.preventDefault();
    await client.post('/rides', form);
    setMessage('Ride posted successfully');
  };

  return (
    <section className="card">
      <h1>Post Ride</h1>
      <p className="muted">For MVP we accept coordinates directly. Google Maps Places autocomplete can be added with your API key.</p>
      <form onSubmit={submit} className="stack">
        <input type="datetime-local" onChange={(e) => setForm({ ...form, time: e.target.value })} required />
        <select onChange={(e) => setForm({ ...form, pricingType: e.target.value })}>
          <option value="fixed">Fixed</option>
          <option value="per_km">Per KM</option>
        </select>
        <input type="number" min="1" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} defaultValue={10} />
        <button type="submit">Post Ride</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
