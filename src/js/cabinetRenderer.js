import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DEFAULT_COMPONENT_COLORS, hexToInt } from './colorPalette.js';

export function renderCabinet(module, container, options = {}) {
  const { filled = false, colors = {} } = options;
  
  // Merge with default colors
  const componentColors = { ...DEFAULT_COMPONENT_COLORS, ...colors };
  
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

  // Derive edge line color from a fill hex: darken light colors, lighten dark colors
  function deriveEdgeColor(hex) {
    const color = new THREE.Color(hexToInt(hex));
    const hsl = {};
    color.getHSL(hsl);
    // Shift lightness toward the opposite extreme for subtle contrast
    if (hsl.l > 0.5) {
      hsl.l = Math.max(0, hsl.l - 0.25);
    } else {
      hsl.l = Math.min(1, hsl.l + 0.25);
    }
    return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
  }

  // Wireframe materials (derived from fill colors when filled, fixed otherwise)
  const cabinetLineMaterial = new THREE.LineBasicMaterial({ color: filled ? deriveEdgeColor(componentColors.cabinet) : 0x333333 });
  const doorLineMaterial = new THREE.LineBasicMaterial({ color: filled ? deriveEdgeColor(componentColors.door) : 0x1e40af });
  const drawerLineMaterial = new THREE.LineBasicMaterial({ color: filled ? deriveEdgeColor(componentColors.drawer) : 0x15803d });
  const stretcherLineMaterial = new THREE.LineBasicMaterial({ color: filled ? deriveEdgeColor(componentColors.stretcher) : 0xb45309 });
  const legLineMaterial = new THREE.LineBasicMaterial({ color: filled ? deriveEdgeColor(componentColors.leg) : 0x6b21a8 });

  // Filled materials (using configurable colors with transparency)
  const cabinetFillMaterial = new THREE.MeshBasicMaterial({ 
    color: hexToInt(componentColors.cabinet), 
    transparent: true, 
    opacity: 0.85 
  });
  const doorFillMaterial = new THREE.MeshBasicMaterial({ 
    color: hexToInt(componentColors.door), 
    transparent: true, 
    opacity: 0.7 
  });
  const drawerFillMaterial = new THREE.MeshBasicMaterial({ 
    color: hexToInt(componentColors.drawer), 
    transparent: true, 
    opacity: 0.7 
  });
  const stretcherFillMaterial = new THREE.MeshBasicMaterial({ 
    color: hexToInt(componentColors.stretcher), 
    transparent: true, 
    opacity: 0.7 
  });
  const legFillMaterial = new THREE.MeshBasicMaterial({ 
    color: hexToInt(componentColors.leg), 
    transparent: true, 
    opacity: 0.7 
  });

  // Helper function to create box (wireframe or filled)
  function createBox(width, height, depth, position, type = 'cabinet') {
    const geometry = new THREE.BoxGeometry(width * scale, height * scale, depth * scale);
    const group = new THREE.Group();
    
    // Get materials based on type
    let lineMaterial, fillMaterial;
    switch (type) {
      case 'door':
        lineMaterial = doorLineMaterial;
        fillMaterial = doorFillMaterial;
        break;
      case 'drawer':
        lineMaterial = drawerLineMaterial;
        fillMaterial = drawerFillMaterial;
        break;
      case 'stretcher':
        lineMaterial = stretcherLineMaterial;
        fillMaterial = stretcherFillMaterial;
        break;
      case 'leg':
        lineMaterial = legLineMaterial;
        fillMaterial = legFillMaterial;
        break;
      default:
        lineMaterial = cabinetLineMaterial;
        fillMaterial = cabinetFillMaterial;
    }
    
    if (filled) {
      const mesh = new THREE.Mesh(geometry, fillMaterial);
      group.add(mesh);
    }
    
    // Always add edges for definition
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    group.add(line);
    
    group.position.set(position.x * scale, position.y * scale, position.z * scale);
    return group;
  }

  // Cabinet dimensions
  const w = module.width;
  const h = module.height;
  const d = module.depth;
  const t = module.structuralThickness || 18;
  const isLowerCabinet = module.type === 'lower';
  const legHeight = isLowerCabinet ? (module.legHeight || 0) : 0;
  const stretcherH = module.stretcherHeight || 80;
  
  // Calculate cabinet box height (excluding legs for lower cabinets)
  const cabinetH = h - legHeight;
  const cabinetYOffset = legHeight / 2; // Shift cabinet up by half leg height

  // Legs (only for lower cabinets)
  if (isLowerCabinet && legHeight > 0) {
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
      scene.add(createBox(legSize, legHeight, legSize, { 
        x: pos.x, 
        y: -h/2 + legHeight/2, 
        z: pos.z 
      }, 'leg'));
    }
  }

  // Cabinet box panels
  // Bottom
  scene.add(createBox(w, t, d, { x: 0, y: -h/2 + legHeight + t/2, z: 0 }, 'cabinet'));
  
  // Top (if hasTop)
  if (module.hasTop !== false) {
    scene.add(createBox(w, t, d, { x: 0, y: h/2 - t/2, z: 0 }, 'cabinet'));
  }
  
  // Left side
  scene.add(createBox(t, cabinetH, d, { x: -w/2 + t/2, y: cabinetYOffset, z: 0 }, 'cabinet'));
  
  // Right side
  scene.add(createBox(t, cabinetH, d, { x: w/2 - t/2, y: cabinetYOffset, z: 0 }, 'cabinet'));
  
  // Back panel (if hasBackPanel)
  if (module.hasBackPanel !== false) {
    const backT = module.backThickness || 3;
    scene.add(createBox(w, cabinetH, backT, { x: 0, y: cabinetYOffset, z: -d/2 + backT/2 }, 'cabinet'));
  }

  // Top Stretcher
  if (module.hasTopStretcher) {
    const stretcherDepth = 80; // Stretcher depth
    // Front stretcher
    scene.add(createBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: h/2 - t - stretcherH/2, 
      z: d/2 - stretcherDepth/2 
    }, 'stretcher'));
    // Back stretcher
    scene.add(createBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: h/2 - t - stretcherH/2, 
      z: -d/2 + stretcherDepth/2 
    }, 'stretcher'));
  }

  // Bottom Stretcher
  if (module.hasBottomStretcher) {
    const stretcherDepth = 80;
    // Front stretcher
    scene.add(createBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: -h/2 + legHeight + t + stretcherH/2, 
      z: d/2 - stretcherDepth/2 
    }, 'stretcher'));
    // Back stretcher
    scene.add(createBox(w - 2*t, stretcherH, stretcherDepth, { 
      x: 0, 
      y: -h/2 + legHeight + t + stretcherH/2, 
      z: -d/2 + stretcherDepth/2 
    }, 'stretcher'));
  }

  // Doors
  if (module.hasDoors && module.doors && module.doors.length > 0) {
    const doorGap = module.doorGap || 2;
    const doorType = module.doorType || 'overlay';
    const doorStyle = module.doorStyle || 'flat';
    const doorThickness = t; // Door panel thickness
    
    // Helper to render a single door (flat or shaker) at a given position
    function renderDoor(doorW, doorH, doorX, doorY, doorZ) {
      if (doorStyle === 'shaker') {
        const railW = module.shakerRailWidth || 60;
        const stileW = module.shakerStileWidth || 60;
        
        // Left stile
        scene.add(createBox(stileW, doorH, doorThickness, {
          x: doorX - doorW / 2 + stileW / 2,
          y: doorY,
          z: doorZ
        }, 'door'));
        
        // Right stile
        scene.add(createBox(stileW, doorH, doorThickness, {
          x: doorX + doorW / 2 - stileW / 2,
          y: doorY,
          z: doorZ
        }, 'door'));
        
        // Top rail (between stiles)
        const railLength = doorW - 2 * stileW;
        scene.add(createBox(railLength, railW, doorThickness, {
          x: doorX,
          y: doorY + doorH / 2 - railW / 2,
          z: doorZ
        }, 'door'));
        
        // Bottom rail (between stiles)
        scene.add(createBox(railLength, railW, doorThickness, {
          x: doorX,
          y: doorY - doorH / 2 + railW / 2,
          z: doorZ
        }, 'door'));
        
        // Center panel (thinner, slightly recessed)
        const panelW = doorW - 2 * stileW;
        const panelH = doorH - 2 * railW;
        const panelThickness = module.shakerPanelThickness || 5.5;
        scene.add(createBox(panelW, panelH, panelThickness, {
          x: doorX,
          y: doorY,
          z: doorZ - (doorThickness - panelThickness) / 2
        }, 'door'));
      } else {
        // Flat slab door
        scene.add(createBox(doorW, doorH, doorThickness, { x: doorX, y: doorY, z: doorZ }, 'door'));
      }
    }
    
    if (doorType === 'inset') {
      // Inset doors: fit inside the cabinet opening, between the side panels
      const openingWidth = w - 2 * t; // Internal width
      const openingTop = h / 2 - t;   // Below top panel
      const openingBottom = -h / 2 + legHeight + t; // Above bottom panel
      const openingHeight = openingTop - openingBottom;
      
      let xOffset = -w / 2 + t + doorGap; // Start after left side panel + gap
      
      for (let i = 0; i < module.doors.length; i++) {
        const door = module.doors[i];
        const doorW = door.width || ((openingWidth - (module.doors.length + 1) * doorGap) / module.doors.length);
        const doorH = door.height || (openingHeight - 2 * doorGap);
        const doorX = xOffset + doorW / 2;
        const doorY = openingBottom + doorGap + doorH / 2;
        const doorZ = d / 2 - doorThickness / 2;
        
        renderDoor(doorW, doorH, doorX, doorY, doorZ);
        xOffset += doorW + doorGap;
      }
    } else {
      // Overlay doors: cover the cabinet front face, overlapping the side panels
      let xOffset = 0;
      
      for (let i = 0; i < module.doors.length; i++) {
        const door = module.doors[i];
        const doorW = door.width || ((w - (module.doors.length - 1) * doorGap) / module.doors.length);
        const doorH = door.height || cabinetH;
        const doorX = -w / 2 + xOffset + doorW / 2;
        const doorY = -h / 2 + legHeight + cabinetH / 2;
        const doorZ = d / 2 + doorThickness / 2 + 1;
        
        renderDoor(doorW, doorH, doorX, doorY, doorZ);
        xOffset += doorW + doorGap;
      }
    }
  }

  // Drawers
  if (module.hasDrawers && module.drawers && module.drawers.length > 0) {
    const drawerSpacing = module.drawerSpacing || 3;
    const slideClearance = module.drawerSlideClearance || 25;
    const innerWidth = w - 2*t - 2*slideClearance;
    const drawerFrontType = module.drawerFrontType || 'overlay';
    const drawerFrontStyle = module.drawerFrontStyle || 'flat';
    const faceThickness = t;
    
    // Helper to render a single drawer face (flat or shaker) at a given position
    function renderDrawerFace(faceW, faceH, faceX, faceY, faceZ) {
      if (drawerFrontStyle === 'shaker') {
        const railW = module.drawerShakerRailWidth || 60;
        const stileW = module.drawerShakerStileWidth || 60;
        
        // Left stile
        scene.add(createBox(stileW, faceH, faceThickness, {
          x: faceX - faceW / 2 + stileW / 2,
          y: faceY,
          z: faceZ
        }, 'drawer'));
        
        // Right stile
        scene.add(createBox(stileW, faceH, faceThickness, {
          x: faceX + faceW / 2 - stileW / 2,
          y: faceY,
          z: faceZ
        }, 'drawer'));
        
        // Top rail (between stiles)
        const railLength = faceW - 2 * stileW;
        scene.add(createBox(railLength, railW, faceThickness, {
          x: faceX,
          y: faceY + faceH / 2 - railW / 2,
          z: faceZ
        }, 'drawer'));
        
        // Bottom rail (between stiles)
        scene.add(createBox(railLength, railW, faceThickness, {
          x: faceX,
          y: faceY - faceH / 2 + railW / 2,
          z: faceZ
        }, 'drawer'));
        
        // Center panel (thinner, slightly recessed)
        const panelW = faceW - 2 * stileW;
        const panelH = faceH - 2 * railW;
        const panelThickness = module.drawerShakerPanelThickness || 5.5;
        scene.add(createBox(panelW, panelH, panelThickness, {
          x: faceX,
          y: faceY,
          z: faceZ - (faceThickness - panelThickness) / 2
        }, 'drawer'));
      } else {
        // Flat slab face
        scene.add(createBox(faceW, faceH, faceThickness, { x: faceX, y: faceY, z: faceZ }, 'drawer'));
      }
    }
    
    let yOffset = h/2 - t - drawerSpacing;
    
    for (let i = 0; i < module.drawers.length; i++) {
      const drawer = module.drawers[i];
      const drawerH = drawer.height || 150;
      const drawerD = drawer.depth || (d - t - 50);
      
      if (drawerFrontType === 'inset') {
        // Inset: face fits inside the cabinet opening
        const openingWidth = w - 2 * t;
        const faceW = openingWidth - 2 * drawerSpacing;
        const faceH = drawerH - 2 * drawerSpacing;
        const faceY = yOffset - drawerH / 2;
        const faceZ = d / 2 - faceThickness / 2;
        
        renderDrawerFace(faceW, faceH, 0, faceY, faceZ);
        
        // Drawer box (sides) — positioned behind the face
        const boxD = drawerD - t;
        const boxH = (drawer.boxHeight || drawerH - 30) - 20;
        scene.add(createBox(t, boxH, boxD, { x: -innerWidth/2 + t/2, y: faceY, z: faceZ - boxD/2 - t }, 'drawer'));
        scene.add(createBox(t, boxH, boxD, { x: innerWidth/2 - t/2, y: faceY, z: faceZ - boxD/2 - t }, 'drawer'));
      } else {
        // Overlay: face covers the full cabinet front width
        const faceW = w;
        const faceH = drawerH;
        const faceY = yOffset - drawerH / 2;
        const faceZ = d / 2 + faceThickness / 2 + 1;
        
        renderDrawerFace(faceW, faceH, 0, faceY, faceZ);
        
        // Drawer box (sides) — positioned behind the face
        const boxD = drawerD - t;
        const boxH = (drawer.boxHeight || drawerH - 30) - 20;
        scene.add(createBox(t, boxH, boxD, { x: -innerWidth/2 + t/2, y: faceY, z: faceZ - boxD/2 - t }, 'drawer'));
        scene.add(createBox(t, boxH, boxD, { x: innerWidth/2 - t/2, y: faceY, z: faceZ - boxD/2 - t }, 'drawer'));
      }
      
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