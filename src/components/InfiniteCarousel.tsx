import React from 'react';
import { cn } from '@/lib/utils';
interface InfiniteCarouselProps {
  children: React.ReactNode;
  className?: string;
}
const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({ children, className }) => {
  return (
    <div className={cn("carousel", className)}>
      <div className="carousel__track">
        {React.Children.map(children, (child, index) => (
          <div className="carousel__item" key={`original-${index}`}>{child}</div>
        ))}
        {/* Duplicated for infinite effect */}
        {React.Children.map(children, (child, index) => (
          <div className="carousel__item" aria-hidden="true" key={`clone-${index}`}>{child}</div>
        ))}
      </div>
    </div>
  );
};
export default InfiniteCarousel;