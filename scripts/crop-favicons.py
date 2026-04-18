#!/usr/bin/env python3
"""
Crop transparent edges from Pokemon sprites and stretch to 48x48 square.
Fills the entire canvas so the Pokemon occupies the full favicon.
"""

from PIL import Image
import os
import sys
from pathlib import Path

def process_sprite(src_path: str, dst_path: str, size: int = 48) -> bool:
    """
    1. Open PNG with alpha
    2. Find bounding box of non-transparent pixels
    3. Crop to that box
    4. Stretch to `size` x `size` square (fills canvas)
    5. Save as PNG
    """
    try:
        img = Image.open(src_path)
    except Exception as e:
        print(f"  ERROR opening {src_path}: {e}")
        return False

    # Ensure RGBA
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox is None:
        # Fully transparent
        print(f"  SKIP (fully transparent): {os.path.basename(src_path)}")
        return False

    # Crop to content
    cropped = img.crop(bbox)

    # Stretch to square (fills entire canvas, no transparency padding)
    resized = cropped.resize((size, size), Image.LANCZOS)

    # Save
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    resized.save(dst_path, 'PNG')
    return True


def main():
    base = Path('/Users/myk/Repo/wangrui2025/sprites-gallery/public/favicons/msikma_pokesprite/pokemon-gen8')

    # Process regular (from backup original 32x32)
    src_dir = base / 'regular_20260418'
    dst_dir = base / 'regular'

    if not src_dir.exists():
        print(f"Source dir not found: {src_dir}")
        sys.exit(1)

    files = sorted(src_dir.glob('*.png'))
    print(f"Processing {len(files)} files from {src_dir} -> {dst_dir}")
    print(f"Output size: 48x48 (stretched fill)")
    print()

    success = 0
    skip = 0
    fail = 0

    for i, f in enumerate(files, 1):
        dst = dst_dir / f.name
        ok = process_sprite(str(f), str(dst), size=48)
        if ok:
            success += 1
        else:
            # Check if file exists (skip) or truly failed
            if f.stat().st_size < 100:
                skip += 1
            else:
                fail += 1

        if i % 200 == 0:
            print(f"  ... {i}/{len(files)} done")

    print(f"\nDone: {success} processed, {skip} skipped, {fail} failed")


if __name__ == '__main__':
    main()
