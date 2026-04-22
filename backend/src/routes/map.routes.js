const express = require('express');
const { getRouteMetrics } = require('../controllers/map.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/route-metrics', protect, getRouteMetrics);

module.exports = router;
