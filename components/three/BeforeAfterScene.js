'use client';

import * as THREE from 'three';
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, PresentationControls, RoundedBox, useGLTF } from '@react-three/drei';
import {
  Jug,
  StudioEnv,
  makeFlowTexture,
  easeInOut,
  useLabelStore,
  LabelAnchor,
  LabelProjector,
  LabelLayer,
} from './shared';

const COOLER = '/models/water-cooler.glb';
const SINK = '/models/kitchen-sink.glb';
const FAUCET = '/models/kitchen-faucet.glb';

// Kitchen counter height (world units, about 1 m).
const COUNTER_Y = 1.1;

// Loads a model, scales it to a target height and puts its base centre at
// the origin. Returns the object and its final size so we can place things
// relative to it.
function useFitted(url, height) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const k = height / size.y;
    c.scale.setScalar(k);
    const center = box.getCenter(new THREE.Vector3());
    c.position.set(-center.x * k, -box.min.y * k, -center.z * k);
    const g = new THREE.Group();
    g.add(c);
    return { object: g, size: size.multiplyScalar(k) };
  }, [scene, height]);
}

function OldWay({ store }) {
  const cooler = useFitted(COOLER, 2.1);
  return (
    <group>
      <primitive object={cooler.object} position={[-0.75, 0, 0]} />
      <Jug position={[0.45, 0.43, -0.3]} scale={0.86} rotation-y={0.4} />
      <Jug position={[1.2, 0.43, 0.0]} scale={0.86} rotation-y={1.2} />
      <Jug position={[0.85, 0.25, 0.8]} scale={0.86} rotation={[0, 0.5, Math.PI / 2]} />
      <LabelAnchor store={store} id="heavy" position={[0.85, 1.25, 0]} />
      <LabelAnchor store={store} id="wait" position={[-0.75, 2.35, 0]} />
    </group>
  );
}

function Stream() {
  const tex = useMemo(() => {
    const t = makeFlowTexture();
    t.repeat.set(1, 3);
    return t;
  }, []);
  useFrame((_, dt) => {
    tex.offset.y += Math.min(dt, 0.05) * 1.6;
  });
  return (
    <mesh>
      <cylinderGeometry args={[0.025, 0.03, 0.24, 16, 1, true]} />
      <meshStandardMaterial map={tex} roughness={0.1} transparent opacity={0.9} emissive="#2aa7e8" emissiveIntensity={0.25} />
    </mesh>
  );
}

function MoyaUnit() {
  const ring = useRef();
  useFrame(({ clock }) => {
    if (ring.current) ring.current.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 3) * 0.6;
  });
  return (
    <group>
      <RoundedBox args={[0.4, 0.52, 0.12]} radius={0.04} smoothness={4} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.06, 0.062]}>
        <torusGeometry args={[0.09, 0.016, 16, 48]} />
        <meshStandardMaterial ref={ring} color="#16b8c4" emissive="#16b8c4" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, -0.15, 0.061]}>
        <planeGeometry args={[0.22, 0.045]} />
        <meshBasicMaterial color="#0a7fd1" />
      </mesh>
    </group>
  );
}

function NewWay({ store }) {
  const sink = useFitted(SINK, COUNTER_Y);
  const faucet = useFitted(FAUCET, 0.5);
  const back = -sink.size.z / 2;
  const tapZ = back + 0.14;
  return (
    <group>
      {/* kitchen wall */}
      <mesh position={[0, 1.3, back - 0.04]} receiveShadow>
        <boxGeometry args={[3.4, 2.6, 0.06]} />
        <meshStandardMaterial color="#f7fbfe" roughness={0.9} />
      </mesh>
      <primitive object={sink.object} />
      {/* the extra drinking-water tap */}
      <group position={[0, COUNTER_Y, tapZ]} rotation-y={-Math.PI / 2}>
        <primitive object={faucet.object} />
      </group>
      <group position={[0, COUNTER_Y + 0.12, tapZ + 0.2]}>
        <Stream />
      </group>
      {/* Moya1 control unit on the wall */}
      <group position={[-sink.size.x / 2 - 0.45, COUNTER_Y + 0.35, back + 0.04]}>
        <MoyaUnit />
      </group>
      <LabelAnchor store={store} id="unit" position={[-sink.size.x / 2 - 0.45, COUNTER_Y + 0.85, back]} />
      <LabelAnchor store={store} id="tap" position={[0.75, COUNTER_Y + 0.55, tapZ]} />
    </group>
  );
}

function Stage({ mode, mRef, store }) {
  const oldRef = useRef();
  const newRef = useRef();

  useFrame((_, dt) => {
    const target = mode === 'after' ? 1 : 0;
    mRef.current += (target - mRef.current) * Math.min(1, dt * 4);
    const e = easeInOut(THREE.MathUtils.clamp(mRef.current, 0, 1));
    const so = Math.max(0.0001, 1 - e);
    const sn = Math.max(0.0001, e);
    oldRef.current.scale.setScalar(so);
    oldRef.current.rotation.y = e * 1.2;
    oldRef.current.visible = so > 0.01;
    newRef.current.scale.setScalar(sn);
    newRef.current.rotation.y = (1 - e) * -1.2;
    newRef.current.visible = sn > 0.01;
  });

  return (
    <>
      <group ref={oldRef}>
        <OldWay store={store} />
      </group>
      <group ref={newRef}>
        <NewWay store={store} />
      </group>
    </>
  );
}

function Rig() {
  useFrame(({ camera }) => camera.lookAt(0, 1.05, 0));
  return null;
}

export default function BeforeAfterScene({ mode, active = true }) {
  const store = useLabelStore();
  const mRef = useRef(mode === 'after' ? 1 : 0);
  const items = useMemo(
    () => [
      { id: 'heavy', text: '20 L can ≈ 20 kg to lift', warn: true, opacity: () => (mRef.current < 0.15 ? 1 : 0) },
      { id: 'wait', text: 'Order, wait, repeat', warn: true, opacity: () => (mRef.current < 0.15 ? 1 : 0) },
      { id: 'unit', text: 'Moya1 unit: checks flow & quality', opacity: () => (mRef.current > 0.85 ? 1 : 0) },
      { id: 'tap', text: 'Drinking-water tap', opacity: () => (mRef.current > 0.85 ? 1 : 0) },
    ],
    []
  );

  return (
    <div className="scene-wrap">
      <Canvas shadows="percentage" dpr={[1, 1.75]} frameloop={active ? 'always' : 'never'} camera={{ position: [0, 2, 5.6], fov: 32 }}>
        <color attach="background" args={['#f3f8fc']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 6, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
        <StudioEnv />
        <Rig />
        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            rotation={[0, -0.3, 0]}
            polar={[-0.1, 0.2]}
            azimuth={[-0.9, 0.9]}
            config={{ mass: 1, tension: 170, friction: 26 }}
          >
            <Stage mode={mode} mRef={mRef} store={store} />
          </PresentationControls>
        </Suspense>
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.4} far={4} color="#0b2540" />
        <LabelProjector store={store} items={items} />
      </Canvas>
      <LabelLayer store={store} items={items} />
    </div>
  );
}

useGLTF.preload(COOLER);
useGLTF.preload(SINK);
useGLTF.preload(FAUCET);
