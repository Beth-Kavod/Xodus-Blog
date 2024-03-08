import React, { ChangeEvent, useState } from 'react';
import Image from '@/types/Image';

interface ImageUploadProps {
  params: {
    setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({ params }) => {
  const { setImages } = params;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews = await Promise.all(Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            resolve(e.target.result.toString());
          }
        };
        reader.readAsDataURL(file);
      });
    }));

    // Update the images state with both preview and file for each selected file
    setImages(prevImages => [
      ...(prevImages || []), // Ensure prevImages is an array
      ...Array.from(files).map((file, index) => ({
        preview: previews[index],
        file: file
      }))
    ]);
  };

  return (
    <input type="file" onChange={handleFileChange} placeholder="Add Images" className="file:rounded-md file:bg-light-theme-green file:text-white file:outline-none file:border-0 file:p-1 file:px-2 file:mr-4 text-sm file:hover:bg-light-theme-green-active file:cursor-pointer" multiple />
  );
};

export default ImageUpload;
