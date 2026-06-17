# Habidoo Art Direction

## Purpose

Habidoo must look and feel like a real game interface, not a productivity dashboard with decorative icons.

The Life Tree is the product. The visual system must make the user feel that real life can be researched, upgraded, and unlocked.

## Core Visual Promise

Habidoo is a Life Strategy Game presented as a living research map.

The user should feel:

- I am inside a progression map.
- My life has branches, eras, and unlocks.
- Every node means something real.
- The next unlock is visible and desirable.

The user should not feel:

- I am filling a checklist.
- I am scrolling a dashboard.
- I am using another habit tracker.
- This is a SaaS template.

## Reference Policy

Habidoo can study strong game interfaces for principles, but must not copy their exact look, assets, layout, iconography, colors, naming, or composition.

Relevant reference principles:

- constellation-like research maps
- large navigable progression fields
- selected-node focus and information panel
- locked future branches
- strong center/core object
- collectible node states
- premium game HUD framing

Do not reproduce any existing game's specific art, node layout, panels, crests, shapes, colors, or decorative trim.

## Tree Composition

The Life Tree should feel like an open constellation field.

Required qualities:

- fullscreen page
- no boxed scroll container
- free camera movement
- zoom and pan as map navigation
- click node to focus camera
- close panel returns to previous camera position
- central Life Core
- branches as constellations, not rows
- future space visible around the current path
- locked areas readable but mysterious

The map must feel bigger than the current MVP content.

## First Visual Style: Animus Dark

Animus Dark is the first production style.

Theme:

A premium dark star-chart strategy interface for ambitious adults.

Visual ingredients:

- deep obsidian background
- subtle blue-black cosmic atmosphere
- faint radial rings
- cyan/violet research energy
- antique gold for core, milestones, and major unlocks
- geometric artifact frames
- glowing but restrained lines
- sharp category glyphs

It should feel inspired by strategy games, sci-fi research maps, ancient instruments, and premium mobile UI.

It must not feel childish, cartoonish, or like a generic cyberpunk gradient.

## Other Visual Styles

The five styles are full thematic skins, not simple color modes.

Each style changes:

- background art direction
- map texture
- node frame shape
- icon style
- connection style
- unlock animation tone
- panel ornamentation
- category badge treatment

### Animus Dark

Dark constellation research interface.

Icons: sharp geometric glyphs, artifact symbols, command UI marks.

Connections: glowing research paths with gold milestone joints.

Background: star map, radial rings, deep obsidian field.

### Mirage Atlas

Historical atlas and ancient navigation interface.

Icons: etched seals, compass marks, astrolabe symbols, route markers.

Connections: ink/gold map routes and engraved constellation lines.

Background: warm parchment, faint compass geometry, premium manuscript texture.

### Arcade Codex

Collectible game progression codex.

Icons: premium pixel badges, item-like upgrades, collectible frames.

Connections: chunky readable paths, bright reward highlights.

Background: dark pixel-grid field with discovery sparks.

### Neon Synapse

Futuristic neural strategy network.

Icons: circuit glyphs, neural nodes, signal marks, data modules.

Connections: electric pulses, scan-line paths, holographic arcs.

Background: black neural mesh, soft neon haze, controlled sci-fi glow.

### Verdant Relic

Ancient living growth map.

Icons: seeds, roots, stone relics, flame, leaf, carved symbols.

Connections: root-like tendrils and living energy veins.

Background: dark botanical field, moss stone texture, quiet ember glow.

## Node Art Rules

Nodes should not be plain circles.

Each node should feel like a collectible technology object:

- framed medallion
- readable icon
- category color accent
- locked variant
- available variant
- active variant
- completed variant

Important nodes can have larger frames, more ornamentation, or gold trim.

Minor nodes can be smaller stars, seals, or stones.

## Background Rules

The background must not be empty CSS decoration.

It should provide:

- depth
- atmosphere
- navigation context
- future mystery
- readable contrast for nodes

Near-term implementation can use CSS/SVG layers, but the target is generated or custom-made bitmap background art for each theme.

## Interaction Rules

The camera is part of the experience.

Required behavior:

- overview shows the larger tree
- pan moves freely
- wheel/pinch zoom changes map scale
- tapping a node focuses the camera
- mission panel appears near the selected node
- panel size is stable
- closing panel returns to the previous camera position
- bottom nav always stays accessible

## Quality Bar

A screenshot of the Life Tree should be interesting even before the user understands the app.

If the screenshot looks like a dashboard, the visual direction failed.

If it looks like a mysterious progression map that invites interaction, it is moving in the right direction.
