import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import CompareSlider from '../components/CompareSlider';
import LeafletMap from '../components/LeafletMap';

const EVENT_METADATA = {
  flood: {
    code: 'EV-01',
    category: 'HYDROLOGICAL / FLOOD BASALT',
    analogueTarget: 'Lunar Mare Tranquillitatis & Oceanus Procellarum',
    incidenceAngle: '38.6°',
    polarization: 'VV + VH',
    wavelength: 'C-band (5.6 cm)',
    resolution: '10m x 10m Ground Range'
  },
  glacier: {
    code: 'EV-02',
    category: 'CRYOSPHERIC / POLAR ICE FLOW',
    analogueTarget: 'Lunar Shackleton Crater & Martian Planum Boreum',
    incidenceAngle: '41.2°',
    polarization: 'HH + HV',
    wavelength: 'C-band & L-band Proxy',
    resolution: '10m x 10m Ground Range'
  },
  wetland: {
    code: 'EV-03',
    category: 'SEDIMENTARY / REGOLITH DELTA',
    analogueTarget: 'Martian Jezero Crater Paleolake & Eberswalde Delta',
    incidenceAngle: '35.4°',
    polarization: 'VV + VH',
    wavelength: 'C-band & L-band UAVSAR',
    resolution: '10m x 10m Ground Range'
  }
};

export default function ViewerPage() {
  const location = useLocation();
  const [selectedEventId, setSelectedEventId] = useState('flood');
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [highlightActive, setHighlightActive] = useState(false);
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  useEffect(() => {
    const hash = location.hash.replace('#', '').toLowerCase();
    if (['flood', 'glacier', 'wetland'].includes(hash)) {
      setSelectedEventId(hash);
    } else {
      setSelectedEventId('flood');
    }
  }, [location.hash]);

  const loadEvent = (id) => {
    setLoading(true);
    setError(false);
    api.getEventById(id)
      .then((data) => {
        setEventData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load event data for ' + id + ':', err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEvent(selectedEventId);
  }, [selectedEventId]);

  const handleTabClick = (id) => {
    window.location.hash = id;
    setSelectedEventId(id);
  };

  const meta = EVENT_METADATA[selectedEventId] || EVENT_METADATA.flood;
  const beforeCred = eventData?.credits?.[0]?.satellite || 'C-band SAR';
  const authorCred = eventData?.credits?.[0]?.author || 'Copernicus / NASA';

  const deltaVal =
    eventData?.before?.value != null && eventData?.after?.value != null
      ? (eventData.after.value - eventData.before.value).toFixed(1)
      : null;

  return (
    <main className="viewer-main">
      <div className="wrap">
        {/* Workspace Header */}
        <div className="page-head">
          <div className="viewer-title-row">
            <div>
              <span className="telemetry-badge">
                <span className="live-dot" aria-hidden="true"></span>
                SAR CALIBRATED COMPARATOR // WORKSPACE
              </span>
              <h1>Planetary Analogue Event Viewer</h1>
              <p className="muted">
                Inspect high-resolution microwave backscatter time-series. Slide the calibrated divider to compare baseline and repeat-pass observations.
              </p>
            </div>

            {/* Scientific Event Selector Tabs */}
            <div className="event-tabs" role="group" aria-label="Select target analogue event">
              <button
                className={`tab ${selectedEventId === 'flood' ? 'is-active' : ''}`}
                type="button"
                data-event="flood"
                aria-pressed={selectedEventId === 'flood' ? 'true' : 'false'}
                onClick={() => handleTabClick('flood')}
              >
                <span className="tab-code">[EV-01]</span>
                <span className="tab-title">Basalt / Flood</span>
              </button>
              <button
                className={`tab ${selectedEventId === 'glacier' ? 'is-active' : ''}`}
                type="button"
                data-event="glacier"
                aria-pressed={selectedEventId === 'glacier' ? 'true' : 'false'}
                onClick={() => handleTabClick('glacier')}
              >
                <span className="tab-code">[EV-02]</span>
                <span className="tab-title">Cryo / Glacier</span>
              </button>
              <button
                className={`tab ${selectedEventId === 'wetland' ? 'is-active' : ''}`}
                type="button"
                data-event="wetland"
                aria-pressed={selectedEventId === 'wetland' ? 'true' : 'false'}
                onClick={() => handleTabClick('wetland')}
              >
                <span className="tab-code">[EV-03]</span>
                <span className="tab-title">Delta / Regolith</span>
              </button>
            </div>
          </div>

          {loading && (
            <div id="status-loading" className="status" role="status">
              <span className="status-spinner" aria-hidden="true"></span>
              <span>Acquiring synthetic aperture radar granules from orbital store…</span>
            </div>
          )}

          {error && (
            <div id="status-error" className="status is-error" role="alert">
              <span>Telemetry downlink interrupted. Verify backend API connection.</span>
              <button
                className="btn btn-ghost"
                type="button"
                id="retry-btn"
                onClick={() => loadEvent(selectedEventId)}
              >
                Retry Downlink
              </button>
            </div>
          )}

          {eventData && !loading && (
            <div className="headline-telemetry">
              <div className="headline">
                <span
                  className={`chip ${eventData.type === 'flood' ? 'chip-flood' : ''}`}
                  id="event-chip"
                >
                  {meta.category}
                </span>
                <h2 id="event-headline">{eventData.headline}</h2>
                <p className="muted" id="event-why-matters">{eventData.whyMatters}</p>
              </div>

              {/* Instrument Technical Parameters Strip */}
              <div className="instrument-telemetry-grid">
                <div className="param-item">
                  <span className="param-label">PLANETARY ANALOGUE</span>
                  <span className="param-val">{meta.analogueTarget}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">RADAR WAVELENGTH</span>
                  <span className="param-val">{meta.wavelength}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">POLARIZATION</span>
                  <span className="param-val">{meta.polarization}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">INCIDENCE ANGLE</span>
                  <span className="param-val">{meta.incidenceAngle}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">SPATIAL RESOLUTION</span>
                  <span className="param-val">{meta.resolution}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {eventData && (
          <>
            {/* Primary Calibrated Split Comparator */}
            <section className="viewer-section compare-block" aria-labelledby="slider-h">
              <div className="section-title-bar">
                <h3 id="slider-h">Calibrated Backscatter Comparator</h3>
                <span className="mono-coords">
                  {eventData.bbox ? `BBOX: [${eventData.bbox.join(', ')}] WGS84` : 'ORBITAL PASS COMPONENT'}
                </span>
              </div>

              <CompareSlider
                beforeImage={eventData.before?.image}
                afterImage={eventData.after?.image}
                beforeDate={eventData.before?.date}
                afterDate={eventData.after?.date}
                title={eventData.title}
                highlightActive={highlightActive}
              />

              <div className="compare-meta-strip">
                <p className="img-label" id="compare-label">
                  <strong>PROVENANCE:</strong> {authorCred} · <strong>T0 (BASELINE):</strong> {eventData.before?.date || 'N/A'} · <strong>T1 (REPEAT):</strong> {eventData.after?.date || 'N/A'} · <strong>SENSOR:</strong> {beforeCred} · <span id="gap-days">{eventData.gapDays ?? '--'}</span>-DAY TEMPORAL BASELINE
                </p>

                <label className="toggle-row">
                  <input
                    type="checkbox"
                    id="highlight-toggle"
                    checked={highlightActive}
                    onChange={(e) => setHighlightActive(e.target.checked)}
                  />
                  <span>Isolate dielectric / backscatter anomaly mask</span>
                </label>
              </div>
            </section>

            {/* Quantitative Change Analytics & Physics Interpretation */}
            <section className="viewer-section" aria-label="Quantitative analytics and radar interpretation">
              <div className="two-col">
                {/* Left: Quantitative Metrics */}
                <article className="panel" aria-labelledby="stats-h">
                  <div className="panel-header">
                    <h3 id="stats-h">Surface Dielectric Shift</h3>
                    <span className="stat-unit-badge">{eventData.unit}</span>
                  </div>
                  <p className="muted" id="stats-unit">
                    Fraction of observation footprint exhibiting altered radar cross-section.
                  </p>

                  <div className="stat-grid">
                    <div className="stat">
                      <div className="stat-label">Baseline Pass (T0)</div>
                      <div className="stat-num" id="stat-before">
                        {eventData.before?.value != null ? `${eventData.before.value}%` : '--'}
                      </div>
                      <div className="bar-track" aria-hidden="true">
                        <div
                          className="bar-fill bar-before"
                          id="bar-before"
                          style={{ width: `${Math.min(100, Math.max(0, eventData.before?.value || 0))}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-label">Repeat Pass (T1)</div>
                      <div className="stat-num" id="stat-after">
                        {eventData.after?.value != null ? `${eventData.after.value}%` : '--'}
                      </div>
                      <div className="bar-track" aria-hidden="true">
                        <div
                          className="bar-fill bar-after"
                          id="bar-after"
                          style={{ width: `${Math.min(100, Math.max(0, eventData.after?.value || 0))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {deltaVal !== null && (
                    <div className="delta-box">
                      <span className="delta-title">NET SURFACE DELTA</span>
                      <span className="delta-value">
                        {Number(deltaVal) > 0 ? `+${deltaVal}%` : `${deltaVal}%`}
                      </span>
                      <span className="delta-sub">Calculated via multi-temporal interferometric backscatter amplitude ratio</span>
                    </div>
                  )}

                  <p className="stat-meta">
                    Geospatial estimate. Geometric boundary uncertainty &plusmn;1.8%. <Link to="/data">Review scientific limits</Link>.
                  </p>
                </article>

                {/* Right: Physics Interpretation */}
                <article className="panel" aria-labelledby="read-h">
                  <div className="panel-header">
                    <h3 id="read-h">Radar Backscatter Calibration</h3>
                    <span className="stat-unit-badge">GAMMA-0 (γ°)</span>
                  </div>
                  <p className="muted">Standardized electromagnetic response classification.</p>

                  <ul className="legend">
                    <li>
                      <i className="swatch sw-dark" aria-hidden="true"></i>
                      <span><strong>Dark Return (&sigma;&deg; &lt; -18 dB):</strong> Specular reflection away from antenna. Smooth standing water, flat ice, or pristine basalt slabs.</span>
                    </li>
                    <li>
                      <i className="swatch sw-mid" aria-hidden="true"></i>
                      <span><strong>Medium Grey (&sigma;&deg; &asymp; -12 dB):</strong> Moderate diffuse scatter. Regolith cover, dry sedimentary soils, sparse desert scrub.</span>
                    </li>
                    <li>
                      <i className="swatch sw-bright" aria-hidden="true"></i>
                      <span><strong>Bright Return (&sigma;&deg; &gt; -5 dB):</strong> Double-bounce / corner reflection. Boulder fields, steep crater scarps, or metallic manmade infrastructure.</span>
                    </li>
                  </ul>

                  <button
                    className="explain-btn"
                    type="button"
                    id="explain-btn"
                    aria-expanded={isExplainOpen ? 'true' : 'false'}
                    aria-controls="explain-body"
                    onClick={() => setIsExplainOpen(!isExplainOpen)}
                  >
                    {isExplainOpen ? 'Hide Scientific Physics Briefing' : 'Show Scientific Physics Briefing'}
                  </button>

                  <div className="explain-body" id="explain-body" hidden={!isExplainOpen}>
                    <p>
                      <strong>Active Microwave Transmission:</strong> SAR sensors emit coherent electromagnetic pulses and record both the travel time and returned complex amplitude (phase and intensity).
                    </p>
                    <p>
                      <strong>Analogue Modeling:</strong> When smooth water or ice spreads, specular scattering directs microwave energy away, creating characteristic dark radar voids. On the Moon and Mars, identical radar voids reveal smooth volcanic maria and icy polar depressions.
                    </p>
                  </div>

                  <div className="why-radar-box">
                    <strong>Planetary Observation Advantage:</strong>{' '}
                    <span id="why-radar">{eventData.whyRadar}</span>
                  </div>
                </article>
              </div>
            </section>

            {/* Radar Penetration vs Optical Cloud Cover Comparison */}
            <section className="viewer-section" aria-labelledby="vs-h">
              <div className="section-title-bar">
                <h3 id="vs-h">Spectral Penetration: SAR Microwaves vs Optical MSI</h3>
                <span className="mono-coords">COINCIDENT ACQUISITION WINDOW</span>
              </div>

              <div className="side-by-side">
                <figure className="spectral-figure">
                  <div className="ph-img">
                    <img
                      id="img-radar"
                      src={eventData.radarImage}
                      alt={`Radar microwave view of ${eventData.title || 'study area'}`}
                    />
                    <span className="spectral-tag radar-tag">SAR MICROWAVE (PENETRATIVE)</span>
                  </div>
                  <figcaption>
                    <b>Synthetic Aperture Radar (SAR)</b>
                    Unimpeded ground return directly resolving surface geomorphology.
                    <small id="radar-caption">
                      Source: {eventData.credits?.[0]?.author || 'Copernicus Sentinel-1'} · Sensor: {eventData.credits?.[0]?.satellite || 'C-band SAR'}
                    </small>
                  </figcaption>
                </figure>

                <figure className="spectral-figure">
                  <div className="ph-img">
                    <img
                      id="img-optical"
                      src={eventData.opticalImage}
                      alt={`Optical camera view of ${eventData.title || 'the same area'}`}
                    />
                    <span className="spectral-tag optical-tag">OPTICAL MULTISPECTRAL (MSI)</span>
                  </div>
                  <figcaption>
                    <b>Passive Optical Satellite</b>
                    Ground surface completely obscured by thick meteorological clouds and atmospheric vapor.
                    <small id="optical-caption">
                      Source: {eventData.credits?.[1]?.author || 'Copernicus Sentinel-2'} · Sensor: {eventData.credits?.[1]?.satellite || 'Optical MSI'}
                    </small>
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* Geospatial Context & Leaflet GIBS Mapping */}
            <section className="viewer-section" aria-labelledby="map-h">
              <div className="section-title-bar">
                <h3 id="map-h">Geospatial Target Coordinates &amp; Global Context</h3>
                <span className="mono-coords">NASA GIBS WMTS EPSG:3857</span>
              </div>

              <LeafletMap bbox={eventData.bbox} title={eventData.title} />

              <div className="map-meta-strip">
                <p className="img-label">
                  Orbital imagery layers served dynamically via NASA Global Imagery Browse Services (GIBS) &amp; OpenStreetMap contributors.
                </p>

                {eventData.bbox && (
                  <div className="bbox-table">
                    <div className="bbox-cell">
                      <span className="b-label">SOUTH LAT</span>
                      <span className="b-val">{eventData.bbox[0]}&deg;</span>
                    </div>
                    <div className="bbox-cell">
                      <span className="b-label">WEST LON</span>
                      <span className="b-val">{eventData.bbox[1]}&deg;</span>
                    </div>
                    <div className="bbox-cell">
                      <span className="b-label">NORTH LAT</span>
                      <span className="b-val">{eventData.bbox[2]}&deg;</span>
                    </div>
                    <div className="bbox-cell">
                      <span className="b-label">EAST LON</span>
                      <span className="b-val">{eventData.bbox[3]}&deg;</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="actions">
                <Link className="btn btn-main" to="/how-sar">
                  Review SAR Physics Engine
                </Link>
                <Link className="btn btn-ghost" to="/data">
                  Dataset Provenance &amp; Team
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
