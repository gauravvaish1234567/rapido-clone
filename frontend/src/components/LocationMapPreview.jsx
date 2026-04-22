export default function LocationMapPreview({ lat, lng, label }) {
  const query = encodeURIComponent(`${lat},${lng}`);
  const src = `https://maps.google.com/maps?q=${query}&z=14&output=embed`;

  return (
    <div className="map-preview">
      <p className="muted">{label}: {lat}, {lng}</p>
      <iframe
        title={`${label}-map`}
        src={src}
        width="100%"
        height="240"
        style={{ border: 0, borderRadius: 8 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
