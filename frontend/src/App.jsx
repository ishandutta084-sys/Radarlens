import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ViewerPage from './pages/ViewerPage';
import HowSarPage from './pages/HowSarPage';
import DataPage from './pages/DataPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if there is no hash
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="/viewer.html" element={<ViewerPage />} />
        <Route path="/how-sar" element={<HowSarPage />} />
        <Route path="/how-sar.html" element={<HowSarPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/data.html" element={<DataPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}
