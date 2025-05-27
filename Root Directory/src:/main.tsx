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

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Navigation Menu */}
        <NavigationMenu />
        
        {/* Main Content Area */}
        <div className="flex-grow ml-20">
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
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
