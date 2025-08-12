# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"一炷香" is a Chinese traditional culture-themed web-based dodge game built with Phaser. The player controls a character dodging arrows from all directions, with time measured in "香" units (1 香 = 10 seconds).

## Game Architecture

The game follows a three-scene structure:

1. **Home Scene** (1512 × 982 pixels)
   - Main menu with game title and start button
   - Layered UI components using absolute positioning from top-left origin

2. **Main Game Scene** 
   - Left side: dodge area where player moves with WASD/arrow keys
   - Right side: incense burner timer area showing current 香 count
   - 3-2-1 countdown before gameplay starts

3. **Game Over Scene**
   - Shows survival time in 香 units
   - Restart button returns directly to countdown

## Key Game Mechanics

- **Movement**: WASD or arrow keys with full collision detection against scene boundaries
- **Timing**: Incense burner sprite animation as visual timer (10 seconds per 香)
- **Collision**: Any arrow-player contact ends the game
- **Arrow System**: Multi-directional projectiles (generation algorithm TBD)

## Current State

This is a design-phase project with only documentation present:
- `game-design-doc.md`: Complete game design specification in Chinese
- `package-lock.json`: Empty dependency lock file

## Development Setup

No build system or dependencies are currently configured. The project will require:
- Phaser framework setup
- Web server for local development
- Asset pipeline for images and audio
- Build process for production deployment

## Asset Requirements (from design doc)

- Player character sprite (static)
- Arrow projectile sprites  
- Incense burner sprite sheet for animations
- Background images (shared across scenes)
- Background music (BGM)

## Scene Layout Details

Home scene uses precise absolute positioning with 5 layered components:
- Background (1512×982 at 0,0)
- Title image (801×446 at 335,153) 
- Decorative elements at specific coordinates
- Start button (218×145 at 647,660)

All assets require scaling to specified display dimensions.