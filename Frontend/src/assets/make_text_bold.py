import os
from PIL import Image

def make_logo_text_bold():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    text_path = os.path.join(script_dir, "logo_text.png")
    
    if not os.path.exists(text_path):
        print(f"Error: logo_text.png not found at {text_path}")
        return
        
    img = Image.open(text_path)
    img = img.convert("RGB")
    width, height = img.size
    print(f"Loaded logo_text.png size: {width}x{height}")
    
    # Copy original to backup
    backup_path = os.path.join(script_dir, "logo_text_original.png")
    if not os.path.exists(backup_path):
        img.save(backup_path)
        print(f"Saved original backup to {backup_path}")
        
    # We will read from the original image (or the backup to keep it clean)
    src_img = Image.open(backup_path).convert("RGB")
    
    # Dilate text pixels to make them bold
    # Background is white (255, 255, 255)
    # Text is red/brown (R < 250)
    bold_img = src_img.copy()
    
    # Store all non-white pixels
    text_pixels = {}
    threshold = 248
    for y in range(height):
        for x in range(width):
            r, g, b = src_img.getpixel((x, y))
            if r < threshold or g < threshold or b < threshold:
                text_pixels[(x, y)] = (r, g, b)
                
    # Dilation amount: 1 pixel radius (cross shape or square shape)
    # Let's use a 3x3 square structure element (radius=1)
    amount = 1
    for (x, y), color in text_pixels.items():
        for dx in range(-amount, amount + 1):
            for dy in range(-amount, amount + 1):
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    curr_r, curr_g, curr_b = bold_img.getpixel((nx, ny))
                    # If current pixel is lighter (closer to white) than the new color, replace it
                    if curr_r > color[0]:
                        bold_img.putpixel((nx, ny), color)
                        
    bold_img.save(text_path)
    print(f"Saved bolded logo_text.png to {text_path}")

if __name__ == "__main__":
    make_logo_text_bold()
