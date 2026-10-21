'use client';

import * as THREE from 'three';
import { Suspense, useCallback, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges, RoundedBox, useGLTF } from '@react-three/drei';
import {
  StudioEnv,
  clamp01,
  easeOut,
  easeOutBack,
  easeInOut,
  useLabelStore,
  LabelAnchor,
  LabelProjector,
  LabelLayer,
} from './shared';

const SINK = '/models/kitchen-sink.glb';

const FLOORS = 7;
const FH = 0.8; // floor height
const W = 4.4;
const D = 2.6;
const FLAT_X = [-1.1, 1.1];
const RISER = { x: 0, z: -1.12 };
const BASE_Y = -1.1;

// Story phases on the 0..1 scroll progress
const phase = (p, a, b) => clamp01((p - a) / (b - a));

function useCloned(url) {
  const { scene } = useGLTF(url);
  return useCallback(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
    return c;
  }, [scene]);
}

function Terrain() {
  const top = '#e6eef3';
  const side = '#d3dfe7';
  const mats = useMemo(
    () => [side, side, top, side, side, side].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 })),
    []
  );
  const h = -BASE_Y;
  // Cut-away ground: the front face is open so the basement is visible.
  const blocks = [
    { x: -(W / 2 + 2), w: 4, front: D / 2, back: -4 },
    { x: W / 2 + 2, w: 4, front: D / 2, back: -4 },
    { x: 0, w: W, front: -D / 2, back: -4 },
  ];
  return (
    <group>
      {blocks.map((b, i) => {
        const depth = b.front - b.back;
        return (
          <mesh key={i} position={[b.x, BASE_Y / 2, b.back + depth / 2]} material={mats} receiveShadow>
            <boxGeometry args={[b.w, h, depth]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Floor({ i, progressRef, makeSink }) {
  const g = useRef();
  const units = useRef([]);
  const sinks = useMemo(() => FLAT_X.map(() => makeSink()), [makeSink]);

  useFrame(() => {
    const p = progressRef.current;
    const build = phase(p, 0.02, 0.22) * FLOORS - i;
    const a = easeOut(clamp01(build));
    g.current.position.y = i * FH + (1 - a) * 1.6;
    g.current.scale.setScalar(Math.max(0.0001, 0.6 + a * 0.4));
    g.current.visible = a > 0.01;
    const u = easeOutBack(clamp01(phase(p, 0.5, 0.7) * 1.6 - i * 0.08));
    units.current.forEach((m) => m && m.scale.setScalar(Math.max(0.0001, u)));
  });

  return (
    <group ref={g}>
      {/* slab */}
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
        <boxGeometry args={[W, 0.06, D]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
        <Edges color="#c4d6e2" />
      </mesh>
      {/* warm floor inside each flat, so every flat reads as a home */}
      {FLAT_X.map((x) => (
        <mesh key={x} position={[x, 0.056, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[W / 2 - 0.12, D - 0.1]} />
          <meshStandardMaterial color="#f1e4d3" roughness={0.9} />
        </mesh>
      ))}
      {/* back wall + flat divider */}
      <mesh position={[0, FH / 2, -D / 2 + 0.03]}>
        <boxGeometry args={[W, FH, 0.05]} />
        <meshStandardMaterial color="#f4f8fb" roughness={0.8} />
      </mesh>
      <mesh position={[0, FH / 2, 0]}>
        <boxGeometry args={[0.04, FH, D]} />
        <meshStandardMaterial color="#e7eff5" transparent opacity={0.55} />
      </mesh>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * W) / 2, FH / 2, 0]}>
          <boxGeometry args={[0.04, FH, D]} />
          <meshStandardMaterial color="#e9f1f6" roughness={0.8} />
        </mesh>
      ))}
      {FLAT_X.map((x, k) => (
        <group key={k} position={[x, 0.05, -D / 2 + 0.08]}>
          <primitive object={sinks[k]} scale={0.95} position={[0.18, 0, 0]} />
          <group ref={(el) => (units.current[k] = el)} position={[-0.32, 0.48, 0.04]}>
            <RoundedBox args={[0.16, 0.22, 0.06]} radius={0.02} smoothness={3}>
              <meshStandardMaterial color="#ffffff" />
            </RoundedBox>
            <mesh position={[0, 0.02, 0.032]}>
              <circleGeometry args={[0.04, 24]} />
              <meshStandardMaterial color="#16b8c4" emissive="#16b8c4" emissiveIntensity={1.6} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function Pipes({ progressRef }) {
  const riser = useRef();
  const branches = useRef([]);
  const pulses = useRef([]);
  const top = FLOORS * FH - 0.15;
  const bottom = BASE_Y + 0.35;
  const len = top - bottom;

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const r = easeInOut(phase(p, 0.26, 0.42));
    riser.current.scale.y = Math.max(0.0001, r);
    const reached = bottom + r * len;
    branches.current.forEach((b, idx) => {
      if (!b) return;
      const floor = Math.floor(idx / 2);
      const y = floor * FH + 0.55;
      const grow = clamp01((reached - y) / 0.5) * easeOut(phase(p, 0.3, 0.48));
      b.scale.x = Math.max(0.0001, grow);
    });
    const flow = phase(p, 0.45, 0.55);
    pulses.current.forEach((s, k) => {
      if (!s) return;
      const t = (clock.elapsedTime * 0.25 + k / pulses.current.length) % 1;
      s.position.y = bottom + t * len;
      s.scale.setScalar(Math.max(0.0001, flow));
    });
  });

  const pipeMat = (
    <meshPhysicalMaterial color="#2aa7e8" emissive="#0a7fd1" emissiveIntensity={0.35} roughness={0.25} clearcoat={1} />
  );

  return (
    <group>
      <group ref={riser} position={[RISER.x, bottom, RISER.z]}>
        <mesh position={[0, len / 2, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, len, 20]} />
          {pipeMat}
        </mesh>
      </group>
      {Array.from({ length: FLOORS }).flatMap((_, f) =>
        FLAT_X.map((x, k) => {
          const dir = Math.sign(x);
          const length = Math.abs(x) + 0.1;
          return (
            <group
              key={`${f}-${k}`}
              ref={(el) => (branches.current[f * 2 + k] = el)}
              position={[RISER.x, f * FH + 0.55, RISER.z]}
              rotation-y={dir < 0 ? Math.PI : 0}
            >
              <mesh position={[length / 2, 0, 0]} rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[0.03, 0.03, length, 12]} />
                {pipeMat}
              </mesh>
            </group>
          );
        })
      )}
      {Array.from({ length: 6 }).map((_, k) => (
        <mesh key={k} ref={(el) => (pulses.current[k] = el)} position={[RISER.x, 0, RISER.z]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshBasicMaterial color="#bff0ff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function ControlRoom({ progressRef }) {
  const screens = useRef([]);
  const light = useRef();
  const tank = useRef();

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const on = phase(p, 0.74, 0.86);
    screens.current.forEach((s, k) => {
      if (!s) return;
      s.material.emissiveIntensity = on * (1.2 + Math.sin(clock.elapsedTime * 2 + k) * 0.3);
    });
    light.current.intensity = on * 6;
    tank.current.material.emissiveIntensity = 0.1 + on * 0.25;
  });

  return (
    <group position={[0, BASE_Y, 0]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[W, 0.06, D]} />
        <meshStandardMaterial color="#d7e1e8" />
      </mesh>
      <mesh position={[0, 0.55, -D / 2 + 0.03]}>
        <boxGeometry args={[W, 1.1, 0.05]} />
        <meshStandardMaterial color="#e9eff4" />
      </mesh>
      {/* storage / plant tank */}
      <mesh ref={tank} position={[-1.35, 0.45, -0.3]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.8, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#2aa7e8" emissiveIntensity={0.1} roughness={0.3} />
      </mesh>
      {/* desk + screens */}
      <mesh position={[0.9, 0.3, -0.55]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {[-0.5, 0, 0.5].map((x, k) => (
        <mesh key={k} ref={(el) => (screens.current[k] = el)} position={[0.9 + x, 0.62, -1.15]}>
          <boxGeometry args={[0.44, 0.3, 0.03]} />
          <meshStandardMaterial color="#0b2540" emissive="#2fb4ef" emissiveIntensity={0} />
        </mesh>
      ))}
      <pointLight ref={light} position={[0.9, 0.8, 0]} color="#7fd3ff" intensity={0} distance={4} />
    </group>
  );
}

function Rig({ progressRef }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const smooth = useRef(0);

  useFrame(() => {
    smooth.current += (progressRef.current - smooth.current) * 0.08;
    const p = smooth.current;
    const aspect = size.width / size.height;
    const wide = aspect > 1.1;
    const radius = wide ? 16.5 : 21;
    const focusLow = easeInOut(phase(p, 0.7, 0.9));
    const angle = -0.55 + p * 0.75;
    camera.position.set(Math.sin(angle) * radius, 4.4 - focusLow * 2.6, Math.cos(angle) * radius);
    // On wide screens push the building to the right of the text panel.
    target.set(wide ? -3.4 : 0, 2.4 - focusLow * 2.2 + (wide ? 0 : -1.6), 0);
    camera.lookAt(target);
  });
  return null;
}

function Building({ progressRef, store }) {
  const makeSink = useCloned(SINK);
  const roof = useRef();

  useFrame(() => {
    const a = easeOut(phase(progressRef.current, 0.18, 0.24));
    roof.current.scale.setScalar(Math.max(0.0001, a));
  });

  return (
    <group>
      <Terrain />
      <ControlRoom progressRef={progressRef} />
      {Array.from({ length: FLOORS }).map((_, i) => (
        <Floor key={i} i={i} progressRef={progressRef} makeSink={makeSink} />
      ))}
      <group ref={roof} position={[0, FLOORS * FH, 0]}>
        <mesh castShadow>
          <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
          <meshStandardMaterial color="#ffffff" />
          <Edges color="#c4d6e2" />
        </mesh>
      </group>
      <Pipes progressRef={progressRef} />

      <LabelAnchor store={store} id="built" position={[0, FLOORS * FH + 0.6, 0]} />
      <LabelAnchor store={store} id="line" position={[0.2, 3.2, RISER.z]} />
      <LabelAnchor store={store} id="unit" position={[FLAT_X[1] - 0.3, 4 * FH + 0.95, -D / 2 + 0.1]} />
      <LabelAnchor store={store} id="control" position={[0.6, BASE_Y + 1.35, 0]} />
    </group>
  );
}

export default function TowerScene({ progressRef, active = true }) {
  const store = useLabelStore();
  const items = useMemo(() => {
    const p = () => progressRef.current;
    return [
      { id: 'built', text: 'Built in during construction', opacity: () => (p() > 0.04 && p() < 0.26 ? 1 : 0) },
      { id: 'line', text: 'Dedicated drinking-water line', opacity: () => (p() > 0.3 && p() < 0.52 ? 1 : 0) },
      { id: 'unit', text: 'Moya1 unit in every kitchen', opacity: () => (p() > 0.55 && p() < 0.76 ? 1 : 0) },
      { id: 'control', text: 'Control room, monitoring 24/7', opacity: () => (p() > 0.78 ? 1 : 0) },
    ];
  }, [progressRef]);

  return (
    <div className="scene-wrap">
    <Canvas
      className="story-canvas"
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 4, 12], fov: 34 }}
    >
      <color attach="background" args={['#f7fbfd']} />
      <fog attach="fog" args={['#f7fbfd', 20, 40]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]}>
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
      </directionalLight>
      <StudioEnv intensity={0.7} />
      <Suspense fallback={null}>
        <Building progressRef={progressRef} store={store} />
      </Suspense>
      <Rig progressRef={progressRef} />
      <LabelProjector store={store} items={items} />
    </Canvas>
    <LabelLayer store={store} items={items} />
    </div>
  );
}

useGLTF.preload(SINK);
