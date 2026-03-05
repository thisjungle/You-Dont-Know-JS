import { useRef, useMemo } from 'react';
import { PROFILES, FINISHES } from '../data/catalog';
import { calculateCenterSupports } from '../utils/engineering';

function TSlotBeam({ position, length, rotation, profileWidth, color, opacity = 1 }) {
  const meshRef = useRef();

  // Convert mm to scene units (1 unit = 1 meter)
  const w = profileWidth / 1000;
  const l = length / 1000;

  // Create T-slot groove effect with slightly darker inset
  const grooveDepth = w * 0.15;

  return (
    <group position={position} rotation={rotation}>
      {/* Main beam body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[l, w, w]} />
        <meshStandardMaterial
          color={color}
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.2}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      {/* T-slot grooves (visual detail on 4 faces) */}
      {[
        [0, w / 2 - grooveDepth / 2, 0, l, grooveDepth, w * 0.25],
        [0, -(w / 2 - grooveDepth / 2), 0, l, grooveDepth, w * 0.25],
        [0, 0, w / 2 - grooveDepth / 2, l, w * 0.25, grooveDepth],
        [0, 0, -(w / 2 - grooveDepth / 2), l, w * 0.25, grooveDepth],
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[sx * 0.98, sy, sz]} />
          <meshStandardMaterial
            color="#111"
            metalness={0.9}
            roughness={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function CornerBracket({ position, rotation, size }) {
  const s = size / 1000;
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[s * 0.8, s * 0.8, s * 0.15]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function FrameModel({ dimensions, profile, finish }) {
  const profileData = PROFILES[profile];
  const pw = profileData.width; // mm
  const finishData = FINISHES[finish];

  const color = finish === 'black' ? '#1a1a1a' : profileData.color;

  const { width, depth, height } = dimensions;

  // Calculate center supports
  const widthBeamLength = width - (2 * pw);
  const depthBeamLength = depth - (2 * pw);
  const centerSupports = calculateCenterSupports(widthBeamLength, profile);

  // Convert all to meters for scene
  const toM = (mm) => mm / 1000;

  const beams = useMemo(() => {
    const result = [];
    const halfW = toM(width) / 2;
    const halfD = toM(depth) / 2;
    const halfPW = toM(pw) / 2;
    const h = toM(height);

    // --- TOP FRAME ---
    // Front top rail (width)
    result.push({
      key: 'top-front-w',
      position: [0, h, halfD - halfPW],
      length: widthBeamLength,
      rotation: [0, 0, 0],
    });
    // Back top rail (width)
    result.push({
      key: 'top-back-w',
      position: [0, h, -(halfD - halfPW)],
      length: widthBeamLength,
      rotation: [0, 0, 0],
    });
    // Left top rail (depth)
    result.push({
      key: 'top-left-d',
      position: [-(halfW - halfPW), h, 0],
      length: depthBeamLength,
      rotation: [0, Math.PI / 2, 0],
    });
    // Right top rail (depth)
    result.push({
      key: 'top-right-d',
      position: [halfW - halfPW, h, 0],
      length: depthBeamLength,
      rotation: [0, Math.PI / 2, 0],
    });

    // --- BOTTOM FRAME ---
    // Front bottom rail
    result.push({
      key: 'bot-front-w',
      position: [0, halfPW, halfD - halfPW],
      length: widthBeamLength,
      rotation: [0, 0, 0],
    });
    // Back bottom rail
    result.push({
      key: 'bot-back-w',
      position: [0, halfPW, -(halfD - halfPW)],
      length: widthBeamLength,
      rotation: [0, 0, 0],
    });
    // Left bottom rail
    result.push({
      key: 'bot-left-d',
      position: [-(halfW - halfPW), halfPW, 0],
      length: depthBeamLength,
      rotation: [0, Math.PI / 2, 0],
    });
    // Right bottom rail
    result.push({
      key: 'bot-right-d',
      position: [halfW - halfPW, halfPW, 0],
      length: depthBeamLength,
      rotation: [0, Math.PI / 2, 0],
    });

    // --- LEGS ---
    const legPositions = [
      [-(halfW - halfPW), h / 2 + halfPW / 2, halfD - halfPW],
      [halfW - halfPW, h / 2 + halfPW / 2, halfD - halfPW],
      [-(halfW - halfPW), h / 2 + halfPW / 2, -(halfD - halfPW)],
      [halfW - halfPW, h / 2 + halfPW / 2, -(halfD - halfPW)],
    ];
    legPositions.forEach((pos, i) => {
      result.push({
        key: `leg-${i}`,
        position: pos,
        length: height - pw,
        rotation: [0, 0, Math.PI / 2],
      });
    });

    // --- CENTER SUPPORTS ---
    if (centerSupports > 0) {
      for (let i = 1; i <= centerSupports; i++) {
        const xPos = -halfW + (toM(width) * i) / (centerSupports + 1);

        // Center leg front
        result.push({
          key: `center-leg-front-${i}`,
          position: [xPos, h / 2 + halfPW / 2, halfD - halfPW],
          length: height - pw,
          rotation: [0, 0, Math.PI / 2],
          isSupport: true,
        });
        // Center leg back
        result.push({
          key: `center-leg-back-${i}`,
          position: [xPos, h / 2 + halfPW / 2, -(halfD - halfPW)],
          length: height - pw,
          rotation: [0, 0, Math.PI / 2],
          isSupport: true,
        });
        // Center cross beam
        result.push({
          key: `center-cross-${i}`,
          position: [xPos, halfPW, 0],
          length: depthBeamLength,
          rotation: [0, Math.PI / 2, 0],
          isSupport: true,
        });
        // Center top cross beam
        result.push({
          key: `center-cross-top-${i}`,
          position: [xPos, h, 0],
          length: depthBeamLength,
          rotation: [0, Math.PI / 2, 0],
          isSupport: true,
        });
      }
    }

    return result;
  }, [width, depth, height, pw, widthBeamLength, depthBeamLength, centerSupports, profile]);

  return (
    <group>
      {beams.map((beam) => (
        <TSlotBeam
          key={beam.key}
          position={beam.position}
          length={beam.length}
          rotation={beam.rotation}
          profileWidth={pw}
          color={beam.isSupport ? '#ff6b35' : color}
          opacity={beam.isSupport ? 0.9 : 1}
        />
      ))}
    </group>
  );
}
