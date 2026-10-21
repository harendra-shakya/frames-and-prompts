---
name: game-art
description: Design and verify coherent game art direction, sprites, characters, animations, UI, environments, and playable visual systems.
---

# Game art and interactive visual direction

A game visual exists in an **interactive system**, not on an ArtStation poster. Judge it at the target camera distance, resolution, movement speed, and actual gameplay context.

## Define the playable visual problem

Record genre, platform, camera (side-view, top-down, isometric, first/third-person), target resolution, gameplay loop, input, engine/render pipeline and performance constraints.

Lock an asset bible:

- **Art grammar:** silhouette, proportions, shape language, perspective grid, outline/shading rules, texture scale, palette and materials.
- **Gameplay communication:** ally/enemy/objective distinction, hitboxes/attack telegraphs, interactable affordances, environmental hazards, UI priority.
- **Production contract:** sprite/tile dimensions, anchor/pivot points, transparency, export format, naming, animation states, tileability, and atlas conventions.
- **Consistency:** character turnaround, equipment, environment scale, light direction, iconography, font, FX palette.

## Research examples in context

- [Game Art Style Atlas](https://gameartstyle.loopyhop.com/) for coherent style families.
- [Game UI Database](https://www.gameuidatabase.com/) and [Interface In Game](https://interfaceingame.com/) for game UI patterns.
- [Lospec Palette List](https://lospec.com/palette-list) for pixel palettes.
- [ArtStation Game Art](https://www.artstation.com/channels/game_art?include_ai=false) for professional concept-art quality.
- [Genie Labs](https://genielabs.tech/learn/prompts) for asset-oriented prompt directions.

Do not mix screenshots from unrelated games as a single look without reconciling palette, perspective, materials, and UI scale.

## Produce a small vertical slice

1. Make one representative environment, one playable character, one interaction/enemy, and the minimum UI necessary to test the loop.
2. Verify character motion in context (idle → move → act → recover). Sprite animations must preserve mass, alignment, contact and anchors.
3. For pixel art: use intended pixel dimensions, consistent pixel clusters, no arbitrary resampling or blurred outlines, and exact grid alignment.
4. For tiles: test seams, edge transitions, repetition artifacts, lighting continuity and traversal/readability.
5. For 3D: test silhouette and materials with the game's **real camera/light**, not only in a turntable render.
6. For UI: test contrast, input response, active/disabled states, text readability and safe-area placement.
7. Play with real input at target resolution. If gameplay is not implemented, call the output concept art or a prototype, not a completed game.

## Game-specific anti-slop checks

- Can the player identify the objective in one glance?
- Are important attacks, interactables, and navigation readable during movement?
- Do all assets appear to belong to the same world? Are scale and perspective consistent?
- Are repeated props/tiles obviously copy-pasted in distracting ways?
- Does visual density conceal controls, collision boundaries, or UI?
- Do idle, locomotion and hit/reaction states connect without popping?

**Reject when:** a compelling key art image has no translation to functional assets, sprites jitter from shifting pivots, tile seams are visible, UI is unreadable, or the game loop cannot be tested.

**Deliver:** art bible, asset manifest with dimensions/states, in-engine screenshots or playable build, and what was playtested.
