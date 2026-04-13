# Images Directory

All images for the website go here, organized by type.

## Directory Structure

```
/images/
├── /projects/     # Project screenshots and thumbnails
├── /travels/      # Travel photos for Wanderings page
└── /misc/         # Favicon, OG images, logos, etc.
```

## Image Requirements

### File Formats
- **Primary**: WebP (best compression and quality)
- **Fallback**: JPEG (for older browser compatibility if needed)
- **Icons/Logos**: SVG (scalable, tiny file size)

### Size Limits
- **Max file size**: 150KB per image
- **Max width**: 1200px for full-size photos
- **Thumbnails**: 800px wide max

### Optimization

Before adding images to this directory, **always optimize them**:

**Option 1: Online Tool (Easiest)**
1. Go to [Squoosh.app](https://squoosh.app/)
2. Upload your image
3. Select WebP format
4. Adjust quality slider until file size is <150KB
5. Download and add to appropriate folder

**Option 2: Command Line**
```bash
# Using ImageMagick
convert input.jpg -resize 1200x -quality 85 output.webp

# Using cwebp
cwebp -q 85 input.jpg -o output.webp
```

## Naming Conventions

Use descriptive, lowercase names with hyphens:

✅ **Good:**
- `tiny-doodle-screenshot.webp`
- `iceland-glacier-lagoon.webp`
- `james-headshot.webp`

❌ **Bad:**
- `IMG_1234.jpg`
- `Screen Shot 2024-01-15.png`
- `my photo.jpg` (spaces!)

## Required Images

### Must Have (For Full Functionality)

**`/misc/`**
- `favicon.svg` - Site favicon (SVG, <5KB)
- `apple-touch-icon.png` - iOS home screen icon (180x180px)
- `og-image.jpg` - Open Graph default image (1200x630px, <200KB)
- `twitter-image.jpg` - Twitter card image (1200x675px, <200KB)

**`/projects/`**
- One image per project listed in `/data/projects.json`
- Recommended size: 800x600px, <100KB

**`/travels/`**
- One main image per trip in `/data/travels.json`
- 3-5 gallery images per trip
- Recommended size: 1200x800px, <150KB each

## Checklist Before Adding Images

- [ ] Image is optimized (<150KB)
- [ ] Image is in WebP format (or SVG for icons)
- [ ] Image has descriptive filename
- [ ] Image is in correct subfolder
- [ ] Image path matches JSON reference
- [ ] Image loads correctly locally

## Testing Images

After adding images:

1. **Check file size**: `ls -lh images/folder/`
2. **Test locally**: Run local server and verify images load
3. **Check lazy loading**: Open DevTools → Network, scroll page
4. **Verify on mobile**: Test on actual mobile device

## Backup Original Images

Keep high-resolution originals elsewhere (not in this repo):
- Personal backup drive
- Cloud storage (Google Photos, iCloud, etc.)
- External hard drive

Only commit optimized, web-ready images to this repository.

---

**Need help?** See [README.md](../README.md) for detailed image optimization guide.
