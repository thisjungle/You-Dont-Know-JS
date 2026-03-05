import { PROFILES, FINISHES, TEMPLATES, WORKTOPS, BACK_PANELS } from '../data/catalog';
import { isProfileSafeForSpan } from '../utils/engineering';

export function DimensionControls({
  dimensions,
  profile,
  finish,
  worktop,
  backPanel,
  undershelf,
  loadKg,
  resolved,
  onDimensionChange,
  onProfileChange,
  onFinishChange,
  onWorktopChange,
  onBackPanelChange,
  onUndershelfChange,
  onTemplateSelect,
}) {
  const widthBeam = dimensions.width - (2 * PROFILES[profile].width);

  return (
    <div className="controls-panel">
      <h2 className="panel-title">Build Your Workbench</h2>

      {/* Quick Start Templates */}
      <div className="control-section">
        <label className="section-label">Quick Start</label>
        <div className="template-grid">
          {Object.values(TEMPLATES).map((t) => (
            <button
              key={t.id}
              className="template-btn"
              onClick={() => onTemplateSelect(t)}
              title={t.description}
            >
              <span className="template-icon">{t.icon}</span>
              <span className="template-name">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="control-section">
        <label className="section-label">Bench Dimensions (mm)</label>

        <div className="dimension-row">
          <label>Width</label>
          <input
            type="range" min={600} max={3000} step={10}
            value={dimensions.width}
            onChange={(e) => onDimensionChange('width', Number(e.target.value))}
          />
          <input
            type="number" className="dim-input"
            value={dimensions.width} min={600} max={3000} step={10}
            onChange={(e) => onDimensionChange('width', Number(e.target.value))}
          />
        </div>

        <div className="dimension-row">
          <label>Depth</label>
          <input
            type="range" min={400} max={1200} step={10}
            value={dimensions.depth}
            onChange={(e) => onDimensionChange('depth', Number(e.target.value))}
          />
          <input
            type="number" className="dim-input"
            value={dimensions.depth} min={400} max={1200} step={10}
            onChange={(e) => onDimensionChange('depth', Number(e.target.value))}
          />
        </div>

        <div className="dimension-row">
          <label>Height</label>
          <input
            type="range" min={700} max={1100} step={10}
            value={dimensions.height}
            onChange={(e) => onDimensionChange('height', Number(e.target.value))}
          />
          <input
            type="number" className="dim-input"
            value={dimensions.height} min={700} max={1100} step={10}
            onChange={(e) => onDimensionChange('height', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Extrusion Profile */}
      <div className="control-section">
        <label className="section-label">Frame Profile</label>
        <div className="profile-options">
          {Object.values(PROFILES).map((p) => {
            const safe = isProfileSafeForSpan(p.id, widthBeam, loadKg);
            return (
              <button
                key={p.id}
                className={`profile-btn ${profile === p.id ? 'active' : ''} ${!safe ? 'profile-unsafe' : ''}`}
                onClick={() => onProfileChange(p.id)}
                title={!safe ? 'Too light for this span' : undefined}
              >
                <div className="profile-btn-row">
                  <strong>{p.name}</strong>
                  {!safe && <span className="profile-lock">Too light</span>}
                </div>
                <span className="profile-price">${p.pricePerMeter.toFixed(2)}/m</span>
                <span className="profile-desc">{p.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish */}
      <div className="control-section">
        <label className="section-label">Frame Finish</label>
        <div className="finish-options">
          {Object.values(FINISHES).map((f) => (
            <button
              key={f.id}
              className={`finish-btn ${finish === f.id ? 'active' : ''}`}
              onClick={() => onFinishChange(f.id)}
            >
              <span
                className="finish-swatch"
                style={{ background: f.id === 'black' ? '#1a1a1a' : '#c0c0c0' }}
              />
              {f.name}
              {f.multiplier > 1 && (
                <span className="finish-premium">+{Math.round((f.multiplier - 1) * 100)}%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Worktop Material */}
      <div className="control-section">
        <label className="section-label">Worktop Surface</label>
        <div className="worktop-options">
          {Object.values(WORKTOPS).map((w) => (
            <button
              key={w.id}
              className={`worktop-btn ${worktop === w.id ? 'active' : ''}`}
              onClick={() => onWorktopChange(w.id)}
            >
              <span className="worktop-swatch" style={{ background: w.color }} />
              <div className="worktop-info">
                <strong>{w.name}</strong>
                <span className="worktop-desc">{w.description}</span>
              </div>
              <span className="worktop-price">${w.pricePerSqM}/m²</span>
            </button>
          ))}
        </div>
      </div>

      {/* Back Panel */}
      <div className="control-section">
        <label className="section-label">Back Panel</label>
        <div className="backpanel-options">
          {Object.values(BACK_PANELS).map((bp) => (
            <button
              key={bp.id}
              className={`backpanel-btn ${backPanel === bp.id ? 'active' : ''}`}
              onClick={() => onBackPanelChange(bp.id)}
            >
              <div className="backpanel-info">
                <strong>{bp.name}</strong>
                <span className="backpanel-desc">{bp.description}</span>
              </div>
              {bp.pricePerSqM > 0 && (
                <span className="backpanel-price">${bp.pricePerSqM}/m²</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Undershelf Toggle */}
      <div className="control-section">
        <label className="section-label">Lower Shelf</label>
        <button
          className={`toggle-btn ${undershelf ? 'active' : ''}`}
          onClick={() => onUndershelfChange(!undershelf)}
        >
          <span className="toggle-indicator">{undershelf ? 'ON' : 'OFF'}</span>
          <div className="toggle-info">
            <strong>Undershelf Storage</strong>
            <span>Full-width shelf at 150mm — store heavy items low</span>
          </div>
        </button>
      </div>

      {/* Structural Status — always green */}
      <div className="control-section">
        <label className="section-label">Structure</label>
        <div className="stress-indicator" style={{ borderColor: '#22c55e' }}>
          <div className="stress-dot" style={{ background: '#22c55e' }} />
          <div>
            <div className="stress-status">All Good</div>
            <div className="stress-detail">
              Deflection: {resolved.deflection?.deflectionMm || 0}mm
              {resolved.supportsNeeded > 0 && (
                <span className="support-badge">
                  +{resolved.supportsNeeded} support{resolved.supportsNeeded > 1 ? 's' : ''} auto-added
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
