'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';

// ---------- 20 litre bottle (jug) ----------
// Profile of a standard 20 L water-cooler bottle, normalised to height 1.
// (radius, y) pairs, bottom to neck. Two grooves wrap the body like the real thing.
const JUG_PROFILE = [
  [0, 0], [0.2, 0], [0.255, 0.012], [0.275, 0.04], [0.28, 0.08],
  [0.28, 0.2], [0.266, 0.214], [0.266, 0.236], [0.28, 0.25],
  [0.28, 0.42], [0.266, 0.434], [0.266, 0.456], [0.28, 0.47],
  [0.28, 0.62], [0.277, 0.67], [0.262, 0.72], [0.232, 0.77], [0.19, 0.81],
  [0.145, 0.843], [0.1, 0.868], [0.074, 0.884], [0.066, 0.9], [0.066, 0.95],
];

let jugCache = null;

export function getJugAssets() {
  if (jugCache) return jugCache;
  const pts = JUG_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  const body = new THREE.LatheGeometry(pts, 56);
  body.translate(0, -0.5, 0);

  const cap = new THREE.CylinderGeometry(0.078, 0.078, 0.07, 32);
  cap.translate(0, 0.465, 0);

  // Water level inside the bottle, slightly smaller than the shell.
  const waterPts = JUG_PROFILE.slice(0, 15).map(([r, y]) => new THREE.Vector2(Math.max(0, r - 0.018), y + 0.01));
  waterPts.push(new THREE.Vector2(0, 0.66));
  const water = new THREE.LatheGeometry(waterPts, 40);
  water.translate(0, -0.5, 0);

  // Clear plastic look without transmission: transmission needs an extra
  // render pass and stalls weaker laptop GPUs for seconds on first use.
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#cfeaff',
    transparent: true,
    opacity: 0.5,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.8,
    depthWrite: false,
  });
  const waterMat = new THREE.MeshStandardMaterial({
    color: '#3aa9e6',
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    envMapIntensity: 1.2,
  });
  const capMat = new THREE.MeshStandardMaterial({ color: '#1474d4', roughness: 0.35, metalness: 0.05 });

  jugCache = { body, cap, water, glass, waterMat, capMat };
  return jugCache;
}

export function Jug(props) {
  const a = getJugAssets();
  return (
    <group {...props}>
      <mesh geometry={a.body} material={a.glass} castShadow />
      <mesh geometry={a.water} material={a.waterMat} />
      <mesh geometry={a.cap} material={a.capMat} castShadow />
    </group>
  );
}

// ---------- Flowing water texture ----------
export function makeFlowTexture() {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#0a7fd1');
  grad.addColorStop(0.45, '#2fb4ef');
  grad.addColorStop(0.5, '#c9f1ff');
  grad.addColorStop(0.55, '#2fb4ef');
  grad.addColorStop(1, '#0a7fd1');
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- Studio lighting (no network HDR needed) ----------
export function StudioEnv({ intensity = 1 }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#eef5fa']} />
      <Lightformer form="rect" intensity={3 * intensity} position={[0, 6, 2]} scale={[12, 3, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={2 * intensity} position={[-6, 2, 3]} scale={[4, 8, 1]} rotation-y={Math.PI / 2.5} />
      <Lightformer form="rect" intensity={2 * intensity} position={[6, 2, 3]} scale={[4, 8, 1]} rotation-y={-Math.PI / 2.5} />
      <Lightformer form="ring" color="#9fdcff" intensity={2 * intensity} position={[0, 1, -6]} scale={4} />
    </Environment>
  );
}

// ---------- Labels ----------
// Lightweight 3D labels: an invisible anchor lives in the scene, a plain DOM
// chip lives in an overlay, and the projector moves the chip to the anchor's
// screen position every frame.
const _v = new THREE.Vector3();

export function useLabelStore() {
  const ref = useRef(null);
  if (!ref.current) ref.current = { anchors: {}, els: {} };
  return ref.current;
}

export function LabelAnchor({ store, id, ...props }) {
  return <object3D ref={(o) => (store.anchors[id] = o)} {...props} />;
}

export function LabelProjector({ store, items }) {
  useFrame(({ camera, size }) => {
    for (const it of items) {
      const a = store.anchors[it.id];
      const el = store.els[it.id];
      if (!a || !el) continue;
      a.getWorldPosition(_v).project(camera);
      const x = ((_v.x + 1) / 2) * size.width;
      const y = ((1 - _v.y) / 2) * size.height;
      const o = _v.z > 1 ? 0 : it.opacity ? it.opacity() : 1;
      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      el.style.opacity = o;
    }
  });
  return null;
}

export function LabelLayer({ store, items }) {
  return (
    <div className="labels-layer" aria-hidden="true">
      {items.map((it) => (
        <span key={it.id} ref={(el) => (store.els[it.id] = el)} className={`label3d ${it.warn ? 'warn' : ''}`} style={{ opacity: 0 }}>
          <i />
          {it.text}
        </span>
      ))}
    </div>
  );
}

// ---------- Easing ----------
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const easeOutBounce = (x) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

// Small deterministic random so the hero looks the same on every load.
export function seeded(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
