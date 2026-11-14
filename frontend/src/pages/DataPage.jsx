import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DEFAULT_SOURCES = [
  {
    dataset: 'NISAR L-band & S-band SAR (Proxy: Sentinel-1 & UAVSAR)',
    usedFor: 'Before/after multi-temporal change detection, backscatter cross-section, surface roughness profiling in the Analogue viewer',
    provider: 'NASA and ISRO (NISAR mission proxy data via ESA Copernicus & NASA JPL)',
    dateRange: 'Calibrated orbital observations: May 2022 – Aug 2024'
  },
  {
    dataset: 'NASA GIBS Global WMTS Layer (MODIS / VIIRS Terra/Aqua)',
    usedFor: 'Interactive geospatial context map and bounding box verification powered by Leaflet EPSG:3857',
    provider: 'NASA Global Imagery Browse Services (GIBS) / EOSDIS',
    dateRange: 'Daily near real-time imagery updates'
  },
  {
    dataset: 'Optical Multispectral Imagery (Sentinel-2 MSI & Landsat-8/9 OLI)',
    usedFor: 'Direct side-by-side comparison demonstrating atmospheric cloud obstruction vs SAR microwave ground penetration',
    provider: 'European Space Agency (Copernicus) & USGS / NASA',
    dateRange: '2020 – 2024 coincident observation passes'
  }
];

const DEFAULT_TEAM = [
  { role: 'Frontend Architecture & Systems', name: 'Shreyas Majumder' },
  { role: 'Frontend UI & Geospatial Components', name: 'Shivam Singho' },
  { role: 'Team Lead & Backend Engineering', name: 'Ishan Dutta' },
  { role: 'Backend Services & Database Pipelines', name: 'Moulina Nandi' },
  { role: 'Planetary Analogue Research & Analysis', name: 'Shreya Roy' },
  { role: 'Scientific Presentation & Mission Modeling', name: 'Simli' }
];

export default function DataPage() {
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [team, setTeam] = useState(DEFAULT_TEAM);
  const [credits, setCredits] = useState([]);
  const [fbName, setFbName] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [fbStatus, setFbStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [fbLoading, setFbLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    api.getSources()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setSources(data);
      })
      .catch((err) => console.warn('Could not fetch sources:', err));

    api.getTeam()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setTeam(data);
      })
      .catch((err) => console.warn('Could not fetch team:', err));

    api.getEvents()
      .then(async (eventsList) => {
        if (!mounted || !Array.isArray(eventsList)) return;
        const allCredits = [];
        for (const ev of eventsList) {
          try {
            const detail = await api.getEventById(ev.id);
            if (detail && Array.isArray(detail.credits)) {
              detail.credits.forEach((c) => {
                allCredits.push({ ...c, eventTitle: detail.title });
              });
            }
          } catch (_) {}
        }
        if (mounted && allCredits.length > 0) {
          setCredits(allCredits);
        }
      })
      .catch((err) => console.warn('Could not fetch credits:', err));

    return () => {
      mounted = false;
    };
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFbStatus(null);
    setFbLoading(true);

    try {
      const res = await api.submitFeedback({ name: fbName, message: fbMessage });
      setFbStatus({
        type: 'success',
        text: res.message || 'Telemetry feedback transmission verified and logged to database.'
      });
      setFbName('');
      setFbMessage('');
    } catch (err) {
      setFbStatus({
        type: 'error',
        text: err.message || 'Transmission failed. Verify backend connection and retry.'
      });
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <main className="data-main">
      <div className="wrap">
        {/* Page Head */}
        <div className="page-head">
          <span className="telemetry-badge">
            <span className="live-dot" aria-hidden="true"></span>
            DATA PROVENANCE // RESEARCH MANIFEST
          </span>
          <h1>Data Sources, Scientific Limits &amp; Research Manifest</h1>
          <p className="muted">
            Open-access orbital observations, mission parameters, analytical constraints, and scientific research citations.
          </p>

          <div className="credit" role="note">
            <b>DATA CREDITS &amp; MISSION COLLABORATION:</b>
            <span>
              Synthetic Aperture Radar observations in <strong>ASTRAV//E</strong> are powered by the NASA-ISRO Synthetic Aperture Radar (NISAR) mission, European Space Agency (ESA) Copernicus Sentinel-1, USGS/NASA Landsat, and NASA Earth Science Data and Information System (ESDIS).
            </span>
          </div>
        </div>

        {/* Datasets Table */}
        <section className="data-section" aria-labelledby="sources-h">
          <div className="section-title-bar">
            <h2 id="sources-h">Orbital Observation Datasets</h2>
            <span className="mono-coords">CALIBRATED SCIENCE GRANULES</span>
          </div>

          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Data sources table, scrolls sideways on small screens"
          >
            <table className="data-table">
              <caption>Core telemetry and raster datasets integrated into ASTRAV//E</caption>
              <thead>
                <tr>
                  <th scope="col">Dataset / Sensor</th>
                  <th scope="col">Analytical Function</th>
                  <th scope="col">Mission Authority</th>
                  <th scope="col">Observation Temporal Range</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s, idx) => (
                  <tr key={idx}>
                    <th scope="row">
                      <span className="dataset-name">{s.dataset}</span>
                    </th>
                    <td>{s.usedFor}</td>
                    <td>{s.provider}</td>
                    <td className="mono">{s.dateRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">
            All SAR data are radiometrically terrain-corrected (RTC) to backscatter coefficient Gamma-0 (γ°) in decibels (dB) referenced to WGS84 ellipsoid.
          </p>
        </section>

        {/* Limits & Team */}
        <section className="data-section" aria-labelledby="more-h">
          <div className="panel-grid">
            {/* Scientific Constraints */}
            <article className="panel" aria-labelledby="limits-h">
              <div className="panel-header">
                <h3 id="limits-h">Scientific Constraints &amp; Uncertainty</h3>
                <span className="stat-unit-badge">VALIDATION SPEC</span>
              </div>
              <p className="muted">Critical analytical considerations for interpreting SAR backscatter data.</p>
              <ul className="limits">
                <li>
                  <b>Electromagnetic Backscatter vs Optical Reflectance:</b> Greyscale radar brightness represents microwave roughness and dielectric permittivity, not visible surface color or illumination.
                </li>
                <li>
                  <b>Geometric Uncertainty Margins:</b> Fractional change calculations carry a &plusmn;1.8% geometric margin due to radar foreshortening, layover on steep slopes, and shadow effects.
                </li>
                <li>
                  <b>Dielectric Ambiguities:</b> Sudden radar dark voids may indicate standing water, specular basaltic flows, or smooth frozen ice sheets; contextual geomorphic validation is essential.
                </li>
                <li>
                  <b>Repeat Pass Interval:</b> Temporal gaps between orbital passes range from 6 to 48 days; intermediate transient phenomena between passes are unrecorded.
                </li>
              </ul>
            </article>

            {/* Team Manifest */}
            <article className="panel" aria-labelledby="team-h">
              <div className="panel-header">
                <h3 id="team-h">Engineering &amp; Research Manifest</h3>
                <span className="stat-unit-badge">NASA SPACE APPS 2024</span>
              </div>
              <p className="muted">Multidisciplinary team specializing in aerospace computing, geospatial analysis, and planetary science.</p>
              <ul className="team-grid">
                {team.map((m, idx) => (
                  <li key={idx} className="slot">
                    <span className="role">{m.role}</span>
                    <span className="name">{m.name}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Observation Licenses and Credits */}
        <section className="data-section" aria-labelledby="credits-h">
          <div className="section-title-bar">
            <h2 id="credits-h">Observation Provenance &amp; Attribution</h2>
            <span className="mono-coords">OPEN SCIENTIFIC DATA LICENSE</span>
          </div>
          <p className="muted">
            All satellite imagery integrated into ASTRAV//E is published under Open Access or Public Domain licenses.
          </p>
          <div id="image-credits-container" className="credits-grid">
            {credits.length === 0 ? (
              <p className="muted">Loading observation provenance records…</p>
            ) : (
              credits.map((c, idx) => (
                <article key={idx} className="credit-card">
                  <div className="credit-chip-row">
                    <span className="chip">{c.eventTitle}</span>
                    <span className="credit-role-tag">{c.role}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <div className="credit-details">
                    <p><strong>Sensor / Payload:</strong> <span className="mono">{c.satellite}</span></p>
                    <p><strong>Authority / Agency:</strong> {c.author}</p>
                    <p><strong>Licensing:</strong> {c.license}</p>
                  </div>
                  <p className="credit-link-row">
                    <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                      Official Dataset Archive ↗
                    </a>
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Feedback Console */}
        <section className="data-section" aria-labelledby="feedback-h">
          <div className="section-title-bar">
            <h2 id="feedback-h">Scientific Inquiries &amp; Peer Feedback Console</h2>
            <span className="mono-coords">DISCOVERY LOGGING PROTOCOL</span>
          </div>
          <p className="muted">
            Submit observations, propose candidate planetary analogue sites, or transmit technical inquiries to the research team.
          </p>

          <form
            id="feedback-form"
            className="feedback-form"
            onSubmit={handleFeedbackSubmit}
          >
            <div className="form-group">
              <label htmlFor="fb-name">
                Researcher / Observer Name
              </label>
              <input
                type="text"
                id="fb-name"
                name="name"
                required
                maxLength={100}
                placeholder="e.g. Dr. Eleanor Vance"
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fb-message">
                Observation Report / Planetary Analogue Note
              </label>
              <textarea
                id="fb-message"
                name="message"
                required
                maxLength={1000}
                rows={4}
                placeholder="Note on radar backscatter, suggested lunar/martian comparison target, or anomaly calibration..."
                value={fbMessage}
                onChange={(e) => setFbMessage(e.target.value)}
                className="form-input form-textarea"
              />
            </div>

            <button type="submit" className="btn btn-main" id="fb-submit-btn" disabled={fbLoading}>
              {fbLoading ? 'Transmitting…' : 'Transmit Feedback Report'}
            </button>

            {fbStatus && (
              <div
                id="fb-status"
                className={`status ${fbStatus.type === 'success' ? 'is-success' : 'is-error'}`}
                role="status"
              >
                {fbStatus.text}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
