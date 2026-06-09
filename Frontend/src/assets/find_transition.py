import os
from PIL import Image

def find_transition():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    img_path = os.path.join(script_dir, "logo.png")
    
    img = Image.open(img_path)
    img = img.convert("RGB")
    width, height = img.size
    
    # We will analyze rows from 320 to 450.
    # Green pixels: G > 100, R < 150, B < 180
    # Red text pixels: R > 100, G < 100
    print("Row Transition Analysis:")
    for y in range(320, 450, 2):
        green_count = 0
        red_count = 0
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            # Check if not white (bg threshold 248)
            if r < 248 or g < 248 or b < 248:
                # Classify color
                if g > 120 and r < 150:
                    green_count += 1
                elif r > 100 and g < 100:
                    red_count += 1
        if green_count > 0 or red_count > 0:
            print(f"Row y={y:03d}: Green pixels={green_count:3d}, Red pixels={red_count:3d}")

if __name__ == "__main__":
    find_transition()
