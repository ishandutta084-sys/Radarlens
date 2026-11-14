import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function LeafletMap({ bbox, title }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const bboxLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        scrollWheelZoom: false
      });

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      const gibsLayer = L.tileLayer(
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-05-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
        {
          maxZoom: 9,
          attribution: 'Imagery &copy; <a href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs">NASA GIBS</a>'
        }
      );

      osmLayer.addTo(map);
      gibsLayer.addTo(map);

      L.control.layers(
        { 'NASA GIBS Satellite': gibsLayer, 'OpenStreetMap': osmLayer },
        null,
        { position: 'topright' }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    if (bboxLayerRef.current) {
      map.removeLayer(bboxLayerRef.current);
      bboxLayerRef.current = null;
    }

    if (Array.isArray(bbox) && bbox.length >= 4) {
      // bbox: [south, west, north, east] -> Leaflet bounds: [[south, west], [north, east]]
      const bounds = [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]]
      ];

      const rect = L.rectangle(bounds, {
        color: '#d9640f',
        weight: 3,
        fillColor: '#d9640f',
        fillOpacity: 0.25
      }).addTo(map);

      rect.bindPopup(
        `<strong>${title || 'Study area'}</strong><br>Monitored bounding box<br><small>S: ${bbox[0]}, W: ${bbox[1]}, N: ${bbox[2]}, E: ${bbox[3]}</small>`
      );

      bboxLayerRef.current = rect;
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });
    }

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [bbox, title]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="map"
      ref={mapRef}
      role="region"
      aria-label="Interactive map of the study area"
    ></div>
  );
}
