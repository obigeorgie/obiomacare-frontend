import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface HotspotData {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  color: string;
}

export const heartHotspots: HotspotData[] = [
  { id: 'right_atrium', position: [0.35, 0.35, 0.35], title: 'Right Atrium', description: 'Receives deoxygenated blood from the body via the vena cavae.', color: '#7f1d1d' },
  { id: 'right_ventricle', position: [0.45, -0.15, 0.35], title: 'Right Ventricle', description: 'Pumps deoxygenated blood to the lungs via the pulmonary artery.', color: '#991b1b' },
  { id: 'left_atrium', position: [-0.35, 0.45, 0.25], title: 'Left Atrium', description: 'Receives oxygenated blood from the lungs via pulmonary veins.', color: '#dc2626' },
  { id: 'left_ventricle', position: [-0.35, -0.25, 0.4], title: 'Left Ventricle', description: 'The heart\'s main pumping chamber — sends oxygenated blood to the body.', color: '#ef4444' },
  { id: 'sa_node', position: [0.55, 0.55, 0.25], title: 'SA Node', description: 'The natural pacemaker — initiates each heartbeat with electrical impulses.', color: '#f59e0b' },
  { id: 'av_node', position: [0.3, 0.2, 0.15], title: 'AV Node', description: 'Delays electrical signals to allow atria to contract before ventricles.', color: '#d97706' },
  { id: 'aorta', position: [-0.2, 0.85, 0.1], title: 'Aorta', description: 'The largest artery — distributes oxygenated blood to the entire body.', color: '#dc2626' },
  { id: 'septum', position: [0.05, 0.0, 0.3], title: 'Septum', description: 'The muscular wall separating the left and right ventricles.', color: '#991b1b' },
  { id: 'left_coronary', position: [-0.25, 0.35, 0.5], title: 'Left Coronary Artery', description: 'Supplies oxygenated blood to the left side of the heart muscle.', color: '#ef4444' },
  { id: 'right_coronary', position: [0.3, 0.25, 0.45], title: 'Right Coronary Artery', description: 'Supplies oxygenated blood to the right side of the heart muscle.', color: '#ef4444' },
];

const textureCache = new Map<string, THREE.CanvasTexture>();
const DOT_PIXELS = 34;

function getDotTexture(color: string): THREE.CanvasTexture {
  const key = color;
  if (textureCache.has(key)) return textureCache.get(key)!;
  const size = DOT_PIXELS * 2;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.fillStyle = color + '33'; ctx.fill();
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
  ctx.strokeStyle = color + '88'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 5, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, tex); return tex;
}

function HotspotDot({ data, onClick, isSelected }: { data: HotspotData; onClick: () => void; isSelected: boolean }) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (!spriteRef.current) return;
    if (isSelected) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 5) * 0.15;
      spriteRef.current.scale.setScalar(0.04 * pulse);
    } else {
      spriteRef.current.scale.setScalar(hovered ? 0.045 : 0.035);
    }
  });
  const texture = useMemo(() => getDotTexture(data.color), [data.color]);
  return (
    <sprite ref={spriteRef} position={data.position} scale={0.035} renderOrder={20}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      <spriteMaterial map={texture} sizeAttenuation={false} depthTest={true} depthWrite={false}
        polygonOffset={true} polygonOffsetFactor={-8} polygonOffsetUnits={-16} transparent={true} opacity={0.95} />
    </sprite>
  );
}

function HotspotCallout({ data }: { data: HotspotData }) {
  return (
    <Html position={[data.position[0] + 0.5, data.position[1] + 0.3, data.position[2]]} center distanceFactor={6}
      style={{ pointerEvents: 'none', zIndex: 100 }}>
      <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', color: '#fff', padding: '12px 16px',
        borderRadius: '8px', minWidth: '200px', maxWidth: '260px', border: `1px solid ${data.color}`, boxShadow: `0 4px 20px ${data.color}44` }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: data.color, marginBottom: '4px' }}>{data.title}</div>
        <div style={{ fontSize: '12px', lineHeight: '1.4', color: '#e5e5e5' }}>{data.description}</div>
      </div>
    </Html>
  );
}

export function HotspotSystem({ hotspots, groupRef, onStructureClick, selectedId, onSelect }: {
  hotspots: HotspotData[];
  groupRef: React.RefObject<THREE.Group | null>;
  onStructureClick: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { camera } = useThree();
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  useFrame(() => {
    if (!groupRef.current) return;
    const newVisible: Record<string, boolean> = {};
    hotspots.forEach((h) => {
      const worldPos = new THREE.Vector3(...h.position);
      worldPos.applyMatrix4(groupRef.current!.matrixWorld);
      const toCamera = camera.position.clone().sub(worldPos).normalize();
      const outward = worldPos.clone().sub(groupRef.current!.position).normalize();
      newVisible[h.id] = outward.dot(toCamera) > -0.1;
    });
    setVisibleMap(newVisible);
  });
  const handleClick = useCallback((id: string) => {
    onSelect(selectedId === id ? null : id);
    onStructureClick(id);
  }, [selectedId, onSelect, onStructureClick]);
  return (
    <group>
      {hotspots.map((h) => (
        <group key={h.id} visible={visibleMap[h.id] !== false}>
          <HotspotDot data={h} onClick={() => handleClick(h.id)} isSelected={selectedId === h.id} />
          {selectedId === h.id && <HotspotCallout data={h} />}
        </group>
      ))}
    </group>
  );
}
