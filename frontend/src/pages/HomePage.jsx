import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const DEFAULT_EVENTS = [
  {
    id: 'flood',
    title: 'River flood',
    type: 'flood',
    thumb: 'images/flood.png',
    summary: 'Water spreads across farmland.'
  },
  {
    id: 'glacier',
    title: 'Glacier movement',
    type: 'glacier',
    thumb: 'images/glacier.png',
    summary: 'Ice creeps down a valley.'
  },
  {
    id: 'wetland',
    title: 'Wetland loss',
    type: 'wetland',
    thumb: 'images/wetland.png',
    summary: 'Marsh turns into dry land.'
  }
];

export default function HomePage() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  useEffect(() => {
    let mounted = true;
    api.getEvents()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch events, keeping fallback events:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="chip chip-dark rise" style={{ '--d': '.1s' }}>
              NASA Space Apps · NISAR challenge
            </p>

            <h1>
              <span className="rise" style={{ '--d': '.25s' }}>The satellite</span>
              <span className="rise" style={{ '--d': '.4s' }}>that sees through</span>
              <span className="rise" style={{ '--d': '.55s' }}>clouds.</span>
            </h1>

            <p className="lead rise" style={{ '--d': '.75s' }}>
              NISAR is a radar satellite from NASA and ISRO. It scans the ground
              day and night, in any weather. RadarLens shows what changed.
            </p>

            <div className="btn-row rise" style={{ '--d': '.95s' }}>
              <a className="btn btn-main" href="#events">Start exploring</a>
              <Link className="btn btn-ghost" to="/how-sar">How does it work?</Link>
            </div>
          </div>

          <div className="hero-visual">
            <img src="images/earth-satellite-animation.webp" alt="A satellite orbiting Earth" />
          </div>
        </div>
      </section>

      <section className="strip" aria-label="Why radar">
        <div className="wrap strip-grid">
          <p><b>Sees through clouds</b><span>Radio waves pass through cloud and smoke.</span></p>
          <p><b>Works day and night</b><span>It makes its own signal, so it needs no sunlight.</span></p>
          <p><b>Spots change</b><span>Compare two passes to see what moved.</span></p>
        </div>
      </section>

      <section className="section" id="events">
        <div className="wrap">
          <h2>Pick a change to explore</h2>
          <p className="muted">Each card opens a before and after view.</p>

          <div className="cards">
            {events.map((e) => {
              const chipClass = `chip${e.type === 'flood' ? ' chip-flood' : ''}`;
              const chipText = e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1) : 'Event';
              return (
                <Link key={e.id} className="card" to={`/viewer#${encodeURIComponent(e.id)}`}>
                  <div className="thumb">
                    <img src={e.thumb} alt={`${e.title || 'Event'} thumbnail`} />
                    <i className="scan"></i>
                  </div>
                  <span className={chipClass}>{chipText}</span>
                  <h3>{e.title}</h3>
                  <p className="muted">{e.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
