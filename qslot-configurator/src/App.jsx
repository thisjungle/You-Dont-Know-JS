import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Scene3D } from './components/Scene3D';
import { DimensionControls } from './components/DimensionControls';
import { PricingPanel } from './components/PricingPanel';
import { TemplateWizard } from './components/TemplateWizard';
import {
  autoResolveStructure,
  getMinimumSafeProfile,
  isProfileSafeForSpan,
} from './utils/engineering';
import { PROFILES } from './data/catalog';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({ width: 1800, depth: 750, height: 900 });
  const [profile, setProfile] = useState('4040');
  const [finish, setFinish] = useState('silver');
  const [worktop, setWorktop] = useState('plywood');
  const [backPanel, setBackPanel] = useState('none');
  const [undershelf, setUndershelf] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [activeTab, setActiveTab] = useState('design');
  const [loadKg, setLoadKg] = useState(50);
  const [pendingTemplate, setPendingTemplate] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, type = 'info') {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  // Auto-resolve: guarantees always-green structural result
  const resolved = useMemo(() => {
    const pw = PROFILES[profile].width;
    const spanMm = dimensions.width - (2 * pw);
    return autoResolveStructure(spanMm, profile, loadKg);
  }, [dimensions.width, profile, loadKg]);

  // Apply auto-upgrade if resolver picked a bigger profile
  useEffect(() => {
    if (resolved.upgraded) {
      setProfile(resolved.profileId);
      showToast(`Auto-upgraded to ${PROFILES[resolved.profileId].name} for your span`, 'upgrade');
    }
  }, [resolved.upgraded, resolved.profileId]);

  const handleDimensionChange = useCallback((key, value) => {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTemplateSelect = useCallback((template) => {
    setPendingTemplate(template);
  }, []);

  const handleWizardApply = useCallback((template, chosenLoadKg, chosenHeightMm) => {
    const newDims = {
      width: template.defaults.width,
      depth: template.defaults.depth,
      height: chosenHeightMm ?? template.defaults.height,
    };
    setDimensions(newDims);
    setLoadKg(chosenLoadKg);

    const pw = PROFILES[template.defaults.profile].width;
    const spanMm = newDims.width - (2 * pw);
    const minProfile = getMinimumSafeProfile(spanMm, chosenLoadKg);
    const profileOrder = ['2020', '4040', '4080'];
    const templateIdx = profileOrder.indexOf(template.defaults.profile);
    const minIdx = profileOrder.indexOf(minProfile);
    setProfile(profileOrder[Math.max(templateIdx, minIdx)]);

    setPendingTemplate(null);
  }, []);

  const handleProfileChange = useCallback((newProfile) => {
    const pw = PROFILES[newProfile].width;
    const spanMm = dimensions.width - (2 * pw);
    if (!isProfileSafeForSpan(newProfile, spanMm, loadKg)) {
      const minProfile = getMinimumSafeProfile(spanMm, loadKg);
      showToast(
        `${PROFILES[newProfile].name} can't handle ${dimensions.width}mm at this load. Minimum: ${PROFILES[minProfile].name}`,
        'warning'
      );
      return;
    }
    setProfile(newProfile);
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
            <h1 className="logo-title">Q-Slot Workbench Builder</h1>
            <p className="logo-sub">80/20 T-Slot Aluminium Garage Workbench</p>
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
            worktop={worktop}
            backPanel={backPanel}
            undershelf={undershelf}
            loadKg={loadKg}
            resolved={resolved}
            onDimensionChange={handleDimensionChange}
            onProfileChange={handleProfileChange}
            onFinishChange={setFinish}
            onWorktopChange={setWorktop}
            onBackPanelChange={setBackPanel}
            onUndershelfChange={setUndershelf}
            onTemplateSelect={handleTemplateSelect}
          />
        </aside>

        <main className={`viewport ${activeTab === '3d' ? 'mobile-show' : ''}`}>
          <Scene3D
            dimensions={dimensions}
            profile={profile}
            finish={finish}
            worktop={worktop}
            backPanel={backPanel}
            undershelf={undershelf}
            onDimensionChange={handleDimensionChange}
          />

          {toast && (
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'upgrade' ? '+ ' : '! '}
              {toast.message}
            </div>
          )}

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
            worktop={worktop}
            backPanel={backPanel}
            undershelf={undershelf}
            accessories={accessories}
            extraSupports={resolved.supportsNeeded}
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
