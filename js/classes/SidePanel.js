/**
 * SIDE PANEL CLASS
 * Manages the side panel that displays room information
 */

export class SidePanel {
    constructor() {
        this.panel = document.getElementById('sidePanel');
        this.titleEl = document.getElementById('panelTitle');
        this.imageEl = document.getElementById('panelImage');
        this.descriptionEl = document.getElementById('panelDescription');
        this.extraContentEl = document.getElementById('panelExtraContent');
        this.closeBtn = document.getElementById('panelClose');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Setup close button
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    /**
     * Opens the panel with room data
     * @param {Object} roomData - Room information object
     */
    open(roomData) {
        this.titleEl.textContent = roomData.name;
        this.imageEl.src = roomData.image;
        this.imageEl.alt = roomData.name;
        this.descriptionEl.textContent = roomData.description;
        
        // Add extra details if available
        if (roomData.details) {
            this.extraContentEl.innerHTML = `
                <div class="panel-section">
                    <h3>Details</h3>
                    ${Object.entries(roomData.details).map(([key, value]) => 
                        `<p><strong>${key}:</strong> ${value}</p>`
                    ).join('')}
                </div>
            `;
        } else {
            this.extraContentEl.innerHTML = '';
        }
        
        this.panel.classList.add('open');
        this.isOpen = true;
    }
    
    /**
     * Closes the panel
     */
    close() {
        this.panel.classList.remove('open');
        this.isOpen = false;
    }
    
    /**
     * Toggles panel open/close
     * @param {Object} roomData - Room information object
     */
    toggle(roomData) {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(roomData);
        }
    }
}