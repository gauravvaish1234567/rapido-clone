const Ride = require('../models/Ride');

// Simple route matching logic for MVP:
// 1) Rider pickup should be near driver's start route proximity.
// 2) Rider dropoff should be near driver's destination proximity.
async function findMatchingRides({ pickupLng, pickupLat, dropoffLng, dropoffLat }) {
  const radiusKm = Number(process.env.MATCH_RADIUS_KM || 3);
  const radiusMeters = radiusKm * 1000;

  const rides = await Ride.find({
    status: 'open',
    availableSeats: { $gt: 0 },
    startLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [pickupLng, pickupLat] },
        $maxDistance: radiusMeters,
      },
    },
    destination: {
      $near: {
        $geometry: { type: 'Point', coordinates: [dropoffLng, dropoffLat] },
        $maxDistance: radiusMeters,
      },
    },
  }).populate('driver', 'name phone totalEarnings');

  return rides;
}

module.exports = { findMatchingRides };
