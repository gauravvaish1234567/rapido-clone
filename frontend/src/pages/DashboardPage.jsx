import { useEffect, useState } from 'react';
import client from '../api/client';

export default function DashboardPage() {
  const [rides, setRides] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    client.get('/rides/my').then(({ data }) => setRides(data));
    client.get('/ride-requests/my').then(({ data }) => setRequests(data));
  }, []);

  return (
    <section>
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="card">
          <h3>My Posted Rides</h3>
          {rides.map((ride) => (
            <p key={ride._id}>{new Date(ride.time).toLocaleString()} - {ride.status}</p>
          ))}
        </div>
        <div className="card">
          <h3>My Ride History</h3>
          {requests.map((request) => (
            <p key={request._id}>{request.ride?.driver?.name} - {request.status}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
