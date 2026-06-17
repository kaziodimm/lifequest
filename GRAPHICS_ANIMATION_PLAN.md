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
- constellation-style research map readability and atmosphere
- Apple-level interaction polish

It should not feel like:

- generic SaaS
- cartoon habit tracker
- cheap mobile game
- static dashboard
- spreadsheet-like task management

## Reference Policy

Habidoo can study strong game UIs for principles, but must not copy another game's art direction, layout, node shapes, icons, colors, panels, or decorative trim.

Reference principles we can use:

- open constellation map
- free camera navigation
- selected node focus
- locked future paths
- collectible research nodes
- premium HUD panels
- strong central object

Reference details we must not copy:

- exact node layout
- exact star chart design
- exact colors and frames
- exact icons
- exact panel styling
- exact naming or progression logic

## Core Tree Composition

The Life Tree should not feel like a boxed scroll window.

It should feel like an open field:

- central Life Core in the middle
- categories branching outward from the center
- free panning and zooming
- large future space around the user
- non-circular technology emblems
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
- generated or hand-polished map background assets

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

## Production Asset Roadmap

### Asset Set 1: Animus Dark Background

Purpose:

- replace pure CSS background with a real game-grade atmosphere
- support fullscreen map readability
- keep center readable for the Life Core

Needed variants:

- desktop wide background
- mobile portrait background
- subtle low-size fallback texture

### Asset Set 2: Category Icon Medallions

Purpose:

- replace generic outline icons with Habidoo-owned visual identity

Needed icons:

- Health
- Mind
- Career
- Business
- Finance
- Relationships
- Creativity

Format target:

- SVG or optimized PNG/WebP after final art direction is accepted
- consistent frame, lighting, trim, and category accent

### Asset Set 3: Node Frames

Purpose:

- make nodes feel like collectible technology objects

Needed states:

- locked
- available
- in progress
- completed
- major milestone

### Asset Set 4: Connection and Fog Layers

Purpose:

- make branches feel like a living research constellation

Needed layers:

- normal branch
- active branch
- completed branch
- locked/fog branch
- future era fog

### Asset Set 5: Theme Packs

Each future theme needs:

- background
- category medallions
- node frames
- line style
- panel treatment
- unlock effect direction

Do not build all five themes before Animus Dark reaches game quality.

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
- generated art concepts kept as reference until production assets are selected

Later:

- Framer Motion or Motion One
- canvas/SVG hybrid tree layer
- custom icon asset pipeline
- optimized WebP/AVIF backgrounds
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

Fix fullscreen viewport, camera movement, and map overflow.

### Step 5

Add unlock animation and timer rings.

### Step 6

Add era regions and fog-of-war.

### Step 7

Add custom branded graphics and app-store quality visual assets.

## Product Rule

Every visual effect must support the Life Tree, mission progress, or era advancement.

If it does not make progression clearer or more desirable, it should not be added yet.
