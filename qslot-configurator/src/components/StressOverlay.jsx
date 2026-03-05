import { Html } from '@react-three/drei';
import { calculateDeflection } from '../utils/engineering';
import { PROFILES } from '../data/catalog';

export function StressOverlay({ dimensions, profile }) {
  const profileData = PROFILES[profile];
  const widthBeamLength = dimensions.width - (2 * profileData.width);
  const deflection = calculateDeflection(widthBeamLength, profile, 50);

  if (!deflection || deflection.status === 'safe') return null;

  const halfW = dimensions.width / 2000;
  const h = dimensions.height / 1000;

  return (
    <Html
      position={[0, h + 0.15, 0]}
      center
      distanceFactor={3}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="stress-badge"
        style={{
          background: deflection.status === 'danger' ? '#ef4444' : '#f59e0b',
          color: 'white',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {deflection.status === 'danger' ? '⚠ ' : '⚡ '}
        {deflection.message}
      </div>
    </Html>
  );
}
