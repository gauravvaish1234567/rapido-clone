const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema(
  {
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
  { _id: false },
);

const rideSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startLocation: { type: pointSchema, required: true },
    destination: { type: pointSchema, required: true },
    time: { type: Date, required: true },
    pricingType: { type: String, enum: ['per_km', 'fixed'], required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['open', 'ongoing', 'completed', 'cancelled'],
      default: 'open',
    },
    availableSeats: { type: Number, default: 1, max: 1 },
  },
  { timestamps: true },
);

rideSchema.index({ startLocation: '2dsphere' });
rideSchema.index({ destination: '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);
