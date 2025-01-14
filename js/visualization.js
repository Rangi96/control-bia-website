const scene = new THREE.Scene();
const container = document.getElementById('visualization-container');
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Add directional lights
const lights = [
    { pos: [5, 5, 5], intensity: 1.0 },
    { pos: [-5, 5, 5], intensity: 1.0 },
    { pos: [0, 5, -5], intensity: 1.0 },
    { pos: [0, -5, 5], intensity: 1.0 }
];

lights.forEach(light => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, light.intensity);
    directionalLight.position.set(...light.pos);
    scene.add(directionalLight);
});

// Bar dimensions
const middleBarHeight = 10.5;
const sideBarHeight = middleBarHeight * 0.7;
const sideBarStart = middleBarHeight * 0.15;
const sideBarYOffset = sideBarStart - middleBarHeight / 2 + sideBarHeight / 2;

// Create geometries for the bars
const barGeometries = [
    new THREE.BoxGeometry(3.5, sideBarHeight, 3.5, 32, 32, 32),
    new THREE.BoxGeometry(3.5, middleBarHeight, 3.5, 32, 32, 32),
    new THREE.BoxGeometry(3.5, sideBarHeight, 3.5, 32, 32, 32),
];

// Color enhancement function
function increaseSaturation(hex, factor = 1.2) {
    const color = new THREE.Color(hex);
    const hsl = {};
    color.getHSL(hsl);
    return new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * factor), hsl.l);
}

// Material creation function
function createBrushedMetalMaterial(color) {
    const saturatedColor = increaseSaturation(color);
    return new THREE.MeshPhysicalMaterial({
        color: saturatedColor,
        metalness: 0.75,
        roughness: 0.3,
        reflectivity: 0.9,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
        emissive: saturatedColor,
        emissiveIntensity: 0.15
    });
}

// Create materials with brand colors
const materials = [
    createBrushedMetalMaterial(0x2050E0), // Blue
    createBrushedMetalMaterial(0xB070DD), // Purple
    createBrushedMetalMaterial(0xBFBFBF)  // Gray
];

// Create and position the bars
const bars = [];
barGeometries.forEach((geometry, index) => {
    const bar = new THREE.Mesh(geometry, materials[index]);
    
    if (index === 1) {
        bar.position.set(index * 4 - 3.5, 0, 0);
    } else {
        bar.position.set(index * 4 - 3.5, sideBarYOffset, 0);
    }

    scene.add(bar);
    bars.push(bar);
});

// Group the bars
const group = new THREE.Group();
bars.forEach(bar => group.add(bar));
scene.add(group);

// Set camera position
camera.position.z = 15;

// Mouse interaction variables
let mouseX = 0, mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

const maxRotation = Math.PI / 7;

// Mouse movement handler
document.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    mouseX = (x / rect.width) * 2 - 1;
    mouseY = -(y / rect.height) * 2 + 1;
    
    targetRotationY = Math.max(Math.min(mouseX * 0.8, maxRotation), -maxRotation);
    targetRotationX = Math.max(Math.min(mouseY * 0.8, maxRotation), -maxRotation);
});

// Animation loop
function animate() {
    // Smooth rotation interpolation
    currentRotationX += (targetRotationX - currentRotationX) * 0.01;
    currentRotationY += (targetRotationY - currentRotationY) * 0.01;

    // Apply rotations
    group.rotation.x = currentRotationX;
    group.rotation.y = currentRotationY;

    // Render the scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Handle window resize
function handleResize() {
    const rect = container.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
}

// Add event listeners and start
window.addEventListener('resize', handleResize);
handleResize();
animate();