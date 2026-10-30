from PIL import Image

# Create completely transparent 16x16, 32x32, 48x48 images
def make_transparent(size):
    return Image.new('RGBA', (size, size), (0, 0, 0, 0))

imgs = [make_transparent(s) for s in [16, 32, 48]]

# Save 100% transparent favicon.ico
imgs[2].save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[imgs[0], imgs[1]])
imgs[2].save('app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[imgs[0], imgs[1]])

# Save transparent PNGs
t512 = make_transparent(512)
t512.save('public/icon.png', 'PNG')
t512.save('app/icon.png', 'PNG')

t180 = make_transparent(180)
t180.save('public/apple-touch-icon.png', 'PNG')
t180.save('app/apple-icon.png', 'PNG')

print("All icons converted to 100% blank/transparent successfully!")

