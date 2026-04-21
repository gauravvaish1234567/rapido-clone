const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: String,
    },
    dropoffLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'ongoing', 'completed'],
      default: 'requested',
    },
    fare: Number,
  },
  { timestamps: true },
);

rideRequestSchema.index({ ride: 1, rider: 1 }, { unique: true });

module.exports = mongoose.model('RideRequest', rideRequestSchema);
