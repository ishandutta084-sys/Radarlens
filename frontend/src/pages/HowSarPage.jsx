import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DEFAULT_STEPS = [
  {
    number: 1,
    title: 'Send a pulse',
    text: 'The satellite sends a short burst of radio waves toward the ground. It makes its own signal, so it works at night. The waves pass through clouds, smoke and rain.'
  },
  {
    number: 2,
    title: 'The ground answers',
    text: 'Each surface sends back a different amount. Smooth water bounces the pulse away, so very little returns. Crops scatter some of it. Buildings and rock send back a lot.'
  },
  {
    number: 3,
    title: 'Time and strength are recorded',
    text: 'The satellite times each echo to work out how far away the surface is. It also measures how strong the echo is, which tells it what kind of surface it hit.'
  },
  {
    number: 4,
    title: 'Many pulses become one image',
    text: 'As the satellite flies on, it sends thousands of pulses and combines the echoes. The result is a sharp image. Compare two passes and you can see what changed.'
  }
];

export default function HowSarPage() {
  const [steps, setSteps] = useState(DEFAULT_STEPS);

  useEffect(() => {
    let mounted = true;
    api.getSteps()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setSteps(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch steps, using defaults:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="steps-page">
      <main>
        <div className="page-head">
          <h1>How SAR works</h1>
          <p className="muted">Synthetic aperture radar (SAR) lets a satellite see the ground in four simple steps.</p>
        </div>

        <div className="content-layout">
          <section className="radar-steps" aria-label="How SAR works">
            {steps.map((s, index) => (
              <div key={s.number || index} className="step">
                <div className="step-number">{s.number}</div>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </section>

          <aside className="satellite-panel" aria-label="Satellite radar scan animation">
            <img
              src="images/earth-satellite-animation.webp"
              alt="NASA ISRO NISAR satellite scanning the surface of Earth"
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
