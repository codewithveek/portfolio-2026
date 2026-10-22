"""Cut out and colour-grade the hero portrait (PRD §7.5).

Usage:
    python3 tools/portrait/grade-portrait.py \
        --input assets-src/portrait/original.png \
        --output assets-src/portrait/graded-master.png

Then run `pnpm images:build` to export AVIF/WebP sizes from the master.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from numpy.typing import NDArray
from PIL import Image, ImageFilter
from rembg import new_session, remove

FloatImage = NDArray[np.float32]

LIME_RGB: tuple[float, float, float] = (198 / 255, 244 / 255, 50 / 255)


@dataclass(frozen=True)
class GradeSettings:
    saturation: float = 0.72
    contrast: float = 1.12
    key_light_falloff: float = 0.45      # brightness lost from left edge to right edge
    shadow_start: float = 0.55           # fraction of height where the lower shadow begins
    shadow_strength: float = 0.45        # brightness lost at the bottom edge
    rim_strength: float = 0.25           # inner rim on the right edge only; no outer halo
    rim_width_px: int = 9


def cut_out_subject(source: Image.Image) -> Image.Image:
    session = new_session("isnet-general-use")
    cutout = remove(
        source,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
    )
    return cutout.convert("RGBA")


def to_float_array(image: Image.Image) -> FloatImage:
    return np.asarray(image).astype(np.float32) / 255.0


def adjust_saturation_and_contrast(rgb: FloatImage, settings: GradeSettings) -> FloatImage:
    luminance = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2])[..., None]
    desaturated = luminance + (rgb - luminance) * settings.saturation
    return np.clip((desaturated - 0.5) * settings.contrast + 0.5, 0.0, 1.0)


def apply_lighting(rgb: FloatImage, settings: GradeSettings) -> FloatImage:
    height, width = rgb.shape[:2]
    horizontal = np.linspace(0.0, 1.0, width, dtype=np.float32)[None, :, None]
    vertical = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None, None]
    key_light = 1.02 - settings.key_light_falloff * horizontal**1.4
    shadow_progress = np.clip((vertical - settings.shadow_start) / (1.0 - settings.shadow_start), 0.0, 1.0)
    lower_shadow = 1.0 - settings.shadow_strength * shadow_progress
    return np.clip(rgb * key_light * lower_shadow, 0.0, 1.0)


def apply_inner_rim_light(rgb: FloatImage, alpha_mask: Image.Image, settings: GradeSettings) -> FloatImage:
    height, width = rgb.shape[:2]
    eroded = alpha_mask.filter(ImageFilter.MinFilter(settings.rim_width_px)).filter(ImageFilter.GaussianBlur(4))
    alpha = to_float_array(alpha_mask)
    inner_band = np.clip(alpha - to_float_array(eroded), 0.0, 1.0)
    horizontal = np.linspace(0.0, 1.0, width, dtype=np.float32)[None, :]
    vertical = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None]
    right_side_only = np.clip((horizontal - 0.55) / 0.3, 0.0, 1.0)
    fades_downward = 1.0 - 0.8 * vertical
    rim = (inner_band * right_side_only * fades_downward * settings.rim_strength)[..., None]
    lime = np.array(LIME_RGB, dtype=np.float32)
    return np.clip(rgb * (1.0 - rim) + lime * rim, 0.0, 1.0)


def grade_portrait(cutout: Image.Image, settings: GradeSettings) -> Image.Image:
    rgba = to_float_array(cutout)
    alpha_mask = cutout.getchannel("A")
    graded_rgb = adjust_saturation_and_contrast(rgba[..., :3], settings)
    graded_rgb = apply_lighting(graded_rgb, settings)
    graded_rgb = apply_inner_rim_light(graded_rgb, alpha_mask, settings)
    output = np.concatenate([graded_rgb, rgba[..., 3:4]], axis=-1)
    return Image.fromarray((output * 255.0).round().astype(np.uint8), mode="RGBA")


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Cut out and grade the hero portrait.")
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--save-cutout", type=Path, help="Optional path for the ungraded cutout.")
    return parser.parse_args()


def main() -> None:
    arguments = parse_arguments()
    source = Image.open(arguments.input).convert("RGB")
    cutout = cut_out_subject(source)
    if arguments.save_cutout is not None:
        cutout.save(arguments.save_cutout)
    graded = grade_portrait(cutout, GradeSettings())
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    graded.save(arguments.output)
    print(f"Wrote {arguments.output} ({graded.width}x{graded.height})")


if __name__ == "__main__":
    main()
