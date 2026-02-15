// src/utils/imageCompression.ts
// Background image compression using native <canvas> API (zero dependencies).
// Compresses images >2MB to ≤2MB while maintaining high visual quality.
// Runs silently in the background while users continue filling out the form.

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB threshold
const MAX_DIMENSION = 1600; // Max width/height in pixels
const JPEG_QUALITY = 0.85; // High quality JPEG

/**
 * Compress an image file if it exceeds the size threshold.
 * Returns the original file if already under threshold.
 * Uses the browser's native <canvas> API — no external dependencies.
 */
export async function compressImage(file: File): Promise<File> {
    // Skip if already under threshold
    if (file.size <= MAX_FILE_SIZE) {
        return file;
    }

    // Skip non-image files
    if (!file.type.startsWith('image/')) {
        return file;
    }

    try {
        const compressed = await doCompress(file);
        console.log(
            `🗜️ Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`
        );
        return compressed;
    } catch (error) {
        // If compression fails for any reason, return original file
        console.warn('⚠️ Image compression failed, using original:', error);
        return file;
    }
}

/**
 * Compress multiple files concurrently.
 * Returns an array of compressed files (or originals if compression not needed).
 */
export async function compressImages(files: File[]): Promise<File[]> {
    return Promise.all(files.map(compressImage));
}

function doCompress(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            try {
                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = img;
                const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height, 1);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);

                // Draw to canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to JPEG blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas toBlob returned null'));
                            return;
                        }

                        // Create a new File with the compressed data
                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, '.jpg'),
                            { type: 'image/jpeg', lastModified: Date.now() }
                        );

                        // If compression made it bigger somehow, return original
                        resolve(compressedFile.size < file.size ? compressedFile : file);
                    },
                    'image/jpeg',
                    JPEG_QUALITY
                );
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for compression'));
        };

        img.src = url;
    });
}
