// src/lib/fileValidation.ts
// Server-side file upload validation to prevent malware uploads and DoS attacks

export interface FileValidationResult {
    valid: boolean;
    error?: string;
    sanitizedName?: string;
}

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg', // Some browsers use image/jpg instead of image/jpeg
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Maximum total upload size for all files: 50MB
export const MAX_TOTAL_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Sanitize filename to prevent path traversal attacks
 * - Remove special characters
 * - Remove path separators
 * - Limit length
 */
function sanitizeFilename(filename: string): string {
    // Remove path components (../../../etc/passwd type attacks)
    const basename = filename.split(/[/\\]/).pop() || 'file';

    // Remove special characters, keep only alphanumeric, dots, dashes, underscores
    const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Limit filename length to 100 characters
    const maxLength = 100;
    if (sanitized.length > maxLength) {
        const ext = sanitized.substring(sanitized.lastIndexOf('.'));
        const name = sanitized.substring(0, maxLength - ext.length);
        return name + ext;
    }

    return sanitized;
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return '';
    return filename.substring(lastDot).toLowerCase();
}

/**
 * Validate a single uploaded file
 */
export function validateFile(file: File): FileValidationResult {
    // 1. Check if file exists
    if (!file || !file.name) {
        return {
            valid: false,
            error: 'No file provided',
        };
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WEBP images are allowed.`,
        };
    }

    // 3. Validate file extension (defense in depth)
    const extension = getFileExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            error: `Invalid file extension: ${extension}. Only .jpg, .jpeg, .png, and .webp are allowed.`,
        };
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
        return {
            valid: false,
            error: `File too large: ${sizeMB}MB. Maximum size is ${maxSizeMB}MB.`,
        };
    }

    // 5. Check for zero-byte files
    if (file.size === 0) {
        return {
            valid: false,
            error: 'File is empty (0 bytes)',
        };
    }

    // 6. Sanitize filename
    const sanitizedName = sanitizeFilename(file.name);

    return {
        valid: true,
        sanitizedName,
    };
}

/**
 * Validate multiple files and check total size
 */
export function validateFiles(files: File[]): {
    valid: boolean;
    validFiles: File[];
    errors: string[];
    totalSize: number;
} {
    const errors: string[] = [];
    const validFiles: File[] = [];
    let totalSize = 0;

    // Validate each file
    for (const file of files) {
        const result = validateFile(file);

        if (result.valid) {
            validFiles.push(file);
            totalSize += file.size;
        } else {
            errors.push(`${file.name}: ${result.error}`);
        }
    }

    // Check total upload size
    if (totalSize > MAX_TOTAL_UPLOAD_SIZE) {
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        const maxTotalSizeMB = (MAX_TOTAL_UPLOAD_SIZE / (1024 * 1024)).toFixed(0);
        return {
            valid: false,
            validFiles: [],
            errors: [
                `Total upload size too large: ${totalSizeMB}MB. Maximum total size is ${maxTotalSizeMB}MB.`,
                ...errors,
            ],
            totalSize,
        };
    }

    return {
        valid: validFiles.length > 0 && errors.length === 0,
        validFiles,
        errors,
        totalSize,
    };
}

/**
 * Format validation errors for user-friendly display
 */
export function formatValidationErrors(errors: string[]): string {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0];
    return `Multiple validation errors:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
}
