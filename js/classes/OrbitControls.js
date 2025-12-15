/**
 * ORBIT CONTROLS CLASS
 * Custom orbit controls with momentum/inertia for smooth camera movement
 */

export class OrbitControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
      // Camera state
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cameraRotation = { x: 0.35, y: 0.6 }; // Initial rotation angles (x más bajo = cámara más baja)
        this.cameraDistance = 70; // Distance from target
        this.cameraTarget = new THREE.Vector3(0, 0, 0); // Look-at point (Y=0 en lugar de Y=5)
        this.isShiftPressed = false;
        
        // Momentum/inertia system
        this.velocity = { x: 0, y: 0 }; // Rotation velocity
        this.panVelocity = { x: 0, y: 0 }; // Pan velocity
        this.damping = 0.95; // Damping factor (0-1, higher = less damping)
        this.minVelocity = 0.0000001; // Minimum velocity threshold
        
        this.setupEventListeners();
    }
    
    /**
     * Sets up all mouse and keyboard event listeners
     */
    setupEventListeners() {
        // Shift key for panning
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') this.isShiftPressed = true;
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') this.isShiftPressed = false;
        });
        
        // Mouse down - start dragging
        this.domElement.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
            // Reset velocities when user starts dragging
            this.velocity = { x: 0, y: 0 };
            this.panVelocity = { x: 0, y: 0 };
        });
        
        // Mouse move - rotate or pan
        this.domElement.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;
            
            if (this.isShiftPressed) {
                // PAN MODE (Shift + Drag)
                this.handlePan(deltaX, deltaY);
            } else {
                // ROTATE MODE (Drag)
                this.handleRotate(deltaX, deltaY);
            }
            
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        // Mouse up - stop dragging
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        // Mouse wheel - zoom
        this.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.handleZoom(e.deltaY);
        }, { passive: false });
    }
    
    /**
     * Handles rotation movement
     */
    handleRotate(deltaX, deltaY) {
        const rotationSpeed = 0.0025;
        
        this.cameraRotation.y -= deltaX * rotationSpeed;
        this.cameraRotation.x -= deltaY * -rotationSpeed;
        
        // Clamp vertical rotation to prevent flipping
        this.cameraRotation.x = Math.max(0.01, Math.min(Math.PI / 2 - 0.01, this.cameraRotation.x));
        
        // Set velocity for momentum
        this.velocity.x = -deltaY * -rotationSpeed * 0.1;
        this.velocity.y = -deltaX * rotationSpeed * 0.1;
    }
    
    /**
     * Handles pan movement
     */
    handlePan(deltaX, deltaY) {
        const panSpeed = 0.015;
        
        // Calculate camera right and up vectors
        const cameraUp = new THREE.Vector3(0, 1, 0);
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, cameraUp).normalize();
        
        // Move target
        this.cameraTarget.addScaledVector(cameraRight, -deltaX * panSpeed);
        this.cameraTarget.y += deltaY * panSpeed;
        
        // Set velocity for momentum
        this.panVelocity.x = -deltaX * panSpeed * 0.1;
        this.panVelocity.y = deltaY * panSpeed * 0.1;
    }
    
    /**
     * Handles zoom (changes orthographic camera size)
     */
    handleZoom(deltaY) {
        const zoomSpeed = 0.01;
        const currentSize = this.camera.top * 2;
        const newSize = currentSize + (deltaY * zoomSpeed);
        const clampedSize = Math.max(10, Math.min(150, newSize));
        
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.left = clampedSize * aspect / -2;
        this.camera.right = clampedSize * aspect / 2;
        this.camera.top = clampedSize / 2;
        this.camera.bottom = clampedSize / -2;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * Updates camera position - call this every frame
     * Applies momentum and damping for smooth movement
     */
    update() {
        // Apply momentum when not dragging
        if (!this.isDragging) {
            // Rotation momentum
            if (Math.abs(this.velocity.x) > this.minVelocity || Math.abs(this.velocity.y) > this.minVelocity) {
                this.cameraRotation.x += this.velocity.x;
                this.cameraRotation.y += this.velocity.y;
                
                // Clamp vertical rotation
                this.cameraRotation.x = Math.max(0.01, Math.min(Math.PI / 2 - 0.01, this.cameraRotation.x));
                
                // Apply damping
                this.velocity.x *= this.damping;
                this.velocity.y *= this.damping;
                
                // Stop if below threshold
                if (Math.abs(this.velocity.x) < this.minVelocity) this.velocity.x = 0;
                if (Math.abs(this.velocity.y) < this.minVelocity) this.velocity.y = 0;
            }
            
            // Pan momentum
            if (Math.abs(this.panVelocity.x) > this.minVelocity || Math.abs(this.panVelocity.y) > this.minVelocity) {
                const cameraUp = new THREE.Vector3(0, 1, 0);
                const cameraDirection = new THREE.Vector3();
                this.camera.getWorldDirection(cameraDirection);
                const cameraRight = new THREE.Vector3();
                cameraRight.crossVectors(cameraDirection, cameraUp).normalize();
                
                this.cameraTarget.addScaledVector(cameraRight, this.panVelocity.x);
                this.cameraTarget.y += this.panVelocity.y;
                
                // Apply damping
                this.panVelocity.x *= this.damping;
                this.panVelocity.y *= this.damping;
                
                // Stop if below threshold
                if (Math.abs(this.panVelocity.x) < this.minVelocity) this.panVelocity.x = 0;
                if (Math.abs(this.panVelocity.y) < this.minVelocity) this.panVelocity.y = 0;
            }
        }
        
        // Calculate camera position from spherical coordinates
        const x = this.cameraDistance * Math.sin(this.cameraRotation.y) * Math.cos(this.cameraRotation.x);
        const z = this.cameraDistance * Math.cos(this.cameraRotation.y) * Math.cos(this.cameraRotation.x);
        const y = this.cameraDistance * Math.sin(this.cameraRotation.x);
        
        // Update camera position and look-at
        this.camera.position.set(
            this.cameraTarget.x + x,
            this.cameraTarget.y + y,
            this.cameraTarget.z + z
        );
        this.camera.lookAt(this.cameraTarget);
    }
}