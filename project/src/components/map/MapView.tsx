import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../types';

// Fix Leaflet default icon issue in React
// This is needed because Leaflet's default marker icons have relative URLs that don't work in a bundled app
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  route: Location[] | null;
}

// Component to recenter the map when locations change
const SetMapView: React.FC<{ locations: Location[] }> = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      // Create bounds object for all locations
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      
      // Fit map to these bounds
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ pickupLocation, dropoffLocation, route }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  
  // Center map on San Francisco by default
  const defaultCenter: Location = { lat: 37.7749, lng: -122.4194 };
  const defaultZoom = 12;
  
  useEffect(() => {
    const newLocations: Location[] = [];
    
    if (pickupLocation) newLocations.push(pickupLocation);
    if (dropoffLocation) newLocations.push(dropoffLocation);
    
    setLocations(newLocations);
  }, [pickupLocation, dropoffLocation]);
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={defaultZoom} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Display markers for pickup and dropoff locations */}
        {pickupLocation && (
          <Marker 
            position={[pickupLocation.lat, pickupLocation.lng]}
            title="Pickup Location"
          />
        )}
        
        {dropoffLocation && (
          <Marker 
            position={[dropoffLocation.lat, dropoffLocation.lng]}
            title="Dropoff Location"
          />
        )}
        
        {/* Display route line if available */}
        {route && route.length > 1 && (
          <Polyline 
            positions={route.map(point => [point.lat, point.lng])}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
          />
        )}
        
        {/* Auto-center map based on markers */}
        {locations.length > 0 && <SetMapView locations={locations} />}
      </MapContainer>
    </div>
  );
};

export default MapView;