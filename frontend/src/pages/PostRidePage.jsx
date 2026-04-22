import { useState } from 'react';
import client from '../api/client';
import LocationMapPreview from '../components/LocationMapPreview';

export default function PostRidePage() {
  const [message, setMessage] = useState('');
  const [showStartMap, setShowStartMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  const [form, setForm] = useState({
    startLocation: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco' },
    destination: { type: 'Point', coordinates: [-122.2711, 37.8044], address: 'Oakland' },
    time: '',
    pricingType: 'fixed',
    price: 10,
  });

  const setStart = (key, value) => {
    const [lng, lat] = form.startLocation.coordinates;
    const nextCoords = key === 'lat' ? [lng, Number(value)] : [Number(value), lat];
    setForm({
      ...form,
      startLocation: { ...form.startLocation, coordinates: nextCoords },
    });
  };

  const setDestination = (key, value) => {
    const [lng, lat] = form.destination.coordinates;
    const nextCoords = key === 'lat' ? [lng, Number(value)] : [Number(value), lat];
    setForm({
      ...form,
      destination: { ...form.destination, coordinates: nextCoords },
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
      <p className="muted">Set exact start and destination coordinates for your route. Click a location button to load Google Map preview.</p>
      <form onSubmit={submit} className="stack">
        <h3>Start Location</h3>
        <input
          placeholder="Start address"
          value={form.startLocation.address}
          onChange={(e) => setForm({ ...form, startLocation: { ...form.startLocation, address: e.target.value } })}
          required
        />
        <div className="row">
          <input
            placeholder="Start latitude"
            type="number"
            step="any"
            value={form.startLocation.coordinates[1]}
            onChange={(e) => setStart('lat', e.target.value)}
            required
          />
          <input
            placeholder="Start longitude"
            type="number"
            step="any"
            value={form.startLocation.coordinates[0]}
            onChange={(e) => setStart('lng', e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={() => setShowStartMap((prev) => !prev)}>
          {showStartMap ? 'Hide Start Map' : 'Show Start on Google Maps'}
        </button>
        {showStartMap && (
          <LocationMapPreview
            label="Start point"
            lat={form.startLocation.coordinates[1]}
            lng={form.startLocation.coordinates[0]}
          />
        )}

        <h3>Destination</h3>
        <input
          placeholder="Destination address"
          value={form.destination.address}
          onChange={(e) => setForm({ ...form, destination: { ...form.destination, address: e.target.value } })}
          required
        />
        <div className="row">
          <input
            placeholder="Destination latitude"
            type="number"
            step="any"
            value={form.destination.coordinates[1]}
            onChange={(e) => setDestination('lat', e.target.value)}
            required
          />
          <input
            placeholder="Destination longitude"
            type="number"
            step="any"
            value={form.destination.coordinates[0]}
            onChange={(e) => setDestination('lng', e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={() => setShowDestinationMap((prev) => !prev)}>
          {showDestinationMap ? 'Hide Destination Map' : 'Show Destination on Google Maps'}
        </button>
        {showDestinationMap && (
          <LocationMapPreview
            label="Destination point"
            lat={form.destination.coordinates[1]}
            lng={form.destination.coordinates[0]}
          />
        )}

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
