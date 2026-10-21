# Creative agent instructions

This repository is both a **reference directory** and a **production standard**. Your job is to make images, films, animation, comics, storyboards, game art, and creative systems that hold up to close inspection. A beautiful prompt is not the deliverable. The finished work is.

## Mandatory entry point

1. Read this file for every creative or visual task using this repository.
2. Read the relevant skill below **before** researching, prompting, generating, implementing, or judging output:
   - Image, illustration, concept art, character design → [image](skills/image/SKILL.md).
   - Animation, AI video, motion graphics, film, comic-to-video → [animation](skills/animation/SKILL.md).
   - Stories, comics, shot design, animatics, sequential images → [storyboards](skills/storyboards/SKILL.md).
   - Game art, assets, visual systems, game UI, game prototypes → [game-art](skills/game-art/SKILL.md).
3. Always read [anti-slop](skills/anti-slop/SKILL.md) before final approval. It is a release gate, not optional inspiration.
4. Use the [creative brief](templates/creative-brief.md) when the task needs multiple assets or shots. Keep it short for a single image.
5. Consult the relevant sections of [README.md](README.md) and [resources.json](resources.json). Research actual examples and identify specific craft decisions; do not collect links without studying them.

## How to work

**Intent → reference → design → prototype → render → inspect → revise → deliver.**

- **Intent.** State audience, format, emotional/narrative outcome, technical constraints, and what must remain consistent. If the user gives a reference, inspect it before claiming to match it.
- **Reference.** Find a small number of strong, task-specific examples. Extract observable facts: framing, palette, shape, lighting, motion, acting, pacing, sound, interaction. Separate what was observed from what was inferred. Link sources where possible.
- **Design.** Choose a coherent direction with a reason for each major decision. For sequences, make a shot or beat plan. For game assets, define an asset system before drawing isolated pieces.
- **Prototype.** Validate the highest-risk moment early: a hero frame, an action cut, a scene-to-scene transition, a character turnaround, or a playable moment.
- **Render.** Produce the actual medium requested. An image is not an animation; a silent slideshow is not a voiced performance; a beautiful mockup is not a playable game.
- **Inspect.** View renders at the real delivery size. Play video with sound from beginning to end. Inspect transitions and representative frames. Play the game with its actual controls.
- **Revise.** Fix the most noticeable failure first, then inspect again. Preserve working parts; do not regenerate everything without a specific reason.
- **Deliver.** Give the artifact, the decisions that matter, and what was actually tested. If an output could not be rendered or viewed, say so. Do not claim 10/10, production ready, or consistent without evidence.

## Non-negotiable craft principles

- **Specific beats generic.** "Camera slowly reveals the empty doorway while the character stays still" is useful. "Ultra-cinematic breathtaking masterpiece" is not a shot.
- **Readability beats decoration.** The audience should understand the subject, action, scene geography, and intended focal point at the intended viewing size.
- **Movement is motivated.** Characters act because something changes. Camera moves reveal, follow, contrast, or intensify information. Avoid motion for its own sake.
- **Continuity is controlled.** Reuse established cast, costume, props, environments, style rules, scale, eyelines, and light direction unless the story calls for a change.
- **Sound is part of filmmaking.** If the requested scene needs singing, speech, ambience, music, or effects, plan and inspect them. Do not silently omit a voice-led performance.
- **No style soup.** Avoid piling up incompatible artist names, movements, lens terms, mediums, and render aesthetics. Pick one dominant visual grammar and make deliberate exceptions.
- **Do not hide defects.** Avoid disguising anatomy errors, broken lip sync, temporal drift, unreadable UI, or animation glitches with cuts, blur, film grain, overlays, or flashy transitions.
- **Do less, better.** Prefer fewer strong shots, coherent assets, and purposeful frames to more generic volume. Do not add unnecessary tools or process.
- **Use references as evidence, not automatic blueprints.** Study craft decisions, adapt to the brief, and keep a distinction between reference media and rights to reuse it.

## Handoff standard

For a completed creative task, report briefly:

1. What you made and where it is.
2. The specific reference(s) and observable technique(s) that informed it.
3. The creative choices that connect the work to the brief.
4. What you actually reviewed (render sizes, frames, footage, playback, user flow, gameplay).
5. Any unresolved quality issue, clearly identified.

This repository's instructions are intentionally independent of any particular model or tool. Use the best available tool for the artifact; **verify its real output rather than trusting the tool's description**.
