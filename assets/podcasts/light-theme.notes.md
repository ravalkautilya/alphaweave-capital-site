# Podcast visual refresh

The nine videos linked from podcasts.html use the ivory, sage, emerald, slate-blue, and muted rust website palette. FindingAlphaPodcast.tsx uses the current AW monogram. Narration files and source case data are retained.

## Rebuild animated episodes

From remotion/: `node render-podcast-theme.mjs`. An optional composition ID limits rendering, for example `node render-podcast-theme.mjs FindingAlphaEpisode01`. This renders the five Finding Alpha episodes and two dated cases at their original 1920x1080, 30 fps, duration and audio timing. Files are staged before replacing the published assets.

## Presentation and trade recording

Presentation frames are captured from docs/site/presentation-20260816.html using the anchors in scripts/capture_presentation_sections.mjs. The 21 frame timings follow Presentation20260816Walkthrough in the Remotion source; duration 642 seconds, 5 fps, original narration. The palette and readable report excerpts come from the current public page.

scripts/refresh_podcast_captures.py captures the original saved trade specimen payload without querying a database or changing the application theme. It creates light-theme replay states and a concat manifest in artifacts/ui-preview/trade-podcast-light. All 12 original events remain, with a final held dashboard frame during the original narration. Duration 283.04 seconds. The regenerated screen capture is a replay of the stored specimen, not a new trading run.

Embedded source report screenshots in the dated case episodes retain their original appearance and values. Frame/caption graphics surrounding them use the new theme. Audio-only MP3 files do not contain visual themes and are unchanged.

Podcast page media URLs are versioned to prevent old cached posters and videos appearing after deployment. No deployment is performed by the rendering scripts.

The four short homepage explainers use the same palette and monogram. Rebuild them from remotion/ with `node render-explainer-theme.mjs`; durations remain 24 seconds at 30 fps.

Validation: completed renders are checked with ffprobe for video/audio streams, 1920x1080 dimensions, original duration and frame rate; representative covers and interior frames are visually inspected. The project-wide TypeScript check currently reports missing @types/react declarations in the existing Remotion dependency setup; the Remotion bundler and video renderer compile the compositions successfully.
