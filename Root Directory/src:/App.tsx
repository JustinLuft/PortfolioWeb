import React from 'react';
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

const App: React.FC = () => {
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

export default App;
```

This `App.tsx` is very similar to the `main.tsx`, with a few key differences:

1. It's a separate component that can be imported into `main.tsx`
2. Uses explicit `React.FC` type for the component
3. Exports the component as default

To use this, you would modify `main.tsx` to import and use this `App` component:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
