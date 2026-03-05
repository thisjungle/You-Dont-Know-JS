import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Scene3D } from './components/Scene3D';
import { DimensionControls } from './components/DimensionControls';
import { PricingPanel } from './components/PricingPanel';
import { TemplateWizard } from './components/TemplateWizard';
import {
  calculateDeflection,
  calculateCenterSupports,
  isProfileSafeForSpan,
  getMinimumSafeProfile,
} from './utils/engineering';
import { PROFILES } from './data/catalog';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({ width: 1500, depth: 750, height: 750 });
  const [profile, setProfile] = useState('4040');
  const [finish, setFinish] = useState('silver');
  const [accessories, setAccessories] = useState([]);
  const [activeTab, setActiveTab] = useState('design');
  const [extraSupports, setExtraSupports] = useState(0);
  const [loadKg, setLoadKg] = useState(50);
  const [pendingTemplate, setPendingTemplate] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, type = 'info') {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  // Auto-upgrade profile when width or load changes and current profile is no longer safe
  useEffect(() => {
    const pw = PROFILES[profile].width;
    const spanMm = dimensions.width - (2 * pw);
    if (!isProfileSafeForSpan(profile, spanMm, loadKg)) {
      const minProfile = getMinimumSafeProfile(spanMm, loadKg);
      setProfile(minProfile);
      setExtraSupports(0);
      showToast(`Profile upgraded to ${PROFILES[minProfile].name} for your span`, 'upgrade');
    }
  }, [dimensions.width, loadKg]);

  const widthBeamLength = useMemo(() => {
    const pw = PROFILES[profile].width;
    return dimensions.width - (2 * pw);
  }, [dimensions.width, profile]);

  const autoSupports = useMemo(
    () => calculateCenterSupports(widthBeamLength, profile),
    [widthBeamLength, profile]
  );

  const structuralCheck = useMemo(
    () => calculateDeflection(widthBeamLength, profile, loadKg, autoSupports + extraSupports),
    [widthBeamLength, profile, loadKg, autoSupports, extraSupports]
  );

  const handleDimensionChange = useCallback((key, value) => {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Template click → open wizard instead of applying immediately
  const handleTemplateSelect = useCallback((template) => {
    setPendingTemplate(template);
  }, []);

  // Wizard "Build this frame" → apply template + user's load/height choices
  const handleWizardApply = useCallback((template, chosenLoadKg, chosenHeightMm) => {
    const newDims = {
      width: template.defaults.width,
      depth: template.defaults.depth,
      height: chosenHeightMm ?? template.defaults.height,
    };
    setDimensions(newDims);
    setLoadKg(chosenLoadKg);
    setExtraSupports(0);

    // Auto-select the minimum safe profile for the chosen span + load
    const pw = PROFILES[template.defaults.profile].width;
    const spanMm = newDims.width - (2 * pw);
    const minProfile = getMinimumSafeProfile(spanMm, chosenLoadKg);
    // Use the heavier of the template's default or the minimum safe profile
    const profileOrder = ['2020', '4040', '4080'];
    const templateIdx = profileOrder.indexOf(template.defaults.profile);
    const minIdx = profileOrder.indexOf(minProfile);
    setProfile(profileOrder[Math.max(templateIdx, minIdx)]);

    setPendingTemplate(null);
  }, []);

  // Profile change — block if unsafe for current span + load
  const handleProfileChange = useCallback((newProfile) => {
    const pw = PROFILES[newProfile].width;
    const spanMm = dimensions.width - (2 * pw);
    if (!isProfileSafeForSpan(newProfile, spanMm, loadKg)) {
      const minProfile = getMinimumSafeProfile(spanMm, loadKg);
      showToast(
        `${PROFILES[newProfile].name} can't safely span ${dimensions.width}mm at this load. Minimum: ${PROFILES[minProfile].name}`,
        'warning'
      );
      return;
    }
    setProfile(newProfile);
    setExtraSupports(0);
  }, [dimensions.width, loadKg]);

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
        <button className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`} onClick={() => setActiveTab('design')}>Design</button>
        <button className={`tab-btn ${activeTab === '3d' ? 'active' : ''}`} onClick={() => setActiveTab('3d')}>3D View</button>
        <button className={`tab-btn ${activeTab === 'price' ? 'active' : ''}`} onClick={() => setActiveTab('price')}>Price</button>
      </div>

      <div className="main-layout">
        <aside className={`sidebar left ${activeTab === 'design' ? 'mobile-show' : ''}`}>
          <DimensionControls
            dimensions={dimensions}
            profile={profile}
            finish={finish}
            loadKg={loadKg}
            extraSupports={extraSupports}
            structuralCheck={structuralCheck}
            autoSupports={autoSupports}
            onDimensionChange={handleDimensionChange}
            onProfileChange={handleProfileChange}
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

          {toast && (
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'upgrade' ? '✓ ' : '⚠ '}
              {toast.message}
            </div>
          )}

          <div className="viewport-info">
            <span>{dimensions.width} × {dimensions.depth} × {dimensions.height} mm</span>
            <span>Orbit: drag | Zoom: scroll</span>
          </div>
        </main>

        <aside className={`sidebar right ${activeTab === 'price' ? 'mobile-show' : ''}`}>
          <PricingPanel
            dimensions={dimensions}
            profile={profile}
            finish={finish}
            accessories={accessories}
            extraSupports={extraSupports}
            onToggleAccessory={handleToggleAccessory}
          />
        </aside>
      </div>

      {pendingTemplate && (
        <TemplateWizard
          template={pendingTemplate}
          onApply={handleWizardApply}
          onClose={() => setPendingTemplate(null)}
        />
      )}
    </div>
  );
}

export default App;
