# render360

Render a Tech Trend 360 episode from a local topic folder name.

## Configuration (fixed per machine)
- **REMOTION_ROOT**: `/Users/admin/trend360-remotion`
- **IMAGES_ROOT**: `/Users/admin/TechTrends360/generated-images`
- **SFX_DIR**: `REMOTION_ROOT/public/sfx`
- **NOTION_CONTENT_LIBRARY_ID**: `359ec5fb-0523-815a-ad7b-d20642545792`

## Invocation
```
/render360 [topic-folder-name]
```
The argument is the exact name of a folder under IMAGES_ROOT — hyphenated, lowercase.
Examples: `nuclear-fusion-energy-race`, `ai-agents`, `quantum-computing-explained`

---

## Execution — follow these steps in order

### Step 1 — Verify the topic folder exists

Check that this path exists:
```
IMAGES_ROOT/[topic-folder-name]/
```

List its contents so you can see what image files are present.

If the folder does not exist, stop:
```
⚠ Folder not found: IMAGES_ROOT/[topic-folder-name]/
Check the folder name — it must match exactly (lowercase, hyphens).
```

### Step 2 — Search Notion for the episode page

Convert the folder name to a search query by replacing hyphens with spaces.
Example: `nuclear-fusion-energy-race` → `"nuclear fusion energy race"`

Use the Notion MCP `notion-search` tool with `page_url` scoped to the Content Library:
- `page_url`: `359ec5fb-0523-815a-ad7b-d20642545792`
- `query`: the converted search string

Get the top 3 results. Pick the page whose title most closely matches the topic.
If unsure, show the top matches to the user and ask which one.

If no matching page is found, stop:
```
⚠ Episode page not found in Notion for: [topic-folder-name]
Check the title or run trend360 [topic] in Claude.ai first to generate the page.
```

### Step 3 — Extract the manifest from Section 22

Fetch the full Notion page using `notion-fetch` with the page ID.

Scan the content for a heading containing **"Section 22"** or **"Remotion Episode Manifest"**.

Find the code block labelled **Output Block B** (the one containing JSON that starts with):
```
{ "episodeId": "techtrend360-
```

Parse that JSON as the Episode Manifest.

If no manifest block is found, stop:
```
⚠ No manifest found in Section 22 of the Notion page.
Run trend360 [topic] in Claude.ai to generate it. Section 22 is auto-written by forge360.
```

### Step 4 — Extract the episode number (NNN)

From the manifest's `episodeId` field (e.g. `"techtrend360-003"`), extract the numeric suffix: `003`.
This is **NNN** — used for folder names, file names, and output path throughout.

### Step 5 — Collect all asset checks

Run all checks before reporting anything, so the user gets the full picture in one shot.

**A — Images (from manifest)**
For each image `src` across all scenes (e.g. `episodes/003/scene1.png`):
- Extract the filename: `scene1.png`
- Check it exists at: `IMAGES_ROOT/[topic-folder-name]/scene1.png`
- Collect any missing filenames

**B — Audio (in Remotion public folder)**
Check both of these paths exist:
- `REMOTION_ROOT/public/episodes/NNN/voiceover.wav`
- `REMOTION_ROOT/public/episodes/NNN/music.mp3`

Note: audio files are manually placed by the user before running render360.
The `public/episodes/NNN/` folder may not exist yet — if it doesn't, both audio checks fail.

**C — SFX (in shared SFX folder)**
For each unique `sfx` value across all scenes (e.g. `whoosh_draw`):
- Check: `REMOTION_ROOT/public/sfx/[sfx].mp3`
- Collect any missing SFX filenames

### Step 6 — Report and decide

**If images or audio are missing → HALT:**
```
⚠ Cannot render — missing required assets:

Missing images (add to IMAGES_ROOT/[topic-folder-name]/):
  - scene2icon3.png
  - scene5.png

Missing audio (add to REMOTION_ROOT/public/episodes/NNN/):
  - voiceover.wav        ← Kokoro TTS / UltimateTTS Studio output
  - music.mp3            ← Sonauto AI output

Fix the above then re-run /render360 [topic-folder-name].
```

**If only SFX is missing → WARN and continue:**
```
⚠ Missing SFX files (scenes will render silently for these):
  - drone_tension.mp3
  - swell_payoff.mp3
Add them to REMOTION_ROOT/public/sfx/ to enable sound effects.
Proceeding with render...
```

**If everything is present:**
```
✓ All [N] images found.
✓ voiceover.wav and music.mp3 found.
✓ All SFX found.   (or: ⚠ [N] SFX missing — render will proceed silently)
```

### Step 7 — Prepare the manifest for render

Take the parsed manifest JSON.

If any SFX files were missing (Step 5C), remove the `sfx` field from those scenes in the manifest object. This prevents Remotion from erroring on missing files — the `SfxAudio` component also handles this gracefully, but stripping here is cleaner.

### Step 8 — Create the Remotion episode folder

```bash
mkdir -p REMOTION_ROOT/public/episodes/NNN
```

### Step 9 — Copy images

Copy all image files from the topic folder to the Remotion public folder in one bash pass:

```bash
cp IMAGES_ROOT/[topic-folder-name]/scene*.png \
   REMOTION_ROOT/public/episodes/NNN/
```

### Step 10 — Write the manifest JSON

Write the (cleaned) manifest JSON to:
```
REMOTION_ROOT/public/episodes/NNN/episode-NNN.json
```
Overwrite if it already exists.

### Step 11 — Run the Remotion render

```bash
cd REMOTION_ROOT
npx remotion render TechTrendEpisode out/episode-NNN.mp4 \
  --props='./public/episodes/NNN/episode-NNN.json'
```

Stream output so the user can see progress.

### Step 12 — Report result

On success:
```
✅ Render complete.
Output: REMOTION_ROOT/out/episode-NNN.mp4
Duration: [X] scenes · [N] frames · [Xs at 30fps]
```

On failure: surface the raw Remotion CLI error — do not wrap or suppress it.

---

## Error reference

| Condition | Behaviour |
|---|---|
| Topic folder not found | Halt — show exact path checked |
| Notion page not found | Halt — suggest `trend360 [topic]` in Claude.ai |
| No manifest in Section 22 | Halt — suggest `trend360 [topic]` in Claude.ai |
| Images missing | Halt — list every missing filename |
| Audio missing (voiceover or music) | Halt — list which file(s) and where to place them |
| SFX missing | Warn — list missing files, strip from manifest, continue |
| Remotion render error | Surface raw CLI error |
