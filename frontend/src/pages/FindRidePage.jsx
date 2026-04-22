import { useState } from 'react';
import client from '../api/client';

export default function FindRidePage() {
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({
    pickupAddress: 'San Francisco',
    pickupLat: 37.7749,
    pickupLng: -122.4194,
    dropoffAddress: 'Oakland',
    dropoffLat: 37.8044,
    dropoffLng: -122.2711,
  });

  const search = async () => {
    const { data } = await client.get('/rides/search', {
      params: {
        pickupLng: filters.pickupLng,
        pickupLat: filters.pickupLat,
        dropoffLng: filters.dropoffLng,
        dropoffLat: filters.dropoffLat,
      },
    });
    setRides(data);
  };

  const requestRide = async (rideId) => {
    await client.post('/ride-requests', {
      rideId,
      pickupLocation: {
        type: 'Point',
        coordinates: [Number(filters.pickupLng), Number(filters.pickupLat)],
        address: filters.pickupAddress,
      },
      dropoffLocation: {
        type: 'Point',
        coordinates: [Number(filters.dropoffLng), Number(filters.dropoffLat)],
        address: filters.dropoffAddress,
      },
    });
    alert('Request sent');
  };

  return (
    <section>
      <h1>Find Ride</h1>
      <div className="card stack">
        <h3>Pickup</h3>
        <input
          placeholder="Pickup address"
          value={filters.pickupAddress}
          onChange={(e) => setFilters({ ...filters, pickupAddress: e.target.value })}
        />
        <div className="row">
          <input
            type="number"
            step="any"
            placeholder="Pickup latitude"
            value={filters.pickupLat}
            onChange={(e) => setFilters({ ...filters, pickupLat: Number(e.target.value) })}
          />
          <input
            type="number"
            step="any"
            placeholder="Pickup longitude"
            value={filters.pickupLng}
            onChange={(e) => setFilters({ ...filters, pickupLng: Number(e.target.value) })}
          />
        </div>

        <h3>Dropoff</h3>
        <input
          placeholder="Dropoff address"
          value={filters.dropoffAddress}
          onChange={(e) => setFilters({ ...filters, dropoffAddress: e.target.value })}
        />
        <div className="row">
          <input
            type="number"
            step="any"
            placeholder="Dropoff latitude"
            value={filters.dropoffLat}
            onChange={(e) => setFilters({ ...filters, dropoffLat: Number(e.target.value) })}
          />
          <input
            type="number"
            step="any"
            placeholder="Dropoff longitude"
            value={filters.dropoffLng}
            onChange={(e) => setFilters({ ...filters, dropoffLng: Number(e.target.value) })}
          />
        </div>

        <button onClick={search}>Search nearby matching rides</button>
      </div>

      <div className="stack" style={{ marginTop: 12 }}>
        {rides.map((ride) => (
          <div className="card" key={ride._id}>
            <p>Driver: {ride.driver?.name}</p>
            <p>Price: {ride.price}</p>
            <p>
              Route: {ride.startLocation?.address || 'Start'} → {ride.destination?.address || 'Destination'}
            </p>
            <button onClick={() => requestRide(ride._id)}>Request Ride</button>
          </div>
        ))}
      </div>
    </section>
  );
}
