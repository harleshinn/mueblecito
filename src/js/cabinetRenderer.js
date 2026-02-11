import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function renderCabinet(module, container) {
  // Clear the container
  container.innerHTML = '';

  // Validate input
  if (!module || !module.width || !module.height || !module.depth) {
    console.warn('Invalid module data:', module);
    return;
  }

  // Scale factor to normalize dimensions (convert mm to reasonable 3D units)
  const scale = 0.01;

  // Create scene, camera, renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); // White background

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Add orbit controls for rotation
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = true;

  // Materials
  const cabinetMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
  const doorMaterial = new THREE.LineBasicMaterial({ color: 0x2563eb }); // Blue for doors
  const drawerMaterial = new THREE.LineBasicMaterial({ color: 0x16a34a }); // Green for drawers
  const stretcherMaterial = new THREE.LineBasicMaterial({ color: 0xf59e0b }); // Orange for stretchers
  const legMaterial = new THREE.LineBasicMaterial({ color: 0x8b5cf6 }); // Purple for legs

  // Helper function to create wireframe box
  function createWireframeBox(width, height, depth, position, material = cabinetMaterial) {
    const geometry = new THREE.BoxGeometry(width * scale, height * scale, depth * scale);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, material);
    line.position.set(position.x * scale, position.y * scale, position.z * scale);
    return line;
  }

  // Cabinet dimensions
  const w = module.width;
  const h = module.height;
  const d = module.depth;
  const t = module.structuralThickness || 18;
  const legHeight = module.legHeight || 0;
  const stretcherH = module.stretcherHeight || 80;
  
  // Calculate cabinet box height (excluding legs)
  const cabinetH = h - legHeight;
  const cabinetYOffset = legHeight / 2; // Shift cabinet up by half leg height

  // Legs (for lower cabinets)
  if (legHeight > 0) {
    const legSize = 40; // Leg cross-section size
    const legInset = t + 20; // Inset from cabinet edges
    
    // Four corner legs
    const legPositions = [
      { x: -w/2 + legInset, z: -d/2 + legInset },
      { x: w/2 - legInset, z: -d/2 + legInset },
      { x: -w/2 + legInset, z: d/2 - legInset },
      { x: w/2 - legInset, z: d/2 - legInset }
    ];
    
    for (const pos of legPositions) {
      scene.add(createWireframeBox(legSize, legHeight, legSize, { 
        x: pos.x, 
        y: -h/2 + legHeight/2, 
        z: pos.z 
      }, legMaterial));
    }
  }

  // Cabinet box panels
  // Bottom
  scene.add(createWireframeBox(w, t, d, { x: 0, y: -h/2 + legHeight + t/2, z: 0 }));
  
  // Top (if hasTop)
  if (module.hasTop !== false) {
    scene.add(createWireframeBox(w, t, d, { x: 0, y: h/2 - t/2, z: 0 }));
  }
  
  // Left side
  scene.add(createWireframeBox(t, cabinetH, d, { x: -w/2 + t/2, y: cabinetYOffset, z: 0 }));
  
  // Right side
  scene.add(createWireframeBox(t, cabinetH, d, { x: w/2 - t/2, y: cabinetYOffset, z: 0 }));
  
  // Back panel (if hasBackPanel)
  if (module.hasBackPanel !== false) {
    const backT = module.backThickness || 3;
    scene.add(createWireframeBox(w, cabinetH, backT, { x: 0, y: cabinetYOffset, z: -d/2 + backT/2 }));
  }

  // Top Stretcher
  if (module.hasTopStretcher) {
    const stretcherDepth = 80; // Stretcher depth
    // Front stretcher
    scene.add(createWireframeBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: h/2 - t - stretcherH/2, 
      z: d/2 - stretcherDepth/2 
    }, stretcherMaterial));
    // Back stretcher
    scene.add(createWireframeBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: h/2 - t - stretcherH/2, 
      z: -d/2 + stretcherDepth/2 
    }, stretcherMaterial));
  }

  // Bottom Stretcher
  if (module.hasBottomStretcher) {
    const stretcherDepth = 80;
    // Front stretcher
    scene.add(createWireframeBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: -h/2 + legHeight + t + stretcherH/2, 
      z: d/2 - stretcherDepth/2 
    }, stretcherMaterial));
    // Back stretcher
    scene.add(createWireframeBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: -h/2 + legHeight + t + stretcherH/2, 
      z: -d/2 + stretcherDepth/2 
    }, stretcherMaterial));
  }

  // Doors
  if (module.hasDoors && module.doors && module.doors.length > 0) {
    const doorGap = module.doorGap || 2;
    let xOffset = -w/2 + t + doorGap;
    
    for (let i = 0; i < module.doors.length; i++) {
      const door = module.doors[i];
      const doorW = door.width || ((w - 2*t - (module.doors.length + 1) * doorGap) / module.doors.length);
      const doorH = door.height || (cabinetH - 2*t - 2*doorGap);
      const doorX = xOffset + doorW/2;
      const doorY = cabinetYOffset;
      const doorZ = d/2 + 2; // Slightly in front of cabinet
      
      scene.add(createWireframeBox(doorW, doorH, t, { x: doorX, y: doorY, z: doorZ }, doorMaterial));
      xOffset += doorW + doorGap;
    }
  }

  // Drawers
  if (module.hasDrawers && module.drawers && module.drawers.length > 0) {
    const drawerSpacing = module.drawerSpacing || 3;
    const slideClearance = module.drawerSlideClearance || 25;
    const innerWidth = w - 2*t - 2*slideClearance;
    let yOffset = h/2 - t - drawerSpacing;
    
    for (let i = 0; i < module.drawers.length; i++) {
      const drawer = module.drawers[i];
      const drawerH = drawer.height || 150;
      const drawerD = drawer.depth || (d - t - 50);
      const drawerY = yOffset - drawerH/2;
      const drawerZ = d/2 + 5; // Front face of drawer
      
      // Drawer front
      scene.add(createWireframeBox(innerWidth, drawerH, t, { x: 0, y: drawerY, z: drawerZ }, drawerMaterial));
      
      // Drawer box (sides)
      const boxD = drawerD - t;
      scene.add(createWireframeBox(t, drawerH - 20, boxD, { x: -innerWidth/2 + t/2, y: drawerY, z: drawerZ - boxD/2 - t }, drawerMaterial));
      scene.add(createWireframeBox(t, drawerH - 20, boxD, { x: innerWidth/2 - t/2, y: drawerY, z: drawerZ - boxD/2 - t }, drawerMaterial));
      
      yOffset -= drawerH + drawerSpacing;
    }
  }

  // Position camera based on cabinet size
  const maxDim = Math.max(w, h, d) * scale;
  camera.position.set(maxDim * 1.8, maxDim * 0.8, maxDim * 2.0);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);

  // Animation loop for controls
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}