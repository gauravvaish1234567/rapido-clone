const { getRouteSummary } = require('../services/map.service');

async function getRouteMetrics(req, res, next) {
  try {
    const { startLng, startLat, endLng, endLat } = req.query;

    const result = await getRouteSummary({
      startLng: Number(startLng),
      startLat: Number(startLat),
      endLng: Number(endLng),
      endLat: Number(endLat),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { getRouteMetrics };
