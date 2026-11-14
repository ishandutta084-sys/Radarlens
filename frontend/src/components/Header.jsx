import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="top">
      <div className="wrap bar">
        <Link className="brand" to="/" aria-label="RadarLens home">
          <svg className="logo" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
            <path className="l-sweep" d="M16 16 L16 2 A14 14 0 0 1 28.12 9 Z" fill="currentColor" />
            <circle
              className="l-ring"
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <circle
              className="l-mid"
              cx="16"
              cy="16"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              className="l-ping"
              cx="16"
              cy="16"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          RadarLens
        </Link>

        <div className="top-actions">
          <nav aria-label="Main">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/viewer"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Event viewer
            </NavLink>
            <NavLink
              to="/how-sar"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              How SAR works
            </NavLink>
            <NavLink
              to="/data"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Data sources
            </NavLink>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
