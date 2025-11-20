# PWA Icons

This directory should contain the PWA app icons in various sizes.

## Required Sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons:

You can use online tools or command-line tools to generate these icons from a single source image:

### Option 1: Using Online Tools
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

### Option 2: Using ImageMagick (CLI)
```bash
# Starting from a 1024x1024 PNG source image
convert icon-source.png -resize 72x72 icon-72x72.png
convert icon-source.png -resize 96x96 icon-96x96.png
convert icon-source.png -resize 128x128 icon-128x128.png
convert icon-source.png -resize 144x144 icon-144x144.png
convert icon-source.png -resize 152x152 icon-152x152.png
convert icon-source.png -resize 192x192 icon-192x192.png
convert icon-source.png -resize 384x384 icon-384x384.png
convert icon-source.png -resize 512x512 icon-512x512.png
```

## Placeholder Icons

For development purposes, you can create simple placeholder icons using any graphics editor or use the favicon generator tools mentioned above.

The icons should represent the Gym Tracker brand - consider using:
- Dumbbell icon
- Barbell icon
- Fitness/gym themed graphics
- Your brand colors (primary: #2563eb blue)
