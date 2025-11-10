import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { 
  LandingPage, 
  SkillsPage, 
  AboutPage, 
  ProjectShowcasePage, 
  NotFoundPage 
} from '@/pages';
import NavigationMenu from '@/components/NavigationMenu';
import InteractiveElements from '@/components/InteractiveElements';
import './index.css';

// SPA-safe hook to track pageviews
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname });
    }
  }, [location]);
};

const App = () => {
  usePageTracking(); // Tracks all route changes

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Main Content Area */}
      <div className="flex-grow md:ml-24 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectShowcasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Interactive Background Elements */}
      <InteractiveElements />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
