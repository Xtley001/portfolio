import os
from PIL import Image, ImageDraw, ImageFont

def create_monogram_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer squircle
    radius = int(size * 0.22)
    bg_color = (12, 13, 14, 255)      # #0c0d0e
    border_color = (200, 155, 60, 220) # #c89b3c gold
    
    # Draw background box with rounded corners
    draw.rounded_rectangle(
        [(1, 1), (size - 2, size - 2)],
        radius=radius,
        fill=bg_color,
        outline=border_color,
        width=max(1, int(size * 0.05))
    )
    
    # Draw terminal prompt `>` and `X`
    # Or an elegant stylized `X` in gold
    # For small sizes (16, 32), use clean bold geometry
    gold_fill = (200, 155, 60, 255)
    accent_dim = (160, 120, 40, 255)
    
    w = size
    # Draw a bold chevron `>` on the left and `_` or `X` on right
    # Let's draw `>_` terminal prompt:
    # Chevron points:
    ch_x1 = int(w * 0.22)
    ch_x2 = int(w * 0.48)
    ch_y_mid = int(w * 0.50)
    ch_y_top = int(w * 0.28)
    ch_y_bot = int(w * 0.72)
    stroke = max(2, int(w * 0.11))
    
    draw.line([(ch_x1, ch_y_top), (ch_x2, ch_y_mid)], fill=gold_fill, width=stroke)
    draw.line([(ch_x2, ch_y_mid), (ch_x1, ch_y_bot)], fill=gold_fill, width=stroke)
    
    # Terminal cursor block `_` or `XO`
    # Underscore:
    cur_x1 = int(w * 0.56)
    cur_x2 = int(w * 0.78)
    cur_y = int(w * 0.72)
    draw.line([(cur_x1, cur_y), (cur_x2, cur_y)], fill=gold_fill, width=stroke)
    
    return img

sizes = [16, 32, 48, 64, 180, 512]
imgs = {s: create_monogram_icon(s) for s in sizes}

# Save favicon.ico (multi-frame)
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
ico_imgs = [imgs[s] for s in [16, 32, 48, 64]]
ico_imgs[0].save('public/favicon.ico', format='ICO', sizes=ico_sizes, append_images=ico_imgs[1:])
ico_imgs[0].save('app/favicon.ico', format='ICO', sizes=ico_sizes, append_images=ico_imgs[1:])

# Save apple-touch-icon.png (180x180)
imgs[180].save('public/apple-touch-icon.png', 'PNG')
imgs[180].save('app/apple-icon.png', 'PNG')

# Save 512x512 icon
imgs[512].save('public/icon.png', 'PNG')
imgs[512].save('app/icon.png', 'PNG')

print("Favicon files generated successfully!")

