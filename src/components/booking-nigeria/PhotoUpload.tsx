// src/components/booking-nigeria/PhotoUpload.tsx
// Photo upload component with Lucide icons

'use client';
import { useRef, useState } from 'react';
import { Camera, Image, X, Users, User, UserCircle, Check } from 'lucide-react';

type PhotoState = 'empty' | 'uploading' | 'processing' | 'complete';

interface PhotoData {
    file: File | null;
    url: string;
    state: PhotoState;
}

interface PhotoUploadProps {
    faceState?: PhotoState;
    bodyState?: PhotoState;
    faceImage?: string;
    bodyImage?: string;
    onFaceUpload?: (file: File) => void;
    onBodyUpload?: (file: File) => void;
    isGroupMode?: boolean;
    groupSize?: number;
    groupPhotos?: { face: PhotoData; body: PhotoData }[];
    onGroupPhotoUpload?: (personIndex: number, type: 'face' | 'body', file: File) => void;
}

export default function PhotoUpload({
    faceState = 'empty',
    bodyState = 'empty',
    faceImage = '',
    bodyImage = '',
    onFaceUpload,
    onBodyUpload,
    isGroupMode = false,
    groupSize = 2,
    groupPhotos = [],
    onGroupPhotoUpload
}: PhotoUploadProps) {
    const faceInputRef = useRef<HTMLInputElement>(null);
    const bodyInputRef = useRef<HTMLInputElement>(null);
    const groupInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const [showSourcePicker, setShowSourcePicker] = useState<{ type: 'face' | 'body'; personIndex?: number } | null>(null);
    const [expandedPerson, setExpandedPerson] = useState<number>(0);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'face' | 'body',
        personIndex?: number
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            alert('Please upload a JPG, PNG, or WebP image');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('Image must be less than 10MB');
            return;
        }

        if (isGroupMode && onGroupPhotoUpload && personIndex !== undefined) {
            onGroupPhotoUpload(personIndex, type, file);
        } else {
            if (type === 'face' && onFaceUpload) {
                onFaceUpload(file);
            } else if (type === 'body' && onBodyUpload) {
                onBodyUpload(file);
            }
        }

        event.target.value = '';
        setShowSourcePicker(null);
    };

    const openFilePicker = (type: 'face' | 'body', source: 'camera' | 'gallery', personIndex?: number) => {
        const inputKey = personIndex !== undefined ? `${personIndex}-${type}` : type;
        const inputRef = isGroupMode ? groupInputRefs.current[inputKey] : (type === 'face' ? faceInputRef.current : bodyInputRef.current);

        if (inputRef) {
            if (source === 'camera') {
                inputRef.setAttribute('capture', type === 'face' ? 'user' : 'environment');
            } else {
                inputRef.removeAttribute('capture');
            }
            inputRef.click();
        }
        setShowSourcePicker(null);
    };

    const renderSinglePhotoBox = (
        type: 'face' | 'body',
        state: PhotoState,
        image?: string,
        inputRef?: React.RefObject<HTMLInputElement>
    ) => {
        const IconComponent = type === 'face' ? UserCircle : User;
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
                    onClick={() => setShowSourcePicker({ type })}
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
                    {state === 'empty' && (
                        <>
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                                <IconComponent className="w-8 h-8 text-gray-500" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{label}</span>
                            <span className="text-gray-500 text-xs text-center mt-1">{description}</span>
                            <div className="mt-3 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                TAP TO UPLOAD
                            </div>
                        </>
                    )}

                    {state === 'uploading' && (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-3" />
                            <span className="text-gray-700 font-medium text-sm">Uploading...</span>
                        </div>
                    )}

                    {state === 'processing' && (
                        <div className="relative w-full h-full">
                            {image && (
                                <img src={image} alt={label} className="w-full h-full object-cover rounded-xl" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37] animate-scan" />
                                <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                                    AI Processing...
                                </div>
                            </div>
                        </div>
                    )}

                    {state === 'complete' && image && (
                        <div className="relative w-full h-full">
                            <img src={image} alt={label} className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full text-center">
                                Tap to change
                            </div>
                        </div>
                    )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-2 font-medium">{label}</p>
            </div>
        );
    };

    // Group mode render
    if (isGroupMode && groupSize > 1) {
        return (
            <div className="w-full">
                {/* Section Header */}
                <div className="text-center mb-6 px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Upload Group Photos
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-base text-gray-600">
                        <Users className="w-5 h-5" />
                        <span>{groupSize} people - Upload photos for each person</span>
                    </div>
                </div>

                {/* Person Cards */}
                <div className="px-4 space-y-4">
                    {Array.from({ length: groupSize }).map((_, personIndex) => {
                        const personPhotos = groupPhotos[personIndex] || {
                            face: { file: null, url: '', state: 'empty' as PhotoState },
                            body: { file: null, url: '', state: 'empty' as PhotoState }
                        };
                        const isExpanded = expandedPerson === personIndex;
                        const faceComplete = personPhotos.face.state === 'complete';
                        const bodyComplete = personPhotos.body.state === 'complete';
                        const bothComplete = faceComplete && bodyComplete;

                        return (
                            <div
                                key={personIndex}
                                className={`
                  bg-white rounded-2xl border-2 overflow-hidden transition-all
                  ${bothComplete ? 'border-green-400' : 'border-gray-200'}
                `}
                            >
                                {/* Person Header */}
                                <button
                                    onClick={() => setExpandedPerson(isExpanded ? -1 : personIndex)}
                                    className="w-full px-4 py-3 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${bothComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                    `}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-bold text-gray-900">Person {personIndex + 1}</span>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className={`flex items-center gap-1 ${faceComplete ? 'text-green-600' : ''}`}>
                                                    <UserCircle className="w-3 h-3" />
                                                    Face {faceComplete ? '✓' : '○'}
                                                </span>
                                                <span className={`flex items-center gap-1 ${bodyComplete ? 'text-green-600' : ''}`}>
                                                    <User className="w-3 h-3" />
                                                    Body {bodyComplete ? '✓' : '○'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                        <div className="flex gap-4">
                                            {/* Face Photo */}
                                            <div className="flex-1">
                                                <input
                                                    ref={(el) => { groupInputRefs.current[`${personIndex}-face`] = el; }}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={(e) => handleFileChange(e, 'face', personIndex)}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => setShowSourcePicker({ type: 'face', personIndex })}
                                                    className={`
                            w-full aspect-square rounded-xl border-2 border-dashed
                            flex flex-col items-center justify-center p-3
                            transition-all relative overflow-hidden
                            ${personPhotos.face.state === 'empty'
                                                            ? 'border-gray-300 bg-gray-50'
                                                            : 'border-[#D4AF37] bg-white border-solid'
                                                        }
                          `}
                                                >
                                                    {personPhotos.face.state === 'empty' ? (
                                                        <>
                                                            <UserCircle className="w-8 h-8 text-gray-400 mb-1" />
                                                            <span className="text-xs font-medium text-gray-600">Face</span>
                                                        </>
                                                    ) : personPhotos.face.url ? (
                                                        <img
                                                            src={personPhotos.face.url}
                                                            alt="Face"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                                                    )}
                                                    {personPhotos.face.state === 'complete' && (
                                                        <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Body Photo */}
                                            <div className="flex-1">
                                                <input
                                                    ref={(el) => { groupInputRefs.current[`${personIndex}-body`] = el; }}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={(e) => handleFileChange(e, 'body', personIndex)}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => setShowSourcePicker({ type: 'body', personIndex })}
                                                    className={`
                            w-full aspect-square rounded-xl border-2 border-dashed
                            flex flex-col items-center justify-center p-3
                            transition-all relative overflow-hidden
                            ${personPhotos.body.state === 'empty'
                                                            ? 'border-gray-300 bg-gray-50'
                                                            : 'border-[#D4AF37] bg-white border-solid'
                                                        }
                          `}
                                                >
                                                    {personPhotos.body.state === 'empty' ? (
                                                        <>
                                                            <User className="w-8 h-8 text-gray-400 mb-1" />
                                                            <span className="text-xs font-medium text-gray-600">Body</span>
                                                        </>
                                                    ) : personPhotos.body.url ? (
                                                        <img
                                                            src={personPhotos.body.url}
                                                            alt="Body"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                                                    )}
                                                    {personPhotos.body.state === 'complete' && (
                                                        <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Progress Summary */}
                <div className="mt-4 mx-4 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-4 h-4 text-blue-700" />
                        <p className="text-blue-800 text-xs font-medium">Upload Progress:</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                    width: `${(groupPhotos.filter(p => p?.face?.state === 'complete' && p?.body?.state === 'complete').length / groupSize) * 100}%`
                                }}
                            />
                        </div>
                        <span className="text-xs text-blue-700 font-medium">
                            {groupPhotos.filter(p => p?.face?.state === 'complete' && p?.body?.state === 'complete').length}/{groupSize} complete
                        </span>
                    </div>
                </div>

                {/* Source Picker Modal */}
                {showSourcePicker && (
                    <div
                        className="fixed inset-0 z-[70] bg-black/50 flex items-end justify-center"
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
                                    onClick={() => openFilePicker(showSourcePicker.type, 'camera', showSourcePicker.personIndex)}
                                    className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/10 transition-colors"
                                >
                                    <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-[#D4AF37]" />
                                    </div>
                                    <span className="font-medium text-gray-900">Camera</span>
                                </button>
                                <button
                                    onClick={() => openFilePicker(showSourcePicker.type, 'gallery', showSourcePicker.personIndex)}
                                    className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/10 transition-colors"
                                >
                                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                        <Image className="w-8 h-8 text-purple-600" />
                                    </div>
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
            0% { top: 0; opacity: 1; }
            100% { top: 100%; opacity: 0.5; }
          }
          .animate-scan { animation: scan 1.5s ease-in-out infinite; }
        `}</style>
            </div>
        );
    }

    // Single person mode
    return (
        <div className="w-full">
            <div className="text-center mb-6 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Your Photos
                </h2>
                <p className="text-base text-gray-600">
                    We need clear photos to create your amazing look
                </p>
            </div>

            <div className="flex gap-4 px-4">
                {renderSinglePhotoBox('face', faceState, faceImage, faceInputRef)}
                {renderSinglePhotoBox('body', bodyState, bodyImage, bodyInputRef)}
            </div>

            <div className="mt-4 mx-4 bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-blue-700" />
                    <p className="text-blue-800 text-xs font-medium">Photo Tips:</p>
                </div>
                <ul className="text-blue-700 text-xs space-y-1 ml-6">
                    <li>• Good lighting makes a huge difference</li>
                    <li>• Avoid sunglasses, hats, or heavy filters</li>
                    <li>• Simple background works best</li>
                </ul>
            </div>

            {/* Source Picker Modal */}
            {showSourcePicker && (
                <div
                    className="fixed inset-0 z-[70] bg-black/50 flex items-end justify-center"
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
                                onClick={() => openFilePicker(showSourcePicker.type, 'camera')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/10 transition-colors"
                            >
                                <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                                <span className="font-medium text-gray-900">Camera</span>
                            </button>
                            <button
                                onClick={() => openFilePicker(showSourcePicker.type, 'gallery')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/10 transition-colors"
                            >
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <Image className="w-8 h-8 text-purple-600" />
                                </div>
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
          0% { top: 0; opacity: 1; }
          100% { top: 100%; opacity: 0.5; }
        }
        .animate-scan { animation: scan 1.5s ease-in-out infinite; }
      `}</style>
        </div>
    );
}
