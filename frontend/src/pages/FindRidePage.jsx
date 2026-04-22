import { useState } from 'react';
import client from '../api/client';
import InteractiveGoogleMap from '../components/InteractiveGoogleMap';

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

  const setPickup = (coords, address) => {
    setFilters({
      ...filters,
      pickupLat: coords.lat,
      pickupLng: coords.lng,
      pickupAddress: address || filters.pickupAddress,
    });
  };

  const setDropoff = (coords, address) => {
    setFilters({
      ...filters,
      dropoffLat: coords.lat,
      dropoffLng: coords.lng,
      dropoffAddress: address || filters.dropoffAddress,
    });
  };

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
        <InteractiveGoogleMap
          title="Pickup Location"
          lat={filters.pickupLat}
          lng={filters.pickupLng}
          address={filters.pickupAddress}
          onLocationChange={setPickup}
        />

        <div className="row map-coords">
          <input
            placeholder="Pickup address"
            value={filters.pickupAddress}
            onChange={(e) => setFilters({ ...filters, pickupAddress: e.target.value })}
          />
          <input value={filters.pickupLat} readOnly />
          <input value={filters.pickupLng} readOnly />
        </div>

        <InteractiveGoogleMap
          title="Dropoff Location"
          lat={filters.dropoffLat}
          lng={filters.dropoffLng}
          address={filters.dropoffAddress}
          onLocationChange={setDropoff}
        />

        <div className="row map-coords">
          <input
            placeholder="Dropoff address"
            value={filters.dropoffAddress}
            onChange={(e) => setFilters({ ...filters, dropoffAddress: e.target.value })}
          />
          <input value={filters.dropoffLat} readOnly />
          <input value={filters.dropoffLng} readOnly />
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
