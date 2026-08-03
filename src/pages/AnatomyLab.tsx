import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Heart3D } from '../components/anatomy/Heart3D';

export default function AnatomyLab() {
  const [mode, setMode] = useState<'explore' | 'animate' | 'disease' | 'quiz'>('explore');
  const [quizTarget, setQuizTarget] = useState<string | null>(null);

  return (
    <div className="w-screen h-screen bg-[#0f0f1a] overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-xl">♥</span>
          <h1 className="text-white font-semibold text-sm">Anatomy & Physiology Lab</h1>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['explore', 'animate', 'disease', 'quiz'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -3, -2]} intensity={0.3} />
          <Suspense fallback={null}>
            <Heart3D
              onStructureClick={(id) => {
                console.log('Clicked:', id);
                setQuizTarget(id);
              }}
              quizTarget={quizTarget}
            />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
          <Environment preset="studio" />
        </Canvas>

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-300">
          Click the colored dots on the heart to explore structures
        </div>
      </div>
    </div>
  );
}
