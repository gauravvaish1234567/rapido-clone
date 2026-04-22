const OSRM_BASE_URL = process.env.OSRM_BASE_URL || 'https://router.project-osrm.org';

async function getRouteSummary({ startLng, startLat, endLng, endLat }) {
  const url = `${OSRM_BASE_URL}/route/v1/bicycle/${startLng},${startLat};${endLng},${endLat}?overview=false&geometries=geojson`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch route from OSRM');
  }

  const data = await response.json();
  if (!data.routes?.length) {
    throw new Error('No bicycle route found');
  }

  const best = data.routes[0];
  return {
    distanceMeters: best.distance,
    durationSeconds: best.duration,
  };
}

module.exports = { getRouteSummary };
