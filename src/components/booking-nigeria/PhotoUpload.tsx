// src/components/booking-nigeria/PhotoUpload.tsx
// Photo upload component with AI scan animation - supports camera, files, gallery

'use client';
import { useRef, useState } from 'react';
import { Camera, Upload, Image } from 'lucide-react';

type PhotoState = 'empty' | 'uploading' | 'processing' | 'complete';

interface PhotoUploadProps {
    faceState: PhotoState;
    bodyState: PhotoState;
    faceImage?: string;
    bodyImage?: string;
    onFaceUpload: (file: File) => void;
    onBodyUpload: (file: File) => void;
}

export default function PhotoUpload({
    faceState,
    bodyState,
    faceImage,
    bodyImage,
    onFaceUpload,
    onBodyUpload
}: PhotoUploadProps) {
    const faceInputRef = useRef<HTMLInputElement>(null);
    const bodyInputRef = useRef<HTMLInputElement>(null);
    const [showSourcePicker, setShowSourcePicker] = useState<'face' | 'body' | null>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'face' | 'body'
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            alert('Please upload a JPG, PNG, or WebP image');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image must be less than 10MB');
            return;
        }

        if (type === 'face') {
            onFaceUpload(file);
        } else {
            onBodyUpload(file);
        }

        // Reset input and close picker
        event.target.value = '';
        setShowSourcePicker(null);
    };

    const openFilePicker = (type: 'face' | 'body', source: 'camera' | 'gallery') => {
        const inputRef = type === 'face' ? faceInputRef : bodyInputRef;
        if (inputRef.current) {
            // Set capture attribute based on source
            if (source === 'camera') {
                inputRef.current.setAttribute('capture', type === 'face' ? 'user' : 'environment');
            } else {
                inputRef.current.removeAttribute('capture');
            }
            inputRef.current.click();
        }
        setShowSourcePicker(null);
    };

    const renderPhotoBox = (
        type: 'face' | 'body',
        state: PhotoState,
        image?: string,
        inputRef?: React.RefObject<HTMLInputElement>
    ) => {
        const icon = type === 'face' ? '👤' : '🧍';
        const label = type === 'face' ? 'Face Selfie' : 'Full Body';
        const description = type === 'face'
            ? 'Clear, front-facing'
            : 'Stand straight, fitted clothes';

        return (
            <div className="flex-1">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, type)}
                    className="hidden"
                />

                <button
                    onClick={() => {
                        if (state === 'complete') {
                            // If already has image, open source picker to replace
                            setShowSourcePicker(type);
                        } else {
                            setShowSourcePicker(type);
                        }
                    }}
                    disabled={state === 'uploading' || state === 'processing'}
                    className={`
            w-full aspect-square rounded-2xl border-2 border-dashed
            flex flex-col items-center justify-center p-4
            transition-all duration-300 relative overflow-hidden
            ${state === 'empty'
                            ? 'border-gray-300 bg-gray-50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5'
                            : 'border-[#D4AF37] bg-white'
                        }
            ${state === 'complete' ? 'border-solid' : ''}
          `}
                >
                    {/* Empty State */}
                    {state === 'empty' && (
                        <>
                            <span className="text-4xl mb-2">{icon}</span>
                            <span className="font-bold text-gray-900 text-sm">{label}</span>
                            <span className="text-gray-500 text-xs text-center mt-1">{description}</span>
                            <div className="mt-3 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1.5 rounded-full">
                                TAP TO UPLOAD
                            </div>
                        </>
                    )}

                    {/* Uploading State */}
                    {state === 'uploading' && (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-3" />
                            <span className="text-gray-700 font-medium text-sm">Uploading...</span>
                        </div>
                    )}

                    {/* Processing State (Face only - AI Scan) */}
                    {state === 'processing' && (
                        <div className="relative w-full h-full">
                            {image && (
                                <img
                                    src={image}
                                    alt={label}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            )}
                            {/* AI Scan Animation */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37] animate-scan" />
                                <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                                    AI Processing...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Complete State */}
                    {state === 'complete' && image && (
                        <div className="relative w-full h-full">
                            <img
                                src={image}
                                alt={label}
                                className="w-full h-full object-cover rounded-xl"
                            />
                            {/* Checkmark Overlay */}
                            <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {/* Tap to change */}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full text-center">
                                Tap to change
                            </div>
                        </div>
                    )}
                </button>

                {/* Label below */}
                <p className="text-center text-sm text-gray-600 mt-2 font-medium">
                    {label}
                </p>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Section Header - BIGGER AND MORE READABLE */}
            <div className="text-center mb-6 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Your Photos
                </h2>
                <p className="text-base text-gray-600">
                    We need clear photos to create your amazing look
                </p>
            </div>

            {/* Two Photo Boxes */}
            <div className="flex gap-4 px-4">
                {renderPhotoBox('face', faceState, faceImage, faceInputRef)}
                {renderPhotoBox('body', bodyState, bodyImage, bodyInputRef)}
            </div>

            {/* Tips */}
            <div className="mt-4 mx-4 bg-blue-50 rounded-xl p-4">
                <p className="text-blue-800 text-xs font-medium mb-2">📷 Photo Tips:</p>
                <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Good lighting makes a huge difference</li>
                    <li>• Avoid sunglasses, hats, or heavy filters</li>
                    <li>• Simple background works best</li>
                </ul>
            </div>

            {/* Source Picker Modal */}
            {showSourcePicker && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
                    onClick={() => setShowSourcePicker(null)}
                >
                    <div
                        className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-center mb-4">
                            Choose Photo Source
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => openFilePicker(showSourcePicker, 'camera')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/10 transition-colors"
                            >
                                <Camera className="w-10 h-10 text-[#D4AF37]" />
                                <span className="font-medium text-gray-900">Camera</span>
                            </button>
                            <button
                                onClick={() => openFilePicker(showSourcePicker, 'gallery')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/10 transition-colors"
                            >
                                <Image className="w-10 h-10 text-[#D4AF37]" />
                                <span className="font-medium text-gray-900">Gallery</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSourcePicker(null)}
                            className="w-full mt-4 py-3 text-gray-500 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0.5;
          }
        }
        .animate-scan {
          animation: scan 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
