/**
 * LABEL 3D CLASS
 * Represents a clickable 3D label that projects onto 2D screen space
 */

export class Label3D {
    constructor(position, roomData, onClickCallback) {
        this.position = position.clone();
        this.roomData = roomData;
        this.onClickCallback = onClickCallback;
        this.id = roomData.id;
        this.element = this.createDOMElement();
        
        // Smooth positioning properties
        this.currentX = 0;
        this.currentY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.lerpFactor = 0.15; // Smoothing factor (0-1, higher = faster response)
        
        // Setup click handler
        this.element.addEventListener('click', () => this.handleClick());
    }
    
    /**
     * Creates the DOM element for the label
     * @returns {HTMLElement} Label container element
     */
    createDOMElement() {
        const container = document.createElement('div');
        container.className = 'label-marker';
        container.setAttribute('data-label-id', this.id);
        
        // SVG icon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'label-svg');
        svg.setAttribute('viewBox', '0 0 48 48');
        svg.innerHTML = `
            <rect width="48" height="48" rx="6" fill="#041676"/>
            <path d="M14 18h20M14 24h20M14 30h12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        `;
        
        // Text label
        const textLabel = document.createElement('div');
        textLabel.className = 'label-text';
        textLabel.textContent = this.roomData.name;
        
        container.appendChild(svg);
        container.appendChild(textLabel);
        
        return container;
    }
    
    /**
     * Handles click event on the label
     */
    handleClick() {
        if (this.onClickCallback) {
            this.onClickCallback(this.roomData);
        }
    }
    
    /**
     * Updates the screen position of the label based on 3D position
     * Uses smooth interpolation to prevent jittering
     * @param {THREE.Camera} camera - Three.js camera
     * @param {number} width - Screen width
     * @param {number} height - Screen height
     */
    updateScreenPosition(camera, width, height) {
        const vector = this.position.clone();
        vector.project(camera);
        
        // Check if behind camera (z > 1 means behind)
        if (vector.z > 1) {
            this.element.classList.add('hidden');
            return;
        }
        
        // Convert normalized device coordinates to screen coordinates
        this.targetX = (vector.x * 0.5 + 0.5) * width;
        this.targetY = (vector.y * -0.5 + 0.5) * height;
        
        // Initialize current position on first frame
        if (this.currentX === 0 && this.currentY === 0) {
            this.currentX = this.targetX;
            this.currentY = this.targetY;
        }
        
        // Smooth interpolation (lerp) to prevent jitter
        this.currentX += (this.targetX - this.currentX) * this.lerpFactor;
        this.currentY += (this.targetY - this.currentY) * this.lerpFactor;
        
        // Apply position with sub-pixel precision
        // Offset by 16px (half of 32px icon size) to center
        const finalX = Math.round(this.currentX * 10) / 10;
        const finalY = Math.round(this.currentY * 10) / 10;
        
        this.element.style.transform = `translate(${finalX - 16}px, ${finalY - 16}px)`;
        this.element.classList.remove('hidden');
    }
    
    /**
     * Removes the label from DOM
     */
    remove() {
        this.element.remove();
    }
}