import React from 'react';

export default function Footer() {
  return (
    <footer className="foot" role="contentinfo">
      <div className="wrap foot-content">
        <div className="foot-brand">
          <span className="brand-name">
            ASTRAV<span className="brand-slash">//</span>E
          </span>
          <span className="foot-tag">Planetary Analogue Discovery Platform</span>
        </div>
        <div className="foot-meta">
          <span>NASA Space Apps Challenge · Powered by NISAR SAR, ESA Copernicus &amp; NASA GIBS</span>
          <span className="foot-telemetry">GEO-REF: WGS84 · INSTRUMENT: L/C-BAND SYNTHETIC APERTURE RADAR</span>
        </div>
      </div>
    </footer>
  );
}
