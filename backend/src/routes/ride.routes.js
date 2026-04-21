const express = require('express');
const {
  postRide,
  getMyPostedRides,
  findRides,
  getDriverRideRequests,
} = require('../controllers/ride.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, postRide);
router.get('/my', protect, getMyPostedRides);
router.get('/search', protect, findRides);
router.get('/requests/incoming', protect, getDriverRideRequests);

module.exports = router;
