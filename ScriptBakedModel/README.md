# Building Visualizer 3D

Professional 3D building visualization tool built with Three.js and Vanilla JavaScript.


## 🚀 Setup

1. **Copy all files** to your project directory following the structure above

2. **Add your 3D models** to the `models/` folder:
   - `museum-bake.glb` - Main building with baked lighting
   - `windows.glb` - Separate windows model

3. **Start a local server** (required for ES6 modules):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in browser**: `http://localhost:8000`

## 🎨 Customization

### Adding/Editing Room Data

Edit `js/data/rooms.js`:

```javascript
export const ROOM_DATA = {
    "your-room-id": {
        "id": "your-room-id",
        "name": "Room Name",
        "description": "Detailed description...",
        "image": "https://your-image-url.jpg",
        "position": { "x": 0, "y": 3, "z": 0 }, // 3D coordinates
        "details": {
            "area": "1,200 m²",
            "specialty": "Art"
        }
    }
};
```

### Adjusting Label Positions

1. Click on a label in the 3D view
2. Note the room ID
3. Adjust the `position` values in `rooms.js`
4. Reload the page

### Styling

Edit `css/styles.css`:
- `--primary-blue`: Main brand color
- `--light-blue`: Accent color
- Label sizes: `.label-svg { width: 32px; height: 32px; }`
- Font sizes: `.label-text { font-size: 12px; }`

## 🎮 Controls

- **Drag**: Rotate camera around building
- **Shift + Drag**: Pan camera
- **Mouse Wheel**: Zoom in/out
- **Click Label**: Open side panel with room details
- **ESC**: Close side panel

## 📦 Dependencies

- **Three.js r128** (loaded from CDN)
- **GLTFLoader** (loaded from CDN)

No build tools required - pure ES6 modules!

## 🏗️ Architecture

### Class Responsibilities

**SceneManager**
- Manages Three.js scene, camera, renderer
- Loads and manages 3D models
- Handles lighting and shadows
- Coordinates labels and controls

**OrbitControls**
- Custom camera controls with momentum
- Smooth rotation and panning
- Orthographic zoom

**Label3D**
- Projects 3D positions to 2D screen space
- Smooth interpolation to prevent jitter
- Click handlers for interactivity

**SidePanel**
- Displays room information
- Smooth slide-in/out animations
- Dynamic content rendering

## 🐛 Debugging

Open browser console and access:

```javascript
DEBUG.sceneManager  // Scene manager instance
DEBUG.sidePanel     // Side panel instance
DEBUG.ROOM_DATA     // Room configuration
```

## 📝 Notes

- Models use **baked lighting** for optimal performance
- Labels always render **on top** of 3D scene
- **Orthographic camera** for architectural visualization
- **Momentum/inertia** for smooth camera movement

## 🔧 Troubleshooting

**Models not loading?**
- Check file paths in `SceneManager.js`
- Ensure models are in `models/` folder
- Check browser console for errors

**Labels not showing?**
- Verify 3D positions in `rooms.js`
- Check if behind camera (z > 1)
- Inspect browser console

**ES6 modules not working?**
- Must use a local server (not `file://`)
- Check MIME types in server config

## 📄 License

MIT License - Feel free to use in your projects!
