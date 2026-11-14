import React, { useState } from 'react';

export default function CompareSlider({ beforeImage, afterImage, beforeDate, afterDate, title, highlightActive }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="compare" id="compare" style={{ '--pos': `${pos}%` }}>
      <div className="layer layer-before">
        <img
          id="img-before"
          src={beforeImage || 'images/flood-before.jpg'}
          alt={`${title || 'Event'} before (${beforeDate || ''})`}
        />
      </div>
      <div className="layer layer-after" id="layer-after">
        <img
          id="img-after"
          src={afterImage || 'images/flood-after.jpg'}
          alt={`${title || 'Event'} after (${afterDate || ''})`}
        />
        <div
          className={`change-overlay ${highlightActive ? 'is-active' : ''}`}
          id="change-overlay"
          aria-hidden="true"
        ></div>
      </div>

      <span className="tag tag-before">Before</span>
      <span className="tag tag-after">After</span>
      <div className="handle" aria-hidden="true"></div>

      <input
        type="range"
        id="compare-range"
        min="0"
        max="100"
        value={pos}
        step="1"
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after radar images"
        aria-valuetext={`${pos}% before, ${100 - pos}% after`}
      />
    </div>
  );
}
