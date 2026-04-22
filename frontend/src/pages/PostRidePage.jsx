import { useState } from 'react';
import client from '../api/client';
import InteractiveGoogleMap from '../components/InteractiveGoogleMap';

export default function PostRidePage() {
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    startLocation: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco' },
    destination: { type: 'Point', coordinates: [-122.2711, 37.8044], address: 'Oakland' },
    time: '',
    pricingType: 'fixed',
    price: 10,
  });

  const setLocation = (field, coords, formattedAddress) => {
    const current = form[field];
    setForm({
      ...form,
      [field]: {
        ...current,
        coordinates: [coords.lng, coords.lat],
        address: formattedAddress || current.address,
      },
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    await client.post('/rides', form);
    setMessage('Ride posted successfully');
  };

  return (
    <section className="card">
      <h1>Post Ride</h1>
      <p className="muted">Search any place, use current location, or click on map to set start and destination points.</p>

      <InteractiveGoogleMap
        title="Start Location"
        lat={form.startLocation.coordinates[1]}
        lng={form.startLocation.coordinates[0]}
        address={form.startLocation.address}
        onLocationChange={(coords, address) => setLocation('startLocation', coords, address)}
      />

      <div className="row map-coords">
        <input
          placeholder="Start address"
          value={form.startLocation.address}
          onChange={(e) => setForm({ ...form, startLocation: { ...form.startLocation, address: e.target.value } })}
          required
        />
        <input value={form.startLocation.coordinates[1]} readOnly />
        <input value={form.startLocation.coordinates[0]} readOnly />
      </div>

      <InteractiveGoogleMap
        title="Destination"
        lat={form.destination.coordinates[1]}
        lng={form.destination.coordinates[0]}
        address={form.destination.address}
        onLocationChange={(coords, address) => setLocation('destination', coords, address)}
      />

      <div className="row map-coords">
        <input
          placeholder="Destination address"
          value={form.destination.address}
          onChange={(e) => setForm({ ...form, destination: { ...form.destination, address: e.target.value } })}
          required
        />
        <input value={form.destination.coordinates[1]} readOnly />
        <input value={form.destination.coordinates[0]} readOnly />
      </div>

      <form onSubmit={submit} className="stack" style={{ marginTop: 12 }}>
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
