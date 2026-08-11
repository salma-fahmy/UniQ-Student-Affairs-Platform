import React, { useEffect, useRef, useState } from 'react';

import { FiCamera, FiLoader, FiUpload, FiInfo } from 'react-icons/fi';

import Avatar from './Avatar';

import { getPhotoUploadSignature } from '../../features/student/studentService';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

const EditableAvatar = ({
  src,
  alt,
  accessToken,
  onPhotoUpdated,
}) => {

  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const showError = (message) => {
    setValidationError(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setValidationError('');
    }, 4000);
  };

  const handleFileChange = async (event) => {

    const file = event.target.files[0];

    setIsDropdownOpen(false);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showError('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      showError('Image must be smaller than 2MB.');
      return;
    }

    setValidationError('');

    try {

      setIsUploading(true);

      const signatureData = await getPhotoUploadSignature(accessToken);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('signature', signatureData.signature);
      formData.append('folder', signatureData.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;

      const cloudinaryResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const secureImageUrl = cloudinaryData.secure_url;
      const publicId = cloudinaryData.public_id;

      if (onPhotoUpdated) {
        await onPhotoUpdated(secureImageUrl, publicId);
      }

    } catch (error) {

      console.error('Upload Error:', error);
      showError('Failed to upload photo. Please try again.');

    } finally {

      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative mb-3 inline-block" ref={dropdownRef}>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      <div
        className="group relative inline-block cursor-pointer rounded-full bg-white p-[6px] shadow-[0_4px_15px_rgb(0,0,0,0.04)]"
        onClick={() => !isUploading && setIsDropdownOpen((prev) => !prev)}
      >

        <div className="relative h-[108px] w-[108px] overflow-hidden rounded-full">

          <Avatar
            src={src}
            alt={alt}
            className="h-full w-full !bg-slate-100 !shadow-none"
          />

          {!isUploading && (
            <div className="absolute inset-0 bg-indigo-900/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          )}

          {isUploading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px]">
              <FiLoader size={24} className="mb-1 animate-spin text-indigo-600" />
              <span className="animate-pulse text-[10px] font-bold text-indigo-800">
                Uploading...
              </span>
            </div>
          )}

        </div>

        {!isUploading && (
          <div className="absolute bottom-1 right-1 z-20 rounded-full border-[3px] border-white bg-indigo-800 p-[8px] text-white shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:bg-indigo-700">
            <FiCamera size={16} />
          </div>
        )}

      </div>

      {isDropdownOpen && !isUploading && (
        <div className="absolute left-1/2 z-50 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

          <div className="flex items-start gap-2 border-b border-slate-50 bg-indigo-50/60 px-4 py-3">
            <FiInfo size={13} className="mt-[2px] shrink-0 text-indigo-400" />
            <p className="text-[11px] leading-snug text-indigo-500">
              Upload a real personal photo. JPEG, PNG or WebP only · Max 2MB.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-800"
          >
            <FiUpload size={15} className="shrink-0 text-indigo-500" />
            Upload new photo
          </button>

        </div>
      )}

      {validationError && (
        <div className="absolute left-1/2 z-50 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-red-100 bg-white px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <p className="text-[12px] font-medium leading-snug text-red-500">
            {validationError}
          </p>
        </div>
      )}

    </div>
  );
};

export default EditableAvatar;