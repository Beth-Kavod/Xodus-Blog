import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImagePreview from '@/types/Image';

interface CarouselEditProps {
  images: ImagePreview[];
  setImages: React.Dispatch<React.SetStateAction<ImagePreview[]>>;
}

const CarouselEdit: React.FC<CarouselEditProps> = ({ images, setImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(images.length - 1); // Set currentIndex to the index of the last uploaded image
  }, [images]);

  const removeImage = (imageName: string) => {
    const filteredImages = images.filter(image => image.preview !== imageName);
    setImages(filteredImages);
    setCurrentIndex(prev => prev === 0 ? prev : prev - 1);
  };

  return (
    <div className="relative">
      {images[currentIndex] && (
        <Image 
          src={images[currentIndex].preview || "/images/image_not_found.png"} 
          alt={images[currentIndex].preview} 
          width={700}  
          height={400}  
        />
      )}
      <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-4 bg-gray-800 bg-opacity-50 py-2">
        <button onClick={() => setCurrentIndex(prev => prev <= 0 ? images.length - 1 : prev - 1)} className="text-white px-3 py-1 rounded-lg hover:bg-gray-600 focus:outline-none">Previous</button>
        <span className="text-white">{currentIndex + 1}</span>
        <button onClick={() => setCurrentIndex(prev => prev >= images.length - 1 ? 0 : prev + 1)} className="text-white px-3 py-1 rounded-lg hover:bg-gray-600 focus:outline-none">Next</button>
      </div>
      <button onClick={() => removeImage(images[currentIndex].preview)} className="absolute bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none">Remove Image</button>
    </div>
  );
};

export default CarouselEdit;
