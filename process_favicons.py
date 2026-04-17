#!/usr/bin/env python3
"""Trim transparent borders from Pokémon icons and resize to 32x32 for favicon use."""

from PIL import Image
import os
import sys

INPUT_DIR = "temp_icons"
OUTPUT_DIR = "dist_favicons"
TARGET_SIZE = (32, 32)


def process_icon(in_path, out_path):
    with Image.open(in_path) as img:
        img = img.convert("RGBA")
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
        img = img.resize(TARGET_SIZE, Image.LANCZOS)
        img.save(out_path)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith(".png")]
    if not files:
        print(f"No PNG files found in {INPUT_DIR}")
        sys.exit(1)

    for filename in files:
        in_path = os.path.join(INPUT_DIR, filename)
        out_path = os.path.join(OUTPUT_DIR, filename)
        process_icon(in_path, out_path)
        print(f"Processed {filename} -> {out_path}")

    print(f"\nDone. {len(files)} icon(s) written to {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
