import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import CompareSlider from '../components/CompareSlider';
import LeafletMap from '../components/LeafletMap';

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

  const beforeCred = eventData?.credits?.[0]?.satellite || 'C-band SAR';
  const authorCred = eventData?.credits?.[0]?.author || 'Copernicus / NASA';

  return (
    <main>
      <div className="wrap">
        <div className="page-head">
          <h1>Event viewer</h1>
          <p className="muted">Drag the handle to compare radar images from before and after.</p>

          <div className="event-tabs" role="group" aria-label="Choose an event">
            <button
              className={`tab ${selectedEventId === 'flood' ? 'is-active' : ''}`}
              type="button"
              data-event="flood"
              aria-pressed={selectedEventId === 'flood' ? 'true' : 'false'}
              onClick={() => handleTabClick('flood')}
            >
              Flood
            </button>
            <button
              className={`tab ${selectedEventId === 'glacier' ? 'is-active' : ''}`}
              type="button"
              data-event="glacier"
              aria-pressed={selectedEventId === 'glacier' ? 'true' : 'false'}
              onClick={() => handleTabClick('glacier')}
            >
              Glacier
            </button>
            <button
              className={`tab ${selectedEventId === 'wetland' ? 'is-active' : ''}`}
              type="button"
              data-event="wetland"
              aria-pressed={selectedEventId === 'wetland' ? 'true' : 'false'}
              onClick={() => handleTabClick('wetland')}
            >
              Wetland
            </button>
          </div>

          {loading && (
            <div id="status-loading" className="status" role="status">
              Loading radar images…
            </div>
          )}

          {error && (
            <div id="status-error" className="status is-error" role="alert">
              <span>We couldn’t reach the data server. Check your connection and try again.</span>
              <br />
              <button
                className="btn btn-ghost"
                type="button"
                id="retry-btn"
                onClick={() => loadEvent(selectedEventId)}
              >
                Try again
              </button>
            </div>
          )}

          {eventData && !loading && (
            <div className="headline">
              <span
                className={`chip ${eventData.type === 'flood' ? 'chip-flood' : ''}`}
                id="event-chip"
              >
                {eventData.type ? eventData.type.charAt(0).toUpperCase() + eventData.type.slice(1) : 'Event'}
              </span>
              <h2 id="event-headline">{eventData.headline}</h2>
              <p className="muted" id="event-why-matters">{eventData.whyMatters}</p>
            </div>
          )}
        </div>

        {eventData && (
          <>
            <section className="viewer-section compare-block" aria-labelledby="slider-h">
              <h2 id="slider-h" style={{ position: 'absolute', left: '-9999px' }}>
                Before and after comparison
              </h2>

              <CompareSlider
                beforeImage={eventData.before?.image}
                afterImage={eventData.after?.image}
                beforeDate={eventData.before?.date}
                afterDate={eventData.after?.date}
                title={eventData.title}
                highlightActive={highlightActive}
              />

              <p className="img-label" id="compare-label">
                Source: {authorCred} · Before: {eventData.before?.date || 'N/A'} · After: {eventData.after?.date || 'N/A'} · Satellite: {beforeCred} · <span id="gap-days">{eventData.gapDays ?? '--'}</span> days apart <small>(Sample data)</small>
              </p>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  id="highlight-toggle"
                  checked={highlightActive}
                  onChange={(e) => setHighlightActive(e.target.checked)}
                />
                Highlight the changed area
              </label>
            </section>

            <section className="viewer-section" aria-label="Change numbers and explanation">
              <div className="two-col">
                <article className="panel" aria-labelledby="stats-h">
                  <h3 id="stats-h">How much changed</h3>
                  <p className="muted" id="stats-unit">{eventData.unit}</p>

                  <div className="stat">
                    <div className="stat-label">Before</div>
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
                    <div className="stat-label">After</div>
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

                  <p className="stat-meta">
                    Estimate. Edges may be off. <Link to="/data">See the limits</Link>.
                  </p>
                </article>

                <article className="panel" aria-labelledby="read-h">
                  <h3 id="read-h">Reading the radar</h3>
                  <p className="muted">What the brightness means.</p>

                  <ul className="legend">
                    <li><i className="swatch sw-dark"></i> Dark: smooth water, very little signal returns</li>
                    <li><i className="swatch sw-mid"></i> Grey: crops, grass and rough ground</li>
                    <li><i className="swatch sw-bright"></i> Bright: buildings and rock, a lot returns</li>
                  </ul>

                  <button
                    className="explain-btn"
                    type="button"
                    id="explain-btn"
                    aria-expanded={isExplainOpen ? 'true' : 'false'}
                    aria-controls="explain-body"
                    onClick={() => setIsExplainOpen(!isExplainOpen)}
                  >
                    What am I looking at?
                  </button>
                  <div className="explain-body" id="explain-body" hidden={!isExplainOpen}>
                    <p>These are radar images, not photos. The satellite sends radio waves down and records what bounces back.</p>
                    <p>Slide the handle to see the same place before and after. Dark patches that grow show where water spread.</p>
                  </div>

                  <ul className="notes">
                    <li>
                      <b>Why radar helped here.</b>{' '}
                      <span id="why-radar">{eventData.whyRadar}</span>
                    </li>
                  </ul>
                </article>
              </div>
            </section>

            <section className="viewer-section" aria-labelledby="vs-h">
              <h2 id="vs-h">Radar vs a normal camera</h2>

              <div className="side-by-side">
                <figure>
                  <div className="ph-img">
                    <img
                      id="img-radar"
                      src={eventData.radarImage}
                      alt={`Radar view of ${eventData.title || 'study area'}`}
                    />
                  </div>
                  <figcaption>
                    <b>Radar</b>
                    Sees the ground through cloud.
                    <small id="radar-caption">
                      Source: {eventData.credits?.[0]?.author || 'Copernicus Sentinel-1'} · Satellite: {eventData.credits?.[0]?.satellite || 'C-band SAR'}
                    </small>
                  </figcaption>
                </figure>

                <figure>
                  <div className="ph-img">
                    <img
                      id="img-optical"
                      src={eventData.opticalImage}
                      alt={`Normal camera view of ${eventData.title || 'the same area'}`}
                    />
                  </div>
                  <figcaption>
                    <b>Normal camera</b>
                    Blocked by cloud in the same place.
                    <small id="optical-caption">
                      Source: {eventData.credits?.[1]?.author || 'Copernicus Sentinel-2'} · Satellite: {eventData.credits?.[1]?.satellite || 'Optical MSI'}
                    </small>
                  </figcaption>
                </figure>
              </div>
            </section>

            <section className="viewer-section" aria-labelledby="map-h">
              <h2 id="map-h">Where is this?</h2>

              <LeafletMap bbox={eventData.bbox} title={eventData.title} />
              <p className="img-label">Map source: NASA Global Imagery Browse Services (GIBS) &amp; OpenStreetMap</p>

              <div className="actions">
                <Link className="btn btn-main" to="/how-sar">How does SAR work?</Link>
                <Link className="btn btn-ghost" to="/data">Data sources and limits</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
