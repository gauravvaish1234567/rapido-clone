const express = require('express');
const {
  requestRide,
  updateRequestStatus,
  getMyRideRequests,
} = require('../controllers/rideRequest.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, requestRide);
router.patch('/:requestId/status', protect, updateRequestStatus);
router.get('/my', protect, getMyRideRequests);

module.exports = router;
