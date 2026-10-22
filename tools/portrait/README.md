# Portrait pipeline

Turns `assets-src/portrait/original.png` into the transparent, graded master used by the hero (PRD §7.5).

## Run

```bash
python3 -m pip install "rembg[cpu]" pillow numpy
python3 tools/portrait/grade-portrait.py \
  --input assets-src/portrait/original.png \
  --output assets-src/portrait/graded-master.png
pnpm images:build   # AVIF/WebP exports at 800, 1200, 1800 px tall + blur placeholder
```

The first run downloads the `isnet-general-use` model (about 180 MB) to `~/.rembg`.

## What it does

1. Removes the background (rembg, alpha matting on).
2. Lowers saturation (× 0.72) and raises contrast (× 1.12).
3. Lights the subject from the copy side: brighter on the left, about 55 % on the right.
4. Lets the lower part of the frame (arms) fall into shadow.
5. Adds a thin lime inner rim on the right edge only, at 25 % strength. No outer halo.

Tune values in `GradeSettings`. If you replace the original with a higher-resolution photo (≥ 1800 px tall is the goal), re-run both commands.
