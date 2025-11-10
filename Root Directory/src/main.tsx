import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import { initAnalytics } from './analytics';
import { usePageTracking } from './usePageTracking';

// Initialize Google Analytics once at startup
initAnalytics();

const App = () => {
  usePageTracking(); // Tracks route changes ✅

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
