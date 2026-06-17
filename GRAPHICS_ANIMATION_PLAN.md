# Habidoo Graphics and Animation Plan

## Goal

Habidoo must eventually feel like a game, not a decorated productivity app.

Graphics and animation are not optional polish. They are part of the product experience because the Life Tree must feel alive and worth returning to.

## Visual Direction

The product should feel like:

- premium strategy game UI
- Civilization-scale progression
- Stellaris-style systems
- Path of Exile-style tree depth
- Duolingo-level daily motivation clarity
- Assassin's Creed-style skill tree readability and atmosphere
- Apple-level interaction polish

It should not feel like:

- generic SaaS
- cartoon habit tracker
- cheap mobile game
- static dashboard
- spreadsheet-like task management

## Core Tree Composition

The Life Tree should not feel like a boxed scroll window.

It should feel like an open field:

- central Life Core in the middle
- categories branching outward from the center
- free panning and zooming
- large future space around the user
- circular technology nodes
- glowing connections
- locked areas dimmed like undiscovered progression
- active missions highlighted as the next meaningful move

The user should feel that they are navigating a strategy map, not scrolling a list.

## Core Graphic Systems

### 1. Life Tree Visual Layer

The Life Tree should evolve from simple nodes into a game map.

Future improvements:

- custom category node shapes
- animated connection lines
- glow states
- unlock pulse
- era regions
- fog-of-war for future eras
- category icons
- parallax background layers
- zoom and pan controls
- radial branch labels
- open-field map composition

### 2. Technology Node Art

Every technology should eventually have a custom icon.

Icon style:

- geometric
- premium
- readable on mobile
- category-coded
- not cartoonish

Examples:

- Health: pulse, shield, body system
- Mind: eye, book, neural path
- Business: launch, market, signal
- Finance: vault, graph, portfolio
- Relationships: network, bond, signal
- Creativity: spark, forge, artifact

### 3. Mission Animation

Missions should feel active.

States:

- ready
- active
- cooldown
- completed
- failed/expired later

Animations:

- timer ring
- progress pulse
- completion sweep
- XP gain burst
- cooldown dim state

### 4. Era Progression

Eras should feel like chapters.

Future visuals:

- era banners
- animated transition when entering a new era
- locked era silhouettes
- milestone gates
- strategic map labels

### 5. Profile and Identity

Profile should feel like a commander/life strategist profile.

Future visuals:

- animated level badge
- life score emblem
- unlocked technology collection
- category mastery rings
- achievement medals

## Visual Theme System

Habidoo should support multiple visual styles over time. These are not just color themes; each style should affect icons, backgrounds, node treatment, connection style, and animation tone.

### Animus Dark

Default MVP direction.

- dark open field
- golden Life Core
- cyan and violet energy lines
- strategy-game interface
- sharp geometric icons

### Mirage Atlas

Warm historical-map direction.

- parchment atlas background
- ink and lapis connections
- compass geometry
- etched artifact icons
- calm but premium mood

### Arcade Codex

More collectible game direction.

- readable pixel-grid field
- chunky node frames
- emerald, amber, and magenta accents
- pixel achievement badges
- stronger reward feel

### Neon Synapse

Sci-fi neural strategy direction.

- holographic mesh field
- electric cyan and plasma violet lines
- scan-line atmosphere
- neural/circuit icons
- futuristic motion language

### Verdant Relic

Organic ancient growth direction.

- dark botanical field
- root-like connections
- jade and ember highlights
- relic/seed/flame icons
- slower living glow

## Animation Principles

Use animation to communicate state.

Good animation:

- confirms unlocks
- shows progress
- highlights the next action
- makes the tree feel alive
- rewards real effort

Avoid animation that is:

- decorative only
- too childish
- too slow
- distracting from action

## Technical Direction

Near-term:

- CSS transitions
- Tailwind animation utilities
- SVG icons
- lightweight unlock effects
- radial SVG connection layer
- local pan and zoom controls

Later:

- Framer Motion or Motion One
- canvas/SVG hybrid tree layer
- custom icon asset pipeline
- Lottie only if it fits performance
- possible WebGL/Three.js only for specific hero/visual moments, not core UI by default

## MVP Graphics Roadmap

### Step 1

Improve static strategy UI.

### Step 2

Add category icons and better node shapes.

### Step 3

Move the Life Tree from row sectors into an open radial field.

### Step 4

Add unlock animation and timer rings.

### Step 5

Add era regions and fog-of-war.

### Step 6

Add custom branded graphics and app-store quality visual assets.

## Product Rule

Every visual effect must support the Life Tree, mission progress, or era advancement.

If it does not make progression clearer or more desirable, it should not be added yet.
