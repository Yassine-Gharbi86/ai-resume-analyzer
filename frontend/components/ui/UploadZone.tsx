/**
 * components/ui/UploadZone.tsx
 *
 * A reusable drag-and-drop file upload zone.
 * Accepts a PDF file and calls the onFileSelect callback.
 *
 * This component is "dumb" — it doesn't talk to the API itself.
 * The parent page controls the actual upload logic.
 * This separation is a React best practice called "lifting state up."
 */

'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled = false }: UploadZoneProps) {
  // isDragging: true when the user is hovering a file over the drop zone
  const [isDragging, setIsDragging] = useState(false);

  // fileInputRef: a direct reference to the hidden <input type="file">.
  // We use this to trigger the file picker dialog when the user clicks the zone.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Drag event handlers ───────────────────────────────────────────────────

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    // Prevent default browser behavior (opening the file in the tab)
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    // e.dataTransfer.files is a FileList (like an array of File objects)
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelect(files[0]);
    }
  };

  // ── Click to browse ───────────────────────────────────────────────────────

  const handleClick = () => {
    if (!disabled) {
      // Programmatically click the hidden file input to open the file picker
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelect(files[0]);
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateAndSelect = (file: File) => {
    // Client-side check before sending to the server.
    // The server will also validate — this just gives instant feedback.
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5 MB.');
      return;
    }
    onFileSelect(file);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const borderColor = isDragging
    ? 'border-indigo-400 bg-indigo-500/5'
    : 'border-[#2a2a3e] hover:border-[#3d3d5c] bg-[#0d0d16]';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative rounded-2xl border-2 border-dashed p-12 text-center
        transition-all duration-200 cursor-pointer select-none
        ${borderColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Icon */}
      <div className={`text-4xl mb-4 transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
        📄
      </div>

      {/* Labels */}
      <p className="text-sm font-medium text-[#c0c0d8] mb-1">
        {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
      </p>
      <p className="text-xs text-[#6b7280]">
        or <span className="text-indigo-400 underline underline-offset-2">click to browse</span>
      </p>
      <p className="text-xs text-[#4a4a5e] mt-3">PDF only · max 5 MB</p>
    </div>
  );
}
