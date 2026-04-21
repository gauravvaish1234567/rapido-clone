import { useEffect, useState } from 'react';
import client from '../api/client';

export default function RideRequestsPage() {
  const [requests, setRequests] = useState([]);

  const load = () => client.get('/rides/requests/incoming').then(({ data }) => setRequests(data));

  useEffect(() => {
    load();
  }, []);

  const update = async (requestId, status) => {
    await client.patch(`/ride-requests/${requestId}/status`, { status });
    load();
  };

  return (
    <section>
      <h1>Incoming Ride Requests</h1>
      {requests.map((r) => (
        <div key={r._id} className="card">
          <p>{r.rider?.name} requested your ride</p>
          <p>Status: {r.status}</p>
          <div className="row">
            <button onClick={() => update(r._id, 'accepted')}>Accept</button>
            <button onClick={() => update(r._id, 'rejected')}>Reject</button>
            <button onClick={() => update(r._id, 'ongoing')}>Mark Ongoing</button>
            <button onClick={() => update(r._id, 'completed')}>Complete</button>
          </div>
        </div>
      ))}
    </section>
  );
}
