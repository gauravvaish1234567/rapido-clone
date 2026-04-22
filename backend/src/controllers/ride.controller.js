const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const { findMatchingRides } = require('../services/matching.service');

async function postRide(req, res) {
  const { startLocation, destination, time, pricingType, price } = req.body;

  const ride = await Ride.create({
    driver: req.user._id,
    startLocation,
    destination,
    time,
    pricingType,
    price,
  });

  res.status(201).json(ride);
}

async function getMyPostedRides(req, res) {
  const rides = await Ride.find({ driver: req.user._id }).sort({ createdAt: -1 });
  res.json(rides);
}

async function findRides(req, res) {
  const { pickupLng, pickupLat, dropoffLng, dropoffLat } = req.query;

  const rides = await findMatchingRides({
    pickupLng: Number(pickupLng),
    pickupLat: Number(pickupLat),
    dropoffLng: Number(dropoffLng),
    dropoffLat: Number(dropoffLat),
  });

  res.json(rides);
}

async function getDriverRideRequests(req, res) {
  const rides = await Ride.find({ driver: req.user._id }).select('_id');
  const rideIds = rides.map((r) => r._id);

  const requests = await RideRequest.find({ ride: { $in: rideIds } })
    .populate('rider', 'name phone')
    .populate('ride');

  res.json(requests);
}

module.exports = { postRide, getMyPostedRides, findRides, getDriverRideRequests };
