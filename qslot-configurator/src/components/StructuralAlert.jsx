import { PROFILES } from '../data/catalog';
import { getSuggestedUpgrade } from '../utils/engineering';

export function StructuralAlert({ deflection, profile, onUpgradeProfile, onAddSupport }) {
  if (!deflection || deflection.status === 'safe') return null;

  const nextProfileId = getSuggestedUpgrade(profile);
  const nextProfile = nextProfileId ? PROFILES[nextProfileId] : null;
  const isDanger = deflection.status === 'danger';

  return (
    <div
      className="structural-alert"
      style={{ background: isDanger ? 'rgba(239,68,68,0.92)' : 'rgba(245,158,11,0.92)' }}
    >
      <span className="alert-msg">
        {isDanger ? '⚠ ' : '⚡ '}
        {deflection.message}
      </span>
      <div className="alert-actions">
        {nextProfile && (
          <button className="alert-btn" onClick={() => onUpgradeProfile(nextProfileId)}>
            Upgrade to {nextProfile.name}
          </button>
        )}
        <button className="alert-btn" onClick={onAddSupport}>
          Add Center Support
        </button>
      </div>
    </div>
  );
}
