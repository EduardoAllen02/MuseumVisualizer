/**
 * SCENE MANAGER CLASS
 * Main class that manages the Three.js scene, models, lighting, and labels
 */

import { Label3D } from './Label3D.js';
import { OrbitControls } from './OrbitControls.js';

export class SceneManager {
    constructor(roomData, sidePanel) {
        this.roomData = roomData;
        this.sidePanel = sidePanel;
        
        // Three.js objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.buildingMesh = null;
        this.windowsMesh = null;
        this.directionalLight = null;
        this.controls = null;
        
        // Labels
        this.labels = [];
        
        // Configuration
        this.MODEL_SCALE = 0.3;
        
        this.init();
    }
    
    /**
     * Initializes the Three.js scene, camera, renderer, and lights
     */
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xD6D2CA);

        // Camera - ORTHOGRAPHIC for architectural visualization
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 15;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        const canvas = document.getElementById('webgl-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        // Lights
        this.setupLighting();

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // Load default models
        this.loadDefaultModels();
        
        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Sets up scene lighting (ambient + directional with shadows)
     */
    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional light for shadows and depth
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        this.directionalLight.position.set(-30, 40, -5);
        this.directionalLight.castShadow = true;
        
        // Shadow configuration
        this.directionalLight.shadow.mapSize.width = 4096;
        this.directionalLight.shadow.mapSize.height = 4096;
        this.directionalLight.shadow.radius = 50;
        this.directionalLight.shadow.bias = -0.001;
        this.directionalLight.shadow.normalBias = 0.015;
        
        const shadowExtent = 60;
        this.directionalLight.shadow.camera.left = -shadowExtent;
        this.directionalLight.shadow.camera.right = shadowExtent;
        this.directionalLight.shadow.camera.top = shadowExtent;
        this.directionalLight.shadow.camera.bottom = -shadowExtent;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 200;
        
        this.scene.add(this.directionalLight);
    }
    
    /**
     * Creates emissive material for windows (glowing effect)
     */
    createEmissiveMaterial() {
        return new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFF8E3,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.1,
            toneMapped: false
        });
    }
    
    /**
     * Loads default models (museum-bake.glb and windows.glb)
     */
    loadDefaultModels() {
        const loader = new THREE.GLTFLoader();
        let buildingLoaded = false;
        let windowsLoaded = false;

        // Load building model
        loader.load('./models/museum-bake.glb',
            (gltf) => {
                if (this.buildingMesh) this.scene.remove(this.buildingMesh);
                
                this.buildingMesh = gltf.scene;
                this.buildingMesh.scale.setScalar(this.MODEL_SCALE);
                this.buildingMesh.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                this.scene.add(this.buildingMesh);
                buildingLoaded = true;
                this.checkBothLoaded(buildingLoaded, windowsLoaded);
            },
            undefined,
            (error) => {
                console.error('Error loading building.glb:', error);
                this.updateStatus('Error: building.glb not found', 'warning');
            }
        );

        // Load windows model
        loader.load('./models/windows.glb',
            (gltf) => {
                if (this.windowsMesh) this.scene.remove(this.windowsMesh);
                
                this.windowsMesh = gltf.scene;
                this.windowsMesh.scale.setScalar(this.MODEL_SCALE);
                this.windowsMesh.traverse((child) => {
                    if (child.isMesh) {
                        child.material = this.createEmissiveMaterial();
                    }
                });
                
                this.scene.add(this.windowsMesh);
                windowsLoaded = true;
                this.checkBothLoaded(buildingLoaded, windowsLoaded);
            },
            undefined,
            (error) => {
                console.error('Error loading windows.glb:', error);
                this.updateStatus('Error: windows.glb not found', 'warning');
            }
        );
    }
    
    /**
     * Called when both models are loaded
     */
    checkBothLoaded(buildingLoaded, windowsLoaded) {
        if (buildingLoaded && windowsLoaded) {
            this.updateStatus('Models loaded successfully', 'success');
            this.initializeLabelsFromData();
        }
    }
    
    /**
     * Creates labels from room data
     */
    initializeLabelsFromData() {
        Object.values(this.roomData).forEach(roomData => {
            const position = new THREE.Vector3(
                roomData.position.x,
                roomData.position.y,
                roomData.position.z
            );
            this.addLabel(position, roomData);
        });
    }
    
    /**
     * Adds a new label to the scene
     * @param {THREE.Vector3} position - 3D position
     * @param {Object} roomData - Room information
     * @returns {Label3D} Created label
     */
    addLabel(position, roomData) {
        const label = new Label3D(position, roomData, (data) => {
            this.sidePanel.open(data);
        });
        
        document.getElementById('svg-overlay').appendChild(label.element);
        this.labels.push(label);
        
        return label;
    }
    
    /**
     * Removes all labels from the scene
     */
    clearAllLabels() {
        this.labels.forEach(label => label.remove());
        this.labels = [];
    }
    
    /**
     * Updates all label screen positions
     */
    updateLabels() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.labels.forEach(label => {
            label.updateScreenPosition(this.camera, width, height);
        });
    }
    
    /**
     * Handles window resize
     */
    onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 50;
        
        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Updates status message in UI
     */
    updateStatus(message, type = '') {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = 'status ' + type;
        }
    }
    
    /**
     * Main animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.updateLabels();
        this.renderer.render(this.scene, this.camera);
    }
}