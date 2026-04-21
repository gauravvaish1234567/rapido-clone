const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const rideRoutes = require('./routes/ride.routes');
const rideRequestRoutes = require('./routes/rideRequest.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'Bikepool API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/ride-requests', rideRequestRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
