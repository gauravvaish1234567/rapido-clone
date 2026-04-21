const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const User = require('../models/User');
const { getIO } = require('../sockets');

async function requestRide(req, res) {
  const { rideId, pickupLocation, dropoffLocation } = req.body;

  const ride = await Ride.findById(rideId);
  if (!ride || ride.status !== 'open') {
    return res.status(400).json({ message: 'Ride not available' });
  }

  const request = await RideRequest.create({
    ride: rideId,
    rider: req.user._id,
    pickupLocation,
    dropoffLocation,
    fare: ride.pricingType === 'fixed' ? ride.price : undefined,
  });

  getIO().to(`user:${ride.driver.toString()}`).emit('ride:request:new', request);
  return res.status(201).json(request);
}

async function updateRequestStatus(req, res) {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await RideRequest.findById(requestId).populate('ride');
  if (!request) return res.status(404).json({ message: 'Request not found' });

  if (request.ride.driver.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  request.status = status;

  if (status === 'accepted') {
    request.ride.availableSeats = 0;
    await request.ride.save();
  }

  if (status === 'completed') {
    request.ride.status = 'completed';
    await request.ride.save();

    const earnings = request.fare || request.ride.price;
    await User.findByIdAndUpdate(request.ride.driver, { $inc: { totalEarnings: earnings } });
  }

  await request.save();

  getIO().to(`user:${request.rider.toString()}`).emit('ride:request:status', request);
  res.json(request);
}

async function getMyRideRequests(req, res) {
  const requests = await RideRequest.find({ rider: req.user._id })
    .populate({
      path: 'ride',
      populate: { path: 'driver', select: 'name phone' },
    })
    .sort({ createdAt: -1 });

  res.json(requests);
}

module.exports = { requestRide, updateRequestStatus, getMyRideRequests };
