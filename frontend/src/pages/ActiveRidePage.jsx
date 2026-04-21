import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export default function ActiveRidePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.emit('join:user', user._id);

    socket.on('ride:request:new', (payload) => {
      setEvents((prev) => [`New ride request: ${payload._id}`, ...prev]);
    });

    socket.on('ride:request:status', (payload) => {
      setEvents((prev) => [`Request ${payload._id} is now ${payload.status}`, ...prev]);
    });

    return () => socket.close();
  }, [user._id]);

  return (
    <section className="card">
      <h1>Active Ride Live Feed</h1>
      {events.length === 0 ? <p>No live events yet.</p> : events.map((event, idx) => <p key={idx}>{event}</p>)}
    </section>
  );
}
