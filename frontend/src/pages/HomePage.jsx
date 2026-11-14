import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const DEFAULT_EVENTS = [
  {
    id: 'flood',
    title: 'Sylhet Basin Inundation',
    type: 'flood',
    thumb: 'images/flood.png',
    summary: 'Monsoon hydrological surge across northeastern Bangladesh floodplains, simulating smooth dielectric basalt surfaces.',
    coordinates: '24.89° N, 91.87° E',
    sensor: 'Sentinel-1 C-Band SAR',
    analogueType: 'Basaltic Flow & Smooth Mare Analogue',
    status: 'VERIFIED ANALOGUE'
  },
  {
    id: 'glacier',
    title: 'Jakobshavn Isbræ Cryospheric Flow',
    type: 'glacier',
    thumb: 'images/glacier.png',
    summary: 'High-velocity ice sheet deformation in western Greenland, modeling lunar polar ice deposits and martian polar caps.',
    coordinates: '69.17° N, 49.83° W',
    sensor: 'Sentinel-1 & NISAR Proxy',
    analogueType: 'Polar Cold-Trap & Ice Dynamics Analogue',
    status: 'VERIFIED ANALOGUE'
  },
  {
    id: 'wetland',
    title: 'Wax Lake Delta Sedimentation',
    type: 'wetland',
    thumb: 'images/wetland.png',
    summary: 'Subaerial delta growth in coastal Louisiana, characterizing sediment transport analogous to martian paleolakes.',
    coordinates: '29.52° N, 91.44° W',
    sensor: 'C-Band SAR & L-Band UAVSAR',
    analogueType: 'Paleolake & Regolith Sediment Analogue',
    status: 'VERIFIED ANALOGUE'
  }
];

export default function HomePage() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    api.getEvents()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          // Merge API data with rich analogue metadata
          const merged = data.map((item) => {
            const fallback = DEFAULT_EVENTS.find((d) => d.id === item.id) || {};
            return {
              ...fallback,
              ...item,
              coordinates: fallback.coordinates || 'MONITORED REGION',
              sensor: fallback.sensor || 'SAR C/L-Band',
              analogueType: fallback.analogueType || 'Planetary Surface Analogue',
              status: fallback.status || 'VERIFIED ANALOGUE'
            };
          });
          setEvents(merged);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch events, keeping default analogue data:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesFilter = filter === 'all' || e.type === filter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.analogueType && e.analogueType.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [events, filter, searchQuery]);

  return (
    <main>
      {/* 1. Scientific Hero & Mission Telemetry */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <div className="mission-tag rise" style={{ '--d': '.1s' }}>
              <span className="live-dot" aria-hidden="true"></span>
              <span>MISSION: EARTH-PLANETARY-ANALOGUE // NISAR SAR ANALYSIS</span>
            </div>

            <h1 id="hero-title">
              <span className="rise" style={{ '--d': '.25s' }}>Planetary analogue</span>
              <span className="rise" style={{ '--d': '.4s' }}>discovery via Synthetic</span>
              <span className="rise" style={{ '--d': '.55s' }}>Aperture Radar.</span>
            </h1>

            <p className="lead rise" style={{ '--d': '.7s' }}>
              <strong>ASTRAV//E</strong> leverages orbital microwave radar (NISAR, Sentinel-1)
              to pierce cloud cover, smoke, and polar darkness. By measuring surface roughness,
              backscatter intensity, and dielectric properties, we identify terrestrial environments
              that mirror geological conditions on the Moon and Mars.
            </p>

            <div className="btn-row rise" style={{ '--d': '.85s' }}>
              <a className="btn btn-main" href="#events">
                Inspect Analogue Sites
              </a>
              <Link className="btn btn-ghost" to="/how-sar">
                SAR Mission Physics
              </Link>
            </div>

            <div className="telemetry-bar rise" style={{ '--d': '1s' }}>
              <div className="telem-item">
                <span className="telem-label">ORBITAL REGIME</span>
                <span className="telem-val">747 KM SSO · 98.4° INC</span>
              </div>
              <div className="telem-item">
                <span className="telem-label">FREQUENCIES</span>
                <span className="telem-val">L-BAND (1.25 GHz) · C-BAND (5.4 GHz)</span>
              </div>
              <div className="telem-item">
                <span className="telem-label">PRIMARY OBJECTIVE</span>
                <span className="telem-val">LUNAR / MARTIAN GEOMORPHOLOGY</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="satellite-frame">
              <div className="frame-corner corner-tl">┼</div>
              <div className="frame-corner corner-tr">┼</div>
              <div className="frame-corner corner-bl">┼</div>
              <div className="frame-corner corner-br">┼</div>
              <img
                src="images/earth-satellite-animation.webp"
                alt="NASA-ISRO NISAR Satellite scanning planetary analogue surfaces in Earth orbit"
              />
              <div className="visual-badge">
                <span className="badge-dot"></span>
                <span>NISAR DUAL-POL ACTIVE // REPEAT CYCLE: 12 DAYS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Technical Specification Strip */}
      <section className="strip" aria-label="SAR Physical Capabilities">
        <div className="wrap strip-grid">
          <div className="strip-item">
            <div className="strip-icon">01 // SPECTRAL</div>
            <h3>Penetrative Microwaves</h3>
            <p>Radio wavelengths (5.6 cm – 24 cm) pierce dense clouds, tropical storms, and atmospheric dust.</p>
          </div>
          <div className="strip-item">
            <div className="strip-icon">02 // ILLUMINATION</div>
            <h3>Zero-Sunlight Operation</h3>
            <p>Active sensor emits its own radar pulse, capturing lunar polar cold-traps and Earth night passes.</p>
          </div>
          <div className="strip-item">
            <div className="strip-icon">03 // COHERENCE</div>
            <h3>Backscatter Dielectrics</h3>
            <p>Sub-centimeter phase comparison isolates surface roughness shifts, ice displacement, and flood baselines.</p>
          </div>
        </div>
      </section>

      {/* 3. Analogue Candidates & Change Events */}
      <section className="section" id="events" aria-labelledby="analogue-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 id="analogue-heading">Documented Terrestrial Analogues &amp; Targets</h2>
              <p className="muted">
                Calibrated SAR backscatter time-series comparing baseline and modified passes across target planetary environments.
              </p>
            </div>

            {/* Scientific Filter Bar */}
            <div className="filter-controls" role="toolbar" aria-label="Filter analogue sites">
              <div className="filter-group">
                <button
                  type="button"
                  className={`filter-btn ${filter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Targets ({events.length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filter === 'flood' ? 'is-active' : ''}`}
                  onClick={() => setFilter('flood')}
                >
                  Basalt / Hydro
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filter === 'glacier' ? 'is-active' : ''}`}
                  onClick={() => setFilter('glacier')}
                >
                  Polar Ice
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filter === 'wetland' ? 'is-active' : ''}`}
                  onClick={() => setFilter('wetland')}
                >
                  Delta / Regolith
                </button>
              </div>

              <div className="search-box">
                <input
                  type="search"
                  placeholder="Filter by target or coordinate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search analogue sites"
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <p>No analogue candidates match the specified filter criteria.</p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredEvents.map((e) => {
                const chipClass = `chip${e.type === 'flood' ? ' chip-flood' : ''}`;
                return (
                  <article key={e.id} className="analogue-card">
                    <Link to={`/viewer#${encodeURIComponent(e.id)}`} className="card-inner">
                      <div className="thumb">
                        <img src={e.thumb} alt={`${e.title || 'Analogue target'} radar thumbnail`} />
                        <i className="scan" aria-hidden="true"></i>
                        <span className="thumb-status">{e.status || 'VERIFIED'}</span>
                      </div>

                      <div className="card-body">
                        <div className="card-meta">
                          <span className={chipClass}>{e.analogueType}</span>
                          <span className="card-coords">{e.coordinates}</span>
                        </div>

                        <h3>{e.title}</h3>
                        <p className="card-summary">{e.summary}</p>

                        <div className="card-footer">
                          <span className="card-sensor">{e.sensor}</span>
                          <span className="card-action">Inspect Telemetry →</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
