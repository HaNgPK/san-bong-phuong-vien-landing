import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';

const useFieldTexture = (length: number, width: number) => {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const scale = 20; 
    canvas.width = length * scale;
    canvas.height = width * scale;
    
    // Background grass
    ctx.fillStyle = '#2e7d32'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grass stripes
    ctx.fillStyle = '#276c2a';
    const stripeWidth = 5 * scale;
    for (let i = 0; i < length * scale; i += stripeWidth * 2) {
      ctx.fillRect(i, 0, stripeWidth, canvas.height);
    }

    // Lines configuration
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.12 * scale; // 12cm line width
    
    const marginX = 2 * scale; // 2m margin
    const marginY = 2 * scale;
    const fieldW = (length - 4) * scale;
    const fieldH = (width - 4) * scale;
    
    // Draw outer boundary
    ctx.strokeRect(marginX, marginY, fieldW, fieldH);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(marginX + fieldW / 2, marginY);
    ctx.lineTo(marginX + fieldW / 2, marginY + fieldH);
    ctx.stroke();

    // Center circle (Bán kính 6m cho sân 7)
    const centerRadius = 6 * scale;
    ctx.beginPath();
    ctx.arc(marginX + fieldW / 2, marginY + fieldH / 2, centerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center dot
    ctx.beginPath();
    ctx.arc(marginX + fieldW / 2, marginY + fieldH / 2, 0.3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Penalty areas (Vòng bán nguyệt 6m cho sân 7)
    const penaltyRadius = 6 * scale;

    // Left Penalty Arc
    ctx.beginPath();
    ctx.arc(marginX, marginY + fieldH / 2, penaltyRadius, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Right Penalty Arc
    ctx.beginPath();
    ctx.arc(marginX + fieldW, marginY + fieldH / 2, penaltyRadius, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();

    // Penalty spots
    const penaltySpotDist = 6 * scale;
    ctx.beginPath();
    ctx.arc(marginX + penaltySpotDist, marginY + fieldH / 2, 0.3 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(marginX + fieldW - penaltySpotDist, marginY + fieldH / 2, 0.3 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Corner arcs
    const cornerRadius = 1 * scale;
    [
      [marginX, marginY, 0, Math.PI/2],
      [marginX + fieldW, marginY, Math.PI/2, Math.PI],
      [marginX + fieldW, marginY + fieldH, Math.PI, Math.PI * 1.5],
      [marginX, marginY + fieldH, Math.PI * 1.5, Math.PI * 2]
    ].forEach(([x, y, start, end]) => {
      ctx.beginPath();
      ctx.arc(x, y, cornerRadius, start, end);
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [length, width]);

  return texture;
};

const Goal = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  // Khung thành sân 7: rộng 6m, cao 2.1m
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[-3, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[3, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 6.12]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 1.05, -0.6]} castShadow>
        <boxGeometry args={[6, 2.1, 1.2]} />
        <meshStandardMaterial color="white" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Player = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <group position={position} castShadow>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.9, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.22]} />
        <meshStandardMaterial color="#fcd0b4" roughness={0.4} />
      </mesh>
    </group>
  );
};

const Players = ({ length, width }: { length: number, width: number }) => {
  const l = length / 2;
  const w = width / 2;
  
  // Team 1 (Đỏ)
  const team1 = [
    [-l + 1.5, 0, 0], // Thủ môn
    [-l + 8, 0, -w/3], // Hậu vệ
    [-l + 8, 0, w/3], // Hậu vệ
    [-l + 14, 0, -w/2.5], // Tiền vệ
    [-l + 13, 0, 0], // Tiền vệ trung tâm
    [-l + 14, 0, w/2.5], // Tiền vệ
    [-2, 0, 0], // Tiền đạo
  ];

  // Team 2 (Xanh)
  const team2 = [
    [l - 1.5, 0, 0], // Thủ môn
    [l - 8, 0, -w/3], // Hậu vệ
    [l - 8, 0, w/3], // Hậu vệ
    [l - 14, 0, -w/2.5], // Tiền vệ
    [l - 13, 0, 0], // Tiền vệ trung tâm
    [l - 14, 0, w/2.5], // Tiền vệ
    [2, 0, 0], // Tiền đạo
  ];

  return (
    <group>
      {team1.map((pos, i) => <Player key={`t1-${i}`} position={pos as [number,number,number]} color="#ef4444" />)}
      {team2.map((pos, i) => <Player key={`t2-${i}`} position={pos as [number,number,number]} color="#3b82f6" />)}
      
      {/* Trái bóng */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

const LightPole = ({ position, rotation }: { position: [number, number, number], rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Cột */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} />
      </mesh>
      {/* Giá đỡ */}
      <mesh position={[0.5, 9.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Đèn (Không bật sáng vào ban ngày) */}
      <mesh position={[0.8, 9.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1, 0.2, 0.4]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
}

const EnvironmentSetup = ({ length, width }: { length: number, width: number }) => {
  const hl = length / 2;
  const hw = width / 2;
  
  return (
    <group>
      {/* Hành lang đi lại (gạch đỏ) xung quanh sân */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length + 6, width + 6]} />
        <meshStandardMaterial color="#ea580c" roughness={0.9} />
      </mesh>

      {/* Nền đất bên ngoài */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#166534" roughness={1} />
      </mesh>

      {/* Lưới rào xung quanh sân (Cao 4m) */}
      {/* Trái */}
      <mesh position={[-hl - 2, 2, 0]}>
        <boxGeometry args={[0.05, 4, width + 4]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} wireframe />
      </mesh>
      {/* Phải */}
      <mesh position={[hl + 2, 2, 0]}>
        <boxGeometry args={[0.05, 4, width + 4]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} wireframe />
      </mesh>
      {/* Trên */}
      <mesh position={[0, 2, -hw - 2]}>
        <boxGeometry args={[length + 4, 4, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} wireframe />
      </mesh>
      {/* Dưới */}
      <mesh position={[0, 2, hw + 2]}>
        <boxGeometry args={[length + 4, 4, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} wireframe />
      </mesh>

      {/* 4 Cột đèn */}
      <LightPole position={[-hl - 2.5, 0, -hw - 2.5]} rotation={Math.PI / 4} />
      <LightPole position={[hl + 2.5, 0, -hw - 2.5]} rotation={Math.PI * 3 / 4} />
      <LightPole position={[hl + 2.5, 0, hw + 2.5]} rotation={Math.PI * 5 / 4} />
      <LightPole position={[-hl - 2.5, 0, hw + 2.5]} rotation={-Math.PI / 4} />
    </group>
  );
}


const Field = ({ length, width }: { length: number, width: number }) => {
  const texture = useFieldTexture(length, width);
  const actualLength = length - 4; 
  const actualWidth = width - 4;
  
  return (
    <group>
      {/* Grass Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        {texture && <meshStandardMaterial map={texture} roughness={0.8} />}
      </mesh>
      
      <EnvironmentSetup length={length} width={width} />

      <Goal position={[-actualLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Goal position={[actualLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

      <Players length={actualLength} width={actualWidth} />
    </group>
  );
};

export default function FootballField3D({ length = 51, width = 32 }: { length?: number, width?: number }) {
  const canvasLength = length + 4;
  const canvasWidth = width + 4;

  return (
    <div className="w-full h-full bg-sky-100 rounded-xl overflow-hidden relative shadow-2xl border border-sky-200/50">
      <Canvas shadows camera={{ position: [0, 40, 50], fov: 45 }} dpr={[1, 1.5]}>
        
        <Sky sunPosition={[100, 20, 100]} turbidity={0.3} rayleigh={0.5} />
        
        {/* Ánh sáng ban ngày rực rỡ */}
        <ambientLight intensity={0.7} color="#ffffff" />
        
        {/* Mặt trời */}
        <directionalLight 
          castShadow 
          position={[50, 80, 30]} 
          intensity={1.5} 
          color="#fdf4ce"
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={150}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        
        <Field length={canvasLength} width={canvasWidth} />
        
        <OrbitControls 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={90}
          enableDamping={true}
        />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={100} blur={2} far={4.5} frames={1} resolution={512} />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-white/10 shadow-lg pointer-events-none">
        <p className="font-bold text-lg text-emerald-400">Sân Bóng Phương Viên</p>
        <p className="text-sm text-slate-200 mt-1">Kích thước hiển thị: {length}m x {width}m</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 bg-white/5 p-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          <p>Kéo chuột để xoay, lăn để zoom</p>
        </div>
      </div>
    </div>
  );
}
