import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Фикс для иконок Leaflet в React (стандартная проблема с путями)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  lat: number;
  lng: number;
  popupText: string;
}

export function MapComponent({ lat, lng, popupText }: MapProps) {
  // Координаты центра Казахстана (для фолбэка)
  const position: [number, number] = [lat || 48.0196, lng || 66.9237];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-lg z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lat && lng && (
        <Marker position={position}>
          <Popup>
            {popupText}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}