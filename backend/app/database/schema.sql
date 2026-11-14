-- ====================================================================
-- ASTRAV//E Supabase Database Schema
-- Planetary Analogue Discovery Platform · NASA Space Apps Challenge
-- ====================================================================

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    thumb TEXT,
    summary TEXT,
    headline TEXT,
    why_matters TEXT,
    why_radar TEXT,
    unit TEXT,
    before_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    after_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    radar_image TEXT,
    optical_image TEXT,
    gap_days INTEGER,
    bbox JSONB,
    credits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);

-- 2. Data Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
    id SERIAL PRIMARY KEY,
    dataset TEXT NOT NULL,
    used_for TEXT NOT NULL,
    provider TEXT NOT NULL,
    date_range TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SAR Steps Table
CREATE TABLE IF NOT EXISTS public.steps (
    number INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    client_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Read policies for public access (Anon + Authenticated)
CREATE POLICY "Allow public read access to events"
    ON public.events FOR SELECT USING (true);

CREATE POLICY "Allow public read access to sources"
    ON public.sources FOR SELECT USING (true);

CREATE POLICY "Allow public read access to steps"
    ON public.steps FOR SELECT USING (true);

CREATE POLICY "Allow public read access to team_members"
    ON public.team_members FOR SELECT USING (true);

-- Feedback: Public can insert feedback; only authenticated/service_role can view
CREATE POLICY "Allow public insert to feedback"
    ON public.feedback FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role full access to feedback"
    ON public.feedback FOR ALL USING (auth.role() = 'service_role');

-- ====================================================================
-- SEED DATA
-- ====================================================================

-- Seed Events
INSERT INTO public.events (id, title, type, thumb, summary, headline, why_matters, why_radar, unit, before_data, after_data, radar_image, optical_image, gap_days, bbox, credits)
VALUES
(
    'flood',
    'River flood',
    'flood',
    'images/flood.png',
    'Water spreads across farmland and floodplains.',
    'Water inundated 48% of the monitored river basin after heavy monsoon rainfall',
    'Why it matters: Emergency response teams and agricultural coordinators can map inundated crops and isolated villages within hours to deploy relief supplies.',
    'Heavy monsoon clouds completely obscured the disaster zone from optical satellites, but radar signals passed straight through clouds and rain to map surface standing water day and night.',
    'Share of monitored study area inundated by surface water (Sample data)',
    '{"image": "images/flood-before.jpg", "date": "2022-05-04", "value": 18}'::jsonb,
    '{"image": "images/flood-after.jpg", "date": "2022-06-21", "value": 48}'::jsonb,
    'images/flood-radar.jpg',
    'images/flood-optical.jpg',
    48,
    '[24.1, 91.0, 25.4, 92.5]'::jsonb,
    '[{"role": "Before & After Radar", "title": "Copernicus Sentinel-1 SAR Multi-Temporal Flood Inundation Acquisition (Northeastern Bangladesh)", "satellite": "Copernicus Sentinel-1 (C-band SAR)", "author": "European Space Agency (ESA) / Copernicus Programme", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Copernicus_Sentinel-1_maps_Bangladesh_flood_ESA24337927.gif", "license": "Creative Commons Attribution 3.0 IGO / Copernicus Open Access"}, {"role": "Optical Comparison", "title": "Copernicus Sentinel-2 True-Color Observation over Inundated River Basin", "satellite": "Copernicus Sentinel-2 (Multispectral)", "author": "European Union / Copernicus Programme / ESA", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Devastating_floods_in_eastern_Bangladesh_(Copernicus_2024-09-03).png", "license": "Copernicus Open Access / Creative Commons Attribution"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    headline = EXCLUDED.headline,
    why_matters = EXCLUDED.why_matters,
    why_radar = EXCLUDED.why_radar,
    unit = EXCLUDED.unit,
    before_data = EXCLUDED.before_data,
    after_data = EXCLUDED.after_data,
    radar_image = EXCLUDED.radar_image,
    optical_image = EXCLUDED.optical_image,
    gap_days = EXCLUDED.gap_days,
    bbox = EXCLUDED.bbox,
    credits = EXCLUDED.credits;

INSERT INTO public.events (id, title, type, thumb, summary, headline, why_matters, why_radar, unit, before_data, after_data, radar_image, optical_image, gap_days, bbox, credits)
VALUES
(
    'glacier',
    'Glacier movement',
    'glacier',
    'images/glacier.png',
    'Ice creeps down a valley and calves into the fjord.',
    'Fast-flowing glacier front advanced 34 meters per day through Ilulissat Icefjord',
    'Why it matters: Glaciologists and climate scientists track polar ice velocity and calving rates to calculate sea level rise contributions and ocean circulation changes.',
    'Polar regions experience months of winter darkness and frequent cloud cover; radar generates its own microwave pulse to detect crevasse displacement and iceberg discharge without daylight.',
    'Glacier flow speed index / relative ice margin displacement (Sample data)',
    '{"image": "images/glacier-before.jpg", "date": "2015-08-16", "value": 35}'::jsonb,
    '{"image": "images/glacier-after.jpg", "date": "2024-08-03", "value": 72}'::jsonb,
    'images/glacier-radar.jpg',
    'images/glacier-optical.jpg',
    12,
    '[69.0, -51.5, 69.4, -49.5]'::jsonb,
    '[{"role": "Before Calving", "title": "Jakobshavn Glacier Calving Front Event", "satellite": "Copernicus Sentinel-2 & Sentinel-1", "author": "European Space Agency (ESA)", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jakobshavn_glacier_calving_ESA345821.jpg", "license": "CC BY-SA 3.0 IGO"}, {"role": "Radar vs Optical", "title": "Earth from Space: Jakobshavn Glacier Dual Optical and SAR Observation", "satellite": "Copernicus Sentinel-1 (C-SAR) and Sentinel-2 (MSI)", "author": "European Space Agency (ESA)", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Earth_from_Space-_Jakobshavn_Glacier,_Greenland_ESA504870_-_Jakobshavn_Glacier_captured_by_Copernicus_Sentinel-1.jpg", "license": "Creative Commons Attribution / ESA"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    headline = EXCLUDED.headline,
    why_matters = EXCLUDED.why_matters,
    why_radar = EXCLUDED.why_radar,
    unit = EXCLUDED.unit,
    before_data = EXCLUDED.before_data,
    after_data = EXCLUDED.after_data,
    radar_image = EXCLUDED.radar_image,
    optical_image = EXCLUDED.optical_image,
    gap_days = EXCLUDED.gap_days,
    bbox = EXCLUDED.bbox,
    credits = EXCLUDED.credits;

INSERT INTO public.events (id, title, type, thumb, summary, headline, why_matters, why_radar, unit, before_data, after_data, radar_image, optical_image, gap_days, bbox, credits)
VALUES
(
    'wetland',
    'Wetland loss',
    'wetland',
    'images/wetland.png',
    'Marshland dries out and vegetative canopy shrinks.',
    'Prolonged drought reduced open marsh surface water by 62% over 3 seasons',
    'Why it matters: Conservationists and water authorities monitor wetland degradation to protect migratory bird sanctuaries, carbon sinks, and underground aquifer health.',
    'Radar backscatter distinguishes between open water, dense reed marsh, and dry soil, and can detect flooded water hidden underneath thick forest and vegetation canopies.',
    'Percentage of wetland basin covered by water and healthy marsh (Sample data)',
    '{"image": "images/wetland-before.jpg", "date": "2020-06-15", "value": 78}'::jsonb,
    '{"image": "images/wetland-after.jpg", "date": "2023-06-20", "value": 26}'::jsonb,
    'images/wetland-radar.jpg',
    'images/wetland-optical.jpg',
    1095,
    '[37.08, -4.78, 37.18, -4.68]'::jsonb,
    '[{"role": "Before & After Drought", "title": "Drought Impact on Fuente de Piedra Wetland Lagoon (2020 vs 2023)", "satellite": "Copernicus Sentinel-2", "author": "European Union / Copernicus Programme / ESA", "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_impact_of_the_drought_on_the_Fuente_de_Piedra_wetlands_in_Spain.jpg", "license": "Copernicus Open Access / Creative Commons Attribution"}, {"role": "Wetland Radar", "title": "Pacaya-Samiria Amazon Wetland Inundation L-Band Radar (NISAR Proxy)", "satellite": "NASA/JPL UAVSAR & ALOS PALSAR (L-band SAR)", "author": "NASA/JPL-Caltech", "sourceUrl": "https://photojournal.jpl.nasa.gov/catalog/PIA26112", "license": "Public Domain (NASA Imagery)"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    headline = EXCLUDED.headline,
    why_matters = EXCLUDED.why_matters,
    why_radar = EXCLUDED.why_radar,
    unit = EXCLUDED.unit,
    before_data = EXCLUDED.before_data,
    after_data = EXCLUDED.after_data,
    radar_image = EXCLUDED.radar_image,
    optical_image = EXCLUDED.optical_image,
    gap_days = EXCLUDED.gap_days,
    bbox = EXCLUDED.bbox,
    credits = EXCLUDED.credits;

-- Seed Sources
INSERT INTO public.sources (dataset, used_for, provider, date_range)
VALUES
(
    'NISAR L-band & S-band SAR (Proxy: Sentinel-1 & UAVSAR)',
    'The before and after views, change detection measurements, and backscatter analysis in the Event viewer',
    'NASA and ISRO (NISAR mission proxy data via ESA Copernicus & NASA JPL)',
    'Sample data: May 2022 – Aug 2024'
),
(
    'NASA GIBS Global WMTS Layer (MODIS / VIIRS Terra/Aqua)',
    'Interactive global context map and event boundary display powered by Leaflet',
    'NASA Global Imagery Browse Services (GIBS) / EOSDIS',
    'Updated daily (Near Real-Time)'
),
(
    'Optical Multispectral Imagery (Sentinel-2 & Landsat)',
    'Direct side-by-side comparison illustrating optical cloud blockage versus radar penetration',
    'European Union / ESA (Copernicus) & USGS / NASA',
    '2020 – 2024 per event'
);

-- Seed Steps
INSERT INTO public.steps (number, title, text)
VALUES
(1, 'Send a pulse', 'The satellite sends a short burst of radio waves toward the ground. It makes its own signal, so it works at night. The waves pass through clouds, smoke and rain.'),
(2, 'The ground answers', 'Each surface sends back a different amount. Smooth water bounces the pulse away, so very little returns. Crops scatter some of it. Buildings and rock send back a lot.'),
(3, 'Time and strength are recorded', 'The satellite times each echo to work out how far away the surface is. It also measures how strong the echo is, which tells it what kind of surface it hit.'),
(4, 'Many pulses become one image', 'As the satellite flies on, it sends thousands of pulses and combines the echoes. The result is a sharp image. Compare two passes and you can see what changed.')
ON CONFLICT (number) DO UPDATE SET
    title = EXCLUDED.title,
    text = EXCLUDED.text;

-- Seed Team Members
INSERT INTO public.team_members (role, name, sort_order)
VALUES
('Frontend Developer', 'Shreyas Majumder', 1),
('Frontend Developer', 'Shivam Singho', 2),
('Backend Developer / Team Leader', 'Ishan Dutta', 3),
('Backend Developer', 'Moulina Nandi', 4),
('Presentation / Research', 'Shreya Roy', 5),
('Presentation / Research', 'Simli', 6);
