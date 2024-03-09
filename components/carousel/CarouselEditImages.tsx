import { useState, useEffect, SyntheticEvent } from 'react';
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

  const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <div className="relative">
      {images[currentIndex] && (
        <div className='p-2'>
          <Image
            src={images[currentIndex].preview || "/images/image_not_found.png"}
            alt={images[currentIndex].preview}
            width={700}
            height={400}
          />
        </div>
      )}
      <div className="inset-x-0 bottom-0 flex justify-center items-center bg-gray-800 bg-opacity-50 py-2">
        <button onClick={(event) => { preventDefault(event); setCurrentIndex(prev => prev <= 0 ? images.length - 1 : prev - 1)}} className="bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active">Previous</button>
        <span className="mx-1 bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active">{currentIndex + 1}</span>
        <button onClick={(event) => { preventDefault(event); setCurrentIndex(prev => prev >= images.length - 1 ? 0 : prev + 1)}} className="bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active">Next</button>
      </div>
      <button onClick={(event) => { preventDefault(event); removeImage(images[currentIndex].preview)}} className="bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none">Remove Image</button>
    </div>
  );
};

export default CarouselEdit;
