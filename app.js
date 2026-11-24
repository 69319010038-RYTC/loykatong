/**
 * ลอยกระทงและปล่อยโคมออนไลน์ 3D ณ เจดีย์กลางน้ำ ระยอง
 * 3D WebGL Application with Three.js & OrbitControls
 * Optimized for Smooth 60 FPS Performance on Mobile & Desktop
 */

// Application State
const state = {
  mode: 'krathong', // 'krathong' | 'lantern'
  theme: 'fair', // 'fair' | 'moonlight'
  krathong: {
    base: 'banana', // 'banana' | 'lotus' | 'coconut' | 'bread'
    flower: 'marigold', // 'marigold' | 'dokrak' | 'gardenia' | 'lotusflower'
    ornament: 'uba', // 'uba' | 'blessing_flag' | 'none'
    candleColor: '#FCD34D',
    isLit: true,
  },
  lantern: {
    shape: 'cylinder', // 'cylinder' | 'lotus' | 'diamond'
    color: 'white', // 'white' | 'gold' | 'orange' | 'pink' | 'red'
    pattern: 'kanok', // 'kanok' | 'prajamyam' | 'moon_stars' | 'plain'
    ribbon: 'streamer', // 'streamer' | 'tassel' | 'none'
    isLit: true,
  },
  counts: {
    krathongs: 24,
    lanterns: 16,
  },
  musicPlaying: false,
  selectedEntity: null,
};

// Seed Data for Initial Scene Atmosphere (ผู้ร่วมลอยกระทง 3D ณ เจดีย์กลางน้ำ ระยอง)
const initialSeedItems = [
  {
    type: 'krathong',
    sender: 'ครอบครัวสุขสมบูรณ์ (ปากน้ำระยอง)',
    wish: 'ขอขมาพระแม่คงคา ขอให้ครอบครัวมีความสุข ร่มเย็นเป็นสุข ไร้โรคภัยตลอดปี',
    time: '2 นาทีที่แล้ว',
    options: { base: 'banana', flower: 'marigold', ornament: 'uba', candleColor: '#FCD34D', isLit: true },
    x: 16, z: 24, speed: 0.045, scale: 1.1, phase: 0.5, blessings: 14
  },
  {
    type: 'krathong',
    sender: 'น้องมิ้นท์ & พี่เจษ',
    wish: 'ขอให้ความรักยืนยาว มั่นคงดั่งสายน้ำระยอง การงานก้าวหน้า ร่ำรวย',
    time: '5 นาทีที่แล้ว',
    options: { base: 'lotus', flower: 'lotusflower', ornament: 'blessing_flag', candleColor: '#EF4444', isLit: true },
    x: 4, z: 12, speed: 0.04, scale: 1.0, phase: 1.2, blessings: 9
  },
  {
    type: 'krathong',
    sender: 'คุณลุงสมนึก ชาวประมงระยอง',
    wish: 'ขอพระแม่คงคาคุ้มครองชาวเรือปากน้ำระยอง ออกเรือปลอดภัย ได้กุ้งปลาเต็มลำ',
    time: '8 นาทีที่แล้ว',
    options: { base: 'coconut', flower: 'gardenia', ornament: 'uba', candleColor: '#FCD34D', isLit: true },
    x: -8, z: 6, speed: 0.038, scale: 0.95, phase: 2.1, blessings: 23
  },
  {
    type: 'krathong',
    sender: 'ครูกัลยา โรงเรียนระยองวิทยาคม',
    wish: 'ขอให้ลูกศิษย์ทุกคนประสบความสำเร็จในการเรียน มีอนาคตที่สดใส ร่มเย็น',
    time: '12 นาทีที่แล้ว',
    options: { base: 'bread', flower: 'dokrak', ornament: 'blessing_flag', candleColor: '#C084FC', isLit: true },
    x: -18, z: -4, speed: 0.035, scale: 0.88, phase: 3.5, blessings: 18
  },
  {
    type: 'krathong',
    sender: 'กลุ่มอนุรักษ์ป่าชายเลนเจดีย์กลางน้ำ',
    wish: 'ขอให้สายน้ำระยองใสสะอาด ธรรมชาติอุดมสมบูรณ์คู่เมืองระยองตลอดไป',
    time: '15 นาทีที่แล้ว',
    options: { base: 'banana', flower: 'marigold', ornament: 'none', candleColor: '#FFFFFF', isLit: true },
    x: -30, z: -16, speed: 0.032, scale: 0.82, phase: 4.2, blessings: 31
  },
  {
    type: 'lantern',
    sender: 'พงษ์ศักดิ์ & นิตยา',
    wish: 'ขอให้ธุรกิจการค้ารุ่งเรือง ปลดหนี้สิน ร่ำรวยมั่งคั่ง สุขภาพแข็งแรง',
    time: '1 นาทีที่แล้ว',
    options: { shape: 'cylinder', color: 'gold', pattern: 'kanok', ribbon: 'streamer', isLit: true },
    x: 22, y: 18, z: 8, speedY: 0.03, swaySpeed: 0.025, scale: 1.15, phase: 0.8, blessings: 17
  },
  {
    type: 'lantern',
    sender: 'แก๊งเพื่อน ม.ปลาย ระยอง',
    wish: 'ขอให้ทุกคนสอบติดคณะที่หวัง มิตรภาพคงอยู่ตลอดไป!',
    time: '4 นาทีที่แล้ว',
    options: { shape: 'lotus', color: 'pink', pattern: 'moon_stars', ribbon: 'tassel', isLit: true },
    x: 8, y: 35, z: -15, speedY: 0.025, swaySpeed: 0.02, scale: 0.95, phase: 1.7, blessings: 25
  },
  {
    type: 'lantern',
    sender: 'คุณยายละม่อม วัย 78 ปี',
    wish: 'ขอให้ลูกหลานทุกคนเป็นคนดี มีความสุข สุขภาพร่างกายแข็งแรง',
    time: '7 นาทีที่แล้ว',
    options: { shape: 'diamond', color: 'orange', pattern: 'prajamyam', ribbon: 'streamer', isLit: true },
    x: -12, y: 48, z: -35, speedY: 0.022, swaySpeed: 0.018, scale: 0.8, phase: 2.8, blessings: 42
  },
  {
    type: 'lantern',
    sender: 'นักท่องเที่ยวจากเชียงใหม่',
    wish: 'ประทับใจเจดีย์กลางน้ำระยองมาก ขอให้ประเทศไทยสงบสุข ร่มเย็น',
    time: '10 นาทีที่แล้ว',
    options: { shape: 'cylinder', color: 'white', pattern: 'plain', ribbon: 'tassel', isLit: true },
    x: 35, y: 56, z: -50, speedY: 0.02, swaySpeed: 0.015, scale: 0.7, phase: 3.2, blessings: 12
  }
];

// ==========================================
// 1. Procedural Texture Generators
// ==========================================

// Traditional Thai Kanok (ลายกนกเปลวเพลิง) Pattern Texture
function createKanokPatternTexture(colorHex = '#B45309') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  ctx.strokeStyle = colorHex;
  ctx.fillStyle = colorHex;
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let x = 64; x <= 448; x += 128) {
    for (let y = 64; y <= 448; y += 128) {
      // Base spiral bud
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Flame tip 1: Upwards curling Kanok leaf
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.quadraticCurveTo(x + 24, y - 36, x + 6, y - 56);
      ctx.quadraticCurveTo(x - 14, y - 40, x - 4, y - 26);
      ctx.quadraticCurveTo(x - 20, y - 18, x, y - 10);
      ctx.stroke();

      // Flame tip 2: Downwards curling Kanok tail
      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.quadraticCurveTo(x - 24, y + 36, x - 6, y + 56);
      ctx.quadraticCurveTo(x + 14, y + 40, x + 4, y + 26);
      ctx.quadraticCurveTo(x + 20, y + 18, x, y + 10);
      ctx.stroke();

      // Side flairs (Left and Right graceful curves)
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.quadraticCurveTo(x - 36, y - 16, x - 52, y);
      ctx.quadraticCurveTo(x - 32, y + 18, x - 10, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + 10, y);
      ctx.quadraticCurveTo(x + 36, y + 16, x + 52, y);
      ctx.quadraticCurveTo(x + 32, y - 18, x + 10, y);
      ctx.stroke();

      // Small golden dots accents
      ctx.beginPath();
      ctx.arc(x + 18, y - 38, 2.5, 0, Math.PI * 2);
      ctx.arc(x - 18, y + 38, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Traditional Thai Prajamyam (ลายดอกประจำยาม 4 กลีบ) Pattern Texture
function createPrajamyamPatternTexture(colorHex = '#B45309') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  ctx.strokeStyle = colorHex;
  ctx.fillStyle = colorHex;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const drawPrajamyam = (cx, cy, size) => {
    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Cardinal Petals
    const angles = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
    angles.forEach(ang => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      // Diamond pointed petal
      ctx.beginPath();
      ctx.moveTo(0, size * 0.2);
      ctx.quadraticCurveTo(size * 0.35, size * 0.55, 0, size * 0.95);
      ctx.quadraticCurveTo(-size * 0.35, size * 0.55, 0, size * 0.2);
      ctx.stroke();

      // Inner vein
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.lineTo(0, size * 0.75);
      ctx.stroke();

      ctx.restore();
    });

    // 4 Diagonal corner flourishes
    const diagAngles = [Math.PI / 4, (Math.PI * 3) / 4, (Math.PI * 5) / 4, (Math.PI * 7) / 4];
    diagAngles.forEach(ang => {
      const px = cx + Math.cos(ang) * (size * 0.65);
      const py = cy + Math.sin(ang) * (size * 0.65);
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  for (let x = 64; x <= 448; x += 128) {
    for (let y = 64; y <= 448; y += 128) {
      drawPrajamyam(x, y, 42);
    }
  }

  // Connecting delicate lattice lines
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 6]);
  for (let x = 64; x <= 448; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 64; y <= 448; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Crescent Moon & Celestial Stars (ลายจันทร์เสี้ยว & นพเคราะห์) Pattern Texture
function createMoonStarsPatternTexture(colorHex = '#D97706') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  ctx.fillStyle = colorHex;
  ctx.strokeStyle = colorHex;

  const drawStar = (cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const drawMoon = (cx, cy, r) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0.25 * Math.PI, 1.75 * Math.PI, false);
    ctx.quadraticCurveTo(cx + r * 0.2, cy, cx + Math.cos(0.25 * Math.PI) * r, cy + Math.sin(0.25 * Math.PI) * r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  for (let x = 64; x <= 448; x += 128) {
    for (let y = 64; y <= 448; y += 128) {
      drawMoon(x, y, 22);
      drawStar(x + 36, y - 28, 6, 12, 4.5);
      drawStar(x - 32, y + 36, 4, 8, 3);
      drawStar(x + 45, y + 40, 4, 6, 2.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Natural Mulberry Saa Paper Texture (ผิวกระดาษสาธรรมชาติ)
function createPlainMulberryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(217, 119, 6, 0.12)';
  ctx.lineWidth = 1.2;
  // Subtle organic fibrous flecks
  for (let i = 0; i < 40; i++) {
    const sx = Math.random() * 256;
    const sy = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + (Math.random() - 0.5) * 30,
      sy + (Math.random() - 0.5) * 30,
      sx + (Math.random() - 0.5) * 40,
      sy + (Math.random() - 0.5) * 40,
      sx + (Math.random() - 0.5) * 50,
      sy + (Math.random() - 0.5) * 50
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ==========================================
// 2. 3D Procedural Model Builders (Krathong & Lantern)
// ==========================================

// ==========================================
// 2. 3D Procedural Model Builders (Krathong & Lantern)
// ==========================================

function createKrathong3D(options) {
  const group = new THREE.Group();
  group.name = 'krathongGroup';

  const { base = 'banana', flower = 'marigold', ornament = 'uba', candleColor = '#FCD34D', isLit = true } = options;

  const greenMaterial = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.5,
    metalness: 0.05,
  });
  const lightGreenMaterial = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.45,
    metalness: 0.05,
  });
  const lotusPinkMaterial = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.4,
    metalness: 0.05,
  });
  const lotusWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.05,
  });
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.7,
    roughness: 0.3,
  });

  // --- 1. Base Crafting ---
  if (base === 'banana') {
    // Cross-cut banana trunk core
    const trunkGeo = new THREE.CylinderGeometry(1.4, 1.45, 0.42, 24);
    const trunk = new THREE.Mesh(trunkGeo, greenMaterial);
    trunk.position.y = 0.21;
    group.add(trunk);

    // Tier 1: Outer pleated banana leaf petals (16 petals)
    const outerCount = 16;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2;
      const leafGeo = new THREE.ConeGeometry(0.36, 1.15, 4);
      leafGeo.rotateZ(Math.PI);
      const leaf = new THREE.Mesh(leafGeo, greenMaterial);
      leaf.scale.set(1.0, 0.38, 1.25);
      leaf.position.set(Math.cos(angle) * 1.42, 0.26, Math.sin(angle) * 1.42);
      leaf.rotation.y = -angle + Math.PI / 2;
      leaf.rotation.x = 0.6;
      group.add(leaf);

      // Gold pins fixing petals
      const pinGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const pin = new THREE.Mesh(pinGeo, goldMaterial);
      pin.position.set(Math.cos(angle) * 1.22, 0.38, Math.sin(angle) * 1.22);
      group.add(pin);
    }

    // Tier 2: Inner folded petals (14 petals, emerald green)
    const innerCount = 14;
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + 0.2;
      const leafGeo = new THREE.ConeGeometry(0.32, 0.95, 4);
      leafGeo.rotateZ(Math.PI);
      const leaf = new THREE.Mesh(leafGeo, lightGreenMaterial);
      leaf.scale.set(0.9, 0.35, 1.1);
      leaf.position.set(Math.cos(angle) * 1.15, 0.34, Math.sin(angle) * 1.15);
      leaf.rotation.y = -angle + Math.PI / 2;
      leaf.rotation.x = 0.45;
      group.add(leaf);
    }
  } else if (base === 'lotus') {
    // Royal Lotus Flower Base (3 tiers of blooming petals)
    const podGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.35, 24);
    const podMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.y = 0.18;
    group.add(pod);

    // Pod seed holes
    for (let h = 0; h < 8; h++) {
      const ha = (h / 8) * Math.PI * 2;
      const hGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8);
      const hMat = new THREE.MeshBasicMaterial({ color: 0x854d0e });
      const hole = new THREE.Mesh(hGeo, hMat);
      hole.position.set(Math.cos(ha) * 0.6, 0.36, Math.sin(ha) * 0.6);
      group.add(hole);
    }

    // Tier 1: Outer broad pink petals
    const outerCount = 14;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2;
      const petalGeo = new THREE.SphereGeometry(0.6, 12, 12);
      petalGeo.scale(0.85, 0.26, 1.45);
      const petal = new THREE.Mesh(petalGeo, lotusPinkMaterial);
      petal.position.set(Math.cos(angle) * 1.48, 0.24, Math.sin(angle) * 1.48);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.5;
      group.add(petal);
    }

    // Tier 2: Middle blush-pink petals
    const midCount = 12;
    for (let i = 0; i < midCount; i++) {
      const angle = (i / midCount) * Math.PI * 2 + 0.25;
      const petalGeo = new THREE.SphereGeometry(0.5, 12, 12);
      petalGeo.scale(0.75, 0.26, 1.2);
      const petal = new THREE.Mesh(petalGeo, lotusWhiteMaterial);
      petal.position.set(Math.cos(angle) * 1.2, 0.32, Math.sin(angle) * 1.2);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.35;
      group.add(petal);
    }

    // Tier 3: Inner white petals
    const inCount = 10;
    for (let i = 0; i < inCount; i++) {
      const angle = (i / inCount) * Math.PI * 2 + 0.15;
      const petalGeo = new THREE.SphereGeometry(0.4, 10, 10);
      petalGeo.scale(0.7, 0.24, 0.95);
      const petal = new THREE.Mesh(petalGeo, lotusWhiteMaterial);
      petal.position.set(Math.cos(angle) * 0.95, 0.38, Math.sin(angle) * 0.95);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.25;
      group.add(petal);
    }
  } else if (base === 'coconut') {
    // Carved Coconut Shell (กะลามะพร้าวแกะสลัก)
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.55,
      metalness: 0.1,
    });
    const shellGeo = new THREE.SphereGeometry(1.42, 24, 16, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.y = 0.9;
    group.add(shell);

    // Decorative carved golden rim ring
    const rimGeo = new THREE.TorusGeometry(1.41, 0.065, 8, 32);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, goldMaterial);
    rim.position.y = 0.88;
    group.add(rim);

    // Bed of fresh shredded banana leaves / jasmine buds inside shell
    const bedGeo = new THREE.CylinderGeometry(1.3, 1.2, 0.3, 20);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.y = 0.72;
    group.add(bed);

    // White floral border buds along inside rim
    const budMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    for (let b = 0; b < 16; b++) {
      const ba = (b / 16) * Math.PI * 2;
      const bGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const bud = new THREE.Mesh(bGeo, budMat);
      bud.position.set(Math.cos(ba) * 1.25, 0.85, Math.sin(ba) * 1.25);
      group.add(bud);
    }
  } else if (base === 'bread') {
    // Eco-friendly Bread Turtle Krathong (เต่าขนมปังรักษ์น้ำ อาหารปลา)
    const breadCrustMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.8,
      metalness: 0.05,
    });
    const breadTopMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.75,
      metalness: 0.05,
    });

    // Turtle Carapace
    const shellGeo = new THREE.SphereGeometry(1.35, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const turtleShell = new THREE.Mesh(shellGeo, breadTopMat);
    turtleShell.scale.set(1.0, 0.65, 1.15);
    turtleShell.position.y = 0.25;
    group.add(turtleShell);

    const baseDiskGeo = new THREE.CylinderGeometry(1.35, 1.4, 0.3, 20);
    const baseDisk = new THREE.Mesh(baseDiskGeo, breadCrustMat);
    baseDisk.position.y = 0.15;
    group.add(baseDisk);

    // Turtle Head
    const headGeo = new THREE.SphereGeometry(0.42, 12, 12);
    headGeo.scale(1.0, 0.7, 1.2);
    const head = new THREE.Mesh(headGeo, breadCrustMat);
    head.position.set(0, 0.28, 1.6);
    group.add(head);

    // Eyes
    for (let eyeSide of [-0.22, 0.22]) {
      const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(eyeSide, 0.38, 1.8);
      group.add(eye);
    }

    // 4 Flipper feet
    const flipperAngles = [0.75, 2.39, 3.89, 5.53];
    flipperAngles.forEach((fa, idx) => {
      const isFront = idx === 0 || idx === 3;
      const flipperGeo = new THREE.SphereGeometry(isFront ? 0.38 : 0.3, 10, 10);
      flipperGeo.scale(1.2, 0.45, 0.8);
      const flipper = new THREE.Mesh(flipperGeo, breadCrustMat);
      flipper.position.set(Math.cos(fa) * 1.45, 0.16, Math.sin(fa) * 1.45);
      flipper.rotation.y = -fa + Math.PI / 2;
      group.add(flipper);
    });

    // Tail
    const tailGeo = new THREE.ConeGeometry(0.18, 0.45, 6);
    tailGeo.rotateX(-Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, breadCrustMat);
    tail.position.set(0, 0.18, -1.55);
    group.add(tail);
  }

  // --- 2. Flowers Arrangement ---
  const flowerOffsetY = base === 'coconut' ? 0.92 : 0.42;

  if (flower === 'marigold') {
    // Golden Marigolds (ดาวเรืองทองมั่งคั่ง)
    const marigoldMat1 = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 });
    const marigoldMat2 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.6 });
    const positions = [
      [0.55, flowerOffsetY, 0.35],
      [-0.55, flowerOffsetY, 0.35],
      [0.0, flowerOffsetY + 0.05, -0.55],
      [0.48, flowerOffsetY, -0.32],
      [-0.48, flowerOffsetY, -0.32],
    ];
    positions.forEach((pos, idx) => {
      const fGeo = new THREE.SphereGeometry(0.35, 12, 12);
      fGeo.scale(1.0, 0.72, 1.0);
      const flowerMesh = new THREE.Mesh(fGeo, idx % 2 === 0 ? marigoldMat1 : marigoldMat2);
      flowerMesh.position.set(...pos);
      group.add(flowerMesh);

      // Flower petals floret details
      for (let p = 0; p < 6; p++) {
        const pa = (p / 6) * Math.PI * 2;
        const floretGeo = new THREE.SphereGeometry(0.12, 6, 6);
        const floret = new THREE.Mesh(floretGeo, marigoldMat1);
        floret.position.set(pos[0] + Math.cos(pa) * 0.22, pos[1] + 0.12, pos[2] + Math.sin(pa) * 0.22);
        group.add(floret);
      }
    });
  } else if (flower === 'dokrak') {
    // Globe Amaranth & Dok Rak (บานไม่รู้โรยม่วง & พวงมาลัยดอกรัก)
    const amaranthMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 });
    const dokrakMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const positions = [
      [0.55, flowerOffsetY, 0.3],
      [-0.55, flowerOffsetY, 0.3],
      [0.0, flowerOffsetY + 0.04, -0.55],
    ];
    positions.forEach(pos => {
      const aGeo = new THREE.SphereGeometry(0.36, 12, 12);
      aGeo.scale(1.0, 0.85, 1.0);
      const aMesh = new THREE.Mesh(aGeo, amaranthMat);
      aMesh.position.set(...pos);
      group.add(aMesh);
    });

    // Crown of white Dok Rak buds around flowers
    for (let r = 0; r < 12; r++) {
      const ra = (r / 12) * Math.PI * 2;
      const rGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const rMesh = new THREE.Mesh(rGeo, dokrakMat);
      rMesh.position.set(Math.cos(ra) * 0.88, flowerOffsetY, Math.sin(ra) * 0.88);
      group.add(rMesh);
    }
  } else if (flower === 'gardenia') {
    // Pure White Gardenia & Jasmine (พุดซ้อน & มะลิขาวบริสุทธิ์)
    const gardeniaMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
    const positions = [
      [0.52, flowerOffsetY, 0.3],
      [-0.52, flowerOffsetY, 0.3],
      [0.0, flowerOffsetY + 0.05, -0.5],
    ];
    positions.forEach(pos => {
      for (let layer = 0; layer < 2; layer++) {
        const pCount = 6;
        for (let j = 0; j < pCount; j++) {
          const petalGeo = new THREE.SphereGeometry(0.25 - layer * 0.06, 8, 8);
          petalGeo.scale(1.0, 0.25, 0.65);
          const pMesh = new THREE.Mesh(petalGeo, gardeniaMat);
          const pAngle = (j / pCount) * Math.PI * 2 + layer * 0.5;
          pMesh.position.set(
            pos[0] + Math.cos(pAngle) * (0.2 - layer * 0.05),
            pos[1] + layer * 0.08,
            pos[2] + Math.sin(pAngle) * (0.2 - layer * 0.05)
          );
          pMesh.rotation.y = pAngle;
          group.add(pMesh);
        }
      }
      const coreGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(pos[0], pos[1] + 0.12, pos[2]);
      group.add(core);
    });
  } else if (flower === 'lotusflower') {
    // Royal Miniature Lotus Blooms (บัวสัตตบงกชชมพู)
    const positions = [
      [0.55, flowerOffsetY, 0.3],
      [-0.55, flowerOffsetY, 0.3],
      [0.0, flowerOffsetY + 0.05, -0.5],
    ];
    positions.forEach(pos => {
      for (let j = 0; j < 8; j++) {
        const petalGeo = new THREE.SphereGeometry(0.3, 8, 8);
        petalGeo.scale(0.8, 0.3, 0.65);
        const pMesh = new THREE.Mesh(petalGeo, lotusPinkMaterial);
        const pAngle = (j / 8) * Math.PI * 2;
        pMesh.position.set(pos[0] + Math.cos(pAngle) * 0.22, pos[1], pos[2] + Math.sin(pAngle) * 0.22);
        pMesh.rotation.y = pAngle;
        pMesh.rotation.x = 0.35;
        group.add(pMesh);
      }
      const budCenterGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const budCenterMat = new THREE.MeshStandardMaterial({ color: 0xfef08a });
      const budCenter = new THREE.Mesh(budCenterGeo, budCenterMat);
      budCenter.position.set(pos[0], pos[1] + 0.1, pos[2]);
      group.add(budCenter);
    });
  }

  // --- 3. Thai Ornaments & Accessories ---
  if (ornament === 'uba') {
    // Authentic Thai Garland Tassel (อุบะมาลัยดอกรัก)
    const ubaGroup = new THREE.Group();
    const ubaStartY = base === 'coconut' ? 0.88 : 0.38;
    ubaGroup.position.set(1.15, ubaStartY, 0.85);

    const dokrakBeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const redPetalMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });

    // String of 6 Dok Rak crown flower beads hanging downward
    for (let b = 0; b < 6; b++) {
      const beadGeo = new THREE.SphereGeometry(0.075, 8, 8);
      const bead = new THREE.Mesh(beadGeo, dokrakBeadMat);
      bead.position.set(0, -b * 0.12, 0);
      ubaGroup.add(bead);
    }

    // Dok Kha / Rose Petal Cone at tassel tip
    const tasselTipGeo = new THREE.ConeGeometry(0.14, 0.32, 8);
    tasselTipGeo.rotateX(Math.PI);
    const tasselTip = new THREE.Mesh(tasselTipGeo, redPetalMat);
    tasselTip.position.set(0, -0.85, 0);
    ubaGroup.add(tasselTip);

    // Golden connector bead
    const goldBeadGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const goldBead = new THREE.Mesh(goldBeadGeo, goldMaterial);
    goldBead.position.set(0, -0.68, 0);
    ubaGroup.add(goldBead);

    group.add(ubaGroup);
  } else if (ornament === 'blessing_flag') {
    // Auspicious Blessing Flag & Parchment Tag (ป้ายอวยพร & ธงสามเหลี่ยมมงคล)
    const flagGroup = new THREE.Group();
    const flagStartY = base === 'coconut' ? 0.85 : 0.35;
    flagGroup.position.set(-0.75, flagStartY, 0.45);

    // Miniature bamboo flagpole
    const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.35, 6);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 0.65;
    flagGroup.add(pole);

    // Auspicious triangular paper flag (ธงสามเหลี่ยมสีแดงทอง)
    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0.55, 0.25);
    flagShape.lineTo(0, 0.5);
    flagShape.closePath();

    const flagGeo = new THREE.ShapeGeometry(flagShape);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0.02, 0.75, 0);
    flagGroup.add(flagMesh);

    // Gold flag finial
    const finialGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const finial = new THREE.Mesh(finialGeo, goldMaterial);
    finial.position.y = 1.35;
    flagGroup.add(finial);

    group.add(flagGroup);
  }

  // --- 4. Golden Incense Sticks (ธูปทอง 3 ดอก) ---
  const incenseOffsetY = base === 'coconut' ? 0.95 : 0.45;
  const incenseMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.4 });
  const emberMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  for (let k = -1; k <= 1; k++) {
    const incenseGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.45, 6);
    const incense = new THREE.Mesh(incenseGeo, incenseMat);
    incense.position.set(k * 0.1, incenseOffsetY + 0.65, 0.15);
    incense.rotation.z = k * 0.07;
    group.add(incense);

    if (isLit) {
      const emberGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(k * 0.1, incenseOffsetY + 1.38, 0.15);
      group.add(ember);
    }
  }

  // --- 5. Candle with Flame & Light ---
  const candleOffsetY = base === 'coconut' ? 0.95 : 0.45;
  const candleColorNum = parseInt(candleColor.replace('#', '0x'), 16) || 0xfcd34d;
  const candleMat = new THREE.MeshStandardMaterial({
    color: candleColorNum,
    roughness: 0.35,
  });
  const candleGeo = new THREE.CylinderGeometry(0.13, 0.13, 1.15, 16);
  const candle = new THREE.Mesh(candleGeo, candleMat);
  candle.position.set(0, candleOffsetY + 0.52, -0.05);
  group.add(candle);

  // Flame & PointLight
  if (isLit) {
    const flameGeo = new THREE.ConeGeometry(0.13, 0.45, 12);
    flameGeo.rotateX(Math.PI);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, candleOffsetY + 1.25, -0.05);
    flame.name = 'flameMesh';
    group.add(flame);

    const flameGlowGeo = new THREE.SphereGeometry(0.22, 10, 10);
    const flameGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.65,
    });
    const flameGlow = new THREE.Mesh(flameGlowGeo, flameGlowMat);
    flameGlow.position.set(0, candleOffsetY + 1.25, -0.05);
    group.add(flameGlow);

    const candleLight = new THREE.PointLight(0xffa500, 1.4, 8);
    candleLight.position.set(0, candleOffsetY + 1.35, -0.05);
    candleLight.name = 'pointLight';
    group.add(candleLight);
  }

  return group;
}

function createLantern3D(options) {
  const group = new THREE.Group();
  group.name = 'lanternGroup';

  const {
    shape = 'cylinder',
    color = 'white',
    pattern = 'kanok',
    ribbon = 'streamer',
    isLit = true,
  } = options;

  let baseColor = 0xfffdf2;
  let emissiveColor = 0xf59e0b;

  if (color === 'gold') {
    baseColor = 0xfde047;
    emissiveColor = 0xd97706;
  } else if (color === 'orange') {
    baseColor = 0xfb923c;
    emissiveColor = 0xc2410c;
  } else if (color === 'pink') {
    baseColor = 0xf472b6;
    emissiveColor = 0xbe185d;
  } else if (color === 'red') {
    baseColor = 0xef4444;
    emissiveColor = 0x991b1b;
  }

  // --- 1. Procedural Texture Assignment ---
  let patternTexture = null;
  const strokeColor = color === 'pink' ? '#831843' : color === 'red' ? '#7F1D1D' : '#78350F';

  if (pattern === 'kanok') {
    patternTexture = createKanokPatternTexture(strokeColor);
  } else if (pattern === 'prajamyam') {
    patternTexture = createPrajamyamPatternTexture(strokeColor);
  } else if (pattern === 'moon_stars') {
    patternTexture = createMoonStarsPatternTexture(strokeColor);
  } else if (pattern === 'plain') {
    patternTexture = createPlainMulberryTexture();
  }

  const paperMaterial = new THREE.MeshStandardMaterial({
    color: baseColor,
    emissive: emissiveColor,
    emissiveIntensity: isLit ? 0.65 : 0.08,
    roughness: 0.5,
    metalness: 0.05,
    map: patternTexture,
    side: THREE.DoubleSide,
  });

  // --- 2. Lantern Body Shapes ---
  if (shape === 'cylinder') {
    // Classic Lanna Cylindrical Lantern (โคมกระบอกล้านนา)
    const bodyGeo = new THREE.CylinderGeometry(1.05, 0.9, 2.7, 24, 1, true);
    const body = new THREE.Mesh(bodyGeo, paperMaterial);
    body.position.y = 1.35;
    group.add(body);

    const topCapGeo = new THREE.SphereGeometry(1.05, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.42);
    const topCap = new THREE.Mesh(topCapGeo, paperMaterial);
    topCap.position.y = 2.55;
    group.add(topCap);
  } else if (shape === 'lotus') {
    // Lotus Petal Silhouette Lantern (โคมทรงบัวล้านนา)
    const lotusPoints = [];
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      // Lotus vase curve: narrower at base, swelling at mid, elegant flared neck
      const radius = 0.9 + Math.sin(u * Math.PI) * 0.48;
      const height = u * 2.8;
      lotusPoints.push(new THREE.Vector2(radius, height));
    }
    const lotusGeo = new THREE.LatheGeometry(lotusPoints, 24);
    const lotusBody = new THREE.Mesh(lotusGeo, paperMaterial);
    group.add(lotusBody);

    const domeGeo = new THREE.SphereGeometry(0.92, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const dome = new THREE.Mesh(domeGeo, paperMaterial);
    dome.position.y = 2.75;
    group.add(dome);
  } else if (shape === 'diamond') {
    // Faceted Diamond / Octagonal Lantern (โคมทรงเพชรแปดเหลี่ยม)
    const octGeo = new THREE.CylinderGeometry(1.22, 0.92, 2.6, 8, 1, true);
    const octBody = new THREE.Mesh(octGeo, paperMaterial);
    octBody.position.y = 1.3;
    group.add(octBody);

    const octCapGeo = new THREE.ConeGeometry(1.24, 0.8, 8);
    const octCap = new THREE.Mesh(octCapGeo, paperMaterial);
    octCap.position.y = 3.0;
    group.add(octCap);
  }

  // --- 3. Bamboo Base Hoop & Crosswire ---
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
  const rimGeo = new THREE.TorusGeometry(0.9, 0.05, 8, 24);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 0.05;
  group.add(rim);

  const wireMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
  const wire1Geo = new THREE.CylinderGeometry(0.015, 0.015, 1.75, 4);
  wire1Geo.rotateZ(Math.PI / 2);
  const wire1 = new THREE.Mesh(wire1Geo, wireMat);
  wire1.position.y = 0.06;
  group.add(wire1);

  const wire2Geo = new THREE.CylinderGeometry(0.015, 0.015, 1.75, 4);
  wire2Geo.rotateX(Math.PI / 2);
  const wire2 = new THREE.Mesh(wire2Geo, wireMat);
  wire2.position.y = 0.06;
  group.add(wire2);

  // Central Fuel Cake (ก้อนเชื้อเพลิง)
  const fuelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12);
  const fuelMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
  const fuel = new THREE.Mesh(fuelGeo, fuelMat);
  fuel.position.y = 0.09;
  group.add(fuel);

  // --- 4. Burner Flame & Inner Light ---
  if (isLit) {
    const flameGeo = new THREE.ConeGeometry(0.15, 0.48, 10);
    flameGeo.rotateX(Math.PI);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.38;
    flame.name = 'flameMesh';
    group.add(flame);

    const innerLight = new THREE.PointLight(0xffa500, 1.8, 12);
    innerLight.position.y = 1.15;
    innerLight.name = 'pointLight';
    group.add(innerLight);
  }

  // --- 5. Ribbons & Tassels (หางริบบิ้นผ้าไหม / พู่ห้อยลูกปัด) ---
  if (ribbon === 'streamer') {
    // Twin flowing silk ribbons (หางริบบิ้นผ้าไหมคู่)
    const ribbonColor = color === 'red' ? 0xfde047 : 0xef4444;
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: ribbonColor,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    for (let side of [-0.35, 0.35]) {
      const ribbonGeo = new THREE.PlaneGeometry(0.16, 1.8, 1, 8);
      const streamerMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
      streamerMesh.position.set(side, -0.9, 0);
      streamerMesh.name = 'lanternStreamer';
      group.add(streamerMesh);
    }
  } else if (ribbon === 'tassel') {
    // Lanna Golden Bead & Silk Thread Tassel (พู่ห้อยลูกปัดทอง)
    const tasselGroup = new THREE.Group();
    tasselGroup.position.set(0, 0, 0);

    const beadMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 });
    const threadMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });

    // Hanging string with beads
    for (let b = 0; b < 3; b++) {
      const bGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const bead = new THREE.Mesh(bGeo, beadMat);
      bead.position.y = -0.15 - b * 0.16;
      tasselGroup.add(bead);
    }

    // Tassel cone & fringe
    const tConeGeo = new THREE.ConeGeometry(0.18, 0.8, 12);
    const tCone = new THREE.Mesh(tConeGeo, threadMat);
    tCone.position.y = -0.95;
    tasselGroup.add(tCone);

    tasselGroup.name = 'lanternTassel';
    group.add(tasselGroup);
  }

  return group;
}

// ==========================================
// 3. 3D Rayong Scenery & Environment
// ==========================================

class RayongScene3D {
  constructor(canvas) {
    this.canvas = canvas;

    // High performance renderer with capped pixel ratio (avoids mobile GPU slowdowns)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = false; // Disable heavy shadows for 60fps

    // Deep luminous twilight night sky
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1e45);
    this.scene.fog = new THREE.FogExp2(0x0e224e, 0.0035);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 1200);
    this.defaultCameraPos = new THREE.Vector3(25, 20, 68);
    this.defaultCameraTarget = new THREE.Vector3(-4, 9, -5);
    this.camera.position.copy(this.defaultCameraPos);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(this.defaultCameraTarget);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.minDistance = 22;
    this.controls.maxDistance = 145;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.entities = [];
    this.fireworks = [];
    this.bridgeStringBulbs = [];
    this.riverStringBulbs = [];
    this.fireflies = [];

    // Build modules
    this.buildLighting();
    this.buildSkyAndMoon();
    this.buildWater();
    this.buildChediKlangNam();
    this.buildThaiTrees();
    this.buildBridge();
    this.buildRiversideMarket();
    this.buildFerrisWheel();
    this.buildTempleFairZone();
    this.buildRiversideStringLights();
    this.buildLongTailBoat();

    window.addEventListener('resize', () => this.onResize());
    this.setupInteractions();

    initialSeedItems.forEach(item => this.spawnEntity(item));

    this.clock = new THREE.Clock();
    this.animate();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  buildLighting() {
    // Increased Ambient & Hemisphere lights for crystal clear visibility
    this.ambientLight = new THREE.AmbientLight(0x385488, 1.85);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0x567dae, 0x182e52, 1.6);
    this.scene.add(this.hemiLight);

    // Moonlight Directional Light
    this.moonLight = new THREE.DirectionalLight(0xa5caff, 1.35);
    this.moonLight.position.set(75, 55, -110);
    this.moonLight.target.position.set(-5, 0, 0);
    this.scene.add(this.moonLight);
    this.scene.add(this.moonLight.target);
  }

  buildSkyAndMoon() {
    const moonGroup = new THREE.Group();
    moonGroup.position.set(75, 55, -110);

    const moonGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    const haloGeo = new THREE.SphereGeometry(8.8, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffe885,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    moonGroup.add(haloMesh);

    this.scene.add(moonGroup);

    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.95);
      const r = 380 + Math.random() * 80;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      colors[i * 3] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 2] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    this.scene.add(starField);
  }

  buildWater() {
    this.waterWidth = 320;
    this.waterSegments = 100;
    this.waterGeo = new THREE.PlaneGeometry(this.waterWidth, this.waterWidth, this.waterSegments, this.waterSegments);
    this.waterGeo.rotateX(-Math.PI / 2);

    // Deep luminous blue river water with specular sheen reflecting moon & fair lights
    this.waterMat = new THREE.MeshStandardMaterial({
      color: 0x0f4273,
      emissive: 0x031830,
      roughness: 0.06,
      metalness: 0.82,
      flatShading: false,
    });

    this.waterMesh = new THREE.Mesh(this.waterGeo, this.waterMat);
    this.waterMesh.position.y = 0;
    this.scene.add(this.waterMesh);

    const posAttr = this.waterGeo.attributes.position;
    this.waterInitPos = new Float32Array(posAttr.array.length);
    this.waterInitPos.set(posAttr.array);
  }

  getWaterHeight(x, z, t) {
    return (
      Math.sin(x * 0.08 + t * 1.5) * 0.42 +
      Math.cos(z * 0.07 + t * 1.2) * 0.32 +
      Math.sin((x + z) * 0.05 + t * 0.8) * 0.22
    );
  }

  buildChediKlangNam() {
    const chediGroup = new THREE.Group();
    chediGroup.position.set(-18, 0, -10);

    const isletGeo = new THREE.CylinderGeometry(14, 18, 2.5, 24);
    const isletMat = new THREE.MeshStandardMaterial({ color: 0x0d2847, roughness: 0.9 });
    const islet = new THREE.Mesh(isletGeo, isletMat);
    islet.position.y = 0.6;
    chediGroup.add(islet);

    const whiteStuccoMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.75,
    });

    const step1Geo = new THREE.CylinderGeometry(8.5, 8.8, 0.9, 8);
    const step1 = new THREE.Mesh(step1Geo, whiteStuccoMat);
    step1.position.y = 2.2;
    chediGroup.add(step1);

    const step2Geo = new THREE.CylinderGeometry(7.2, 7.5, 0.85, 8);
    const step2 = new THREE.Mesh(step2Geo, whiteStuccoMat);
    step2.position.y = 3.0;
    chediGroup.add(step2);

    const step3Geo = new THREE.CylinderGeometry(6.0, 6.3, 0.8, 8);
    const step3 = new THREE.Mesh(step3Geo, whiteStuccoMat);
    step3.position.y = 3.8;
    chediGroup.add(step3);

    const lotusMoldingGeo = new THREE.CylinderGeometry(5.8, 5.2, 0.6, 24);
    const lotusMolding = new THREE.Mesh(lotusMoldingGeo, goldMat);
    lotusMolding.position.y = 4.4;
    chediGroup.add(lotusMolding);

    const bellPoints = [];
    for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      const radius = 4.6 * Math.cos(u * Math.PI * 0.42) + 0.6;
      const height = u * 7.5;
      bellPoints.push(new THREE.Vector2(radius, height));
    }
    const bellGeo = new THREE.LatheGeometry(bellPoints, 24);
    const bell = new THREE.Mesh(bellGeo, whiteStuccoMat);
    bell.position.y = 4.7;
    chediGroup.add(bell);

    const sashGeo = new THREE.TorusGeometry(3.6, 0.22, 8, 24);
    sashGeo.rotateX(Math.PI / 2);
    const sash = new THREE.Mesh(sashGeo, goldMat);
    sash.position.y = 8.5;
    chediGroup.add(sash);

    const throneGeo = new THREE.BoxGeometry(2.4, 1.2, 2.4);
    const throne = new THREE.Mesh(throneGeo, goldMat);
    throne.position.y = 12.8;
    chediGroup.add(throne);

    for (let r = 0; r < 9; r++) {
      const ringRadius = 1.05 - r * 0.08;
      const ringGeo = new THREE.CylinderGeometry(ringRadius * 0.9, ringRadius, 0.45, 16);
      const ring = new THREE.Mesh(ringGeo, r % 2 === 0 ? goldMat : whiteStuccoMat);
      ring.position.y = 13.6 + r * 0.52;
      chediGroup.add(ring);
    }

    const finialGeo = new THREE.ConeGeometry(0.38, 2.8, 16);
    const finial = new THREE.Mesh(finialGeo, goldMat);
    finial.position.y = 19.5;
    chediGroup.add(finial);

    const crownBallGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const crownBallMat = new THREE.MeshBasicMaterial({ color: 0xfff9c4 });
    const crownBall = new THREE.Mesh(crownBallGeo, crownBallMat);
    crownBall.position.y = 21.0;
    chediGroup.add(crownBall);

    // Architectural Spotlights on Chedi
    for (let angle of [0.4, 2.4]) {
      const spotX = Math.cos(angle) * 11;
      const spotZ = Math.sin(angle) * 11;

      const spotLight = new THREE.SpotLight(0xffe885, 4.5, 45, Math.PI / 5, 0.45, 1.2);
      spotLight.position.set(spotX, 1.8, spotZ);
      spotLight.target = bell;
      chediGroup.add(spotLight);

      const lampGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(spotX, 1.8, spotZ);
      chediGroup.add(lamp);
    }

    this.scene.add(chediGroup);
  }

  // 3D Thai Trees (ต้นไม้ใหญ่ 3D เช่น ต้นโพธิ์และต้นจามจุรี พร้อมไฟหิ่งห้อยหยดน้ำสีเหลืองทองระยิบระยับ)
  buildThaiTrees() {
    const treesGroup = new THREE.Group();
    this.fireflies = [];

    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x2e1d11,
      roughness: 0.9,
      metalness: 0.05,
    });

    const leafColors = [0x14532d, 0x15803d, 0x166534, 0x1e3a1e];
    const leafMats = leafColors.map(
      c =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.82,
          metalness: 0.05,
        })
    );

    const fireflyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    const createThaiTree = (x, y, z, scale = 1.0, rotY = 0) => {
      const tree = new THREE.Group();
      tree.position.set(x, y, z);
      tree.rotation.y = rotY;

      // 1. Organic Tapered Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.7 * scale, 1.15 * scale, 7.5 * scale, 10);
      const trunk = new THREE.Mesh(trunkGeo, barkMat);
      trunk.position.y = 3.75 * scale;
      trunk.rotation.z = 0.04;
      tree.add(trunk);

      // 2. Buttress Roots (รากพูพอนแผ่กว้างตามแบบไม้ใหญ่ริมน้ำ)
      for (let r = 0; r < 5; r++) {
        const ra = (r / 5) * Math.PI * 2;
        const rootGeo = new THREE.ConeGeometry(0.55 * scale, 2.8 * scale, 6);
        rootGeo.rotateZ(0.55);
        const root = new THREE.Mesh(rootGeo, barkMat);
        root.position.set(Math.cos(ra) * 0.95 * scale, 1.0 * scale, Math.sin(ra) * 0.95 * scale);
        root.rotation.y = ra;
        tree.add(root);
      }

      // 3. Spreading Main Branches (กิ่งก้านสาขาแผ่กว้าง)
      const branchAngles = [0.2, 1.4, 2.7, 4.1, 5.3];
      branchAngles.forEach((ba, bIdx) => {
        const bLen = (3.6 + (bIdx % 3) * 0.8) * scale;
        const branchGeo = new THREE.CylinderGeometry(0.25 * scale, 0.45 * scale, bLen, 7);
        branchGeo.rotateZ(1.0);
        const branch = new THREE.Mesh(branchGeo, barkMat);
        const by = (5.2 + bIdx * 0.4) * scale;
        branch.position.set(Math.cos(ba) * 1.4 * scale, by, Math.sin(ba) * 1.4 * scale);
        branch.rotation.y = ba;
        tree.add(branch);

        // Sub-branch
        const subLen = 2.2 * scale;
        const subGeo = new THREE.CylinderGeometry(0.15 * scale, 0.25 * scale, subLen, 6);
        subGeo.rotateZ(0.85);
        const sub = new THREE.Mesh(subGeo, barkMat);
        sub.position.set(Math.cos(ba) * 2.8 * scale, by + 1.2 * scale, Math.sin(ba) * 2.8 * scale);
        sub.rotation.y = ba + 0.5;
        tree.add(sub);
      });

      // 4. Layered Organic Foliage Clusters (พุ่มใบไม้แน่นหนาหลายเฉดสี)
      const canopyOffsets = [
        [0, 8.4 * scale, 0, 3.4 * scale],
        [2.6 * scale, 7.6 * scale, 1.2 * scale, 2.8 * scale],
        [-2.5 * scale, 7.9 * scale, -1.4 * scale, 2.9 * scale],
        [1.2 * scale, 8.9 * scale, -2.6 * scale, 2.6 * scale],
        [-1.4 * scale, 8.6 * scale, 2.4 * scale, 2.7 * scale],
        [3.6 * scale, 6.9 * scale, -1.8 * scale, 2.3 * scale],
        [-3.4 * scale, 7.1 * scale, 1.6 * scale, 2.4 * scale],
        [0.4 * scale, 9.9 * scale, 0.5 * scale, 2.5 * scale],
      ];

      canopyOffsets.forEach((c, idx) => {
        const fGeo = new THREE.SphereGeometry(c[3], 9, 8);
        fGeo.scale(1.15, 0.75, 1.1);
        const fMat = leafMats[idx % leafMats.length];
        const canopyMesh = new THREE.Mesh(fGeo, fMat);
        canopyMesh.position.set(c[0], c[1], c[2]);
        tree.add(canopyMesh);

        // 5. Firefly & Golden Teardrop Fairy Lights (ไฟหิ่งห้อยหยดน้ำสีเหลืองทองระยิบระยับ)
        for (let fl = 0; fl < 2; fl++) {
          const flGeo = new THREE.SphereGeometry(0.18 * scale, 6, 6);
          const flMesh = new THREE.Mesh(flGeo, fireflyMat);
          const fa = Math.random() * Math.PI * 2;
          const fr = c[3] * (0.8 + Math.random() * 0.25);
          flMesh.position.set(
            c[0] + Math.cos(fa) * fr,
            c[1] - (0.4 + Math.random() * 0.8) * scale,
            c[2] + Math.sin(fa) * fr
          );
          tree.add(flMesh);

          this.fireflies.push({
            mesh: flMesh,
            baseIntensity: 1.6,
            speed: 1.8 + Math.random() * 2.2,
            phase: Math.random() * Math.PI * 2,
          });
        }
      });

      return tree;
    };

    // Location Group A: Around Phra Chedi Klang Nam Islet (-18, 0, -10)
    const chediTrees = [
      [-28, 1.5, -18, 1.15, 0.4],
      [-8, 1.5, -16, 1.05, 1.2],
      [-27, 1.5, 0, 1.1, 2.3],
      [-7, 1.5, -2, 0.95, 3.8],
      [-19, 1.5, -24, 1.25, 4.9],
    ];
    chediTrees.forEach(pos => {
      treesGroup.add(createThaiTree(pos[0], pos[1], pos[2], pos[3], pos[4]));
    });

    // Location Group B: Right Riverbank (Behind Market & Bridge)
    const rightBankTrees = [
      [36, 2.2, -18, 1.35, 0.8],
      [38, 2.2, -2, 1.25, 1.9],
      [36, 2.2, 15, 1.3, 3.2],
      [34, 2.2, 32, 1.2, 4.5],
    ];
    rightBankTrees.forEach(pos => {
      treesGroup.add(createThaiTree(pos[0], pos[1], pos[2], pos[3], pos[4]));
    });

    // Location Group C: Left Riverbank (Behind Temple Fair & Ferris Wheel)
    const leftBankTrees = [
      [-42, 2.0, -16, 1.4, 0.5],
      [-44, 2.0, 6, 1.3, 1.7],
      [-38, 2.0, 26, 1.2, 3.1],
      [-46, 2.0, 36, 1.35, 4.8],
    ];
    leftBankTrees.forEach(pos => {
      treesGroup.add(createThaiTree(pos[0], pos[1], pos[2], pos[3], pos[4]));
    });

    this.scene.add(treesGroup);
  }

  // Remodeled 3D Bridge (สะพานทรงโค้งสวยงาม มีมิติ ราวสะพานและโคมไฟหัวเสาเป็นระเบียบ)
  buildBridge() {
    const bridgeGroup = new THREE.Group();

    // Elegant arched curve spanning from right bank across canal to Chedi islet
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(26, 3.2, 16),
      new THREE.Vector3(14, 3.8, 8),
      new THREE.Vector3(2, 4.3, 0),
      new THREE.Vector3(-10, 2.8, -6),
    ]);

    const bridgePoints = curve.getPoints(28);

    const deckMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.65 });
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    const railingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.5 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 });
    const lanternFrameMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.7 });
    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xffd060,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    // Extruded Deck
    const deckShape = new THREE.Shape();
    deckShape.moveTo(-1.4, -0.22);
    deckShape.lineTo(1.4, -0.22);
    deckShape.lineTo(1.4, 0.22);
    deckShape.lineTo(-1.4, 0.22);
    deckShape.closePath();

    const extrudeSettings = {
      steps: 36,
      bevelEnabled: false,
      extrudePath: curve,
    };
    const bridgeDeckGeo = new THREE.ExtrudeGeometry(deckShape, extrudeSettings);
    const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, deckMat);
    bridgeGroup.add(bridgeDeck);

    // Architectural Support Columns & Balusters
    this.bridgeStringBulbs = [];

    for (let i = 0; i < bridgePoints.length; i++) {
      const pt = bridgePoints[i];

      // Support Column Pairs into riverbed every 6 steps
      if (i > 1 && i < bridgePoints.length - 2 && i % 6 === 0) {
        for (let side of [-1.2, 1.2]) {
          const colGeo = new THREE.CylinderGeometry(0.32, 0.45, 5.5, 8);
          const col = new THREE.Mesh(colGeo, pillarMat);
          col.position.set(pt.x, 0.6, pt.z + side);
          bridgeGroup.add(col);
        }
      }

      // Orderly Baluster Railing Posts on both sides (เสาราวสะพานเป็นระเบียบ)
      if (i % 2 === 0) {
        for (let side of [-1.25, 1.25]) {
          const postGeo = new THREE.CylinderGeometry(0.06, 0.08, 1.2, 6);
          const post = new THREE.Mesh(postGeo, curbMat);
          post.position.set(pt.x, pt.y + 0.6, pt.z + side);
          bridgeGroup.add(post);

          // Classical Post-top Decorative Temple Lanterns (โคมไฟหัวเสาสะพาน) every 4 posts
          if (i % 4 === 0) {
            const lampFrameGeo = new THREE.BoxGeometry(0.35, 0.45, 0.35);
            const lampFrame = new THREE.Mesh(lampFrameGeo, lanternFrameMat);
            lampFrame.position.set(pt.x, pt.y + 1.25, pt.z + side);
            bridgeGroup.add(lampFrame);

            const lampGlassGeo = new THREE.SphereGeometry(0.18, 8, 8);
            const lampGlass = new THREE.Mesh(lampGlassGeo, lanternGlowMat);
            lampGlass.position.copy(lampFrame.position);
            bridgeGroup.add(lampGlass);
          }
        }
      }
    }

    // Top Handrails along both sides
    for (let side of [-1.25, 1.25]) {
      const railCurve = new THREE.CatmullRomCurve3(
        bridgePoints.map(p => new THREE.Vector3(p.x, p.y + 1.15, p.z + side))
      );
      const railGeo = new THREE.TubeGeometry(railCurve, 28, 0.05, 6, false);
      const rail = new THREE.Mesh(railGeo, railingMat);
      bridgeGroup.add(rail);

      // Drooping String Lights along handrail with warm golden glow
      const pts = railCurve.getPoints(24);
      for (let b = 1; b < pts.length; b++) {
        const pt = pts[b];
        const bulbGeo = new THREE.SphereGeometry(0.16, 6, 6);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffd54f,
          emissiveIntensity: 1.6,
          roughness: 0.2,
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(pt.x, pt.y - (b % 3 === 1 ? 0.28 : 0.12), pt.z);
        bridgeGroup.add(bulb);
        this.bridgeStringBulbs.push({ mesh: bulb, index: b });
      }
    }

    // Consolidated Bridge Lighting (Only 2 efficient point lights for the whole bridge)
    const bridgeCenterLight = new THREE.PointLight(0xffa500, 2.2, 22);
    bridgeCenterLight.position.set(4, 5.0, 0);
    bridgeGroup.add(bridgeCenterLight);

    const bridgeIsletLight = new THREE.PointLight(0xffb703, 1.8, 16);
    bridgeIsletLight.position.set(-6, 3.6, -4);
    bridgeGroup.add(bridgeIsletLight);

    this.scene.add(bridgeGroup);
  }

  buildRiversideMarket() {
    const marketGroup = new THREE.Group();
    marketGroup.position.set(28, 0, 18);

    const dockGeo = new THREE.BoxGeometry(22, 1.2, 35);
    const dockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const dock = new THREE.Mesh(dockGeo, dockMat);
    dock.position.set(10, 2.2, 0);
    marketGroup.add(dock);

    const awningColors = [0xb91c1c, 0x1e40af, 0xd97706];
    for (let s = 0; s < 3; s++) {
      const stallGroup = new THREE.Group();
      stallGroup.position.set(5, 2.8, -10 + s * 10);

      const counterGeo = new THREE.BoxGeometry(4.5, 1.4, 6);
      const counterMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.y = 0.7;
      stallGroup.add(counter);

      const awningGeo = new THREE.ConeGeometry(3.6, 1.8, 4);
      awningGeo.rotateY(Math.PI / 4);
      const awningMat = new THREE.MeshStandardMaterial({
        color: awningColors[s],
        roughness: 0.5,
      });
      const awning = new THREE.Mesh(awningGeo, awningMat);
      awning.position.y = 3.2;
      stallGroup.add(awning);

      const bulbGeo = new THREE.SphereGeometry(0.2, 6, 6);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffedd5,
        emissiveIntensity: 1.5,
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.y = 2.4;
      stallGroup.add(bulb);

      marketGroup.add(stallGroup);
    }

    // Consolidated Market Lanterns (Using high emissive shaders)
    const festivalColors = [0xef4444, 0xf59e0b, 0x06b6d4, 0xec4899, 0x10b981, 0xf97316];
    for (let f = 0; f < festivalColors.length; f++) {
      const lanternGeo = new THREE.SphereGeometry(0.35, 10, 10);
      lanternGeo.scale(1, 1.3, 1);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: festivalColors[f],
        emissive: festivalColors[f],
        emissiveIntensity: 1.5,
        roughness: 0.3,
      });
      const fLantern = new THREE.Mesh(lanternGeo, lanternMat);
      fLantern.position.set(1.5, 5.5 + Math.sin(f * 0.9) * 0.5, -14 + f * 5.5);
      marketGroup.add(fLantern);
    }

    // 1 Key PointLight for the whole right market
    const marketLight = new THREE.PointLight(0xffa500, 2.4, 22);
    marketLight.position.set(4, 4.0, 0);
    marketGroup.add(marketLight);

    this.scene.add(marketGroup);
  }

  // Riverside String Fairy Lights (Optimized with high-efficiency Emissive Bulbs)
  buildRiversideStringLights() {
    this.riverStringBulbs = [];
    const colors = [0xfcd34d, 0xef4444, 0x06b6d4, 0x10b981, 0xec4899, 0xf59e0b];
    for (let i = 0; i < 20; i++) {
      const z = -12 + i * 2.2;
      const bulbGeo = new THREE.SphereGeometry(0.2, 6, 6);
      const col = colors[i % colors.length];
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: col,
        emissiveIntensity: 1.6,
        roughness: 0.2,
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(27.8, 3.6 + Math.sin(i * 0.8) * 0.3, z);
      this.scene.add(bulb);
      this.riverStringBulbs.push({ mesh: bulb, index: i, defaultEmissive: col });
    }

    // 2 Consolidated boardwalk lights instead of multiple redundant lights
    const dockLight1 = new THREE.PointLight(0xf59e0b, 1.8, 20);
    dockLight1.position.set(27.0, 4.5, -4);
    this.scene.add(dockLight1);

    const dockLight2 = new THREE.PointLight(0xf59e0b, 1.8, 20);
    dockLight2.position.set(27.0, 4.5, 14);
    this.scene.add(dockLight2);
  }

  // 3D Long-tail Boat (เรือหางยาวประดับไฟลอยลำแล่นผ่านเป็นระยะ)
  buildLongTailBoat() {
    const boatGroup = new THREE.Group();

    const hullMat = new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.7 });
    const hullGeo = new THREE.CylinderGeometry(0.7, 0.45, 6.5, 10);
    hullGeo.scale(1.2, 0.5, 1);
    hullGeo.rotateZ(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 0.2;
    boatGroup.add(hull);

    const prowGeo = new THREE.ConeGeometry(0.5, 2.2, 8);
    prowGeo.rotateZ(-Math.PI / 3);
    const prow = new THREE.Mesh(prowGeo, hullMat);
    prow.position.set(3.8, 0.8, 0);
    boatGroup.add(prow);

    const garlandGeo = new THREE.TorusGeometry(0.45, 0.12, 8, 14);
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xf59e0b, emissiveIntensity: 0.8 });
    const garland = new THREE.Mesh(garlandGeo, garlandMat);
    garland.position.set(4.2, 0.9, 0);
    boatGroup.add(garland);

    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 });
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 6);
    shaftGeo.rotateZ(Math.PI / 4);
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(-4.2, -0.4, 0);
    boatGroup.add(shaft);

    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const canopyGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.2, 10, 1, true, 0, Math.PI);
    canopyGeo.rotateZ(Math.PI / 2);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(-0.5, 1.4, 0);
    boatGroup.add(canopy);

    for (let i = -1.4; i <= 1.4; i += 0.5) {
      for (let side of [-0.85, 0.85]) {
        const bGeo = new THREE.SphereGeometry(0.12, 6, 6);
        const bMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xfcd34d,
          emissiveIntensity: 1.6,
        });
        const bulb = new THREE.Mesh(bGeo, bMat);
        bulb.position.set(i - 0.5, 1.35, side);
        boatGroup.add(bulb);
      }
    }

    const boatLight = new THREE.PointLight(0xffa500, 1.6, 12);
    boatLight.position.set(0, 1.2, 0);
    boatGroup.add(boatLight);

    boatGroup.scale.set(0.9, 0.9, 0.9);
    this.longTailBoat = boatGroup;

    this.boatPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, 0, -28),
      new THREE.Vector3(-25, 0, -22),
      new THREE.Vector3(0, 0, -12),
      new THREE.Vector3(18, 0, -2),
      new THREE.Vector3(38, 0, 12),
      new THREE.Vector3(20, 0, 28),
      new THREE.Vector3(-10, 0, 20),
      new THREE.Vector3(-30, 0, 0),
    ], true);

    this.scene.add(boatGroup);
  }

  buildFerrisWheel() {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(-36, 0, 4);

    const baseGeo = new THREE.BoxGeometry(22, 1.4, 18);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.7;
    wheelGroup.add(baseMesh);

    const legMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.3, roughness: 0.5 });
    const strutMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.4, roughness: 0.4 });
    const hubY = 16.5;

    for (let side of [-2.0, 2.0]) {
      const leg1Geo = new THREE.CylinderGeometry(0.35, 0.5, 17.5, 8);
      const leg1 = new THREE.Mesh(leg1Geo, legMat);
      leg1.position.set(-4.5, hubY / 2 + 0.7, side);
      leg1.rotation.z = -0.27;
      wheelGroup.add(leg1);

      const leg2Geo = new THREE.CylinderGeometry(0.35, 0.5, 17.5, 8);
      const leg2 = new THREE.Mesh(leg2Geo, legMat);
      leg2.position.set(4.5, hubY / 2 + 0.7, side);
      leg2.rotation.z = 0.27;
      wheelGroup.add(leg2);

      const braceGeo = new THREE.CylinderGeometry(0.2, 0.2, 6.2, 8);
      braceGeo.rotateZ(Math.PI / 2);
      const brace = new THREE.Mesh(braceGeo, strutMat);
      brace.position.set(0, 6.5, side);
      wheelGroup.add(brace);
    }

    const axleGeo = new THREE.CylinderGeometry(0.65, 0.65, 4.8, 14);
    axleGeo.rotateX(Math.PI / 2);
    const axleMat = new THREE.MeshStandardMaterial({ color: 0xfde047, metalness: 0.8, roughness: 0.2 });
    const axle = new THREE.Mesh(axleGeo, axleMat);
    axle.position.y = hubY;
    wheelGroup.add(axle);

    this.ferrisWheel = new THREE.Group();
    this.ferrisWheel.position.set(0, hubY, 0);

    const wheelRadius = 12.0;
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });

    for (let rz of [-1.5, 1.5]) {
      const rimGeo = new THREE.TorusGeometry(wheelRadius, 0.22, 8, 32);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.z = rz;
      this.ferrisWheel.add(rim);
    }

    const spokeCount = 12;
    this.ferrisGondolas = [];
    this.ferrisBulbs = [];

    const gondolaColors = [0xef4444, 0xf59e0b, 0x10b981, 0x06b6d4, 0xec4899, 0xa855f7];

    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;

      for (let rz of [-1.5, 1.5]) {
        const spokeGeo = new THREE.CylinderGeometry(0.08, 0.08, wheelRadius, 4);
        const spoke = new THREE.Mesh(spokeGeo, strutMat);
        spoke.position.set(Math.cos(angle) * (wheelRadius / 2), Math.sin(angle) * (wheelRadius / 2), rz);
        spoke.rotation.z = angle - Math.PI / 2;
        this.ferrisWheel.add(spoke);
      }

      const crossGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 4);
      crossGeo.rotateX(Math.PI / 2);
      const crossMesh = new THREE.Mesh(crossGeo, strutMat);
      crossMesh.position.set(Math.cos(angle) * wheelRadius, Math.sin(angle) * wheelRadius, 0);
      this.ferrisWheel.add(crossMesh);

      const gondolaPivot = new THREE.Group();
      gondolaPivot.position.set(Math.cos(angle) * wheelRadius, Math.sin(angle) * wheelRadius, 0);

      const cabinGroup = new THREE.Group();
      cabinGroup.position.y = -1.2;

      const armMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });
      for (let side of [-1.2, 1.2]) {
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.3, 4);
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.position.set(0, 0.6, side);
        cabinGroup.add(arm);
      }

      const cColor = gondolaColors[i % gondolaColors.length];
      const cabinMat = new THREE.MeshStandardMaterial({
        color: cColor,
        emissive: cColor,
        emissiveIntensity: 0.4,
        roughness: 0.4,
      });
      const cabinGeo = new THREE.CylinderGeometry(1.0, 0.85, 1.1, 10, 1, false);
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.y = 0;
      cabinGroup.add(cabin);

      const roofMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });
      const roofGeo = new THREE.ConeGeometry(1.2, 0.6, 10);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 0.85;
      cabinGroup.add(roof);

      gondolaPivot.add(cabinGroup);
      this.ferrisWheel.add(gondolaPivot);

      this.ferrisGondolas.push({
        pivot: gondolaPivot,
        cabin: cabinGroup,
      });

      // Neon LED Bulbs along outer rim (Optimized)
      for (let b = 0; b < 2; b++) {
        const subAngle = angle + (b / 2) * (Math.PI * 2 / spokeCount);
        const bulbGeo = new THREE.SphereGeometry(0.25, 6, 6);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xf59e0b,
          emissiveIntensity: 1.4,
          roughness: 0.2,
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(Math.cos(subAngle) * wheelRadius, Math.sin(subAngle) * wheelRadius, 1.6);
        this.ferrisWheel.add(bulb);
        this.ferrisBulbs.push({ mesh: bulb, index: this.ferrisBulbs.length });
      }
    }

    const starCenterGeo = new THREE.SphereGeometry(1.2, 12, 12);
    const starCenterMat = new THREE.MeshBasicMaterial({ color: 0xffe885 });
    const starCenter = new THREE.Mesh(starCenterGeo, starCenterMat);
    starCenter.position.z = 1.8;
    this.ferrisWheel.add(starCenter);

    // 1 Key PointLight for the whole wheel
    this.ferrisLight = new THREE.PointLight(0xf59e0b, 3.2, 32);
    this.ferrisLight.position.set(0, hubY, 4.0);
    wheelGroup.add(this.ferrisLight);

    wheelGroup.add(this.ferrisWheel);
    this.scene.add(wheelGroup);
  }

  buildTempleFairZone() {
    const fairGroup = new THREE.Group();

    const deckGeo = new THREE.BoxGeometry(28, 1.4, 48);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(-36, 1.8, 4);
    fairGroup.add(deck);

    const curbGeo = new THREE.BoxGeometry(1.2, 1.8, 48);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(-22.2, 2.0, 4);
    fairGroup.add(curb);

    const archGroup = new THREE.Group();
    archGroup.position.set(-23.5, 2.2, 22);

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4, metalness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
    for (let pz of [-3.8, 3.8]) {
      const pillarGeo = new THREE.BoxGeometry(1.0, 6.5, 1.0);
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(0, 3.2, pz);
      archGroup.add(pillar);

      const capGeo = new THREE.CylinderGeometry(0.8, 0.45, 0.6, 8);
      const cap = new THREE.Mesh(capGeo, goldMat);
      cap.position.set(0, 6.6, pz);
      archGroup.add(cap);

      const fLampGeo = new THREE.SphereGeometry(0.45, 8, 8);
      const fLampMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.6 });
      const fLamp = new THREE.Mesh(fLampGeo, fLampMat);
      fLamp.position.set(0.6, 5.2, pz);
      archGroup.add(fLamp);
    }

    const beamGeo = new THREE.BoxGeometry(1.2, 0.8, 9.2);
    const beam = new THREE.Mesh(beamGeo, goldMat);
    beam.position.set(0, 6.8, 0);
    archGroup.add(beam);

    const roofGableGeo = new THREE.ConeGeometry(5.2, 2.4, 4);
    roofGableGeo.rotateY(Math.PI / 4);
    const roofGable = new THREE.Mesh(roofGableGeo, pillarMat);
    roofGable.position.set(0, 8.2, 0);
    roofGable.scale.set(0.25, 1, 1.6);
    archGroup.add(roofGable);

    const signGeo = new THREE.BoxGeometry(0.4, 1.1, 6.2);
    const signMat = new THREE.MeshStandardMaterial({
      color: 0x050c22,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0.5, 5.6, 0);
    archGroup.add(sign);

    // 1 Key PointLight for Archway
    const archLight = new THREE.PointLight(0x06b6d4, 2.4, 16);
    archLight.position.set(1.0, 6.5, 0);
    archGroup.add(archLight);

    fairGroup.add(archGroup);

    // Balloon Dart Game Booth
    const balloonBooth = new THREE.Group();
    balloonBooth.position.set(-27, 2.5, 13);

    const bCanopyGeo = new THREE.ConeGeometry(3.5, 1.6, 4);
    bCanopyGeo.rotateY(Math.PI / 4);
    const bCanopyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const bCanopy = new THREE.Mesh(bCanopyGeo, bCanopyMat);
    bCanopy.position.set(0, 3.8, 0);
    balloonBooth.add(bCanopy);

    const bCounterGeo = new THREE.BoxGeometry(1.2, 1.4, 4.5);
    const bCounterMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const bCounter = new THREE.Mesh(bCounterGeo, bCounterMat);
    bCounter.position.set(1.5, 0.7, 0);
    balloonBooth.add(bCounter);

    const boardGeo = new THREE.BoxGeometry(0.3, 2.6, 4.2);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(-1.2, 2.0, 0);
    balloonBooth.add(board);

    const bColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0xec4899, 0xa855f7];
    for (let bx = 0; bx < 4; bx++) {
      for (let by = 0; by < 3; by++) {
        const balGeo = new THREE.SphereGeometry(0.22, 6, 6);
        const col = bColors[(bx + by * 2) % bColors.length];
        const balMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.6 });
        const bal = new THREE.Mesh(balGeo, balMat);
        bal.position.set(-1.0, 1.2 + by * 0.7, -1.4 + bx * 0.9);
        balloonBooth.add(bal);
      }
    }
    fairGroup.add(balloonBooth);

    // Carnival Cork Gun Shooting Range
    const gunBooth = new THREE.Group();
    gunBooth.position.set(-27, 2.5, -6);

    const gCanopyGeo = new THREE.ConeGeometry(3.5, 1.6, 4);
    gCanopyGeo.rotateY(Math.PI / 4);
    const gCanopyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const gCanopy = new THREE.Mesh(gCanopyGeo, gCanopyMat);
    gCanopy.position.set(0, 3.8, 0);
    gunBooth.add(gCanopy);

    const gCounterGeo = new THREE.BoxGeometry(1.2, 1.4, 4.5);
    const gCounter = new THREE.Mesh(gCounterGeo, bCounterMat);
    gCounter.position.set(1.5, 0.7, 0);
    gunBooth.add(gCounter);

    const shelfGeo = new THREE.BoxGeometry(0.5, 0.1, 4.0);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    for (let sh = 0; sh < 3; sh++) {
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.set(-1.0, 1.2 + sh * 0.6, 0);
      gunBooth.add(shelf);

      for (let tg = 0; tg < 5; tg++) {
        const canGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.28, 6);
        const canMat = new THREE.MeshStandardMaterial({ color: tg % 2 === 0 ? 0xdc2626 : 0xfde047 });
        const can = new THREE.Mesh(canGeo, canMat);
        can.position.set(-1.0, 1.4 + sh * 0.6, -1.4 + tg * 0.7);
        gunBooth.add(can);
      }
    }
    fairGroup.add(gunBooth);

    // Bunting Flags along Embankment
    const poleCount = 8;
    const flagPoles = [];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const flagColors = [0xef4444, 0xf59e0b, 0x10b981, 0x06b6d4, 0xec4899, 0x3b82f6];

    this.buntingFlags = [];

    for (let p = 0; p < poleCount; p++) {
      const pZ = -16 + p * 5.8;
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7.5, 6);
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(-22.2, 4.8, pZ);
      fairGroup.add(pole);

      const pTopGeo = new THREE.SphereGeometry(0.25, 6, 6);
      const pTop = new THREE.Mesh(pTopGeo, goldMat);
      pTop.position.set(-22.2, 8.6, pZ);
      fairGroup.add(pTop);

      flagPoles.push(new THREE.Vector3(-22.2, 8.0, pZ));
    }

    for (let s = 0; s < flagPoles.length - 1; s++) {
      const p1 = flagPoles[s];
      const p2 = flagPoles[s + 1];

      const stringCurve = new THREE.CatmullRomCurve3([
        p1,
        new THREE.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 0.7, (p1.z + p2.z) / 2),
        p2,
      ]);
      const stringGeo = new THREE.TubeGeometry(stringCurve, 8, 0.02, 3, false);
      const stringMesh = new THREE.Mesh(stringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      fairGroup.add(stringMesh);

      for (let f = 1; f <= 4; f++) {
        const u = f / 5;
        const pt = stringCurve.getPoint(u);

        const flagGeo = new THREE.ConeGeometry(0.35, 0.7, 3);
        flagGeo.rotateZ(Math.PI);
        const col = flagColors[(s * 5 + f) % flagColors.length];
        const flagMat = new THREE.MeshStandardMaterial({
          color: col,
          roughness: 0.5,
          side: THREE.DoubleSide,
        });
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        flagMesh.position.copy(pt);
        flagMesh.position.y -= 0.35;
        fairGroup.add(flagMesh);

        this.buntingFlags.push({ mesh: flagMesh, phase: s * 1.2 + f * 0.8 });
      }
    }

    this.scene.add(fairGroup);
  }

  // Interactive Lighting Ambience Mode Switch
  setTheme(theme) {
    state.theme = theme;
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    if (theme === 'fair') {
      themeIcon.textContent = '🎪';
      themeLabel.textContent = 'โหมดงานวัด';
      this.scene.background.setHex(0x0c1e45);
      this.scene.fog.color.setHex(0x0e224e);
      this.ambientLight.color.setHex(0x385488);
      this.ambientLight.intensity = 1.85;
      this.hemiLight.color.setHex(0x567dae);
      this.hemiLight.intensity = 1.6;
      this.moonLight.color.setHex(0xa5caff);
      this.moonLight.intensity = 1.35;
      this.waterMat.color.setHex(0x0f4273);

      if (this.riverStringBulbs) {
        this.riverStringBulbs.forEach(b => {
          b.mesh.material.emissive.setHex(b.defaultEmissive);
          b.mesh.material.emissiveIntensity = 1.6;
        });
      }
      if (this.bridgeStringBulbs) {
        this.bridgeStringBulbs.forEach(b => {
          b.mesh.material.emissive.setHex(0xffd54f);
          b.mesh.material.emissiveIntensity = 1.6;
        });
      }
      if (this.ferrisLight) this.ferrisLight.intensity = 3.2;
    } else {
      // Romantic Moonlight Mode
      themeIcon.textContent = '🌕';
      themeLabel.textContent = 'โหมดแสงจันทร์';
      this.scene.background.setHex(0x091838);
      this.scene.fog.color.setHex(0x0b1c3e);
      this.ambientLight.color.setHex(0x284270);
      this.ambientLight.intensity = 1.45;
      this.hemiLight.color.setHex(0x3e5e8e);
      this.hemiLight.intensity = 1.4;
      this.moonLight.color.setHex(0xd0e4ff);
      this.moonLight.intensity = 1.8;
      this.waterMat.color.setHex(0x0d3862);

      if (this.riverStringBulbs) {
        this.riverStringBulbs.forEach(b => {
          b.mesh.material.emissive.setHex(0xfff0b3);
          b.mesh.material.emissiveIntensity = 1.2;
        });
      }
      if (this.bridgeStringBulbs) {
        this.bridgeStringBulbs.forEach(b => {
          b.mesh.material.emissive.setHex(0xfff5cc);
          b.mesh.material.emissiveIntensity = 1.3;
        });
      }
      if (this.ferrisLight) this.ferrisLight.intensity = 1.8;
    }
  }

  // Grand Fireworks Finale Barrage (พลุชุดใหญ่ 10 ลูก)
  launchGrandBarrage() {
    const barragePositions = [
      { x: -35, y: 55, z: -25, delay: 0 },
      { x: 30, y: 58, z: -20, delay: 200 },
      { x: -10, y: 65, z: -40, delay: 450 },
      { x: 15, y: 52, z: -30, delay: 700 },
      { x: -25, y: 62, z: -15, delay: 950 },
      { x: 5, y: 68, z: -35, delay: 1200 },
      { x: -42, y: 50, z: -10, delay: 1450 },
      { x: 38, y: 60, z: -15, delay: 1700 },
      { x: -5, y: 72, z: -25, delay: 1950 },
      { x: 20, y: 65, z: -45, delay: 2200 },
    ];

    barragePositions.forEach(b => {
      setTimeout(() => {
        this.launchFirework(b.x, b.y, b.z);
      }, b.delay);
    });
  }

  setupInteractions() {
    this.canvas.addEventListener('click', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const clickableMeshes = [];
      this.entities.forEach(entity => {
        entity.group.traverse(child => {
          if (child.isMesh) {
            child.userData.entityParent = entity;
            clickableMeshes.push(child);
          }
        });
      });

      const intersects = this.raycaster.intersectObjects(clickableMeshes);
      if (intersects.length > 0) {
        const clickedEntity = intersects[0].object.userData.entityParent;
        if (clickedEntity) {
          openWishInspector(clickedEntity);
          return;
        }
      }

      if (e.clientY < window.innerHeight * 0.65) {
        const rayPoint = this.raycaster.ray.at(120, new THREE.Vector3());
        this.launchFirework(rayPoint.x, Math.max(30, rayPoint.y), rayPoint.z);
      }
    });
  }

  spawnEntity(data) {
    let group = null;
    if (data.type === 'krathong') {
      group = createKrathong3D(data.options);
    } else {
      group = createLantern3D(data.options);
    }

    const scale = data.scale || 1.0;
    group.scale.set(scale, scale, scale);
    group.position.set(data.x, data.y || 0, data.z);
    this.scene.add(group);

    const entityObj = {
      id: Math.random().toString(36).substring(2, 9),
      group: group,
      type: data.type,
      sender: data.sender || 'ผู้มีจิตศรัทธา',
      wish: data.wish || 'ขอขมาพระแม่คงคา บันดาลชีวิตร่มเย็น',
      time: data.time || 'เมื่อสักครู่',
      blessings: data.blessings || 1,
      x: data.x,
      y: data.y || 0,
      z: data.z,
      speed: data.speed || 0.04,
      speedY: data.speedY || 0.025,
      swaySpeed: data.swaySpeed || 0.02,
      phase: data.phase || Math.random() * Math.PI * 2,
    };

    this.entities.push(entityObj);
    return entityObj;
  }

  launchFirework(targetX = null, targetY = null, targetZ = null) {
    const tx = targetX !== null ? targetX : (Math.random() - 0.5) * 80;
    const ty = targetY !== null ? targetY : 35 + Math.random() * 25;
    const tz = targetZ !== null ? targetZ : -20 + (Math.random() - 0.5) * 50;

    const firework = new Firework3D(this.scene, tx, ty, tz);
    this.fireworks.push(firework);
    soundEngine.playFireworkLaunch();
  }

  resetCamera() {
    this.camera.position.copy(this.defaultCameraPos);
    this.controls.target.copy(this.defaultCameraTarget);
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = this.clock.getElapsedTime();

    // 1. Water Surface Waves
    if (this.waterGeo && this.waterInitPos) {
      const pos = this.waterGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = i * 3;
        const x = this.waterInitPos[u];
        const z = this.waterInitPos[u + 2];
        pos.array[u + 1] = this.getWaterHeight(x, z, t);
      }
      pos.needsUpdate = true;
      this.waterGeo.computeVertexNormals();
    }

    // 2. Animate Entities (3D Krathongs & 3D Lanterns)
    for (let i = 0; i < this.entities.length; i++) {
      const e = this.entities[i];

      if (e.type === 'krathong') {
        e.x -= e.speed;
        e.z -= e.speed * 0.4;
        if (e.x < -40 || e.z < -30) {
          e.x = 32;
          e.z = 24;
        }

        const waterH = this.getWaterHeight(e.x, e.z, t);
        e.group.position.set(e.x, waterH - 0.05, e.z);

        e.group.rotation.z = Math.sin(t * 2.2 + e.phase) * 0.08;
        e.group.rotation.x = Math.cos(t * 1.8 + e.phase) * 0.06;

        const light = e.group.getObjectByName('pointLight');
        if (light) {
          light.intensity = 1.4 + Math.sin(t * 15 + e.phase) * 0.4;
        }
      } else {
        e.y += e.speedY;
        if (e.y > 75) {
          e.y = 8;
          e.x = (Math.random() - 0.5) * 60;
          e.z = (Math.random() - 0.5) * 40;
        }

        const swayX = Math.sin(t * 1.4 + e.phase) * 0.6;
        const swayZ = Math.cos(t * 1.2 + e.phase) * 0.4;

        e.group.position.set(e.x + swayX, e.y, e.z + swayZ);
        e.group.rotation.z = Math.sin(t * 1.4 + e.phase) * 0.05;

        // Animate silk streamers & tassels waving in the wind
        e.group.traverse(child => {
          if (child.name === 'lanternStreamer') {
            child.rotation.z = Math.sin(t * 3.2 + e.phase + child.position.x) * 0.18;
            child.rotation.x = Math.cos(t * 2.4 + e.phase) * 0.12;
          } else if (child.name === 'lanternTassel') {
            child.rotation.z = Math.sin(t * 2.2 + e.phase) * 0.12;
          }
        });

        const light = e.group.getObjectByName('pointLight');
        if (light) {
          light.intensity = 1.8 + Math.sin(t * 12 + e.phase) * 0.4;
        }
      }
    }

    // 2.5 Fireflies & Golden Teardrop Fairy Lights (ไฟหิ่งห้อยหยดน้ำระยิบระยับตามต้นไม้ใหญ่)
    if (this.fireflies && this.fireflies.length > 0) {
      for (let f = 0; f < this.fireflies.length; f++) {
        const ff = this.fireflies[f];
        ff.mesh.material.emissiveIntensity = ff.baseIntensity + Math.sin(t * ff.speed + ff.phase) * 0.75;
      }
    }

    // 3. Cruising Long-tail Boat (เรือหางยาวประดับไฟลอยลำข้ามสายน้ำ)
    if (this.longTailBoat && this.boatPath) {
      const boatProgress = (t * 0.02) % 1.0;
      const pt = this.boatPath.getPoint(boatProgress);
      const nextPt = this.boatPath.getPoint((boatProgress + 0.01) % 1.0);

      const waterH = this.getWaterHeight(pt.x, pt.z, t);
      this.longTailBoat.position.set(pt.x, waterH + 0.15, pt.z);

      this.longTailBoat.lookAt(nextPt.x, waterH + 0.15, nextPt.z);
      this.longTailBoat.rotation.z += Math.sin(t * 2.5) * 0.04;
      this.longTailBoat.rotation.x += Math.cos(t * 2.0) * 0.03;
    }

    // 4. Grand Ferris Wheel (ชิงช้าสวรรค์หมุน & กระเช้าตั้งตรง & ไฟนีออนกะพริบ)
    if (this.ferrisWheel) {
      this.ferrisWheel.rotation.z += 0.0035;

      if (this.ferrisGondolas) {
        for (let g of this.ferrisGondolas) {
          g.cabin.rotation.z = -this.ferrisWheel.rotation.z;
        }
      }

      if (this.ferrisBulbs && state.theme === 'fair') {
        const neonRainbow = [
          new THREE.Color(0xff0055),
          new THREE.Color(0xffaa00),
          new THREE.Color(0x00ffcc),
          new THREE.Color(0xff00ff),
          new THREE.Color(0x00e5ff),
          new THREE.Color(0x76ff03),
        ];
        for (let b of this.ferrisBulbs) {
          const colorIndex = Math.floor((t * 5 + b.index * 0.35) % neonRainbow.length);
          b.mesh.material.emissive.copy(neonRainbow[colorIndex]);
          b.mesh.material.emissiveIntensity = 1.4 + Math.sin(t * 8 + b.index) * 0.4;
        }
      }

      if (this.ferrisLight) {
        this.ferrisLight.intensity = (state.theme === 'fair' ? 3.2 : 1.8) + Math.sin(t * 4) * 0.5;
      }
    }

    // 5. Animate Temple Fair Bunting Flags
    if (this.buntingFlags) {
      for (let flag of this.buntingFlags) {
        flag.mesh.rotation.z = Math.sin(t * 3.5 + flag.phase) * 0.22;
        flag.mesh.rotation.x = Math.cos(t * 2.8 + flag.phase) * 0.15;
      }
    }

    // 6. 3D Fireworks
    for (let f = this.fireworks.length - 1; f >= 0; f--) {
      const fw = this.fireworks[f];
      fw.update();
      if (fw.isDead) {
        fw.destroy();
        this.fireworks.splice(f, 1);
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// ==========================================
// 4. 3D Particle Fireworks Engine
// ==========================================

class Firework3D {
  constructor(scene, tx, ty, tz) {
    this.scene = scene;
    this.target = new THREE.Vector3(tx, ty, tz);
    this.pos = new THREE.Vector3(tx + (Math.random() - 0.5) * 15, 2, tz + (Math.random() - 0.5) * 15);
    this.state = 'rocket';
    this.speed = 1.4 + Math.random() * 0.5;
    this.isDead = false;

    const palettes = [
      [0xffd700, 0xffa500, 0xff4500],
      [0xff1493, 0xff69b4, 0xffe4e1],
      [0x00ffff, 0x00bfff, 0x7fffd4],
      [0x7cfc00, 0x32cd32, 0xadff2f],
      [0xba55d3, 0x9370db, 0xe6e6fa],
    ];
    this.palette = palettes[Math.floor(Math.random() * palettes.length)];

    const rGeo = new THREE.SphereGeometry(0.3, 6, 6);
    const rMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });
    this.rocketMesh = new THREE.Mesh(rGeo, rMat);
    this.rocketMesh.position.copy(this.pos);
    this.scene.add(this.rocketMesh);
  }

  explode() {
    this.state = 'particles';
    this.scene.remove(this.rocketMesh);

    soundEngine.playFireworkBurst();

    const pCount = 75;
    this.particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);
    this.velocities = [];

    const baseColor = new THREE.Color(this.palette[0]);
    const secColor = new THREE.Color(this.palette[1]);

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = this.pos.x;
      positions[i * 3 + 1] = this.pos.y;
      positions[i * 3 + 2] = this.pos.z;

      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const spd = 0.6 + Math.random() * 1.4;

      this.velocities.push(
        new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi) * spd,
          Math.sin(theta) * Math.sin(phi) * spd,
          Math.cos(theta) * spd
        )
      );

      const c = Math.random() > 0.5 ? baseColor : secColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.particleMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
    });

    this.particlesMesh = new THREE.Points(this.particleGeo, this.particleMat);
    this.scene.add(this.particlesMesh);

    this.burstLight = new THREE.PointLight(this.palette[0], 4.2, 32);
    this.burstLight.position.copy(this.pos);
    this.scene.add(this.burstLight);
  }

  update() {
    if (this.state === 'rocket') {
      const dir = new THREE.Vector3().subVectors(this.target, this.pos);
      const dist = dir.length();
      if (dist < this.speed) {
        this.explode();
      } else {
        dir.normalize();
        this.pos.addScaledVector(dir, this.speed);
        this.rocketMesh.position.copy(this.pos);
      }
    } else if (this.state === 'particles') {
      const pos = this.particleGeo.attributes.position;
      for (let i = 0; i < this.velocities.length; i++) {
        const v = this.velocities[i];
        v.y -= 0.015;
        v.multiplyScalar(0.97);

        pos.array[i * 3] += v.x;
        pos.array[i * 3 + 1] += v.y;
        pos.array[i * 3 + 2] += v.z;
      }
      pos.needsUpdate = true;

      this.particleMat.opacity -= 0.018;
      if (this.burstLight) {
        this.burstLight.intensity *= 0.88;
      }

      if (this.particleMat.opacity <= 0.02) {
        this.isDead = true;
      }
    }
  }

  destroy() {
    if (this.rocketMesh) this.scene.remove(this.rocketMesh);
    if (this.particlesMesh) this.scene.remove(this.particlesMesh);
    if (this.burstLight) this.scene.remove(this.burstLight);
  }
}

// ==========================================
// 5. 3D Customizer Stage (Turntable 360° Preview)
// ==========================================

class Customizer3DPreview {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(300, 300);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    this.camera.position.set(0, 3.2, 5.2);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 1.0, 0);
    this.controls.maxDistance = 8.5;
    this.controls.minDistance = 3.0;

    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(amb);

    const dir = new THREE.DirectionalLight(0xfff7ed, 1.5);
    dir.position.set(4, 7, 5);
    this.scene.add(dir);

    const backDir = new THREE.DirectionalLight(0x93c5fd, 0.9);
    backDir.position.set(-4, 3, -5);
    this.scene.add(backDir);

    this.currentModel = null;
    this.clock = new THREE.Clock();
    this.animate();
  }

  updateModel(mode, options) {
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
    }

    if (mode === 'krathong') {
      this.currentModel = createKrathong3D(options);
      this.currentModel.position.set(0, 0.25, 0);
      this.currentModel.scale.set(1.15, 1.15, 1.15);
      this.camera.position.set(0, 3.2, 4.6);
      this.controls.target.set(0, 0.9, 0);
    } else {
      this.currentModel = createLantern3D(options);
      this.currentModel.position.set(0, -0.35, 0);
      this.currentModel.scale.set(1.05, 1.05, 1.05);
      this.camera.position.set(0, 2.2, 5.0);
      this.controls.target.set(0, 1.3, 0);
    }

    this.scene.add(this.currentModel);
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = this.clock.getElapsedTime();

    if (this.currentModel) {
      if (!this.controls.state >= 0) {
        this.currentModel.rotation.y += 0.008;
      }

      this.currentModel.traverse(child => {
        if (child.name === 'lanternStreamer') {
          child.rotation.z = Math.sin(t * 2.8 + child.position.x) * 0.16;
          child.rotation.x = Math.cos(t * 2.0) * 0.1;
        } else if (child.name === 'lanternTassel') {
          child.rotation.z = Math.sin(t * 2.2) * 0.12;
        }
      });
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// ==========================================
// 6. Web Audio Synthesizer (Thai Melodies & Sounds)
// ==========================================

class FestivalSoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentStep = 0;
    this.melodyTimer = null;

    this.notes = [
      { f: 392.0, d: 0.3 }, // G4
      { f: 440.0, d: 0.3 }, // A4
      { f: 523.3, d: 0.4 }, // C5
      { f: 440.0, d: 0.3 }, // A4
      { f: 392.0, d: 0.5 }, // G4
      { f: 329.6, d: 0.3 }, // E4
      { f: 293.7, d: 0.3 }, // D4
      { f: 329.6, d: 0.4 }, // E4
      { f: 392.0, d: 0.6 }, // G4
      { f: 523.3, d: 0.3 }, // C5
      { f: 587.3, d: 0.3 }, // D5
      { f: 523.3, d: 0.4 }, // C5
      { f: 440.0, d: 0.3 }, // A4
      { f: 392.0, d: 0.6 }, // G4
      { f: 329.6, d: 0.3 }, // E4
      { f: 293.7, d: 0.5 }, // D4
      { f: 261.6, d: 0.7 }, // C4
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, duration) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration * 1.5);
    } catch (e) {}
  }

  playFireworkLaunch() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  playFireworkBurst() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  toggleMusic() {
    this.init();
    this.isPlaying = !this.isPlaying;
    state.musicPlaying = this.isPlaying;

    const icon = document.getElementById('musicIcon');
    const label = document.getElementById('musicLabel');
    const soundWaves = document.getElementById('soundWaves');

    if (this.isPlaying) {
      icon.textContent = '🔊';
      label.textContent = 'ปิดเสียง';
      soundWaves.classList.remove('hidden');
      this.startMelodyLoop();
    } else {
      icon.textContent = '🎵';
      label.textContent = 'เปิดเสียง';
      soundWaves.classList.add('hidden');
      if (this.melodyTimer) clearTimeout(this.melodyTimer);
    }
  }

  startMelodyLoop() {
    const playNext = () => {
      if (!this.isPlaying) return;
      const note = this.notes[this.currentStep];
      this.playNote(note.f, note.d);

      this.currentStep = (this.currentStep + 1) % this.notes.length;
      const stepDuration = note.d * 1000 + 100;
      this.melodyTimer = setTimeout(playNext, stepDuration);
    };
    playNext();
  }
}

const soundEngine = new FestivalSoundEngine();

// ==========================================
// 7. Wish Inspector Popover Card
// ==========================================

const inspectCard = document.getElementById('wishInspectCard');
const inspectTypeIcon = document.getElementById('inspectTypeIcon');
const inspectTypeText = document.getElementById('inspectTypeText');
const inspectSender = document.getElementById('inspectSender');
const inspectWish = document.getElementById('inspectWish');
const inspectTime = document.getElementById('inspectTime');
const blessingCount = document.getElementById('blessingCount');
const btnSendBlessing = document.getElementById('btnSendBlessing');
const btnCloseInspect = document.getElementById('btnCloseInspect');

function openWishInspector(entity) {
  state.selectedEntity = entity;

  if (entity.type === 'krathong') {
    inspectTypeIcon.textContent = '🪷';
    inspectTypeText.textContent = 'กระทง 3D สายน้ำระยอง';
  } else {
    inspectTypeIcon.textContent = '🏮';
    inspectTypeText.textContent = 'โคมลอย 3D สู่ฟากฟ้าราตรี';
  }

  inspectSender.textContent = entity.sender;
  inspectWish.textContent = entity.wish;
  inspectTime.textContent = entity.time;
  blessingCount.textContent = `(${entity.blessings})`;

  inspectCard.classList.remove('hidden');
}

function closeWishInspector() {
  inspectCard.classList.add('hidden');
  state.selectedEntity = null;
}

// ==========================================
// 8. Application Initialization & UI Wiring
// ==========================================

let mainScene3D = null;
let customizer3D = null;

document.addEventListener('DOMContentLoaded', () => {
  const sceneCanvas = document.getElementById('webglSceneCanvas');
  mainScene3D = new RayongScene3D(sceneCanvas);

  const previewCanvas = document.getElementById('preview3DCanvas');
  customizer3D = new Customizer3DPreview(previewCanvas);

  const modal = document.getElementById('customizerModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnOpenKrathong = document.getElementById('btnOpenKrathongModal');
  const btnOpenLantern = document.getElementById('btnOpenLanternModal');

  const tabKrathong = document.getElementById('tabKrathong');
  const tabLantern = document.getElementById('tabLantern');
  const krathongSection = document.getElementById('krathongOptionsSection');
  const lanternSection = document.getElementById('lanternOptionsSection');

  const previewHintText = document.getElementById('previewHintText');
  const submitButtonText = document.getElementById('submitButtonText');
  const btnSubmitRelease = document.getElementById('btnSubmitRelease');

  const inputSenderName = document.getElementById('inputSenderName');
  const inputWishText = document.getElementById('inputWishText');
  const charCount = document.getElementById('charCount');

  // Top Nav Buttons
  const btnLaunchFirework = document.getElementById('btnLaunchFirework');
  const btnGrandFireworks = document.getElementById('btnGrandFireworks');
  const btnToggleTheme = document.getElementById('btnToggleTheme');
  const btnToggleMusic = document.getElementById('btnToggleMusic');
  const btnResetCamera = document.getElementById('btnResetCamera');
  const btnInfo = document.getElementById('btnInfo');
  const infoModal = document.getElementById('infoModal');
  const btnCloseInfo = document.getElementById('btnCloseInfo');
  const btnAckInfo = document.getElementById('btnAckInfo');

  function update3DPreview() {
    if (state.mode === 'krathong') {
      customizer3D.updateModel('krathong', state.krathong);
      previewHintText.textContent = '✨ แสดงโมเดลกระทง 3D แบบ Real-time หมุนดูรอบทิศทางได้';
      submitButtonText.textContent = 'ปล่อยกระทงลงสู่สายน้ำ 3D';
    } else {
      customizer3D.updateModel('lantern', state.lantern);
      previewHintText.textContent = '✨ แสดงโมเดลโคมลอย 3D แบบ Real-time หมุนดูรอบทิศทางได้';
      submitButtonText.textContent = 'ปล่อยโคมลอยสู่ฟากฟ้า 3D';
    }
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === 'krathong') {
      tabKrathong.classList.add('active');
      tabLantern.classList.remove('active');
      krathongSection.classList.remove('hidden');
      lanternSection.classList.add('hidden');
    } else {
      tabLantern.classList.add('active');
      tabKrathong.classList.remove('active');
      lanternSection.classList.remove('hidden');
      krathongSection.classList.add('hidden');
    }
    update3DPreview();
  }

  btnOpenKrathong.addEventListener('click', () => {
    setMode('krathong');
    modal.classList.remove('hidden');
    closeWishInspector();
  });

  btnOpenLantern.addEventListener('click', () => {
    setMode('lantern');
    modal.classList.remove('hidden');
    closeWishInspector();
  });

  btnCloseModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  tabKrathong.addEventListener('click', () => setMode('krathong'));
  tabLantern.addEventListener('click', () => setMode('lantern'));

  // --- Krathong Customizer Options ---
  document.querySelectorAll('#baseChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#baseChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.krathong.base = card.dataset.base;
      update3DPreview();
    });
  });

  document.querySelectorAll('#flowerChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#flowerChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.krathong.flower = card.dataset.flower;
      update3DPreview();
    });
  });

  document.querySelectorAll('#krathongOrnamentChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#krathongOrnamentChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.krathong.ornament = card.dataset.ornament;
      update3DPreview();
    });
  });

  document.querySelectorAll('#candleColorChoices .color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('#candleColorChoices .color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      state.krathong.candleColor = swatch.dataset.color;
      update3DPreview();
    });
  });

  const btnToggleKrathongFlame = document.getElementById('btnToggleKrathongFlame');
  const krathongFlameState = document.getElementById('krathongFlameState');
  btnToggleKrathongFlame.addEventListener('click', () => {
    state.krathong.isLit = !state.krathong.isLit;
    if (state.krathong.isLit) {
      btnToggleKrathongFlame.classList.add('active');
      krathongFlameState.textContent = 'จุดไฟแล้ว';
    } else {
      btnToggleKrathongFlame.classList.remove('active');
      krathongFlameState.textContent = 'ยังไม่จุดไฟ';
    }
    update3DPreview();
  });

  // --- Lantern Customizer Options ---
  document.querySelectorAll('#lanternShapeChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#lanternShapeChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.lantern.shape = card.dataset.shape;
      update3DPreview();
    });
  });

  document.querySelectorAll('#lanternColorChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#lanternColorChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.lantern.color = card.dataset.color;
      update3DPreview();
    });
  });

  document.querySelectorAll('#lanternPatternChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#lanternPatternChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.lantern.pattern = card.dataset.pattern;
      update3DPreview();
    });
  });

  document.querySelectorAll('#lanternRibbonChoices .choice-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#lanternRibbonChoices .choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.lantern.ribbon = card.dataset.ribbon;
      update3DPreview();
    });
  });

  const btnToggleLanternFlame = document.getElementById('btnToggleLanternFlame');
  const lanternFlameState = document.getElementById('lanternFlameState');
  btnToggleLanternFlame.addEventListener('click', () => {
    state.lantern.isLit = !state.lantern.isLit;
    if (state.lantern.isLit) {
      btnToggleLanternFlame.classList.add('active');
      lanternFlameState.textContent = 'จุดไฟสว่างแล้ว';
    } else {
      btnToggleLanternFlame.classList.remove('active');
      lanternFlameState.textContent = 'ยังไม่จุดไฟ';
    }
    update3DPreview();
  });

  // --- Preset Wish Chips ---
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      inputWishText.value = chip.textContent;
      charCount.textContent = inputWishText.value.length;
    });
  });

  inputWishText.addEventListener('input', () => {
    charCount.textContent = inputWishText.value.length;
  });

  // --- Release Action (ปล่อยกระทง 3D / ปล่อยโคมลอย 3D) ---
  btnSubmitRelease.addEventListener('click', () => {
    const sender = inputSenderName.value.trim() || 'ผู้มีจิตศรัทธา';
    const wish =
      inputWishText.value.trim() ||
      (state.mode === 'krathong'
        ? 'ขอขมาพระแม่คงคา บันดาลชีวิตร่มเย็นเป็นสุข'
        : 'ขอให้ชีวิตสว่างไสว ปลอดโปร่งใจ สมปรารถนาทุกประการ');

    if (state.mode === 'krathong') {
      mainScene3D.spawnEntity({
        type: 'krathong',
        sender: sender,
        wish: wish,
        time: 'เมื่อสักครู่',
        options: { ...state.krathong },
        x: 22,
        y: 0,
        z: 32,
        speed: 0.048,
        scale: 1.35,
        phase: 0,
        blessings: 1,
      });

      state.counts.krathongs++;
      document.getElementById('krathongCount').textContent = state.counts.krathongs;
      mainScene3D.launchFirework(-5, 45, -15);
    } else {
      mainScene3D.spawnEntity({
        type: 'lantern',
        sender: sender,
        wish: wish,
        time: 'เมื่อสักครู่',
        options: { ...state.lantern },
        x: 24,
        y: 4,
        z: 18,
        speedY: 0.038,
        swaySpeed: 0.025,
        scale: 1.25,
        phase: 0,
        blessings: 1,
      });

      state.counts.lanterns++;
      document.getElementById('lanternCount').textContent = state.counts.lanterns;
      mainScene3D.launchFirework(20, 48, -10);
    }

    modal.classList.add('hidden');
    inputWishText.value = '';
    charCount.textContent = '0';
  });

  // Single Firework
  btnLaunchFirework.addEventListener('click', (e) => {
    e.stopPropagation();
    mainScene3D.launchFirework();
    setTimeout(() => mainScene3D.launchFirework(), 350);
  });

  // Grand Fireworks Finale Barrage (จุดพลุชุดใหญ่)
  btnGrandFireworks.addEventListener('click', (e) => {
    e.stopPropagation();
    mainScene3D.launchGrandBarrage();
  });

  // Switch Lighting Ambience Mode
  btnToggleTheme.addEventListener('click', (e) => {
    e.stopPropagation();
    const nextTheme = state.theme === 'fair' ? 'moonlight' : 'fair';
    mainScene3D.setTheme(nextTheme);
  });

  btnResetCamera.addEventListener('click', (e) => {
    e.stopPropagation();
    mainScene3D.resetCamera();
  });

  btnToggleMusic.addEventListener('click', (e) => {
    e.stopPropagation();
    soundEngine.toggleMusic();
  });

  btnInfo.addEventListener('click', () => infoModal.classList.remove('hidden'));
  btnCloseInfo.addEventListener('click', () => infoModal.classList.add('hidden'));
  btnAckInfo.addEventListener('click', () => infoModal.classList.add('hidden'));

  btnCloseInspect.addEventListener('click', closeWishInspector);

  btnSendBlessing.addEventListener('click', () => {
    if (state.selectedEntity) {
      state.selectedEntity.blessings++;
      blessingCount.textContent = `(${state.selectedEntity.blessings})`;
      btnSendBlessing.style.transform = 'scale(1.15)';
      setTimeout(() => (btnSendBlessing.style.transform = 'scale(1)'), 200);
      mainScene3D.launchFirework();
    }
  });

  setInterval(() => {
    if (mainScene3D && Math.random() > 0.35) {
      mainScene3D.launchFirework();
    }
  }, 5000);

  update3DPreview();
});
