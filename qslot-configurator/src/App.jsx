import { useState, useCallback } from 'react';
import { Scene3D } from './components/Scene3D';
import { DimensionControls } from './components/DimensionControls';
import { PricingPanel } from './components/PricingPanel';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({
    width: 1500,
    depth: 750,
    height: 750,
  });
  const [profile, setProfile] = useState('4040');
  const [finish, setFinish] = useState('silver');
  const [accessories, setAccessories] = useState([]);
  const [activeTab, setActiveTab] = useState('design');

  const handleDimensionChange = useCallback((key, value) => {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTemplateSelect = useCallback((template) => {
    setDimensions({
      width: template.defaults.width,
      depth: template.defaults.depth,
      height: template.defaults.height,
    });
    setProfile(template.defaults.profile);
  }, []);

  const handleToggleAccessory = useCallback((id) => {
    setAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">Q</span>
          <div>
            <h1 className="logo-title">Q-Slot Configurator</h1>
            <p className="logo-sub">80/20 T-Slot Aluminum Frame Designer</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-dot" />
          QLD, Australia
        </div>
      </header>

      <div className="mobile-tabs">
        <button
          className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        <button
          className={`tab-btn ${activeTab === '3d' ? 'active' : ''}`}
          onClick={() => setActiveTab('3d')}
        >
          3D View
        </button>
        <button
          className={`tab-btn ${activeTab === 'price' ? 'active' : ''}`}
          onClick={() => setActiveTab('price')}
        >
          Price
        </button>
      </div>

      <div className="main-layout">
        <aside className={`sidebar left ${activeTab === 'design' ? 'mobile-show' : ''}`}>
          <DimensionControls
            dimensions={dimensions}
            profile={profile}
            finish={finish}
            onDimensionChange={handleDimensionChange}
            onProfileChange={setProfile}
            onFinishChange={setFinish}
            onTemplateSelect={handleTemplateSelect}
          />
        </aside>

        <main className={`viewport ${activeTab === '3d' ? 'mobile-show' : ''}`}>
          <Scene3D
            dimensions={dimensions}
            profile={profile}
            finish={finish}
            onDimensionChange={handleDimensionChange}
          />
          <div className="viewport-info">
            <span>{dimensions.width} x {dimensions.depth} x {dimensions.height} mm</span>
            <span>Orbit: drag | Zoom: scroll</span>
          </div>
        </main>

        <aside className={`sidebar right ${activeTab === 'price' ? 'mobile-show' : ''}`}>
          <PricingPanel
            dimensions={dimensions}
            profile={profile}
            finish={finish}
            accessories={accessories}
            onToggleAccessory={handleToggleAccessory}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
