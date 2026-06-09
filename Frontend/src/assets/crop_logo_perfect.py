import os
from PIL import Image

def process_logo_perfect():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    img_path = os.path.join(script_dir, "logo.png")
    
    if not os.path.exists(img_path):
        print(f"Error: logo.png not found at {img_path}")
        return
        
    img = Image.open(img_path)
    img = img.convert("RGB")
    width, height = img.size
    print(f"Original image size: {width}x{height}")
    
    # 1. Inpaint (remove) the scanner line on the base image
    # Let's locate the scanner line first
    line_x = None
    best_match_count = 0
    check_rows = [5, 10, 15, 20, 25, 30, 35, 40, 460, 465, 470, 475, 480, 485, 490, 495]
    
    for x in range(150, 300):
        gray_pixels = 0
        for y in check_rows:
            r, g, b = img.getpixel((x, y))
            if r < 248 or g < 248 or b < 248:
                gray_pixels += 1
        if gray_pixels > best_match_count:
            best_match_count = gray_pixels
            line_x = x
            
    cleaned_img = img.copy()
    if line_x is not None and best_match_count >= 5:
        line_left = line_x
        while line_left > 0:
            r, g, b = img.getpixel((line_left, 10))
            if r < 248 or g < 248 or b < 248:
                line_left -= 1
            else:
                break
        line_right = line_x
        while line_right < width - 1:
            r, g, b = img.getpixel((line_right, 10))
            if r < 248 or g < 248 or b < 248:
                line_right += 1
            else:
                break
        
        line_left = max(0, line_left - 1)
        line_right = min(width - 1, line_right + 1)
        line_width = line_right - line_left + 1
        print(f"Scanner line horizontal span: X = {line_left} to {line_right} (width: {line_width}px)")
        
        for y in range(height):
            r_l, g_l, b_l = img.getpixel((max(0, line_left - 2), y))
            r_r, g_r, b_r = img.getpixel((min(width - 1, line_right + 2), y))
            
            for x in range(line_left, line_right + 1):
                t = (x - line_left) / (line_width + 1)
                r = int(r_l * (1 - t) + r_r * t)
                g = int(g_l * (1 - t) + g_r * t)
                b = int(b_l * (1 - t) + b_r * t)
                cleaned_img.putpixel((x, y), (r, g, b))
        print("Scanner line successfully inpainted!")

    # 2. Crop Emblem (upper part, y from 0 to 398)
    # We remove any red/brown text pixels that are inside this box
    emblem_box = (0, 0, width, 398)
    emblem_crop = cleaned_img.crop(emblem_box)
    emblem_w, emblem_h = emblem_crop.size
    
    # Filter out red text pixels (where r > 100 and r > g)
    for y in range(emblem_h):
        for x in range(emblem_w):
            r, g, b = emblem_crop.getpixel((x, y))
            # If it's a red text pixel, make it white
            if r > 100 and r > g + 10:
                emblem_crop.putpixel((x, y), (255, 255, 255))
                
    # Now auto-crop the white borders
    left, top, right, bottom = emblem_w, emblem_h, 0, 0
    threshold = 250
    for y in range(emblem_h):
        for x in range(emblem_w):
            r, g, b = emblem_crop.getpixel((x, y))
            if r < threshold or g < threshold or b < threshold:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y
                
    left = max(0, left - 5)
    top = max(0, top - 5)
    right = min(emblem_w, right + 5)
    bottom = min(emblem_h, bottom + 5)
    
    emblem_final = emblem_crop.crop((left, top, right, bottom))
    emblem_path = os.path.join(script_dir, "logo_emblem.png")
    emblem_final.save(emblem_path)
    print(f"Saved perfectly cropped emblem ({emblem_final.size[0]}x{emblem_final.size[1]}) to {emblem_path}")
    
    # 3. Crop Cursive Brand Text (y from 385 to height)
    # We remove any green/teal emblem pixels that are inside this box
    text_box = (0, 385, width, height)
    text_crop = cleaned_img.crop(text_box)
    text_w, text_h = text_crop.size
    
    # Filter out green emblem pixels (where g > 100 and g > r)
    # Also filter out any non-red noise to keep text clean
    for y in range(text_h):
        for x in range(text_w):
            r, g, b = text_crop.getpixel((x, y))
            # If it's a green pixel or if it doesn't have a red tint, make it white
            # (allow light gray anti-aliasing but remove green/teal)
            if g > 100 and g > r:
                text_crop.putpixel((x, y), (255, 255, 255))
                
    # Auto-crop the white borders of the text
    left, top, right, bottom = text_w, text_h, 0, 0
    for y in range(text_h):
        for x in range(text_w):
            r, g, b = text_crop.getpixel((x, y))
            if r < threshold or g < threshold or b < threshold:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y
                
    left = max(0, left - 8)
    top = max(0, top - 5)
    right = min(text_w, right + 8)
    bottom = min(text_h, bottom + 5)
    
    text_cropped = text_crop.crop((left, top, right, bottom))
    
    # Save a backup of the original text crop (thin version)
    backup_path = os.path.join(script_dir, "logo_text_original.png")
    text_cropped.save(backup_path)
    print(f"Saved thin original text to {backup_path}")
    
    # 4. Apply Bold Stroke Dilation to the cropped text
    bold_img = text_cropped.copy()
    text_w, text_h = text_cropped.size
    
    text_pixels = {}
    for y in range(text_h):
        for x in range(text_w):
            r, g, b = text_cropped.getpixel((x, y))
            if r < threshold or g < threshold or b < threshold:
                text_pixels[(x, y)] = (r, g, b)
                
    amount = 1
    for (x, y), color in text_pixels.items():
        for dx in range(-amount, amount + 1):
            for dy in range(-amount, amount + 1):
                nx, ny = x + dx, y + dy
                if 0 <= nx < text_w and 0 <= ny < text_h:
                    curr_r, curr_g, curr_b = bold_img.getpixel((nx, ny))
                    if curr_r > color[0]:
                        bold_img.putpixel((nx, ny), color)
                        
    text_path = os.path.join(script_dir, "logo_text.png")
    bold_img.save(text_path)
    print(f"Saved bolded, perfectly cropped logo_text.png ({bold_img.size[0]}x{bold_img.size[1]}) to {text_path}")

if __name__ == "__main__":
    process_logo_perfect()
