# `src/crop/cropUtils.js`

**Location**: `src/crop/cropUtils.js` (45 lines)

## File Purpose

Two utilities used by `UserDashboard` to crop and encode a user-selected avatar into a JPEG blob URL.

## Imports

None.

## Exports

### `createImage(url) => Promise<HTMLImageElement>`
Loads an image from a URL (data URL or http URL) into an `HTMLImageElement` and resolves once it has loaded. Sets `crossOrigin = 'anonymous'` so a CORS-tainted canvas is avoided when the source is an `https://` URL.

### `getCroppedImg(imageSrc, pixelCrop, rotation = 0) => Promise<string>`
Crops + rotates the image to the requested rectangle, returns an `objectURL` of the resulting JPEG blob.

## Internal Logic

1. `createImage` the source.
2. Create an offscreen canvas sized to `Math.max(image.width, image.height) * 2` (the "safe area") so any rotation fits.
3. Translate to the center, rotate, translate back, and `drawImage` the original.
4. `getImageData(...)` of the whole safe area.
5. Resize the canvas to the crop's `width` and `height`, and `putImageData(...)` with the offset needed to position the cropped region at `(0, 0)`.
6. `canvas.toBlob(... 'image/jpeg')` and resolve the `URL.createObjectURL(...)`.

## Dependencies

* Browser `Canvas`, `Image`, `URL`, `Blob` APIs only.

## Used By

* `src/pages/UserDashboard.jsx` (when the user clicks "Crop & Upload" in the avatar modal).

## Risks

* The blob URL is never `URL.revokeObjectURL`'d. With many uploads in one session this can leak memory.
* `getCroppedImg` always encodes JPEG; PNG transparency is not preserved.
