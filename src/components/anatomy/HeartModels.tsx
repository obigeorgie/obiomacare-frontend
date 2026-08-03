import { useMemo } from 'react';
import * as THREE from 'three';

const HEART_COLOR = '#b91c1c';
const ARTERY_COLOR = '#dc2626';
const VEIN_COLOR = '#1e3a5f';
const AORTA_COLOR = '#991b1b';

function createHeartProfile(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0, -1.0), new THREE.Vector2(0.35, -0.95),
    new THREE.Vector2(0.55, -0.6), new THREE.Vector2(0.5, -0.2),
    new THREE.Vector2(0.45, 0.1), new THREE.Vector2(0.35, 0.35),
    new THREE.Vector2(0.2, 0.45), new THREE.Vector2(0, 0.5),
    new THREE.Vector2(-0.2, 0.45), new THREE.Vector2(-0.35, 0.35),
    new THREE.Vector2(-0.45, 0.1), new THREE.Vector2(-0.5, -0.2),
    new THREE.Vector2(-0.55, -0.6), new THREE.Vector2(-0.35, -0.95),
    new THREE.Vector2(0, -1.0),
  ];
}

function createAortaPath(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(0.1, 0.9, 0), new THREE.Vector3(0.3, 1.0, 0),
    new THREE.Vector3(0.5, 0.95, 0), new THREE.Vector3(0.6, 0.8, 0),
  ]);
}

function createPulmonaryTrunkPath(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 0.4, 0.1), new THREE.Vector3(0.2, 0.6, 0.15),
    new THREE.Vector3(0.35, 0.75, 0.1), new THREE.Vector3(0.5, 0.8, 0),
  ]);
}

function createVenaCavaPath(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.3, 0.3, -0.2), new THREE.Vector3(-0.35, 0.6, -0.25),
    new THREE.Vector3(-0.3, 0.9, -0.2),
  ]);
}

interface DetailedHeartProps { quizTarget?: string | null; }

export function DetailedProceduralHeart({ quizTarget }: DetailedHeartProps) {
  const heartProfile = useMemo(() => createHeartProfile(), []);
  const aortaPath = useMemo(() => createAortaPath(), []);
  const pulmonaryPath = useMemo(() => createPulmonaryTrunkPath(), []);
  const venaCavaPath = useMemo(() => createVenaCavaPath(), []);
  const heartMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: quizTarget === 'left_ventricle' ? '#f87171' : HEART_COLOR,
    roughness: 0.55, metalness: 0.05, clearcoat: 0.3, clearcoatRoughness: 0.4,
    sheen: 0.2, sheenColor: '#ff4444',
  }), [quizTarget]);
  return (
    <group scale={1.2}>
      <mesh material={heartMaterial}><latheGeometry args={[heartProfile, 32]} /></mesh>
      <mesh position={[0.35, -0.2, 0]} scale={[0.7, 0.85, 0.7]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshPhysicalMaterial color={quizTarget === 'right_ventricle' ? '#f87171' : '#8b1a1a'} roughness={0.55} metalness={0.05} clearcoat={0.3} clearcoatRoughness={0.4} />
      </mesh>
      <mesh position={[-0.25, 0.3, -0.15]} scale={[0.6, 0.45, 0.55]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshPhysicalMaterial color={quizTarget === 'left_atrium' ? '#f87171' : '#7f1d1d'} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0.3, 0.25, -0.1]} scale={[0.55, 0.4, 0.5]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshPhysicalMaterial color={quizTarget === 'right_atrium' ? '#f87171' : '#7f1d1d'} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh>
        <tubeGeometry args={[aortaPath, 32, 0.12, 16, false]} />
        <meshPhysicalMaterial color={quizTarget === 'aorta' ? '#f87171' : AORTA_COLOR} roughness={0.4} metalness={0.2} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.3, 1.0, 0]} rotation={[0, 0, -0.5]}>
        <torusGeometry args={[0.2, 0.1, 12, 24, Math.PI]} />
        <meshPhysicalMaterial color={AORTA_COLOR} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh>
        <tubeGeometry args={[pulmonaryPath, 24, 0.1, 12, false]} />
        <meshPhysicalMaterial color={quizTarget === 'pulmonary_artery' ? '#f87171' : ARTERY_COLOR} roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh>
        <tubeGeometry args={[venaCavaPath, 16, 0.08, 12, false]} />
        <meshPhysicalMaterial color={VEIN_COLOR} roughness={0.5} metalness={0.1} />
      </mesh>
      <CoronaryArtery points={[new THREE.Vector3(-0.1, 0.5, 0.35), new THREE.Vector3(-0.3, 0.3, 0.45), new THREE.Vector3(-0.5, 0.0, 0.4), new THREE.Vector3(-0.55, -0.3, 0.3)]}
        color={quizTarget === 'left_coronary' ? '#fbbf24' : ARTERY_COLOR} radius={0.04} />
      <CoronaryArtery points={[new THREE.Vector3(0.1, 0.5, 0.35), new THREE.Vector3(0.25, 0.3, 0.45), new THREE.Vector3(0.4, 0.0, 0.4), new THREE.Vector3(0.45, -0.3, 0.3)]}
        color={quizTarget === 'right_coronary' ? '#fbbf24' : ARTERY_COLOR} radius={0.035} />
      <mesh position={[0.05, -0.15, 0]} rotation={[0, 0, 0.05]} scale={[0.08, 0.7, 0.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color={quizTarget === 'septum' ? '#f87171' : '#5c1414'} roughness={0.7} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CoronaryArtery({ points, color, radius = 0.04 }: { points: THREE.Vector3[]; color: string; radius?: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 20, radius, 8, false]} />
      <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface GLBModelProps { url: string; scale?: number; position?: [number, number, number]; onLoad?: (scene: THREE.Group) => void; }

export function GLBModelLoader({ url, scale = 1, position = [0, 0, 0], onLoad }: GLBModelProps) {
  const gltf = useLoader(GLTFLoader, url);
  const scene = useMemo(() => { const cloned = gltf.scene.clone(); if (onLoad) onLoad(cloned); return cloned; }, [gltf, onLoad]);
  return <primitive object={scene} scale={scale} position={position} />;
}
