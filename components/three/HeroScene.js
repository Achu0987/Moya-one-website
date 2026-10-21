'use client';

import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import {
  Jug,
  StudioEnv,
  makeFlowTexture,
  clamp01,
  easeInOut,
  easeOut,
  easeOutBounce,
  useLabelStore,
  LabelAnchor,
  LabelProjector,
  LabelLayer,
} from './shared';

// Scroll-driven hero. progressRef goes 0 → 1 through the pinned section:
//   0.00–0.14  one big 20 L bottle, the thing everyone knows
//   0.14–0.40  "Today": it becomes a delivery stack of bottles
//   0.42–0.66  "The change": the stack lines up and becomes one pipe
//   0.68–1.00  "With Moya One": a tap appears and fills a glass
const S = 0.85; // bottle scale in the stack
const ROWS = [5, 4, 3, 2, 1];
const COUNT = ROWS.reduce((a, b) => a + b, 0);
const PIPE_R = 0.27;
const range = (p, a, b) => clamp01((p - a) / (b - a));

function layout(wide) {
  const offX = wide ? 2.7 : 0;
  const floor = wide ? -2.1 : -2.9;
  return { offX, floor, pipeY: wide ? -0.9 : -1.6, glassY: floor };
}

function buildJugs(L) {
  const slots = [];
  ROWS.forEach((n, r) => {
    for (let k = 0; k < n; k++) {
      slots.push(
        new THREE.Vector3(
          L.offX + (k - (n - 1) / 2) * 0.5,
          L.floor + 0.25 + r * 0.43,
          0
        )
      );
    }
  });
  const span = (COUNT - 1) / 2;
  // Bottle 0 is the big "hero" bottle; it lands on top of the stack.
  const order = [COUNT - 1, ...Array.from({ length: COUNT - 1 }, (_, i) => i)];
  return order.map((slot, i) => ({
    slot: slots[slot],
    drop: 0.15 + (i / COUNT) * 0.17,
    final: new THREE.Vector3((i - span) * S * 0.98, L.pipeY, 0),
    gather: 0.43 + (i / COUNT) * 0.1,
  }));
}

const qUp = new THREE.Quaternion();
const qStack = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)); // cap faces viewer
const qPipe = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2));

function Bottles({ L, progressRef }) {
  const jugs = useMemo(() => buildJugs(L), [L]);
  const refs = useRef([]);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const big = useMemo(() => new THREE.Vector3(L.offX, L.floor + 1.55, 0.6), [L]);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const t = clock.elapsedTime;
    jugs.forEach((j, i) => {
      const g = refs.current[i];
      if (!g) return;
      const gather = easeInOut(range(p, j.gather, j.gather + 0.12));
      const absorb = easeInOut(range(p, 0.62, 0.7));
      let scale = S;

      if (i === 0) {
        // the hero bottle: big, turning slowly, then shrinks onto the stack
        const m = easeInOut(range(p, 0.12, 0.3));
        e.set(0.08 * Math.sin(t * 0.6), t * 0.35, 0.05);
        qUp.setFromEuler(e);
        if (gather <= 0) {
          g.position.lerpVectors(big, j.slot, m);
          g.position.y += Math.sin(t * 1.2) * 0.06 * (1 - m);
          q.copy(qUp).slerp(qStack, m);
        }
        scale = THREE.MathUtils.lerp(3.1, S, m);
      } else if (gather <= 0) {
        // fall into the stack from above
        const d = range(p, j.drop, j.drop + 0.07);
        g.position.set(j.slot.x, j.slot.y + (1 - easeOutBounce(d)) * 6, j.slot.z);
        q.copy(qStack);
        scale = d > 0 ? S : 0.0001;
      }
      if (gather > 0) {
        g.position.lerpVectors(j.slot, j.final, gather);
        g.position.y += Math.sin(Math.PI * gather) * 1.1;
        q.copy(qStack).slerp(qPipe, gather);
      }
      g.quaternion.copy(q);
      g.scale.setScalar(Math.max(0.0001, scale * (1 - absorb)));
      g.visible = absorb < 0.995 && scale > 0.001;
    });
  });

  return jugs.map((j, i) => (
    <group key={i} ref={(el) => (refs.current[i] = el)} position={j.slot.toArray()}>
      <Jug />
    </group>
  ));
}

function Pipe({ L, progressRef }) {
  const glass = useRef();
  const core = useRef();
  const tex = useMemo(() => {
    const t = makeFlowTexture();
    t.repeat.set(1, 14);
    return t;
  }, []);
  const LEN = 40;

  useFrame((_, dt) => {
    const p = progressRef.current;
    const grow = easeInOut(range(p, 0.55, 0.66));
    const fill = easeInOut(range(p, 0.63, 0.74));
    glass.current.scale.set(Math.max(grow, 0.0001), 1, 1);
    glass.current.visible = grow > 0.001;
    core.current.scale.set(Math.max(fill, 0.0001), 1, 1);
    core.current.visible = fill > 0.001;
    tex.offset.y -= Math.min(dt, 0.05) * 0.5;
  });

  return (
    <group position={[0, L.pipeY, 0]}>
      <mesh ref={glass} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[PIPE_R, PIPE_R, LEN, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#dff3ff"
          transparent
          opacity={0.45}
          roughness={0.05}
          clearcoat={1}
          envMapIntensity={1.6}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={core} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[PIPE_R * 0.74, PIPE_R * 0.74, LEN, 32, 1, true]} />
        <meshStandardMaterial map={tex} emissive="#1f9be6" emissiveIntensity={0.35} roughness={0.2} />
      </mesh>
    </group>
  );
}

// A chrome tap grows out of the pipe and fills a glass: the end result.
const TAP_Z = 0.55;

function TapAndGlass({ L, progressRef, store }) {
  const tap = useRef();
  const stream = useRef();
  const water = useRef();
  const tex = useMemo(() => {
    const t = makeFlowTexture();
    t.repeat.set(1, 2);
    return t;
  }, []);
  const chrome = <meshStandardMaterial color="#e9f1f6" metalness={0.9} roughness={0.15} envMapIntensity={1.4} />;

  useFrame((_, dt) => {
    const p = progressRef.current;
    const show = easeOut(range(p, 0.7, 0.78));
    const flow = range(p, 0.76, 0.8);
    const fill = range(p, 0.78, 0.96);
    tap.current.scale.setScalar(Math.max(0.0001, show));
    tap.current.visible = show > 0.001;
    stream.current.scale.set(1, Math.max(0.0001, flow), 1);
    stream.current.visible = flow > 0.01;
    water.current.scale.set(1, Math.max(0.0001, fill), 1);
    water.current.visible = fill > 0.01;
    tex.offset.y += Math.min(dt, 0.05) * 1.8;
  });

  const top = L.pipeY - 0.62;
  const len = top - (L.glassY + 0.1);

  return (
    <group position={[L.offX, 0, 0]}>
      <group ref={tap}>
        <mesh position={[0, L.pipeY - 0.25, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 24]} />
          {chrome}
        </mesh>
        <mesh position={[0, L.pipeY - 0.5, 0]}>
          <sphereGeometry args={[0.075, 24, 16]} />
          {chrome}
        </mesh>
        <mesh position={[0, L.pipeY - 0.5, TAP_Z / 2]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.06, TAP_Z, 24]} />
          {chrome}
        </mesh>
        <mesh position={[0, L.pipeY - 0.55, TAP_Z]}>
          <cylinderGeometry args={[0.06, 0.045, 0.12, 24]} />
          {chrome}
        </mesh>
        <mesh position={[0, L.pipeY - 0.36, 0.12]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 12]} />
          <meshStandardMaterial color="#0a7fd1" roughness={0.3} />
        </mesh>
      </group>
      <group ref={stream} position={[0, top, TAP_Z]}>
        <mesh position={[0, -len / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.04, len, 16, 1, true]} />
          <meshStandardMaterial map={tex} transparent opacity={0.9} emissive="#2aa7e8" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group position={[0, L.glassY, TAP_Z]} visible>
        <group ref={water} position={[0, 0.02, 0]}>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.285, 0.245, 0.52, 40]} />
            <meshStandardMaterial color="#5cc3f0" transparent opacity={0.8} roughness={0.1} />
          </mesh>
        </group>
        <Glass progressRef={progressRef} />
      </group>
      <LabelAnchor store={store} id="tap" position={[0.95, L.pipeY - 0.55, TAP_Z]} />
      <LabelAnchor store={store} id="glass" position={[0.95, L.glassY + 0.35, TAP_Z]} />
    </group>
  );
}

function Glass({ progressRef }) {
  const ref = useRef();
  useFrame(() => {
    const s = easeOut(range(progressRef.current, 0.72, 0.78));
    ref.current.scale.setScalar(Math.max(0.0001, s));
    ref.current.visible = s > 0.001;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.6, 40, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.03}
          clearcoat={1}
          envMapIntensity={2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.25, 40]} />
        <meshStandardMaterial color="#e8f4fb" />
      </mesh>
    </group>
  );
}

function Anchors({ L, store }) {
  // Positions around the big bottle (stage 0) and the stack (stage 1).
  return (
    <>
      <LabelAnchor store={store} id="weight" position={[L.offX + 1.25, L.floor + 2.4, 0.6]} />
      <LabelAnchor store={store} id="chores" position={[L.offX - 1.35, L.floor + 1.3, 0.6]} />
      <LabelAnchor store={store} id="stack" position={[L.offX, L.floor + 2.6, 0]} />
    </>
  );
}

function Rig({ L, progressRef }) {
  const { camera, pointer, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const smooth = useRef(0);

  useFrame(() => {
    smooth.current += (progressRef.current - smooth.current) * 0.1;
    const p = smooth.current;
    const aspect = size.width / size.height;
    const dist = aspect < 0.8 ? 17 : aspect < 1.2 ? 14 : 11.5;
    // Turn to a 3/4 view once the pipe exists, so it reads as a real 3D pipe.
    const turn = easeInOut(range(p, 0.6, 0.9));
    // Finally zoom in on the tap and the glass.
    const zoom = easeInOut(range(p, 0.72, 0.92));
    const angle = -0.12 + turn * 0.5 + pointer.x * 0.05;
    const d = dist * (1 - zoom * 0.3);
    const tx = L.offX * zoom * 0.75;
    camera.position.set(tx + Math.sin(angle) * d, 0.5 + turn * 0.7 + pointer.y * 0.2, Math.cos(angle) * d);
    target.set(tx, (aspect < 1.2 ? 0.2 : -0.4) - zoom * 0.9, 0);
    camera.lookAt(target);
  });
  return null;
}

export default function HeroScene({ progressRef, active = true }) {
  const wide = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight > 1.2 : true;
  const L = useMemo(() => layout(wide), [wide]);
  const store = useLabelStore();
  const items = useMemo(() => {
    const p = () => progressRef.current;
    return [
      { id: 'weight', text: '20 litres ≈ 20 kg', warn: true, opacity: () => (p() < 0.1 ? 1 : 0) },
      { id: 'chores', text: 'Order · wait · lift · store', warn: true, opacity: () => (p() < 0.1 ? 1 : 0) },
      { id: 'stack', text: '1 can a week ≈ 1,040 kg a year', warn: true, opacity: () => (p() > 0.3 && p() < 0.42 ? 1 : 0) },
      { id: 'tap', text: 'Drinking water on tap', opacity: () => (p() > 0.8 ? 1 : 0) },
      { id: 'glass', text: 'No bottle. No filter.', opacity: () => (p() > 0.88 ? 1 : 0) },
    ];
  }, [progressRef]);

  return (
    <div className="scene-wrap">
      <Canvas
        className="hero-canvas"
        shadows="percentage"
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0.5, 11.5], fov: 35 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#eef6fb']} />
        <fog attach="fog" args={['#eef6fb', 14, 30]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 8, 6]} intensity={1.6} />
        <StudioEnv />
        <Bottles L={L} progressRef={progressRef} />
        <Pipe L={L} progressRef={progressRef} />
        <TapAndGlass L={L} progressRef={progressRef} store={store} />
        <Anchors L={L} store={store} />
        <ContactShadows position={[0, L.floor, 0]} opacity={0.3} scale={24} blur={2.4} far={0.8} resolution={512} color="#0b2540" />
        <Rig L={L} progressRef={progressRef} />
        <LabelProjector store={store} items={items} />
      </Canvas>
      <LabelLayer store={store} items={items} />
    </div>
  );
}
