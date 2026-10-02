import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei'
import { X, ShieldCheck, Zap, RotateCcw } from 'lucide-react'

function ArmourMesh({ stance, color }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={meshRef}>
        {/* Main ergonomic curved shield body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.9, 1.8, 16, 32]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.2}
            metalness={0.7}
            clearcoat={1}
            clearcoatRoughness={0.1}
            wireframe={false}
          />
        </mesh>

        {/* Central Impact Spine */}
        <mesh position={[0, 0, 0.45]}>
          <boxGeometry args={[0.25, 2.2, 0.2]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Ventilation and mobility ribbing */}
        {[-0.6, -0.2, 0.2, 0.6].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.38]}>
            <boxGeometry args={[1.3, 0.08, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

export default function Armour3DModal({ isOpen, onClose }) {
  const [selectedStance, setSelectedStance] = useState('Aggressive Forward')
  const [armourColor, setArmourColor] = useState('#2563eb')

  if (!isOpen) return null

  const stances = ['Orthodox Defensive', 'Aggressive Forward', 'Deep Crease Power']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#090f1d] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Canvas Area */}
        <div className="relative w-full md:w-3/5 h-80 md:h-[480px] bg-gradient-to-b from-[#0b1528] to-[#050811]">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full text-xs text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Interactive 3D Preview (Drag to Orbit)</span>
          </div>

          <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} color="#93c5fd" />
            <pointLight position={[-5, -2, -2]} intensity={0.8} color="#2563eb" />
            <spotLight position={[0, 6, 2]} intensity={2} angle={0.6} penumbra={1} color="#ffffff" />
            
            <ArmourMesh stance={selectedStance} color={armourColor} />
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
          </Canvas>

          <div className="absolute bottom-3 left-4 text-[11px] text-slate-500">
            ArmourCraft AS CAD Gen-V • Carbon-Reinforced Polypropylene
          </div>
        </div>

        {/* Customization Details & Stance Selector */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-[#080d1a]">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Custom Stance Engineering</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              Pro Ergonomic Armour
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Dynamically contouring inner & outer thigh protection tested for seamless articulation and zero bat-handle interference.
            </p>

            {/* Stance Selector */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Select Your Stance:
              </label>
              <div className="space-y-2">
                {stances.map((stance) => (
                  <button
                    key={stance}
                    onClick={() => setSelectedStance(stance)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
                      selectedStance === stance
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm shadow-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{stance}</span>
                    {selectedStance === stance && <Zap className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Customization */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                Carbon Accent Tone:
              </label>
              <div className="flex gap-2.5">
                {[
                  { name: 'Electric Blue', hex: '#2563eb' },
                  { name: 'Titanium Silver', hex: '#64748b' },
                  { name: 'Carbon Black', hex: '#1e293b' },
                  { name: 'Cyan Kinetic', hex: '#06b6d4' },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setArmourColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform border-2 ${
                      armourColor === c.hex ? 'scale-110 border-white ring-2 ring-blue-500/50' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              Lock In My Stance Specs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
