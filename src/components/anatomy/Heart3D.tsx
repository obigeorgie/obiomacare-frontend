import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnatomyLabStore } from './store';
import { HotspotSystem, heartHotspots } from './HeartHotspots';
import { DetailedProceduralHeart, GLBModelLoader } from './HeartModels';

interface HeartModelProps {
  showLabels?: boolean;
  healthyView?: boolean;
  onStructureClick?: (id: string) => void;
  quizTarget?: string | null;
  useGLB?: boolean;
  glbUrl?: string;
}

export function Heart3D({
  onStructureClick,
  quizTarget,
  useGLB = false,
  glbUrl,
}: HeartModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const store = useAnatomyLabStore();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.15;
  });

  const handleStructureClick = (id: string) => {
    store.markOrganViewed('cardiovascular', id);
    if (onStructureClick) onStructureClick(id);
  };

  return (
    <group ref={groupRef}>
      {useGLB && glbUrl ? (
        <GLBModelLoader url={glbUrl} scale={2.5} />
      ) : (
        <DetailedProceduralHeart quizTarget={quizTarget} />
      )}

      <HotspotSystem
        hotspots={heartHotspots}
        groupRef={groupRef}
        onStructureClick={handleStructureClick}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </group>
  );
}
