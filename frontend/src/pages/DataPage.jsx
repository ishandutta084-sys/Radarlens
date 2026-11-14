import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DEFAULT_SOURCES = [
  {
    dataset: 'NISAR L-band & S-band SAR (Proxy: Sentinel-1 & UAVSAR)',
    usedFor: 'The before and after views, change detection measurements, and backscatter analysis in the Event viewer',
    provider: 'NASA and ISRO (NISAR mission proxy data via ESA Copernicus & NASA JPL)',
    dateRange: 'Sample data: May 2022 – Aug 2024'
  },
  {
    dataset: 'NASA GIBS Global WMTS Layer (MODIS / VIIRS Terra/Aqua)',
    usedFor: 'Interactive global context map and event boundary display powered by Leaflet',
    provider: 'NASA Global Imagery Browse Services (GIBS) / EOSDIS',
    dateRange: 'Updated daily (Near Real-Time)'
  },
  {
    dataset: 'Optical Multispectral Imagery (Sentinel-2 & Landsat)',
    usedFor: 'Direct side-by-side comparison illustrating optical cloud blockage versus radar penetration',
    provider: 'European Union / ESA (Copernicus) & USGS / NASA',
    dateRange: '2020 – 2024 per event'
  }
];

const DEFAULT_TEAM = [
  { role: 'Frontend Developer', name: 'Shreyas Majumder' },
  { role: 'Frontend Developer', name: 'Shivam Singho' },
  { role: 'Backend Developer / Team Leader', name: 'Ishan Dutta' },
  { role: 'Backend Developer', name: 'Moulina Nandi' },
  { role: 'Presentation / Research', name: 'Shreya Roy' },
  { role: 'Presentation / Research', name: 'Simli' }
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
        text: res.message || 'Thank you! Your feedback has been received.'
      });
      setFbName('');
      setFbMessage('');
    } catch (err) {
      setFbStatus({
        type: 'error',
        text: err.message || 'Could not send feedback. Please try again later.'
      });
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <main>
      <div className="wrap">
        <div className="page-head">
          <h1>Data sources and credits</h1>
          <p className="muted">Where the images come from, what they can’t tell you, and who built this.</p>

          <div className="credit" role="note">
            <b>Data credit</b>
            <span>
              Radar imagery in RadarLens comes from the NASA-ISRO Synthetic Aperture Radar
              (NISAR) mission, a joint Earth-observing mission of NASA and the Indian Space
              Research Organisation (ISRO).
            </span>
          </div>
        </div>

        <section className="data-section" aria-labelledby="sources-h">
          <h2 id="sources-h">What we use</h2>

          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Data sources table, scrolls sideways on small screens"
          >
            <table className="data-table">
              <caption>Datasets used in RadarLens</caption>
              <thead>
                <tr>
                  <th scope="col">Dataset</th>
                  <th scope="col">Used for</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Date range</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s, idx) => (
                  <tr key={idx}>
                    <th scope="row">{s.dataset}</th>
                    <td>{s.usedFor}</td>
                    <td>{s.provider}</td>
                    <td>{s.dateRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">Every image in RadarLens is labelled with its source, date and satellite.</p>
        </section>

        <section className="data-section" aria-labelledby="more-h">
          <h2 id="more-h">Limits and team</h2>

          <div className="panel-grid">
            <article className="panel" aria-labelledby="limits-h">
              <h3 id="limits-h">Honest limits</h3>
              <p className="muted">What to keep in mind when reading the results.</p>
              <ul className="limits">
                <li><b>Radar isn’t a photo.</b> Bright and dark areas show how the ground scatters radio waves, not colour.</li>
                <li><b>Numbers are estimates.</b> Change figures come from comparing two passes and can be off at the edges.</li>
                <li><b>Not every change is a flood or a loss.</b> Wind, farming and wet soil can also alter the signal.</li>
                <li><b>Passes are days apart.</b> Anything that happened between them is not shown.</li>
              </ul>
            </article>

            <article className="panel" aria-labelledby="team-h">
              <h3 id="team-h">The team</h3>
              <p className="muted">Built for NASA Space Apps.</p>
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

        {/* IMAGE CREDITS */}
        <section className="data-section" aria-labelledby="credits-h">
          <h2 id="credits-h">Image credits and licenses</h2>
          <p className="muted">
            All satellite imagery used in RadarLens is freely licensed or public domain. Every observation is credited below.
          </p>
          <div id="image-credits-container" className="credits-grid">
            {credits.length === 0 ? (
              <p className="muted">Loading image credits…</p>
            ) : (
              credits.map((c, idx) => (
                <article key={idx} className="credit-card">
                  <span className="chip" style={{ marginBottom: '8px' }}>{c.eventTitle} · {c.role}</span>
                  <h3>{c.title}</h3>
                  <p><strong>Satellite / Sensor:</strong> {c.satellite}</p>
                  <p><strong>Author / Agency:</strong> {c.author}</p>
                  <p><strong>License:</strong> {c.license}</p>
                  <p style={{ marginTop: '8px' }}>
                    <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">Source reference link ↗</a>
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        {/* FEEDBACK FORM */}
        <section className="data-section" aria-labelledby="feedback-h">
          <h2 id="feedback-h">Feedback &amp; suggestions</h2>
          <p className="muted">Share your questions or suggestions for RadarLens.</p>

          <form
            id="feedback-form"
            className="feedback-form"
            style={{ marginTop: '16px', maxWidth: '600px' }}
            onSubmit={handleFeedbackSubmit}
          >
            <div style={{ marginBottom: '14px' }}>
              <label htmlFor="fb-name" style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>
                Your name
              </label>
              <input
                type="text"
                id="fb-name"
                name="name"
                required
                maxLength={100}
                placeholder="e.g. Shreyas Majumder"
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label htmlFor="fb-message" style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>
                Message
              </label>
              <textarea
                id="fb-message"
                name="message"
                required
                maxLength={1000}
                rows={4}
                placeholder="Your thoughts on the radar change comparison..."
                value={fbMessage}
                onChange={(e) => setFbMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button type="submit" className="btn btn-main" id="fb-submit-btn" disabled={fbLoading}>
              {fbLoading ? 'Sending…' : 'Send feedback'}
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
