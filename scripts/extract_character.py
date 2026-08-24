from pathlib import Path

from PIL import Image


SOURCE = Path(
    "/Users/cassie/.codex/generated_images/019fe4f8-7e08-77d2-9fb8-49a322e35702/"
    "exec-41f7fa2a-d657-4d59-81d6-dae017c4aad3.png"
)
TARGET = Path(__file__).resolve().parents[1] / "assets" / "characters" / "cassie-walk.webp"


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            green_excess = green - max(red, blue)

            if green > 105 and green_excess > 24:
                alpha = max(0, min(255, int(255 * (1 - (green_excess - 24) / 58))))
                neutral_green = min(green, max(red, blue) + 10)
                pixels[x, y] = (red, neutral_green, blue, alpha)

    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds is None:
        raise RuntimeError("No foreground pixels found")

    left, top, right, bottom = bounds
    margin = 28
    crop = image.crop(
        (
            max(0, left - margin),
            max(0, top - margin),
            min(image.width, right + margin),
            min(image.height, bottom + margin),
        )
    )
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    crop.save(TARGET, "WEBP", quality=92, method=6)
    print(f"saved {TARGET} ({crop.width}x{crop.height})")


if __name__ == "__main__":
    main()
