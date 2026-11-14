import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const DEFAULT_STEPS = [
  {
    number: 1,
    phase: 'PHASE 01/04',
    subtitle: 'COHERENT PULSE TRANSMISSION',
    title: 'Electromagnetic Pulse Emission',
    text: 'The orbital radar payload emits frequency-modulated microwave pulses (chirps) toward the planetary surface. Operating as an active remote sensing system, it generates its own illumination, enabling 24-hour observation through nighttime passes, cloud decks, storm systems, and atmospheric dust.'
  },
  {
    number: 2,
    phase: 'PHASE 02/04',
    subtitle: 'SURFACE DIELECTRIC & ROUGHNESS SCATTERING',
    title: 'Terrestrial Backscatter Interaction',
    text: 'Microwaves incident upon the surface undergo specular, diffuse, or volume scattering depending on topography and dielectric permittivity. Smooth liquid surfaces or flat basalts reflect energy away (specular void), while rough terrain, fractured bedrock, and ice scarps scatter high-energy echoes directly back to the antenna.'
  },
  {
    number: 3,
    phase: 'PHASE 03/04',
    subtitle: 'TIME-OF-FLIGHT & PHASE QUADRATURE',
    title: 'Signal Reception & Doppler Tracking',
    text: 'The antenna registers the exact time-of-flight, returned amplitude, and carrier wave phase of the echo. High-precision atomic clocks determine slant range with sub-meter accuracy, while Doppler frequency shifts induced by orbital forward velocity differentiate signals across the azimuth corridor.'
  },
  {
    number: 4,
    phase: 'PHASE 04/04',
    subtitle: 'SYNTHETIC APERTURE INTEGRATION',
    title: 'Doppler Processing & 2D Image Synthesis',
    text: 'As the spacecraft travels hundreds of meters along its orbital trajectory, thousands of pulses illuminate the same terrain footprint. By mathematically synthesizing this long flight path into a single massive virtual antenna, algorithms produce sharp 10-meter ground resolution images comparable to a kilometer-wide physical dish.'
  }
];

const BANDS = [
  {
    band: 'X-band',
    freq: '9.6 GHz',
    wavelength: '3.1 cm',
    penetration: 'Canopy surface, bare rock, top 1 mm regolith',
    analogueUse: 'High-detail surface roughness & micro-crater topography (TerraSAR-X / COSMO-SkyMed)'
  },
  {
    band: 'C-band',
    freq: '5.4 GHz',
    wavelength: '5.6 cm',
    penetration: 'Moderate foliage, glacial firn, top 5 cm soil',
    analogueUse: 'Continuous operational monitoring, ice velocity tracking, flood baselines (Copernicus Sentinel-1)'
  },
  {
    band: 'L-band',
    freq: '1.25 GHz',
    wavelength: '24.0 cm',
    penetration: 'Dense forest canopy, arid regolith up to 1–2 meters, deep glacial ice',
    analogueUse: 'Subsurface paleo-channel discovery, polar ice sheet structure, lunar regolith depth (NISAR / ALOS-2)'
  }
];

export default function HowSarPage() {
  const [steps, setSteps] = useState(DEFAULT_STEPS);

  useEffect(() => {
    let mounted = true;
    api.getSteps()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          // Merge API step text with rich scientific phase subtitles
          const merged = data.map((item, idx) => {
            const fallback = DEFAULT_STEPS[idx] || {};
            return {
              ...fallback,
              ...item,
              phase: fallback.phase || `PHASE 0${item.number || idx + 1}/04`,
              subtitle: fallback.subtitle || 'RADAR PHASING'
            };
          });
          setSteps(merged);
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
        <div className="wrap">
          {/* Header */}
          <div className="page-head">
            <span className="telemetry-badge">
              <span className="live-dot" aria-hidden="true"></span>
              PHYSICS FOUNDATIONS // MICROWAVE INTERFEROMETRY
            </span>
            <h1>How Synthetic Aperture Radar Operates</h1>
            <p className="muted">
              Synthetic Aperture Radar (SAR) is an active remote-sensing technique that combines microwave pulses and spacecraft orbital motion to achieve diffraction-limited ground resolution independent of daylight and weather.
            </p>
          </div>

          {/* 4-Step Radar Pulse Sequence */}
          <div className="content-layout">
            <section className="radar-steps" aria-label="Step-by-step radar mechanics">
              {steps.map((s, index) => (
                <article key={s.number || index} className="step">
                  <div className="step-number" aria-hidden="true">
                    0{s.number || index + 1}
                  </div>
                  <div className="step-content">
                    <div className="step-phase-tag">{s.phase} · {s.subtitle}</div>
                    <h2>{s.title}</h2>
                    <p>{s.text}</p>
                  </div>
                </article>
              ))}
            </section>

            {/* Orbit Telemetry & Animation Side Panel */}
            <aside className="satellite-panel" aria-label="Orbital payload telemetry panel">
              <div className="satellite-panel-inner">
                <div className="sat-panel-header">
                  <span className="sat-label">INSTRUMENT CONSOLE</span>
                  <span className="sat-status">NOMINAL // 747 KM</span>
                </div>

                <div className="sat-img-wrap">
                  <div className="frame-corner corner-tl">┼</div>
                  <div className="frame-corner corner-tr">┼</div>
                  <div className="frame-corner corner-bl">┼</div>
                  <div className="frame-corner corner-br">┼</div>
                  <img
                    src="images/earth-satellite-animation.webp"
                    alt="NASA ISRO NISAR satellite scanning the surface of Earth"
                  />
                  <div className="scan-line-anim" aria-hidden="true"></div>
                </div>

                <div className="sat-telemetry-specs">
                  <div className="sat-spec-row">
                    <span>ANTENNA CONFIG:</span>
                    <strong>12-meter deployable mesh reflector</strong>
                  </div>
                  <div className="sat-spec-row">
                    <span>FREQUENCY:</span>
                    <strong>L-Band (1.25 GHz) / S-Band (3.2 GHz)</strong>
                  </div>
                  <div className="sat-spec-row">
                    <span>SWATH WIDTH:</span>
                    <strong>242 km SweepSAR continuous swath</strong>
                  </div>
                  <div className="sat-spec-row">
                    <span>REPEAT CYCLE:</span>
                    <strong>12 days exact orbit repeat</strong>
                  </div>
                  <div className="sat-spec-row">
                    <span>LOOK DIRECTION:</span>
                    <strong>Left-looking polar / Right-looking equator</strong>
                  </div>
                </div>

                <div className="sat-panel-cta">
                  <Link to="/viewer" className="btn btn-main" style={{ width: '100%', textAlign: 'center' }}>
                    Launch Analogue Viewer
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Technical Radar Science Reference Section */}
          <section className="tech-reference-section" aria-labelledby="radar-ref-h">
            <div className="section-title-bar">
              <h2 id="radar-ref-h">Microwave Frequency Bands &amp; Penetration Depth</h2>
              <span className="mono-coords">ELECTROMAGNETIC SPECTRUM SPECIFICATION</span>
            </div>

            <div className="table-responsive">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Radar Band</th>
                    <th>Center Freq</th>
                    <th>Wavelength (&lambda;)</th>
                    <th>Penetration Medium</th>
                    <th>Planetary Analogue Application</th>
                  </tr>
                </thead>
                <tbody>
                  {BANDS.map((b) => (
                    <tr key={b.band}>
                      <td><strong>{b.band}</strong></td>
                      <td className="mono">{b.freq}</td>
                      <td className="mono">{b.wavelength}</td>
                      <td>{b.penetration}</td>
                      <td>{b.analogueUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="physics-tri-grid">
              <div className="physics-card">
                <h3>Surface Roughness &amp; Rayleigh Criterion</h3>
                <p>
                  A surface behaves as optically smooth or rough to radar depending on the height of micro-topographic irregularities relative to wavelength (&lambda;) and incidence angle (&theta;):
                </p>
                <div className="formula-box">
                  <code>h &lt; &lambda; / (8 &middot; cos &theta;) &rarr; Specular Reflection</code>
                </div>
                <p className="subtext">
                  Smooth surfaces reflect microwave energy away, appearing pitch black in SAR imagery.
                </p>
              </div>

              <div className="physics-card">
                <h3>Dielectric Permittivity (&epsilon;<sub>r</sub>)</h3>
                <p>
                  The dielectric constant determines how much energy is reflected versus transmitted. Dry lunar regolith has a low dielectric constant (&epsilon;<sub>r</sub> &asymp; 2.5–3.0), permitting microwave penetration into subsurface layers. Liquid water exhibits an exceptionally high dielectric constant (&epsilon;<sub>r</sub> &asymp; 80).
                </p>
              </div>

              <div className="physics-card">
                <h3>Polarimetric Backscatter (HH, VV, HV, VH)</h3>
                <p>
                  By emitting and receiving linearly polarized waves in horizontal (H) and vertical (V) configurations, SAR differentiates single surface reflections (co-pol: HH, VV) from volume scattering and multiple bounces in vegetation or fractured rock (cross-pol: HV, VH).
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
