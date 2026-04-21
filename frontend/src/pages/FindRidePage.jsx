import { useState } from 'react';
import client from '../api/client';

export default function FindRidePage() {
  const [rides, setRides] = useState([]);

  const search = async () => {
    const { data } = await client.get('/rides/search', {
      params: {
        pickupLng: -122.4194,
        pickupLat: 37.7749,
        dropoffLng: -122.2711,
        dropoffLat: 37.8044,
      },
    });
    setRides(data);
  };

  const requestRide = async (rideId) => {
    await client.post('/ride-requests', {
      rideId,
      pickupLocation: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'Pickup' },
      dropoffLocation: { type: 'Point', coordinates: [-122.2711, 37.8044], address: 'Dropoff' },
    });
    alert('Request sent');
  };

  return (
    <section>
      <h1>Find Ride</h1>
      <button onClick={search}>Search nearby matching rides</button>
      <div className="stack">
        {rides.map((ride) => (
          <div className="card" key={ride._id}>
            <p>Driver: {ride.driver?.name}</p>
            <p>Price: {ride.price}</p>
            <button onClick={() => requestRide(ride._id)}>Request Ride</button>
          </div>
        ))}
      </div>
    </section>
  );
}
