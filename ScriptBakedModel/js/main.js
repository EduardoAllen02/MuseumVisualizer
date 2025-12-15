/**
 * MAIN APPLICATION ENTRY POINT
 * Initializes the 3D visualizer and handles UI interactions
 */

import { ROOM_DATA } from './data/rooms.js';
import { SidePanel } from './classes/SidePanel.js';
import { SceneManager } from './classes/SceneManager.js';

// ============================================
// INITIALIZATION
// ============================================

// Initialize side panel
const sidePanel = new SidePanel();

// Initialize scene manager
const sceneManager = new SceneManager(ROOM_DATA, sidePanel);

// ============================================
// UI EVENT HANDLERS
// ============================================

let buildingFileData = null;
let windowsFileData = null;

// File input handlers
document.getElementById('buildingFile').addEventListener('change', (e) => {
    buildingFileData = e.target.files[0];
    checkFilesReady();
});

document.getElementById('windowsFile').addEventListener('change', (e) => {
    windowsFileData = e.target.files[0];
    checkFilesReady();
});

/**
 * Checks if both model files are selected
 */
function checkFilesReady() {
    const loadBtn = document.getElementById('loadModels');
    if (buildingFileData && windowsFileData) {
        loadBtn.disabled = false;
        updateStatus('Files ready. Click "Upload models"', 'success');
    }
}

/**
 * Loads custom models from file inputs
 */
document.getElementById('loadModels').addEventListener('click', () => {
    if (!buildingFileData || !windowsFileData) return;
    
    updateStatus('Loading custom models...', 'warning');
    
    // TODO: Implement custom model loading
    // This would require FileReader API and GLTF parsing
    console.log('Custom model loading not yet implemented');
});

/**
 * Clears all labels and reinitializes from data
 */
document.getElementById('clearLabels').addEventListener('click', () => {
    sceneManager.clearAllLabels();
    sceneManager.initializeLabelsFromData();
    updateStatus('Labels reset', 'success');
});

/**
 * Updates the status message in UI
 */
function updateStatus(message, type = '') {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = 'status ' + type;
    }
}

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    updateStatus('An error occurred. Check console.', 'warning');
});

// ============================================
// EXPORT FOR DEBUGGING (optional)
// ============================================

// Make objects available in console for debugging
if (process.env.NODE_ENV === 'development') {
    window.DEBUG = {
        sceneManager,
        sidePanel,
        ROOM_DATA
    };
}