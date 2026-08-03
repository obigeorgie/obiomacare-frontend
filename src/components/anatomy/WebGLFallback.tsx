import { useEffect, useState } from 'react';

export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

export function WebGLFallback() {
  return (
    <div className="webgl-fallback" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      color: '#e0e0e0'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🫀</div>
      <h3 style={{ margin: '0 0 0.5rem', color: '#fff' }}>Interactive 3D Heart</h3>
      <p style={{ margin: '0 0 1rem', opacity: 0.8, maxWidth: '400px' }}>
        Your browser doesn't support WebGL, which is needed for the 3D anatomy lab.
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: '0 0 0.5rem' }}><strong>Try:</strong></p>
        <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1.2rem' }}>
          <li>Chrome, Firefox, or Edge (latest)</li>
          <li>Enable hardware acceleration</li>
          <li>Update your graphics drivers</li>
        </ul>
      </div>
    </div>
  );
}
