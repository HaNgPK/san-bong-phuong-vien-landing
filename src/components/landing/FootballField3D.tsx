"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Sky,
  Loader,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

const useFieldTexture = (length: number, width: number) => {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scale = 20;
    canvas.width = length * scale;
    canvas.height = width * scale;

    // Background grass
    ctx.fillStyle = "#2e7d32";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grass stripes
    ctx.fillStyle = "#276c2a";
    const stripeWidth = 5 * scale;
    for (let i = 0; i < length * scale; i += stripeWidth * 2) {
      ctx.fillRect(i, 0, stripeWidth, canvas.height);
    }

    // Lines configuration
    ctx.strokeStyle = "#ffffff";
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
    ctx.arc(
      marginX + fieldW / 2,
      marginY + fieldH / 2,
      centerRadius,
      0,
      Math.PI * 2,
    );
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(
      marginX + fieldW / 2,
      marginY + fieldH / 2,
      0.3 * scale,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Penalty areas (Vòng bán nguyệt 6m cho sân 7)
    const penaltyRadius = 6 * scale;

    // Left Penalty Arc
    ctx.beginPath();
    ctx.arc(
      marginX,
      marginY + fieldH / 2,
      penaltyRadius,
      -Math.PI / 2,
      Math.PI / 2,
    );
    ctx.stroke();

    // Right Penalty Arc
    ctx.beginPath();
    ctx.arc(
      marginX + fieldW,
      marginY + fieldH / 2,
      penaltyRadius,
      Math.PI / 2,
      -Math.PI / 2,
    );
    ctx.stroke();

    // Penalty spots
    const penaltySpotDist = 6 * scale;
    ctx.beginPath();
    ctx.arc(
      marginX + penaltySpotDist,
      marginY + fieldH / 2,
      0.3 * scale,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      marginX + fieldW - penaltySpotDist,
      marginY + fieldH / 2,
      0.3 * scale,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Corner arcs
    const cornerRadius = 1 * scale;
    [
      [marginX, marginY, 0, Math.PI / 2],
      [marginX + fieldW, marginY, Math.PI / 2, Math.PI],
      [marginX + fieldW, marginY + fieldH, Math.PI, Math.PI * 1.5],
      [marginX, marginY + fieldH, Math.PI * 1.5, Math.PI * 2],
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

const Goal = ({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) => {
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
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const Player = ({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) => {
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

const Players = ({ length, width }: { length: number; width: number }) => {
  const l = length / 2;
  const w = width / 2;

  // Team 1 (Đỏ)
  const team1 = [
    [-l + 1.5, 0, 0], // Thủ môn
    [-l + 8, 0, -w / 3], // Hậu vệ
    [-l + 8, 0, w / 3], // Hậu vệ
    [-l + 14, 0, -w / 2.5], // Tiền vệ
    [-l + 13, 0, 0], // Tiền vệ trung tâm
    [-l + 14, 0, w / 2.5], // Tiền vệ
    [-2, 0, 0], // Tiền đạo
  ];

  // Team 2 (Xanh)
  const team2 = [
    [l - 1.5, 0, 0], // Thủ môn
    [l - 8, 0, -w / 3], // Hậu vệ
    [l - 8, 0, w / 3], // Hậu vệ
    [l - 14, 0, -w / 2.5], // Tiền vệ
    [l - 13, 0, 0], // Tiền vệ trung tâm
    [l - 14, 0, w / 2.5], // Tiền vệ
    [2, 0, 0], // Tiền đạo
  ];

  return (
    <group>
      {team1.map((pos, i) => (
        <Player
          key={`t1-${i}`}
          position={pos as [number, number, number]}
          color="#ef4444"
        />
      ))}
      {team2.map((pos, i) => (
        <Player
          key={`t2-${i}`}
          position={pos as [number, number, number]}
          color="#3b82f6"
        />
      ))}

      {/* Trái bóng */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

const LightPole = ({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: number;
}) => {
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
};

// ========================
// ========================
// DÒNG MƯƠNG - phía sau sân (Z âm), lòng mương xanh có tường bao
// ========================
const Canal = ({
  length,
  fieldHalfWidth,
}: {
  length: number;
  fieldHalfWidth: number;
}) => {
  const cZ = -(fieldHalfWidth + 14);
  return (
    <group>
      {/* Lòng mương (nước lõm xuống) */}
      <mesh position={[0, -0.2, cZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length + 40, 7]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.82}
          roughness={0.05}
          metalness={0.4}
        />
      </mesh>

      {/* Tường bao mương bên trong (sát bờ sông) */}
      <mesh position={[0, 0.4, cZ + 3.6]} receiveShadow castShadow>
        <boxGeometry args={[length + 40, 1.2, 0.4]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.7} />
      </mesh>

      {/* Tường bao mương bên ngoài (mặt xa) */}
      <mesh position={[0, 0.4, cZ - 3.6]} receiveShadow castShadow>
        <boxGeometry args={[length + 40, 1.2, 0.4]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.7} />
      </mesh>

      {/* Đất quanh mương */}
      <mesh position={[0, 0.05, cZ + 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length + 40, 2.8]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, cZ - 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length + 40, 2.8]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>

      {/* Biển "DÒNG MƯƠNG" */}
      <mesh position={[0, 1.4, cZ + 3.8]}>
        <boxGeometry args={[10, 0.8, 0.15]} />
        <meshStandardMaterial color="#0e7490" roughness={0.5} />
      </mesh>
    </group>
  );
};

// ========================
// NHÀ VĂN HÓA 2 TẦNG - bên PHẢI sân (X+)
// ========================
const CommunityCenter = ({ fieldHalfLength }: { fieldHalfLength: number }) => {
  // Đặt ở X+, xoay Y=0 để mặt tiền nhìn về phía đê (Z+) thay vì nhìn vào sân
  return (
    <group position={[fieldHalfLength + 22, 0, 0]} rotation={[0, 0, 0]}>
      {/* Nền móng */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 0.6, 13]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.7} />
      </mesh>
      {/* Tường tầng 1 */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 4, 13]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.6} />
      </mesh>
      {/* Tường tầng 2 */}
      <mesh position={[0, 6.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 3.6, 13]} />
        <meshStandardMaterial color="#ede8dc" roughness={0.6} />
      </mesh>
      {/* Mái phẳng đua */}
      <mesh position={[0, 9.5, 0]} castShadow>
        <boxGeometry args={[28, 0.4, 15]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Mái tam giác (cone 4 mặt) */}
      <mesh position={[0, 11.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[10.5, 3.5, 4]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {/* Cột trụ mặt tiền */}
      {[-9, -4.5, 0, 4.5, 9].map((x, i) => (
        <mesh key={i} position={[x, 2.4, 6.6]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 4.2, 8]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.5} />
        </mesh>
      ))}
      {/* Ban công tầng 2 */}
      <mesh position={[0, 5.2, 7]} castShadow>
        <boxGeometry args={[26, 0.2, 1]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.5} />
      </mesh>
      {/* Lan can ban công */}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={`r${i}`} position={[-6 + i, 5.7, 7]} castShadow>
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.4} />
        </mesh>
      ))}
      {/* Cửa chính */}
      <mesh position={[0, 1.4, 6.55]}>
        <boxGeometry args={[3.2, 2.8, 0.1]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} />
      </mesh>
      {/* Cửa sổ tầng 1 */}
      {[-8, -4.5, 4.5, 8].map((x, i) => (
        <mesh key={`w1${i}`} position={[x, 2.5, 6.55]}>
          <boxGeometry args={[2.2, 1.7, 0.08]} />
          <meshStandardMaterial
            color="#bfdbfe"
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
      ))}
      {/* Cửa sổ tầng 2 */}
      {[-8, -4.5, 0, 4.5, 8].map((x, i) => (
        <mesh key={`w2${i}`} position={[x, 7, 6.55]}>
          <boxGeometry args={[2.2, 1.7, 0.08]} />
          <meshStandardMaterial
            color="#bfdbfe"
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
      ))}
      {/* Biển hiệu đỏ */}
      <mesh position={[0, 8.4, 6.6]}>
        <boxGeometry args={[13, 1.1, 0.15]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>
      {/* Bậc thềm */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`s${i}`}
          position={[0, 0.12 + i * 0.18, 7.1 + i * 0.35]}
          castShadow
        >
          <boxGeometry args={[5, 0.18, 0.7]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.8} />
        </mesh>
      ))}
      {/* Sân trước */}
      <mesh position={[0, 0.02, 11]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      {/* Cây xanh 2 bên */}
      {[-12, 12].map((x, i) => (
        <group key={`tr${i}`} position={[x, 0, 10]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 3, 6]} />
            <meshStandardMaterial color="#713f12" roughness={0.9} />
          </mesh>
          <mesh position={[0, 4, 0]} castShadow>
            <sphereGeometry args={[2, 8, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ========================
// CỜ VIỆT NAM (vẫy bằng useFrame)
// ========================
const VietNamFlag = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const flagTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Nền đỏ
    ctx.fillStyle = "#da251d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sao vàng
    ctx.fillStyle = "#ffcd00";
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerRadius = 80;
    const innerRadius = 30;
    const spikes = 5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      const posAttr = meshRef.current.geometry.attributes.position;
      const positions = posAttr.array;
      // Vẫy cờ bằng cách thay đổi tọa độ z của đỉnh dựa trên x và thời gian
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        // Điểm x = -1.5 là gốc cột cờ, biên độ vẫy tăng dần về đuôi cờ
        positions[i + 2] = Math.sin((x + 1.5) * 2 - t * 6) * ((x + 1.5) * 0.15);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Cột cờ */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 8]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} />
      </mesh>

      {/* Đế cột */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Lá cờ (treo ở ngọn cột) */}
      <mesh ref={meshRef} position={[1.5, 6.5, 0]} castShadow>
        <planeGeometry args={[3, 2, 20, 20]} />
        {flagTexture && (
          <meshStandardMaterial
            map={flagTexture}
            side={THREE.DoubleSide}
            roughness={0.6}
          />
        )}
      </mesh>
    </group>
  );
};

// ========================
// DẢI ĐÊ - phía TRƯỚC gần user (Z+)
// ========================
const Dyke = ({
  length,
  fieldHalfWidth,
}: {
  length: number;
  fieldHalfWidth: number;
}) => {
  const dZ = fieldHalfWidth + 12;
  return (
    <group>
      <mesh position={[0, 1.2, dZ]} castShadow receiveShadow>
        <boxGeometry args={[length + 50, 2.4, 7]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.41, dZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length + 50, 4]} />
        <meshStandardMaterial color="#a3a3a3" roughness={0.8} />
      </mesh>
      {/* Taluy cỏ phía sân */}
      <mesh
        position={[0, 1.1, dZ - 5.5]}
        rotation={[-Math.PI / 2 + 0.55, 0, 0]}
      >
        <planeGeometry args={[length + 50, 3.5]} />
        <meshStandardMaterial color="#4ade80" roughness={0.85} side={2} />
      </mesh>
      {/* Taluy cỏ phía ngoài */}
      <mesh
        position={[0, 1.1, dZ + 5.5]}
        rotation={[-Math.PI / 2 - 0.55, 0, 0]}
      >
        <planeGeometry args={[length + 50, 3.5]} />
        <meshStandardMaterial color="#4ade80" roughness={0.85} side={2} />
      </mesh>
      {/* Cây bụi trên đê */}
      {[-21, -15, -9, -3, 3, 9, 15, 21].map((x, i) => (
        <mesh key={`b${i}`} position={[x, 2.8, dZ - 0.3]} castShadow>
          <sphereGeometry args={[0.9, 6, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#16a34a" : "#15803d"}
            roughness={0.85}
          />
        </mesh>
      ))}
      {/* Cột mốc */}
      {[-18, 0, 18].map((x, i) => (
        <mesh key={`p${i}`} position={[x, 3.2, dZ]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 6]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
      ))}
      {/* Biển "DẢI ĐÊ" */}
      <mesh position={[0, 3.8, dZ]}>
        <boxGeometry args={[8, 0.7, 0.15]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>
      {/* Cờ Việt Nam ở chính giữa đỉnh đê */}
      <VietNamFlag position={[0, 2.41, dZ]} />
    </group>
  );
};

// ========================
// SÂN BÓNG CHUYỀN - bên TRÁI sân (X-)
// ========================
const VolleyballCourt = ({ fieldHalfLength }: { fieldHalfLength: number }) => {
  // Đặt ở X-, xoay Y=0 để lưới song song với đê
  return (
    <group position={[-(fieldHalfLength + 18), 0.01, 0]} rotation={[0, 0, 0]}>
      {/* Nền sân xi măng */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 9]} />
        <meshStandardMaterial color="#d4c5a9" roughness={0.9} />
      </mesh>
      {/* Vạch biên ngang (trục X) */}
      {[-4.5, 4.5].map((z, i) => (
        <mesh
          key={`vl${i}`}
          position={[0, 0.02, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[18, 0.08]} />
          <meshStandardMaterial color="white" roughness={0.5} />
        </mesh>
      ))}
      {/* Vạch biên dọc (trục Z) */}
      {[-9, 9].map((x, i) => (
        <mesh
          key={`hl${i}`}
          position={[x, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.08, 9]} />
          <meshStandardMaterial color="white" roughness={0.5} />
        </mesh>
      ))}
      {/* Đường giữa & tấn công */}
      {[0, -3, 3].map((x, i) => (
        <mesh
          key={`cl${i}`}
          position={[x, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.07, 9]} />
          <meshStandardMaterial color="white" roughness={0.5} />
        </mesh>
      ))}
      {/* Cột lưới */}
      {[-4.7, 4.7].map((z, i) => (
        <mesh key={`np${i}`} position={[0, 1.2, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 2.43, 8]} />
          <meshStandardMaterial
            color="#78716c"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Lưới */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.05, 2, 9.5]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      {/* Dải trắng trên lưới */}
      <mesh position={[0, 2.33, 0]}>
        <boxGeometry args={[0.05, 0.1, 9.5]} />
        <meshStandardMaterial color="white" roughness={0.4} />
      </mesh>
      {/* Cỏ xung quanh */}
      {[-7, 7].map((z, i) => (
        <mesh
          key={`cg${i}`}
          position={[0, -0.01, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[22, 5]} />
          <meshStandardMaterial color="#166534" roughness={0.85} />
        </mesh>
      ))}
      {/* Biển "SÂN BÓNG CHUYỀN" */}
      <mesh position={[0, 1.2, 5]}>
        <boxGeometry args={[7, 1, 0.15]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
      </mesh>
    </group>
  );
};

const EnvironmentSetup = ({
  length,
  width,
}: {
  length: number;
  width: number;
}) => {
  const hl = length / 2;
  const hw = width / 2;

  return (
    <group>
      {/* Hành lang đi lại (gạch đỏ) xung quanh sân */}
      <mesh
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[length + 6, width + 6]} />
        <meshStandardMaterial color="#ea580c" roughness={0.9} />
      </mesh>

      {/* Nền đất bên ngoài rộng hơn để chứa quang cảnh */}
      <mesh
        position={[0, -0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#166534" roughness={1} />
      </mesh>

      {/* Lưới rào xung quanh sân (Cao 4m) */}
      {/* Trái */}
      <mesh position={[-hl - 2, 2, 0]}>
        <boxGeometry args={[0.05, 4, width + 4]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      {/* Phải */}
      <mesh position={[hl + 2, 2, 0]}>
        <boxGeometry args={[0.05, 4, width + 4]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      {/* Trên */}
      <mesh position={[0, 2, -hw - 2]}>
        <boxGeometry args={[length + 4, 4, 0.05]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      {/* Dưới */}
      <mesh position={[0, 2, hw + 2]}>
        <boxGeometry args={[length + 4, 4, 0.05]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* 4 Cột đèn góc */}
      <LightPole position={[-hl - 2.5, 0, -hw - 2.5]} rotation={Math.PI / 4} />
      <LightPole
        position={[hl + 2.5, 0, -hw - 2.5]}
        rotation={(Math.PI * 3) / 4}
      />
      <LightPole
        position={[hl + 2.5, 0, hw + 2.5]}
        rotation={(Math.PI * 5) / 4}
      />
      <LightPole position={[-hl - 2.5, 0, hw + 2.5]} rotation={-Math.PI / 4} />

      {/* 2 Cột đèn giữa sân */}
      <LightPole position={[0, 0, -hw - 2.5]} rotation={Math.PI / 2} />
      <LightPole position={[0, 0, hw + 2.5]} rotation={-Math.PI / 2} />

      {/* ===== QUANG CẢNH XUNG QUANH ===== */}
      {/* Dòng mương - phía sau (Z-) màu xanh */}
      <Canal length={length} fieldHalfWidth={hw} />

      {/* Nhà văn hóa 2 tầng - bên PHẢI sân (X+) */}
      <CommunityCenter fieldHalfLength={hl} />

      {/* Dải đê - phía TRƯỚC gần user (Z+) */}
      <Dyke length={length} fieldHalfWidth={hw} />

      {/* Sân bóng chuyền - bên TRÁI sân (X-) */}
      <VolleyballCourt fieldHalfLength={hl} />
    </group>
  );
};

const Field = ({ length, width }: { length: number; width: number }) => {
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

      <Goal
        position={[-actualLength / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Goal
        position={[actualLength / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      <Players length={actualLength} width={actualWidth} />

      {/* Hiển thị kích thước DÀI (dọc theo trục X, nằm sát biên dưới) */}
      <Text
        position={[0, 0.02, actualWidth / 2 + 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={2}
        color="white"
        outlineWidth={0.05}
        outlineColor="black"
      >
        Chiều dài: {actualLength}m
      </Text>

      {/* Hiển thị kích thước RỘNG (dọc theo trục Z, nằm sát biên phải) */}
      <Text
        position={[actualLength / 2 + 1, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={2}
        color="white"
        outlineWidth={0.05}
        outlineColor="black"
      >
        Chiều rộng: {actualWidth}m
      </Text>
    </group>
  );
};

export default function FootballField3D({
  length = 51,
  width = 32,
}: {
  length?: number;
  width?: number;
}) {
  const canvasLength = length + 4;
  const canvasWidth = width + 4;

  return (
    <div className="w-full h-full bg-sky-100 rounded-xl overflow-hidden relative shadow-2xl border border-sky-200/50">
      <Canvas
        shadows
        camera={{ position: [0, 40, 50], fov: 45 }}
        dpr={[1, 1.5]}
      >
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
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.4}
          scale={100}
          blur={2}
          far={4.5}
          frames={1}
          resolution={512}
        />
      </Canvas>

      <Loader
        containerStyles={{ backgroundColor: "#f0f9ff" }}
        innerStyles={{
          backgroundColor: "#cbd5e1",
          height: "6px",
          width: "250px",
          borderRadius: "4px",
        }}
        barStyles={{
          backgroundColor: "#10b981",
          height: "6px",
          borderRadius: "4px",
        }}
        dataStyles={{
          color: "#047857",
          fontWeight: "bold",
          fontSize: "14px",
          marginTop: "16px",
          fontFamily: "sans-serif",
        }}
        dataInterpolation={(p) => `Đang dựng mô hình 3D... ${p.toFixed(0)}%`}
      />

      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-white/10 shadow-lg pointer-events-none">
        <p className="font-bold text-lg text-emerald-400">
          Sân Bóng Phương Viên
        </p>
        <p className="text-sm text-slate-200 mt-1">
          Kích thước hiển thị: {length}m x {width}m
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 bg-white/5 p-2 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          <p>Kéo chuột để xoay, lăn để zoom</p>
        </div>
      </div>
    </div>
  );
}
