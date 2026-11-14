import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="top" role="banner">
      <div className="wrap bar">
        <Link className="brand" to="/" aria-label="ASTRAV//E Planetary Analogue Discovery Platform">
          <svg className="logo" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path className="l-sweep" d="M16 16 L16 2 A14 14 0 0 1 28.12 9 Z" fill="currentColor" />
            <circle
              className="l-ring"
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <circle
              className="l-mid"
              cx="16"
              cy="16"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              className="l-ping"
              cx="16"
              cy="16"
              r="2.5"
              fill="currentColor"
            />
          </svg>
          <span className="brand-name">
            ASTRAV<span className="brand-slash">//</span>E
          </span>
          <span className="brand-indicator" title="Telemetry Feed Online" aria-label="System online"></span>
        </Link>

        <div className="top-actions">
          <nav aria-label="Primary Platform Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Overview
            </NavLink>
            <NavLink
              to="/viewer"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Analogue viewer
            </NavLink>
            <NavLink
              to="/how-sar"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              SAR Physics
            </NavLink>
            <NavLink
              to="/data"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Data &amp; Provenance
            </NavLink>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
