import { PROFILES, FINISHES, TEMPLATES } from '../data/catalog';
import { isProfileSafeForSpan } from '../utils/engineering';

export function DimensionControls({
  dimensions,
  profile,
  finish,
  loadKg,
  resolved,
  onDimensionChange,
  onProfileChange,
  onFinishChange,
  onTemplateSelect,
}) {
  const widthBeam = dimensions.width - (2 * PROFILES[profile].width);

  return (
    <div className="controls-panel">
      <h2 className="panel-title">Design Your Frame</h2>

      {/* Templates */}
      <div className="control-section">
        <label className="section-label">Quick Start Templates</label>
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
        <label className="section-label">External Dimensions (mm)</label>

        <div className="dimension-row">
          <label>Width</label>
          <input
            type="range"
            min={400}
            max={3000}
            step={10}
            value={dimensions.width}
            onChange={(e) => onDimensionChange('width', Number(e.target.value))}
          />
          <input
            type="number"
            className="dim-input"
            value={dimensions.width}
            min={400}
            max={3000}
            step={10}
            onChange={(e) => onDimensionChange('width', Number(e.target.value))}
          />
        </div>

        <div className="dimension-row">
          <label>Depth</label>
          <input
            type="range"
            min={300}
            max={1500}
            step={10}
            value={dimensions.depth}
            onChange={(e) => onDimensionChange('depth', Number(e.target.value))}
          />
          <input
            type="number"
            className="dim-input"
            value={dimensions.depth}
            min={300}
            max={1500}
            step={10}
            onChange={(e) => onDimensionChange('depth', Number(e.target.value))}
          />
        </div>

        <div className="dimension-row">
          <label>Height</label>
          <input
            type="range"
            min={300}
            max={1500}
            step={10}
            value={dimensions.height}
            onChange={(e) => onDimensionChange('height', Number(e.target.value))}
          />
          <input
            type="number"
            className="dim-input"
            value={dimensions.height}
            min={300}
            max={1500}
            step={10}
            onChange={(e) => onDimensionChange('height', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Profile Selection */}
      <div className="control-section">
        <label className="section-label">Extrusion Profile</label>
        <div className="profile-options">
          {Object.values(PROFILES).map((p) => {
            const safe = isProfileSafeForSpan(p.id, widthBeam, loadKg);
            return (
              <button
                key={p.id}
                className={`profile-btn ${profile === p.id ? 'active' : ''} ${!safe ? 'profile-unsafe' : ''}`}
                onClick={() => onProfileChange(p.id)}
                title={!safe ? `Too light for your current width at this load` : undefined}
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
        <label className="section-label">Finish</label>
        <div className="finish-options">
          {Object.values(FINISHES).map((f) => (
            <button
              key={f.id}
              className={`finish-btn ${finish === f.id ? 'active' : ''}`}
              onClick={() => onFinishChange(f.id)}
            >
              <span
                className="finish-swatch"
                style={{
                  background: f.id === 'black' ? '#1a1a1a' : '#c0c0c0',
                }}
              />
              {f.name}
              {f.multiplier > 1 && (
                <span className="finish-premium">+{Math.round((f.multiplier - 1) * 100)}%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Structural Status — always green, purely informational */}
      <div className="control-section">
        <label className="section-label">Structural Status</label>
        <div className="stress-indicator" style={{ borderColor: '#22c55e' }}>
          <div className="stress-dot" style={{ background: '#22c55e' }} />
          <div>
            <div className="stress-status">All Good</div>
            <div className="stress-detail">
              Deflection: {resolved.deflection?.deflectionMm || 0}mm
              {resolved.supportsNeeded > 0 && (
                <span className="support-badge">
                  +{resolved.supportsNeeded} center support{resolved.supportsNeeded > 1 ? 's' : ''} auto-added
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
