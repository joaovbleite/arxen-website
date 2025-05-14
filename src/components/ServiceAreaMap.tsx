import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet's CSS is imported

// It's good practice to ensure Leaflet's default icon path is correctly set up,
// especially when using bundlers like Vite or Webpack.
// This might sometimes be needed if default icons (like markers) appear broken.
import L from 'leaflet';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });

const ServiceAreaMap: React.FC = () => {
  const mariettaPosition: L.LatLngExpression = [33.9526, -84.5499]; // Marietta, GA coordinates
  const radiusInMiles = 90;
  const radiusInMeters = radiusInMiles * 1609.34; // Convert miles to meters

  // Core service cities list (can be expanded or adjusted)
  const cities: string[] = [
    'Marietta, GA',
    'Atlanta, GA',
    'Kennesaw, GA',
    'Smyrna, GA',
    'Alpharetta, GA',
    'Roswell, GA',
    'Woodstock, GA',
    'Cartersville, GA',
    'Canton, GA',
    'Acworth, GA',
    'Peachtree City, GA',
    'Dahlonega, GA',
    'Douglasville, GA',
    'Rome, GA',
    'Newnan, GA',
    'Griffin, GA',
    'Dallas, GA',
    'Hiram, GA',
    'Cumming, GA',
    'Decatur, GA',
    'Duluth, GA',
    'Lawrenceville, GA',
    'Tucker, GA',
    'Stone Mountain, GA',
    'Sandy Springs, GA',
    'Norcross, GA',
    'Buford, GA',
    'Augusta, GA',
    // Additional major cities within ~90 mi radius
    'Athens, GA',
    'Gainesville, GA',
    'Johns Creek, GA',
    'Milton, GA',
    'Dunwoody, GA',
    'Brookhaven, GA',
    'East Point, GA',
    'College Park, GA',
    'Stockbridge, GA',
    'McDonough, GA',
    'Conyers, GA',
    'Carrollton, GA',
    'Covington, GA',
    'Powder Springs, GA',
    'Austell, GA',
  ];

  // Toggle for expanding list
  const [expanded, setExpanded] = useState(false);

  const initialCount = 10; // number of cities to show when collapsed
  const visibleCities = expanded ? cities : cities.slice(0, initialCount);

  return (
    <div className="my-8 md:my-12 lg:my-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
          Our Service Area
        </h2>

        {/* Map & City list layout */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Map */}
          <div className="md:col-span-2">
            <div
              className="map-container-wrapper h-[320px] md:h-[420px] lg:h-[480px] rounded-lg shadow-xl overflow-hidden border-4 border-blue-600"
              aria-label="Interactive map showing service area within a 90-mile radius of Marietta, GA"
            >
              <MapContainer
                center={mariettaPosition}
                zoom={7} // Zoomed out a touch to ensure circle fits
                scrollWheelZoom={true} // Allow users to zoom in/out
                style={{ height: '100%', width: '100%' }}
                attributionControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle
                  center={mariettaPosition}
                  radius={radiusInMeters}
                  pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                >
                  <Popup>
                    Our services cover a 90-mile radius around Marietta, GA.
                  </Popup>
                </Circle>
              </MapContainer>
            </div>

            <p className="text-center mt-4 text-gray-600 mx-auto max-w-xl text-sm">
              The blue circle indicates our approximate 90-mile service radius centered on Marietta, GA. Use your mouse or touchpad to zoom and pan around the map for a closer look.
            </p>
          </div>

          {/* Cities List */}
          <aside className="md:col-span-1 bg-blue-50 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />Cities We Serve
            </h3>
            <ul className={`space-y-2 ${expanded ? 'lg:columns-2' : ''}`}>
              {visibleCities.map((city) => (
                <li key={city} className="break-inside-avoid flex items-center text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600 mr-1" />
                  {city}
                </li>
              ))}
            </ul>

            {/* Toggle Button */}
            {cities.length > initialCount && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-4 text-blue-700 hover:text-blue-900 text-sm font-medium focus:outline-none focus:underline"
                aria-expanded={expanded}
              >
                {expanded ? 'Show Fewer Cities' : `Show All ${cities.length} Cities`}
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaMap; 