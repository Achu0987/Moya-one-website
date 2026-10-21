'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { StudioEnv, seeded, useLabelStore, LabelAnchor, LabelProjector, LabelLayer } from './shared';

const SKY = '/models/skyscraper.glb';
const LARGE = '/models/large-building.glb';

function Building({ url, ...props }) {
  const { scene } = useGLTF(url);
  const c = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);
  return <primitive object={c} {...props} />;
}

// The one tower fitted with Moya One: a glowing water line and pulsing rings.
function MoyaTower({ position, store }) {
  const rings = useRef([]);
  const H = 3.15 * 1.35;

  useFrame(({ clock }) => {
    rings.current.forEach((r, k) => {
      if (!r) return;
      const t = (clock.elapsedTime * 0.35 + k / 3) % 1;
      r.position.y = t * H;
      r.material.opacity = Math.sin(t * Math.PI) * 0.7;
    });
  });

  return (
    <group position={position}>
      <Building url={SKY} scale={1.35} />
      {[0, 1, 2].map((k) => (
        <mesh key={k} ref={(el) => (rings.current[k] = el)} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[1.3, 1.42, 4, 1, Math.PI / 4]} />
          <meshBasicMaterial color="#16b8c4" transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
        <meshBasicMaterial color="#2aa7e8" />
      </mesh>
      <LabelAnchor store={store} id="tower" position={[0, H + 0.5, 0]} />
    </group>
  );
}

function City({ store }) {
  const items = useMemo(() => {
    const r = seeded(5);
    const out = [];
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        if (x === 0 && z === 0) continue;
        if (r() < 0.18) continue;
        out.push({
          url: r() < 0.45 ? SKY : LARGE,
          pos: [x * 2.7 + (r() - 0.5) * 0.3, 0, z * 2.7 + (r() - 0.5) * 0.3],
          rot: Math.floor(r() * 4) * (Math.PI / 2),
          s: 0.85 + r() * 0.35,
        });
      }
    }
    return out;
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#f2f6f9" />
      </mesh>
      {/* underground supply line into the Moya tower */}
      <mesh position={[-4.5, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[9, 0.12]} />
        <meshBasicMaterial color="#7fd3ff" />
      </mesh>
      {items.map((b, i) => (
        <Building key={i} url={b.url} position={b.pos} rotation-y={b.rot} scale={b.s} />
      ))}
      <MoyaTower position={[0, 0, 0]} store={store} />
    </group>
  );
}

const ITEMS = [{ id: 'tower', text: 'Tower with Moya One' }];

export default function CityScene({ active = true }) {
  const store = useLabelStore();
  return (
    <div className="scene-wrap">
    <Canvas shadows="percentage" dpr={[1, 1.75]} frameloop={active ? 'always' : 'never'} camera={{ position: [9, 7, 11], fov: 38 }}>
      <color attach="background" args={['#eaf3f9']} />
      <fog attach="fog" args={['#eaf3f9', 18, 34]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 12, 5]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]}>
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 0.1, 40]} />
      </directionalLight>
      <StudioEnv intensity={0.6} />
      <Suspense fallback={null}>
        <City store={store} />
      </Suspense>
      <ContactShadows position={[0, 0, 0]} opacity={0.25} scale={20} blur={2} far={6} />
      <OrbitControls
        target={[0, 1.6, 0]}
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={0.6}
        maxPolarAngle={1.25}
      />
      <LabelProjector store={store} items={ITEMS} />
    </Canvas>
    <LabelLayer store={store} items={ITEMS} />
    </div>
  );
}

useGLTF.preload(SKY);
useGLTF.preload(LARGE);
