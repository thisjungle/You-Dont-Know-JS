import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid, Html } from '@react-three/drei';
import { FrameModel } from './FrameModel';
import { StressOverlay } from './StressOverlay';

export function Scene3D({ dimensions, profile, finish, onDimensionChange }) {
  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [3, 2.5, 3], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-3, 4, -3]} intensity={0.3} color="#4a9eff" />

        <FrameModel
          dimensions={dimensions}
          profile={profile}
          finish={finish}
          onDimensionChange={onDimensionChange}
        />

        <StressOverlay dimensions={dimensions} profile={profile} />

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        <Grid
          position={[0, -0.005, 0]}
          args={[20, 20]}
          cellSize={0.1}
          cellThickness={0.5}
          cellColor="#2a2a4a"
          sectionSize={0.5}
          sectionThickness={1}
          sectionColor="#3a3a6a"
          fadeDistance={8}
          infiniteGrid
        />

        <OrbitControls
          makeDefault
          minDistance={1}
          maxDistance={10}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.1}
          enableDamping
          dampingFactor={0.05}
        />

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
