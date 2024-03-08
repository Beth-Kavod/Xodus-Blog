import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImagePreview from '@/types/Image';

interface CarouselDisplayProps {
  images: string[];
}

const CarouselDisplay: React.FC<CarouselDisplayProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(images.length > 0 ? 0 : -1); // Set currentIndex to the first image index
  }, [images]);

  return (
    <div className="relative">
      {images[currentIndex] && (
        <Image 
          src={images[currentIndex] || "/images/image_not_found.png"} 
          alt={images[currentIndex]} 
          width={700}  
          height={400}  
        />
      )}
      <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-4 bg-gray-800 bg-opacity-50 py-2">
        <button onClick={() => setCurrentIndex(prev => prev <= 0 ? images.length - 1 : prev - 1)} className="text-white px-3 py-1 rounded-lg hover:bg-gray-600 focus:outline-none">Previous</button>
        <span className="text-white">{currentIndex + 1}</span>
        <button onClick={() => setCurrentIndex(prev => prev >= images.length - 1 ? 0 : prev + 1)} className="text-white px-3 py-1 rounded-lg hover:bg-gray-600 focus:outline-none">Next</button>
      </div>
    </div>
  );
};

export default CarouselDisplay;
