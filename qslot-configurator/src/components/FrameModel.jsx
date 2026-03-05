import { useRef, useMemo } from 'react';
import { PROFILES, WORKTOPS, BACK_PANELS } from '../data/catalog';
import { autoResolveStructure } from '../utils/engineering';

function TSlotBeam({ position, length, rotation, profileWidth, color, opacity = 1 }) {
  const meshRef = useRef();
  const w = profileWidth / 1000;
  const l = length / 1000;
  const grooveDepth = w * 0.15;

  return (
    <group position={position} rotation={rotation}>
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
      {[
        [0, w / 2 - grooveDepth / 2, 0, l, grooveDepth, w * 0.25],
        [0, -(w / 2 - grooveDepth / 2), 0, l, grooveDepth, w * 0.25],
        [0, 0, w / 2 - grooveDepth / 2, l, w * 0.25, grooveDepth],
        [0, 0, -(w / 2 - grooveDepth / 2), l, w * 0.25, grooveDepth],
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[sx * 0.98, sy, sz]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function FrameModel({ dimensions, profile, finish, worktop, backPanel, undershelf }) {
  const profileData = PROFILES[profile];
  const pw = profileData.width;
  const color = finish === 'black' ? '#1a1a1a' : profileData.color;
  const { width, depth, height } = dimensions;

  const widthBeamLength = width - (2 * pw);
  const depthBeamLength = depth - (2 * pw);

  // Use auto-resolve to get the actual number of supports
  const resolved = useMemo(
    () => autoResolveStructure(widthBeamLength, profile, 50),
    [widthBeamLength, profile]
  );
  const centerSupports = resolved.supportsNeeded;

  const toM = (mm) => mm / 1000;

  const beams = useMemo(() => {
    const result = [];
    const halfW = toM(width) / 2;
    const halfD = toM(depth) / 2;
    const halfPW = toM(pw) / 2;
    const h = toM(height);

    // --- TOP FRAME ---
    result.push({ key: 'top-front-w', position: [0, h, halfD - halfPW], length: widthBeamLength, rotation: [0, 0, 0] });
    result.push({ key: 'top-back-w', position: [0, h, -(halfD - halfPW)], length: widthBeamLength, rotation: [0, 0, 0] });
    result.push({ key: 'top-left-d', position: [-(halfW - halfPW), h, 0], length: depthBeamLength, rotation: [0, Math.PI / 2, 0] });
    result.push({ key: 'top-right-d', position: [halfW - halfPW, h, 0], length: depthBeamLength, rotation: [0, Math.PI / 2, 0] });

    // --- BOTTOM FRAME ---
    result.push({ key: 'bot-front-w', position: [0, halfPW, halfD - halfPW], length: widthBeamLength, rotation: [0, 0, 0] });
    result.push({ key: 'bot-back-w', position: [0, halfPW, -(halfD - halfPW)], length: widthBeamLength, rotation: [0, 0, 0] });
    result.push({ key: 'bot-left-d', position: [-(halfW - halfPW), halfPW, 0], length: depthBeamLength, rotation: [0, Math.PI / 2, 0] });
    result.push({ key: 'bot-right-d', position: [halfW - halfPW, halfPW, 0], length: depthBeamLength, rotation: [0, Math.PI / 2, 0] });

    // --- LEGS ---
    const legPositions = [
      [-(halfW - halfPW), h / 2 + halfPW / 2, halfD - halfPW],
      [halfW - halfPW, h / 2 + halfPW / 2, halfD - halfPW],
      [-(halfW - halfPW), h / 2 + halfPW / 2, -(halfD - halfPW)],
      [halfW - halfPW, h / 2 + halfPW / 2, -(halfD - halfPW)],
    ];
    legPositions.forEach((pos, i) => {
      result.push({ key: `leg-${i}`, position: pos, length: height - pw, rotation: [0, 0, Math.PI / 2] });
    });

    // --- CENTER SUPPORTS ---
    if (centerSupports > 0) {
      for (let i = 1; i <= centerSupports; i++) {
        const xPos = -halfW + (toM(width) * i) / (centerSupports + 1);
        result.push({ key: `csup-leg-f-${i}`, position: [xPos, h / 2 + halfPW / 2, halfD - halfPW], length: height - pw, rotation: [0, 0, Math.PI / 2], isSupport: true });
        result.push({ key: `csup-leg-b-${i}`, position: [xPos, h / 2 + halfPW / 2, -(halfD - halfPW)], length: height - pw, rotation: [0, 0, Math.PI / 2], isSupport: true });
        result.push({ key: `csup-cross-bot-${i}`, position: [xPos, halfPW, 0], length: depthBeamLength, rotation: [0, Math.PI / 2, 0], isSupport: true });
        result.push({ key: `csup-cross-top-${i}`, position: [xPos, h, 0], length: depthBeamLength, rotation: [0, Math.PI / 2, 0], isSupport: true });
      }
    }

    // --- BACK PANEL UPRIGHTS (if back panel selected) ---
    if (backPanel !== 'none') {
      // Two vertical posts rising from the back top rail
      const backPanelHeight = 600; // mm above bench top
      const bpH = toM(backPanelHeight);
      result.push({
        key: 'bp-upright-l',
        position: [-(halfW - halfPW), h + bpH / 2 + halfPW, -(halfD - halfPW)],
        length: backPanelHeight,
        rotation: [0, 0, Math.PI / 2],
      });
      result.push({
        key: 'bp-upright-r',
        position: [halfW - halfPW, h + bpH / 2 + halfPW, -(halfD - halfPW)],
        length: backPanelHeight,
        rotation: [0, 0, Math.PI / 2],
      });
      // Top horizontal rail for back panel
      result.push({
        key: 'bp-top-rail',
        position: [0, h + bpH + halfPW, -(halfD - halfPW)],
        length: widthBeamLength,
        rotation: [0, 0, 0],
      });
    }

    // --- UNDERSHELF RAILS ---
    if (undershelf) {
      const shelfHeight = toM(150); // 150mm from floor
      // Front and back shelf rails
      result.push({ key: 'shelf-front', position: [0, shelfHeight, halfD - halfPW], length: widthBeamLength, rotation: [0, 0, 0] });
      result.push({ key: 'shelf-back', position: [0, shelfHeight, -(halfD - halfPW)], length: widthBeamLength, rotation: [0, 0, 0] });
    }

    return result;
  }, [width, depth, height, pw, widthBeamLength, depthBeamLength, centerSupports, backPanel, undershelf]);

  // Worktop surface
  const worktopData = WORKTOPS[worktop];
  const worktopThickness = toM(worktopData?.thickness || 25);
  const worktopColor = worktopData?.color || '#c4a882';

  // Back panel surface
  const backPanelData = BACK_PANELS[backPanel];
  const backPanelHeight = 600;

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

      {/* Worktop surface */}
      <mesh
        position={[0, toM(height) + toM(pw) / 2 + worktopThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[toM(width), worktopThickness, toM(depth)]} />
        <meshStandardMaterial
          color={worktopColor}
          metalness={worktop === 'stainless' ? 0.8 : 0.05}
          roughness={worktop === 'stainless' ? 0.2 : (worktop === 'rubberMat' ? 0.95 : 0.7)}
        />
      </mesh>

      {/* Back panel surface */}
      {backPanel !== 'none' && backPanelData && (
        <mesh
          position={[
            0,
            toM(height) + toM(backPanelHeight) / 2 + toM(pw),
            -(toM(depth) / 2 - toM(pw) / 2),
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[toM(width - 2 * pw), toM(backPanelHeight), 0.003]} />
          <meshStandardMaterial
            color={backPanelData.color}
            metalness={0.3}
            roughness={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Undershelf surface */}
      {undershelf && (
        <mesh
          position={[0, toM(150) + toM(pw) / 2 + 0.009, 0]}
          receiveShadow
        >
          <boxGeometry args={[toM(width - 2 * pw), 0.018, toM(depth - 2 * pw)]} />
          <meshStandardMaterial color="#8a7a6a" metalness={0.05} roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}
