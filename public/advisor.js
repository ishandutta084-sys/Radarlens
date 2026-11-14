/**
 * NISAR Applications Advisor
 * Interactive assistant grounded in NASA Science's Societal Benefits White Papers
 * and the NISAR Data User Guide (ASF DAAC).
 */

(function () {
  'use strict';

  // Topic database strictly grounded in the white papers & Data User Guide
  const TOPICS = {
    floods: {
      id: 'floods',
      title: 'Floods & Inundation Mapping',
      category: 'Natural hazards',
      paperName: 'Floods White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: true,
      product: 'GCOV (Geocoded Polarimetric Covariance backscatter)',
      summary: 'Radar maps flooding through cloud cover and can detect flooding beneath forest canopy, as well as open water.',
      details: [
        '**All-Weather Mapping**: Radar penetrates clouds, precipitation, and storm cover day or night.',
        '**Canopy Penetration**: L-band (approx. 24 cm wavelength) penetrates dense tree canopies to spot standing floodwater beneath vegetation, unlike optical satellites.',
        '**Key Stakeholders**: Directly assists responders such as FEMA, NOAA, and USGS during active emergencies.',
        '**Ecosystem & Wetland Management**: Enables wetland managers to monitor seasonal inundation patterns critical for habitat and biodiversity health.',
        '**Data Product**: **GCOV** backscatter product (Level 2).',
        '**Disaster Urgent Response**: Acquisitions already planned in the 12-day observation cycle can be flagged for priority downlink and processing within hours (NISAR does not take extra emergency acquisitions).',
        '**Scientific Limit**: Radar-derived flood maps are indicators/proxies of surface water changes, not ground-verified facts.'
      ]
    },
    damage: {
      id: 'damage',
      title: 'Damage Proxy Mapping',
      category: 'Natural hazards',
      paperName: 'Damage Mapping White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: true,
      product: 'GUNW / RUNW (Interferograms) & GCOV Coherence',
      summary: 'Before-and-after radar images are compared automatically to produce Damage Proxy Maps (DPMs) indicating probable structural and ground disruption.',
      details: [
        '**Automated Change Detection**: InSAR phase coherence and backscatter variations between pre- and post-event passes flag localized building and infrastructure collapse.',
        '**2011 Christchurch Earthquake Example**: A radar-based damage map produced just 3 days after the earthquake closely matched official government ground-survey maps that took 4 and 8 months to complete.',
        '**2016 Amatrice, Italy Example**: Highlighted how wide-swath radar coverage provides regional disaster overviews when ground transport and communication lines are severed.',
        '**Data Products**: **GUNW / RUNW** interferogram products for displacement and phase coherence; **GCOV** for structural backscatter disturbance.',
        '**Scientific Limit**: Damage proxy maps are probability indicators of surface alteration, not structural engineering certifications. SAR products require technical expertise to interpret.'
      ]
    },
    soil_moisture: {
      id: 'soil_moisture',
      title: 'Soil Moisture & Water Resources',
      category: 'Water resources',
      paperName: 'Soil Moisture and Water Resources White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'Level 3 SME2 (Soil Moisture)',
      note: 'This topic is covered by an official NASA two-page application white paper on the Societal Benefits page. You can read the original PDF on the NASA Societal Benefits page.',
      dataGuideDetails: 'Measures volumetric soil moisture for reservoir management, drought warning, irrigation scheduling, and crop yield forecasting. **Note**: The **VALIDATED** version of the Level 3 SME2 product is not yet available.'
    },
    earthquakes: {
      id: 'earthquakes',
      title: 'Earthquakes & Fault Creep',
      category: 'Natural hazards',
      paperName: 'Earthquakes White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GUNW / RUNW (Geocoded / Rapid Unwrapped Interferograms)',
      note: 'This topic is covered by an official NASA two-page application white paper on the Societal Benefits page. You can read the original PDF on the NASA Societal Benefits page.',
      dataGuideDetails: 'Measures centimeter-to-millimeter line-of-sight surface displacement across active fault zones and post-seismic relaxation using repeat-pass InSAR.'
    },
    volcanoes: {
      id: 'volcanoes',
      title: 'Volcanic Hazards',
      category: 'Natural hazards',
      paperName: 'Volcanic Hazards White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GUNW / RUNW (Interferograms)',
      note: 'This topic is covered by an official NASA two-page application white paper on the Societal Benefits page. You can read the original PDF on the NASA Societal Benefits page.',
      dataGuideDetails: 'Detects magma chamber inflation, flank deformation, and post-eruption collapse.'
    },
    landslides: {
      id: 'landslides',
      title: 'Landslides & Slope Stability',
      category: 'Natural hazards',
      paperName: 'Landslides White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GUNW / RUNW (Interferograms)',
      note: 'This topic is covered by an official NASA two-page application white paper on the Societal Benefits page. You can read the original PDF on the NASA Societal Benefits page.',
      dataGuideDetails: 'Detects slow precursory creep on unstable slopes and delineates active slide boundaries.'
    },
    subsidence: {
      id: 'subsidence',
      title: 'Subsidence & Groundwater Withdrawal',
      category: 'Natural hazards / Water resources',
      paperName: 'Subsidence & Drought and Groundwater Withdrawal White Papers',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GUNW / RUNW (Interferograms)',
      note: 'This topic is covered by official NASA application white papers on the Societal Benefits page. You can read the original PDFs on the NASA Societal Benefits page.',
      dataGuideDetails: 'Maps regional land subsidence driven by aquifer over-pumping, oil/gas extraction, or coastal soil compaction.'
    },
    forests: {
      id: 'forests',
      title: 'Forest Resources & Timber Disturbance',
      category: 'Land and agriculture',
      paperName: 'Forest Resources / Timber and Forest Disturbance White Papers',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GCOV (Backscatter)',
      note: 'This topic is covered by official NASA application white papers on the Societal Benefits page. You can read the original PDFs on the NASA Societal Benefits page.',
      dataGuideDetails: 'L-band radar penetrates canopy layers to estimate woody biomass, track selective logging, and monitor deforestation trends.'
    },
    agriculture: {
      id: 'agriculture',
      title: 'Food Security & Crop Mapping',
      category: 'Land and agriculture',
      paperName: 'Food Security White Paper',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GCOV (Backscatter) & Level 3 SME2',
      note: 'This topic is covered by an official NASA application white paper on the Societal Benefits page. You can read the original PDF on the NASA Societal Benefits page.',
      dataGuideDetails: 'Monitors crop growth cycles, field boundaries, and soil moisture conditions for agricultural planning and drought warnings.'
    },
    cryosphere: {
      id: 'cryosphere',
      title: 'Glaciers, Ice Sheets & Sea Ice',
      category: 'Ice, ocean and coast',
      paperName: 'Ice Sheets/Glaciers/Oceans & Sea Ice White Papers',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GUNW / RUNW (Ice velocity) & GCOV',
      note: 'This topic is covered by official NASA application white papers on the Societal Benefits page. You can read the original PDFs on the NASA Societal Benefits page.',
      dataGuideDetails: 'Measures glacier velocity, grounding line migration, and sea ice motion regardless of polar night or cloud cover.'
    },
    infrastructure: {
      id: 'infrastructure',
      title: 'Levees, Dams & Reservoirs',
      category: 'Water resources',
      paperName: 'Levees and Dams / Underground Reservoirs White Papers',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GUNW / RUNW (Interferograms)',
      note: 'This topic is covered by official NASA application white papers on the Societal Benefits page. You can read the original PDFs on the NASA Societal Benefits page.',
      dataGuideDetails: 'Monitors millimeters of structural movement, crest settlement, and foundation shifts in large civil engineering structures.'
    },
    coastal: {
      id: 'coastal',
      title: 'Coastal Land Loss & Oil Spills',
      category: 'Ice, ocean and coast',
      paperName: 'Coastal Land Loss & Oil Spills White Papers',
      paperUrl: 'https://science.nasa.gov/mission/nisar/societal-benefits/',
      hasFullDetail: false,
      product: 'GCOV (Backscatter) & GUNW',
      note: 'This topic is covered by official NASA application white papers on the Societal Benefits page. You can read the original PDFs on the NASA Societal Benefits page.',
      dataGuideDetails: 'Detects oil slicks through sea-surface roughness damping, and tracks shoreline erosion and barrier island degradation.'
    }
  };

  const DATA_GUIDE_INFO = {
    maturity: [
      { phase: 'BETA', window: 'Jan – Feb 2026' },
      { phase: 'PROVISIONAL', window: 'June 17 – Oct 23, 2026' },
      { phase: 'VALIDATED', window: 'Level 0–2 for acquisitions from Oct 21, 2026 onward (Released Nov 6, 2026)' }
    ],
    urgentResponse: 'Urgent Response flags acquisitions already in the 12-day observation plan for priority downlink and rapid processing (hours). NISAR does not acquire extra emergency acquisitions.',
    access: 'Access is completely free via NASA Earthdata Login on ASF Vertex, Earthdata Search, or Python libraries (asf_search, earthaccess).',
    support: [
      { name: 'ASF User Services', email: 'uso@asf.alaska.edu' },
      { name: 'NASA Earthdata Support', email: 'earthdata-support@nasa.gov' }
    ]
  };

  let currentRole = 'general';
  let chatHistory = [];

  function initAdvisor() {
    createAdvisorDOM();
    bindEvents();
    renderWelcome();
  }

  function createAdvisorDOM() {
    if (document.getElementById('nisar-advisor-root')) return;

    const root = document.createElement('div');
    root.id = 'nisar-advisor-root';
    root.innerHTML = `
      <!-- Launcher Button -->
      <button id="advisor-launcher" class="advisor-launcher" aria-label="Open NISAR Applications Advisor" title="NISAR Applications Advisor">
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="16" cy="16" r="13" stroke-dasharray="4 3"/>
          <circle cx="16" cy="16" r="7"/>
          <path d="M16 16 L25 7"/>
          <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
        </svg>
        <span>NISAR Advisor</span>
        <span class="advisor-badge">AI</span>
      </button>

      <!-- Advisor Modal / Drawer -->
      <div id="advisor-panel" class="advisor-panel" aria-hidden="true" role="dialog" aria-labelledby="advisor-header-title">
        <div class="advisor-header">
          <div class="advisor-header-info">
            <div class="advisor-avatar">
              <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
                <path d="M16 16 L16 2 A14 14 0 0 1 28.12 9 Z"/>
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4"/>
              </svg>
            </div>
            <div>
              <h3 id="advisor-header-title">NISAR Applications Advisor</h3>
              <p class="advisor-sub">NASA Science Societal Benefits & ASF Data Guide</p>
            </div>
          </div>
          <div class="advisor-header-btns">
            <button id="advisor-reset-btn" class="advisor-icon-btn" title="Reset Conversation" aria-label="Reset Conversation">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button id="advisor-close-btn" class="advisor-icon-btn" title="Close" aria-label="Close Advisor">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Role Selector Bar -->
        <div class="advisor-role-bar">
          <span class="role-label">Your Role:</span>
          <div class="role-chips" role="radiogroup" aria-label="Select your role">
            <button class="role-chip active" data-role="responder" role="radio" aria-checked="true">🚨 Responder</button>
            <button class="role-chip" data-role="researcher" role="radio" aria-checked="false">🔬 Researcher</button>
            <button class="role-chip" data-role="student" role="radio" aria-checked="false">🎓 Student</button>
            <button class="role-chip" data-role="policymaker" role="radio" aria-checked="false">🏛️ Policymaker</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="advisor-messages" class="advisor-messages" role="log" aria-live="polite"></div>

        <!-- Quick Topics Bar -->
        <div class="advisor-quick-topics">
          <span class="quick-label">Explore Applications:</span>
          <div class="quick-scroll">
            <button class="quick-btn" data-topic="floods">🌊 Floods</button>
            <button class="quick-btn" data-topic="damage">🏚️ Damage Mapping</button>
            <button class="quick-btn" data-topic="soil_moisture">💧 Soil Moisture</button>
            <button class="quick-btn" data-topic="earthquakes">🌋 Earthquakes</button>
            <button class="quick-btn" data-topic="forests">🌲 Forests & Biomass</button>
            <button class="quick-btn" data-topic="subsidence">📉 Subsidence</button>
            <button class="quick-btn" data-topic="infrastructure">🏗️ Dams & Levees</button>
            <button class="quick-btn" data-topic="cryosphere">❄️ Glaciers & Ice</button>
            <button class="quick-btn" data-topic="data_guide">📡 Data Products & Access</button>
          </div>
        </div>

        <!-- Input Box -->
        <form id="advisor-input-form" class="advisor-input-form">
          <input type="text" id="advisor-input" placeholder="Ask about floods, damage mapping, soil moisture, data access..." autocomplete="off" />
          <button type="submit" id="advisor-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(root);
  }

  function bindEvents() {
    const launcher = document.getElementById('advisor-launcher');
    const panel = document.getElementById('advisor-panel');
    const closeBtn = document.getElementById('advisor-close-btn');
    const resetBtn = document.getElementById('advisor-reset-btn');
    const form = document.getElementById('advisor-input-form');
    const input = document.getElementById('advisor-input');
    const roleBtns = document.querySelectorAll('.role-chip');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Toggle panel
    launcher.addEventListener('click', () => {
      const isOpen = panel.classList.contains('open');
      if (isOpen) {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
      } else {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 200);
      }
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    });

    resetBtn.addEventListener('click', () => {
      chatHistory = [];
      const messagesContainer = document.getElementById('advisor-messages');
      messagesContainer.innerHTML = '';
      renderWelcome();
    });

    // Role selection
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        currentRole = btn.getAttribute('data-role');
        appendMessage('system', `Role updated to: **${btn.textContent.trim()}**`);
      });
    });

    // Quick topic buttons
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const topicKey = btn.getAttribute('data-topic');
        handleTopicQuery(topicKey);
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserMessage(text);
    });

    // Wire any external triggers with [data-open-advisor]
    document.querySelectorAll('[data-open-advisor]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        const topic = el.getAttribute('data-open-advisor');
        if (topic && TOPICS[topic]) {
          handleTopicQuery(topic);
        }
      });
    });
  }

  function renderWelcome() {
    const welcomeHtml = `
      <p>👋 <strong>Welcome to the NISAR Applications Advisor.</strong></p>
      <p>I help match your operational challenges or research questions to capabilities from the joint NASA-ISRO <strong>NISAR</strong> radar mission.</p>
      <p>My answers are grounded in <strong>NASA Science's Societal Benefits White Papers</strong> and the <strong>NISAR Data User Guide</strong> (ASF DAAC).</p>
      <div class="advisor-card-callout">
        <strong>What I can help you with:</strong>
        <ul>
          <li><strong>Natural Hazards</strong>: Floods, Damage Proxy Mapping, Earthquakes, Landslides, Volcanoes, Subsidence</li>
          <li><strong>Water Resources</strong>: Soil Moisture, Levees & Dams, Drought Monitoring</li>
          <li><strong>Land & Agriculture</strong>: Forest Disturbance, Woody Biomass, Crop Monitoring</li>
          <li><strong>Data Access & Rules</strong>: Products (<code>GCOV</code>, <code>GUNW</code>, <code>SME2</code>), Urgent Response rules, and Data Maturity phases.</li>
        </ul>
      </div>
      <p class="muted-note">Select your role above, pick a quick topic, or describe the problem you are solving below!</p>
    `;
    appendMessage('advisor', welcomeHtml);
  }

  function appendMessage(sender, htmlContent) {
    const container = document.getElementById('advisor-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `advisor-msg msg-${sender}`;

    if (sender === 'advisor') {
      msgDiv.innerHTML = `
        <div class="msg-avatar">🛰️</div>
        <div class="msg-body">${htmlContent}</div>
      `;
    } else if (sender === 'user') {
      msgDiv.innerHTML = `
        <div class="msg-body">${escapeHtml(htmlContent)}</div>
        <div class="msg-avatar">👤</div>
      `;
    } else {
      msgDiv.innerHTML = `<div class="msg-body msg-system-text">${htmlContent}</div>`;
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  function handleTopicQuery(topicKey) {
    if (topicKey === 'data_guide') {
      appendMessage('user', 'Show NISAR Data Products & Access Guidelines');
      setTimeout(() => respondWithDataGuide(), 300);
      return;
    }

    const topic = TOPICS[topicKey];
    if (!topic) return;

    appendMessage('user', `Tell me about NISAR for ${topic.title}`);
    setTimeout(() => respondWithTopic(topic), 300);
  }

  function handleUserMessage(userText) {
    appendMessage('user', userText);

    // Call backend API if configured, otherwise use internal knowledge engine
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'advisor-msg msg-advisor typing';
    typingIndicator.innerHTML = '<div class="msg-avatar">🛰️</div><div class="msg-body"><span class="dots">Analyzing white papers...</span></div>';
    const container = document.getElementById('advisor-messages');
    container.appendChild(typingIndicator);
    container.scrollTop = container.scrollHeight;

    // Check if backend endpoint is accessible
    fetch('/api/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        role: currentRole
      })
    })
      .then(res => res.json())
      .then(data => {
        container.removeChild(typingIndicator);
        if (data && data.response) {
          appendMessage('advisor', data.response);
        } else {
          fallbackLocalEngine(userText);
        }
      })
      .catch(() => {
        if (container.contains(typingIndicator)) {
          container.removeChild(typingIndicator);
        }
        fallbackLocalEngine(userText);
      });
  }

  function fallbackLocalEngine(text) {
    const lower = text.toLowerCase();

    // Check Data Guide keywords
    if (lower.includes('data product') || lower.includes('download') || lower.includes('access') || lower.includes('vertex') || lower.includes('maturity') || lower.includes('beta') || lower.includes('validated') || lower.includes('urgent response')) {
      respondWithDataGuide();
      return;
    }

    // Match topics
    if (lower.includes('flood') || lower.includes('water extent') || lower.includes('inundat') || lower.includes('river')) {
      respondWithTopic(TOPICS.floods);
    } else if (lower.includes('damage') || lower.includes('building') || lower.includes('collapse') || lower.includes('dpm') || lower.includes('christchurch') || lower.includes('amatrice')) {
      respondWithTopic(TOPICS.damage);
    } else if (lower.includes('soil') || lower.includes('moisture') || lower.includes('drought') || lower.includes('irrigation')) {
      respondWithTopic(TOPICS.soil_moisture);
    } else if (lower.includes('earthquake') || lower.includes('fault') || lower.includes('seismic') || lower.includes('slip')) {
      respondWithTopic(TOPICS.earthquakes);
    } else if (lower.includes('forest') || lower.includes('biomass') || lower.includes('timber') || lower.includes('tree') || lower.includes('canopy') || lower.includes('deforest')) {
      respondWithTopic(TOPICS.forests);
    } else if (lower.includes('volcano') || lower.includes('magma') || lower.includes('eruption')) {
      respondWithTopic(TOPICS.volcanoes);
    } else if (lower.includes('landslide') || lower.includes('slope')) {
      respondWithTopic(TOPICS.landslides);
    } else if (lower.includes('subsidence') || lower.includes('sinkhole') || lower.includes('groundwater withdrawal')) {
      respondWithTopic(TOPICS.subsidence);
    } else if (lower.includes('dam') || lower.includes('levee') || lower.includes('reservoir') || lower.includes('infrastructure')) {
      respondWithTopic(TOPICS.infrastructure);
    } else if (lower.includes('ice') || lower.includes('glacier') || lower.includes('permafrost') || lower.includes('cryosphere')) {
      respondWithTopic(TOPICS.cryosphere);
    } else if (lower.includes('crop') || lower.includes('agriculture') || lower.includes('farm') || lower.includes('food security')) {
      respondWithTopic(TOPICS.agriculture);
    } else if (lower.includes('coast') || lower.includes('oil spill') || lower.includes('marine')) {
      respondWithTopic(TOPICS.coastal);
    } else {
      respondOutOfScope(text);
    }
  }

  function respondWithTopic(topic) {
    let html = `
      <h4>${topic.title}</h4>
      <div class="meta-tag">Area: ${topic.category} | Relevant Product: <code>${topic.product}</code></div>
    `;

    if (topic.hasFullDetail) {
      html += `
        <p>${topic.summary}</p>
        <div class="advisor-bullet-box">
          <ul>
            ${topic.details.map(d => `<li>${formatMarkdown(d)}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      html += `
        <div class="advisor-notice-box">
          <p>ℹ️ <strong>Official NASA White Paper Reference:</strong></p>
          <p>${topic.note}</p>
          <p><a href="${topic.paperUrl}" target="_blank" rel="noopener noreferrer">📄 Read the official 2-page PDF on NASA Science Societal Benefits &rarr;</a></p>
        </div>
        <p><strong>Actual NISAR Data Linkage:</strong></p>
        <p>${formatMarkdown(topic.dataGuideDetails)}</p>
      `;
    }

    // Role-specific note
    html += getRoleGuidance(currentRole, topic);

    appendMessage('advisor', html);
  }

  function respondWithDataGuide() {
    const html = `
      <h4>🛰️ NISAR Data Products & Availability (Data User Guide)</h4>
      <p>Data access guidelines from the official NISAR Data User Guide (ASF DAAC / NASA Earthdata):</p>
      
      <div class="advisor-bullet-box">
        <strong>Primary Products:</strong>
        <ul>
          <li><strong>GUNW / RUNW</strong>: Geocoded / Rapid Unwrapped Interferograms (for earthquakes, volcanoes, subsidence, landslides, ice velocity).</li>
          <li><strong>GCOV</strong>: Geocoded Polarimetric Covariance (for flood inundation, forest biomass, crop mapping, surface disturbance).</li>
          <li><strong>SME2 (Level 3)</strong>: Soil Moisture. <em>Note: The VALIDATED version is not yet available.</em></li>
        </ul>
      </div>

      <div class="advisor-bullet-box">
        <strong>Data Maturity Phases:</strong>
        <ul>
          ${DATA_GUIDE_INFO.maturity.map(m => `<li><strong>${m.phase}</strong>: ${m.window}</li>`).join('')}
        </ul>
      </div>

      <div class="advisor-notice-box">
        <p>🚨 <strong>Disaster Urgent Response:</strong></p>
        <p>${DATA_GUIDE_INFO.urgentResponse}</p>
      </div>

      <p><strong>How to Access:</strong></p>
      <p>${DATA_GUIDE_INFO.access}</p>
      <p><strong>Technical Support:</strong></p>
      <ul>
        ${DATA_GUIDE_INFO.support.map(s => `<li>${s.name}: <a href="mailto:${s.email}">${s.email}</a></li>`).join('')}
      </ul>
      <p><a href="https://nisar-docs.asf.alaska.edu" target="_blank" rel="noopener noreferrer">📖 Open NISAR Data User Guide (ASF) &rarr;</a></p>
    `;
    appendMessage('advisor', html);
  }

  function respondOutOfScope(query) {
    const html = `
      <p>I want to provide accurate, honest guidance grounded strictly in NASA Science documentation.</p>
      <p>Your question about <em>"${escapeHtml(query)}"</em> is not directly covered in the 30 application white papers or the NISAR Data User Guide, and per mission guidelines, I do not invent statistics, case studies, or unverified capabilities.</p>
      <div class="advisor-notice-box">
        <strong>Recommended Next Steps:</strong>
        <ul>
          <li>Review the complete list of 30 application papers on the <a href="https://science.nasa.gov/mission/nisar/societal-benefits/" target="_blank" rel="noopener noreferrer">NASA Science Societal Benefits page</a>.</li>
          <li>Check operational data specifications in the <a href="https://nisar-docs.asf.alaska.edu" target="_blank" rel="noopener noreferrer">NISAR Data User Guide</a>.</li>
          <li>Contact ASF User Services at <a href="mailto:uso@asf.alaska.edu">uso@asf.alaska.edu</a> or NASA Earthdata Support at <a href="mailto:earthdata-support@nasa.gov">earthdata-support@nasa.gov</a>.</li>
        </ul>
      </div>
    `;
    appendMessage('advisor', html);
  }

  function getRoleGuidance(role, topic) {
    if (role === 'responder') {
      return `
        <div class="role-advice">
          <strong>🚨 Emergency Responder Note:</strong> Remember that NISAR's Urgent Response flags pre-scheduled passes for rapid downlink (within hours). For damage and flood assessment, radar products serve as rapid situational indicators, not structural certifications.
        </div>
      `;
    }
    if (role === 'researcher') {
      return `
        <div class="role-advice">
          <strong>🔬 Researcher Note:</strong> For scientific studies, verify product maturity level. Level 0–2 VALIDATED products are available for acquisitions from Oct 21, 2026 onward. Access programmatically using <code>asf_search</code> or <code>earthaccess</code> Python APIs.
        </div>
      `;
    }
    if (role === 'student') {
      return `
        <div class="role-advice">
          <strong>🎓 Student Note:</strong> Check out the <a href="how-sar.html">How SAR Works</a> interactive walkthrough on this site to see how synthetic aperture geometry and radar backscatter differ from optical photography.
        </div>
      `;
    }
    if (role === 'policymaker') {
      return `
        <div class="role-advice">
          <strong>🏛️ Policymaker Note:</strong> NISAR's 12-day repeat orbit offers consistent, cloud-free baseline monitoring across state and national boundaries, eliminating cloud cover gaps during critical seasonal events.
        </div>
      `;
    }
    return '';
  }

  function formatMarkdown(str) {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvisor);
  } else {
    initAdvisor();
  }
})();
