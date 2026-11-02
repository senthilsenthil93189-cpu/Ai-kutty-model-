import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sparkles, Sliders, Layers, Eye, RotateCw } from 'lucide-react';

export const ThreeStudioView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);
  const [materialType, setMaterialType] = useState<'gold' | 'chrome' | 'obsidian'>('gold');
  const [autoRotate, setAutoRotate] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.5);
    dirLight.position.set(6, 10, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(30, 30);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Procedural 3-12 Part Composite Trophy / Studio Play Button Model
    const trophyGroup = new THREE.Group();
    groupRef.current = trophyGroup;

    const getMaterial = (type: string, isAccent = false) => {
      if (type === 'gold') {
        return new THREE.MeshStandardMaterial({
          color: isAccent ? 0xf59e0b : 0xd97706,
          metalness: 0.95,
          roughness: isAccent ? 0.1 : 0.25,
        });
      } else if (type === 'chrome') {
        return new THREE.MeshStandardMaterial({
          color: isAccent ? 0x38bdf8 : 0xe2e8f0,
          metalness: 0.98,
          roughness: isAccent ? 0.1 : 0.15,
        });
      } else {
        return new THREE.MeshStandardMaterial({
          color: isAccent ? 0xef4444 : 0x18181b,
          metalness: 0.8,
          roughness: 0.3,
        });
      }
    };

    const mat = getMaterial(materialType);
    const accentMat = getMaterial(materialType, true);

    // Part 1: Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.8, 32);
    const baseMesh = new THREE.Mesh(baseGeo, getMaterial('obsidian'));
    baseMesh.position.y = -1.6;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    trophyGroup.add(baseMesh);

    // Part 2: Pedestal Gold Ring Trim
    const ringGeo = new THREE.CylinderGeometry(2.22, 2.22, 0.15, 32);
    const ringMesh = new THREE.Mesh(ringGeo, accentMat);
    ringMesh.position.y = -1.25;
    ringMesh.castShadow = true;
    trophyGroup.add(ringMesh);

    // Part 3: Central Stem Column
    const stemGeo = new THREE.CylinderGeometry(0.6, 0.9, 1.8, 16);
    const stemMesh = new THREE.Mesh(stemGeo, mat);
    stemMesh.position.y = -0.3;
    stemMesh.castShadow = true;
    trophyGroup.add(stemMesh);

    // Part 4: Play Button Shield Body (Extruded Triangle)
    const shape = new THREE.Shape();
    shape.moveTo(-1.2, 1.5);
    shape.lineTo(1.8, 0);
    shape.lineTo(-1.2, -1.5);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    };
    const shieldGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    shieldGeo.center();
    const shieldMesh = new THREE.Mesh(shieldGeo, mat);
    shieldMesh.position.set(0, 1.4, 0);
    shieldMesh.castShadow = true;
    trophyGroup.add(shieldMesh);

    // Part 5: Inner Play Triangle Emblem
    const innerShape = new THREE.Shape();
    innerShape.moveTo(-0.6, 0.8);
    innerShape.lineTo(1.0, 0);
    innerShape.lineTo(-0.6, -0.8);
    innerShape.closePath();
    const innerGeo = new THREE.ExtrudeGeometry(innerShape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    innerGeo.center();
    const innerMesh = new THREE.Mesh(innerGeo, accentMat);
    innerMesh.position.set(0.2, 1.4, 0.4);
    innerMesh.castShadow = true;
    trophyGroup.add(innerMesh);

    scene.add(trophyGroup);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop (60fps)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && groupRef.current) {
        groupRef.current.rotation.y += delta * 0.5;
      }

      // Smooth exploded animation target
      if (groupRef.current) {
        const targetY = exploded ? 0.6 : 0;
        shieldMesh.position.y = THREE.MathUtils.damp(shieldMesh.position.y, 1.4 + targetY * 1.5, 4, delta);
        innerMesh.position.z = THREE.MathUtils.damp(innerMesh.position.z, 0.4 + targetY * 0.8, 4, delta);
        stemMesh.position.y = THREE.MathUtils.damp(stemMesh.position.y, -0.3 - targetY * 0.5, 4, delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [exploded, materialType, autoRotate]);

  return (
    <div className="relative w-full h-[calc(100vh-70px)] bg-slate-950 overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top Spec Badge */}
      <div className="absolute top-6 left-6 z-10 bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-4 space-y-1 shadow-2xl max-w-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold">
          <Sparkles className="w-3 h-3" />
          Three.js PBR Studio
        </div>
        <h2 className="text-base font-bold text-white">AI Kutty Creator Award</h2>
        <p className="text-xs text-slate-400">Composite procedural 3D studio award stage with RoomEnvironment PBR lighting.</p>
      </div>

      {/* Collapsible Bottom Control Dock (Strictly <= 15% viewport footprint) */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 transition-all duration-300 ${collapsed ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExploded(!exploded)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                exploded ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {exploded ? 'Assembled View' : 'Exploded Layers'}
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                autoRotate ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              Auto-Rotate
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Finish:</span>
            {(['gold', 'chrome', 'obsidian'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMaterialType(m)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize border transition-all ${
                  materialType === m ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-6 right-6 z-30 px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white shadow-xl backdrop-blur-md transition-all"
      >
        {collapsed ? '▴ Show Studio Controls' : '▾ Hide Controls'}
      </button>
    </div>
  );
};
