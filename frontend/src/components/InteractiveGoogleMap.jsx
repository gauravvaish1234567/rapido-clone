import { useEffect, useRef, useState } from 'react';

function loadGoogleMapsScript(apiKey) {
  if (window.google?.maps) return Promise.resolve();

  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', resolve, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function InteractiveGoogleMap({ title, lat, lng, address, onLocationChange }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [query, setQuery] = useState(address || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Missing VITE_GOOGLE_MAPS_API_KEY. Add it to frontend/.env');
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        const center = { lat: Number(lat), lng: Number(lng) };
        mapRef.current = new window.google.maps.Map(mapElRef.current, {
          center,
          zoom: 13,
        });

        markerRef.current = new window.google.maps.Marker({
          position: center,
          map: mapRef.current,
          draggable: true,
        });

        geocoderRef.current = new window.google.maps.Geocoder();

        mapRef.current.addListener('click', (event) => {
          const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          markerRef.current.setPosition(position);
          onLocationChange(position);
        });

        markerRef.current.addListener('dragend', (event) => {
          onLocationChange({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        });
      })
      .catch(() => {
        setError('Could not load Google Maps script');
      });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const position = { lat: Number(lat), lng: Number(lng) };
    mapRef.current.setCenter(position);
    markerRef.current.setPosition(position);
  }, [lat, lng]);

  const searchAddress = () => {
    if (!geocoderRef.current || !query.trim()) return;

    geocoderRef.current.geocode({ address: query }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) {
        setError('Address not found. Try a more specific place.');
        return;
      }

      setError('');
      const location = results[0].geometry.location;
      const next = { lat: location.lat(), lng: location.lng() };
      onLocationChange(next, results[0].formatted_address);
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setError('');
        onLocationChange({ lat: coords.latitude, lng: coords.longitude });
      },
      () => setError('Could not access your current location. Please allow location access.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="map-editor">
      <h4>{title}</h4>
      <div className="row">
        <input
          placeholder="Search address or place"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" onClick={searchAddress}>Search</button>
        <button type="button" onClick={useCurrentLocation}>Use Current Location</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      <div ref={mapElRef} className="map-canvas" />
    </div>
  );
}
