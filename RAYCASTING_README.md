# Phaser Raycasting Dungeon

A classic first-person dungeon crawler built with Phaser.js featuring smooth raycasting rendering and animated movement.

## Features

### 🎮 Gameplay
- **First-person perspective** with classic dungeon crawler feel
- **Smooth animated movement** - fluid transitions between tiles
- **Grid-based navigation** - move one tile at a time
- **90-degree rotation** - classic dungeon movement style
- **Debug mode** - press 'D' to toggle top-down view

### 🎨 Visual Design
- **Green stone walls** with distance-based shading
- **Vertical gradient walls** - light green at top, dark green at bottom
- **Brownish-green floor and ceiling** for cohesive color scheme
- **Fish-eye correction** for proper 3D perspective
- **Classic retro aesthetic** inspired by old-school dungeon crawlers

### 🔧 Technical Implementation
- **Raycasting engine** - custom implementation for wall detection
- **Smooth interpolation** - animated movement and rotation
- **Performance optimized** - 120 rays for detailed rendering
- **Distance-based lighting** - walls fade to darker colors with distance

## Controls

| Key | Action |
|-----|--------|
| ↑ Arrow | Move forward |
| ↓ Arrow | Move backward |
| ← Arrow | Turn left (90°) |
| → Arrow | Turn right (90°) |
| D | Toggle debug view |

## Technical Details

### Raycasting Configuration
```javascript
TILE_SIZE = 64;           // Size of each map tile
FOV = Math.PI / 3;        // 60-degree field of view
NUM_RAYS = 120;           // Number of rays cast per frame
MAX_DEPTH = 400;          // Maximum raycast distance
```

### Animation Settings
```javascript
moveSpeed = 320;          // Pixels per second for movement
rotateSpeed = 6;          // Radians per second for rotation
moveCooldown = 200;       // Milliseconds between inputs
```

### Color Scheme
```javascript
Floor/Ceiling: 0x3d4a2a   // Brownish-green
Wall Base:     Green with distance fading
Wall Gradient: 130% → 70% brightness (top to bottom)
```

## Map Format

The dungeon uses a simple 2D array where:
- `1` = Wall
- `0` = Walkable space

```javascript
map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1]
];
```

## Development Process

### Major Fixes Applied
1. **Fixed broken movement logic** - Player wasn't actually moving to target positions
2. **Implemented fish-eye correction** - Eliminated perspective distortion
3. **Added proper distance-based shading** - Walls fade naturally with distance
4. **Resolved rendering artifacts** - Eliminated harsh black areas
5. **Added smooth animation system** - Replaced instant teleportation with fluid movement

### Key Challenges Solved
- **Raycasting accuracy** - Used smaller step sizes (0.5) for precise wall detection
- **Visual consistency** - Used uniform background color to eliminate black artifacts
- **Movement feel** - Implemented target-based animation system for smooth transitions
- **Color matching** - Matched reference image aesthetic with proper green tones

### Animation System
The movement system uses a state-based approach:
- `isMoving` / `isRotating` flags prevent input during animation
- Target positions (`targetX`, `targetY`, `targetAngle`) define animation endpoints
- Delta-time based interpolation ensures smooth 60fps animation
- Automatic completion detection snaps to target when close enough

## File Structure

```
src/game/scenes/
└── DungeonScene.js     # Main raycasting implementation
```

## Performance Notes

- **120 rays per frame** provides good detail without performance impact
- **Distance culling** at 400 pixels reduces unnecessary calculations
- **Efficient raycasting** with 0.5 pixel step increments
- **Single graphics object** reused each frame for optimal rendering

## Future Enhancement Ideas

- [ ] Multiple dungeon levels
- [ ] Different wall textures
- [ ] Enemies and NPCs
- [ ] Items and pickups
- [ ] Sound effects
- [ ] Minimap overlay
- [ ] Different lighting effects
- [ ] Textured floors/ceilings

## Credits

Built with:
- **Phaser.js 3.90.0** - Game framework
- **Vite** - Build tool and dev server
- **Custom raycasting engine** - Written from scratch

---

*This project demonstrates classic raycasting techniques used in early 3D games like Wolfenstein 3D and Doom, implemented with modern web technologies.*