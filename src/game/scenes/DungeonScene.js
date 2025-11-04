import Phaser from 'phaser';
import Raycaster from 'phaser-raycaster';

export default class DungeonScene extends Phaser.Scene {

    map = [
  [1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,0,0,1],
  [1,0,1,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1]
];

TILE_SIZE = 64;
FOV = Math.PI / 3;
NUM_RAYS = 120;
MAX_DEPTH = 400;

    player;

  constructor() {
    super('DungeonScene');
    this.player = {
        x: this.TILE_SIZE * 1.5,
        y: this.TILE_SIZE * 1.5,
        angle: 0,
        speed: 2,
        turnSpeed: 0.05,
        // Animation properties
        targetX: this.TILE_SIZE * 1.5,
        targetY: this.TILE_SIZE * 1.5,
        targetAngle: 0,
        isMoving: false,
        isRotating: false
    };
  }

  castRay(x, y, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    
    // Use smaller steps for more accurate raycasting
    let stepSize = 0.5;

    for (let depth = 0; depth < this.MAX_DEPTH; depth += stepSize) {
      let targetX = x + cos * depth;
      let targetY = y + sin * depth;

      let mapX = Math.floor(targetX / this.TILE_SIZE);
      let mapY = Math.floor(targetY / this.TILE_SIZE);

      // Stop if ray goes out of bounds
      if (mapX < 0 || mapY < 0 || mapY >= this.map.length || mapX >= this.map[0].length) {
        return this.MAX_DEPTH;
      }

      if (this.map[mapY][mapX] === 1) {
        return depth;
      }
    }

    return this.MAX_DEPTH;
  }


  render3DView(graphics) {
    graphics.clear();
    
    if (this.showDebug) {
      this.renderDebugView(graphics);
      return;
    }
    
    // Draw floor - brownish green like in the reference image
    graphics.fillStyle(0x3d4a2a); // Brown-green floor color
    graphics.fillRect(0, 350, 800, 250);
    
    // Draw ceiling - same color as floor
    graphics.fillStyle(0x3d4a2a); // Same brown-green as floor
    graphics.fillRect(0, 0, 800, 250);
    
    // Fill the middle area with floor color as default (replaces black)
    graphics.fillStyle(0x3d4a2a); // Same brown-green as floor
    graphics.fillRect(0, 250, 800, 100);
    
    let rayWidth = 800 / this.NUM_RAYS;
    
    for (let i = 0; i < this.NUM_RAYS; i++) {
        let rayAngle = this.player.angle - this.FOV / 2 + (this.FOV / this.NUM_RAYS) * i;
        let depth = this.castRay(this.player.x, this.player.y, rayAngle);
        
        // Fix fish-eye effect
        let angleDiff = rayAngle - this.player.angle;
        depth = depth * Math.cos(angleDiff);
        
        // Calculate wall height for proper perspective
        let wallHeight = Math.min(400, (this.TILE_SIZE * 200) / Math.max(depth, 1));
        
        // Simple green color based on distance
        let brightness = Math.max(0.1, 1.0 - (depth / this.MAX_DEPTH));
        let green = Math.floor(200 * brightness);
        let red = Math.floor(100 * brightness);
        
        // Ensure we always have some minimum green visibility for distant walls
        green = Math.max(20, green);
        red = Math.max(10, red);
        
        let wallTop = 300 - wallHeight / 2;
        
        // Create vertical gradient - light green at top, dark green at bottom
        let gradientSteps = Math.max(5, Math.floor(wallHeight / 4)); // Number of gradient steps
        let stepHeight = wallHeight / gradientSteps;
        
        for (let step = 0; step < gradientSteps; step++) {
          // Calculate gradient factor (0 = top/lightest, 1 = bottom/darkest)
          let gradientFactor = step / (gradientSteps - 1);
          
          // Light green at top (1.3x brightness), dark green at bottom (0.7x brightness)
          let gradientMultiplier = 1.3 - (gradientFactor * 0.6);
          
          let gradientGreen = Math.floor(green * gradientMultiplier);
          let gradientRed = Math.floor(red * gradientMultiplier);
          
          // Ensure colors stay within valid range
          gradientGreen = Math.min(255, Math.max(0, gradientGreen));
          gradientRed = Math.min(255, Math.max(0, gradientRed));
          
          graphics.fillStyle(Phaser.Display.Color.GetColor(gradientRed, gradientGreen, 0));
          
          let stepY = wallTop + (step * stepHeight);
          graphics.fillRect(i * rayWidth, stepY, Math.ceil(rayWidth), Math.ceil(stepHeight) + 1);
        }
    }
  }

  renderDebugView(graphics) {
    // Draw map
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === 1) {
          graphics.fillStyle(0xffffff);
          graphics.fillRect(x * 50, y * 50, 50, 50);
        } else {
          graphics.fillStyle(0x333333);
          graphics.fillRect(x * 50, y * 50, 50, 50);
        }
      }
    }
    
    // Draw player
    let playerScreenX = (this.player.x / this.TILE_SIZE) * 50;
    let playerScreenY = (this.player.y / this.TILE_SIZE) * 50;
    graphics.fillStyle(0xff0000);
    graphics.fillCircle(playerScreenX, playerScreenY, 10);
    
    // Draw player direction
    graphics.lineStyle(2, 0xff0000);
    graphics.beginPath();
    graphics.moveTo(playerScreenX, playerScreenY);
    graphics.lineTo(
      playerScreenX + Math.cos(this.player.angle) * 30,
      playerScreenY + Math.sin(this.player.angle) * 30
    );
    graphics.strokePath();
    
    // Draw FOV rays
    graphics.lineStyle(1, 0x00ff00);
    for (let i = 0; i < this.NUM_RAYS; i += 10) {
      let rayAngle = this.player.angle - this.FOV / 2 + (this.FOV / this.NUM_RAYS) * i;
      let depth = this.castRay(this.player.x, this.player.y, rayAngle);
      let endX = playerScreenX + Math.cos(rayAngle) * (depth / this.TILE_SIZE) * 50;
      let endY = playerScreenY + Math.sin(rayAngle) * (depth / this.TILE_SIZE) * 50;
      
      graphics.beginPath();
      graphics.moveTo(playerScreenX, playerScreenY);
      graphics.lineTo(endX, endY);
      graphics.strokePath();
    }
  }

  preload() {
    // Optional: preload assets
  }

  isWalkable(x, y) {
    const mapX = Math.floor(x / this.TILE_SIZE);
    const mapY = Math.floor(y / this.TILE_SIZE);
    return this.map[mapY]?.[mapX] === 0;
    }

  create() {
    console.log("DungeonScene created!");
    console.log("Player initial position:", this.player.x, this.player.y);
    console.log("Map:", this.map);
    
    // Create graphics object for rendering
    this.graphics = this.add.graphics();

    // Set up arrow key input
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Add debug key
    this.debugKey = this.input.keyboard.addKey('D');

    // Initialize movement and rotation cooldowns
    this.lastMoveTime = 0;
    this.moveCooldown = 200; // Shorter cooldown for faster input
    
    // Animation settings
    this.moveSpeed = 320; // Faster movement - increased from 200
    this.rotateSpeed = 6; // Faster rotation - increased from 4
    
    // Debug mode
    this.showDebug = false;
  }

  update() {
    const now = this.time.now;
    const deltaTime = this.game.loop.delta / 1000; // Delta time in seconds

    // Toggle debug view
    if (Phaser.Input.Keyboard.JustDown(this.debugKey)) {
      this.showDebug = !this.showDebug;
    }

    // Handle smooth movement animation
    if (this.player.isMoving) {
      let moveDistance = this.moveSpeed * deltaTime;
      let distanceToTarget = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.player.targetX, this.player.targetY);
      
      if (distanceToTarget <= moveDistance) {
        // Snap to target and stop moving
        this.player.x = this.player.targetX;
        this.player.y = this.player.targetY;
        this.player.isMoving = false;
      } else {
        // Move towards target
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.player.targetX, this.player.targetY);
        this.player.x += Math.cos(angle) * moveDistance;
        this.player.y += Math.sin(angle) * moveDistance;
      }
    }

    // Handle smooth rotation animation
    if (this.player.isRotating) {
      let rotateAmount = this.rotateSpeed * deltaTime;
      let angleDiff = Phaser.Math.Angle.ShortestBetween(this.player.angle * (180/Math.PI), this.player.targetAngle * (180/Math.PI)) * (Math.PI/180);
      
      if (Math.abs(angleDiff) <= rotateAmount) {
        // Snap to target and stop rotating
        this.player.angle = this.player.targetAngle;
        this.player.isRotating = false;
      } else {
        // Rotate towards target
        this.player.angle += Math.sign(angleDiff) * rotateAmount;
      }
    }

    // Only accept new input if not currently animating
    if (!this.player.isMoving && !this.player.isRotating && now - this.lastMoveTime > this.moveCooldown) {
      
      // ROTATION: Snap 90° left/right with animation
      if (this.cursors.left.isDown) {
        this.player.targetAngle = this.player.angle - Math.PI / 2;
        this.player.isRotating = true;
        this.lastMoveTime = now;
        console.log("Player rotating to angle:", this.player.targetAngle);
      }

      if (this.cursors.right.isDown) {
        this.player.targetAngle = this.player.angle + Math.PI / 2;
        this.player.isRotating = true;
        this.lastMoveTime = now;
        console.log("Player rotating to angle:", this.player.targetAngle);
      }

      // MOVEMENT: Move one tile forward/backward with animation
      if (this.cursors.up.isDown) {
        const dx = Math.cos(this.player.angle);
        const dy = Math.sin(this.player.angle);
        const targetX = this.player.x + dx * this.TILE_SIZE;
        const targetY = this.player.y + dy * this.TILE_SIZE;

        console.log("Trying to move to:", targetX, targetY);
        if (this.isWalkable(targetX, targetY)) {
          this.player.targetX = targetX;
          this.player.targetY = targetY;
          this.player.isMoving = true;
          console.log("Player moving to:", targetX, targetY);
          this.lastMoveTime = now;
        } else {
          console.log("Movement blocked!");
        }
      }

      if (this.cursors.down.isDown) {
        const dx = Math.cos(this.player.angle);
        const dy = Math.sin(this.player.angle);
        const targetX = this.player.x - dx * this.TILE_SIZE;
        const targetY = this.player.y - dy * this.TILE_SIZE;

        if (this.isWalkable(targetX, targetY)) {
          this.player.targetX = targetX;
          this.player.targetY = targetY;
          this.player.isMoving = true;
          this.lastMoveTime = now;
        }
      }
    }

    // Test a single ray to see what's happening
    let testDepth = this.castRay(this.player.x, this.player.y, this.player.angle);
    if (this.time.now % 1000 < 50) { // Log every second
      console.log("Player pos:", this.player.x, this.player.y, "Test ray depth:", testDepth);
    }

    // Render the 3D view
    this.render3DView(this.graphics);
  }

}
