// Initialize Three.js scene
const scene = new THREE.Scene();
const container = document.getElementById('visualization-container');
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
});

// Setup renderer
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

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

// Create visualization elements
const middleBarHeight = 10.5;
const sideBarHeight = middleBarHeight * 0.7;
const sideBarStart = middleBarHeight * 0.15;
const sideBarYOffset = sideBarStart - middleBarHeight / 2 + sideBarHeight / 2;

const barGeometries = [
    new THREE.BoxGeometry(3.5, sideBarHeight, 3.5, 32, 32, 32),
    new THREE.BoxGeometry(3.5, middleBarHeight, 3.5, 32, 32, 32),
    new THREE.BoxGeometry(3.5, sideBarHeight, 3.5, 32, 32, 32),
];

// Animation and interaction
let mouseX = 0, mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

const maxRotation = Math.PI / 7;

// Event listeners
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
    currentRotationX += (targetRotationX - currentRotationX) * 0.01;
    currentRotationY += (targetRotationY - currentRotationY) * 0.01;

    group.rotation.x = currentRotationX;
    group.rotation.y = currentRotationY;

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

window.addEventListener('resize', handleResize);
handleResize();

// Start animation
animate();