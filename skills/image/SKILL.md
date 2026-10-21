---
name: image
description: Direct and verify high-quality single images, concept art, character sheets, manga panels, environments, and visual styles.
---

# Image direction

Use for illustrations, character/location design, keyframes, manga/manhwa panels, style frames, marketing art, and game concept art.

## Start with the image's job

Specify the subject and action, audience, final crop/aspect ratio, target viewing size, and what the viewer must notice first. Decide whether it is a **standalone hero image**, a **sequence frame**, or a **reusable reference asset**. Each has different acceptance criteria.

## Research before prompting

- Style vocabulary: [Futurepedia AI Style Atlas](https://www.futurepedia.io/resources/ai-style-atlas/view) and [Midlibrary](https://midlibrary.io/).
- Composition and lighting: [ShotDeck](https://shotdeck.com/) and [FilmGrab](https://film-grab.com/).
- Model-specific prompt mechanics: [Runway image prompting](https://help.runwayml.com/hc/en-us/articles/35694045317139-Gen-4-Image-Prompting-Guide).
- For each chosen example, record 2–4 **observable** features: silhouette, line weight, shape language, value structure, edge treatment, depth, color, or material. Do not copy generic adjectives or pretend to have inspected images you could not access.

## Art-direction specification

Define before generation:

1. **Composition:** focal point, foreground/midground/background, negative space, scale, subject placement.
2. **Subject:** identity, anatomy/proportions, emotion, pose, gesture, clothing, distinctive props.
3. **Medium:** ink, cel paint, charcoal, pixel art, clay, photographed miniature, PBR, etc. Pick one governing logic.
4. **Value/light:** main source, shadows, value hierarchy, reflection behavior, time of day.
5. **Palette and texture:** a controlled palette with a clear accent; materials behave consistently.
6. **Continuity:** reference sheet or prior frame, fixed character traits, environment landmarks, camera and light relationships.
7. **Exclusions:** explicit defects relevant to the scene, not a giant negative-prompt dump.

### Prompt structure

Use concrete production language, not hype:

> [Subject and identifiable traits] [specific action/emotion] in [setting]. [Shot size, angle, composition and focal point]. [One coherent medium/line/texture treatment]. [Light direction and value design]. [Palette]. [Props and continuity requirements]. [Aspect ratio and non-negotiables].

For multi-frame work, keep a **stable reference block** for character/world/style; vary only pose, expression, camera, and local action. Use supported image references, masks, edits, or control inputs instead of hoping text alone preserves identity.

## Review the actual pixels

Inspect both full-resolution detail and final-display-size readability. Check silhouette, hands and faces, contact shadows, physical relationships, perspective, text, material consistency, line quality, unwanted duplicate objects, and the focal hierarchy. For a sequence, compare frames side by side for identity and art-style drift.

Correct the **largest visible failure** first. Prefer a focused edit over full regeneration when the overall direction works. Do not upscale or add texture to compensate for weak composition.

**Reject when:** character identity changes between connected shots, key props vanish, anatomy distracts, spatial relationships contradict the story, style is inconsistent, or the image cannot be read at delivery size.

**Deliver:** final image(s), the locked style/continuity notes for reuse, and observed limitations.
