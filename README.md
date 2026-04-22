# Bikepool MVP (Ride Sharing on Existing Bike Routes)

Production-oriented MVP with:
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT
- **Realtime**: Socket.io
- **Maps/Distance (Free APIs)**:
  - **OSRM public API** for bicycle route distance/time
  - **OpenStreetMap tiles** for map rendering support

## Folder Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── sockets
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend
    ├── src
    │   ├── api
    │   ├── components
    │   ├── contexts
    │   ├── pages
    │   ├── styles
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### 1) Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend default: `http://localhost:5000`

### 2) Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend default: `http://localhost:5173`

### 3) MongoDB

Run local MongoDB or provide cloud URI in `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/bikepool
```

## API Routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Rides
- `POST /api/rides` (driver posts ride)
- `GET /api/rides/my` (driver ride history)
- `GET /api/rides/search?pickupLng=&pickupLat=&dropoffLng=&dropoffLat=` (rider match search)
- `GET /api/rides/requests/incoming` (driver incoming requests)

### Ride Requests
- `POST /api/ride-requests` (rider requests ride)
- `PATCH /api/ride-requests/:requestId/status` (driver updates status)
- `GET /api/ride-requests/my` (rider request history)

### Maps (Free)
- `GET /api/maps/route-metrics?startLng=&startLat=&endLng=&endLat=`
  - Uses **OSRM** (public/free) bicycle routing
  - Returns `distanceMeters` and `durationSeconds`

- Frontend supports loading Google Maps previews when users click Start/Destination (and Pickup/Dropoff) location actions.

## Core Flow
1. Signup/Login to get JWT.
2. Driver posts ride from A → B with time and pricing.
3. Rider searches nearby matching rides by location and destination.
4. Rider sends ride request.
5. Driver accepts/rejects (and can transition to ongoing/completed).
6. Socket.io pushes request/status updates in real time.
7. Completion updates driver earnings and history.

## Matching Logic (MVP)
- Geo-proximity matching using MongoDB geospatial queries.
- Rider pickup must be within `MATCH_RADIUS_KM` of ride start.
- Rider dropoff must be within `MATCH_RADIUS_KM` of ride destination.
- Basic direction alignment approximated by start+destination pair.

## Free Map/Geocoding Alternatives
If you want to avoid Google Maps entirely:
- Routing + distance: **OSRM** / **OpenRouteService**
- Map tiles: **OpenStreetMap**
- Geocoding: **Nominatim** (or self-hosted)

## Notes for Production Hardening
- Add request validation (Joi/Zod), rate limiting, helmet, logging.
- Add stronger route similarity checks using polyline overlap and heading similarity.
- Add payments, dispute handling, notifications, and admin moderation.
- For scale/reliability, move from public OSRM endpoint to self-hosted or paid SLA provider.
