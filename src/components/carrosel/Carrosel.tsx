import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // Importando Link do react-router-dom
import './Carousel.css';

interface CarouselItem {
  image: string;
  title: string;
  description: string;
  gameRoute: string; 
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const getPosition = (index: number): 'left' | 'center' | 'right' | 'hidden' => {
    const relative = (index - currentIndex + total) % total;
    if (relative === 0) return 'left';
    if (relative === 1) return 'center';
    if (relative === 2) return 'right';
    return 'hidden';
  };

  const getStyles = (position: string) => {
    switch (position) {
      case 'left':
        return { x: -540, opacity: 0.5, scale: 0.9, zIndex: 1 };
      case 'center':
        return { x: 0, opacity: 1, scale: 1, zIndex: 2 };
      case 'right':
        return { x: 540, opacity: 0.5, scale: 0.9, zIndex: 1 };
      default:
        return { opacity: 0, scale: 0.8, zIndex: 0 };
    }
  };

  return (
    <div className="carousel-container">
      <button onClick={prevSlide} className="nav-button">◀</button>
      <div className="carousel-wrapper">
        <AnimatePresence>
          {items.map((item, index) => {
            const pos = getPosition(index);
            if (pos === 'hidden') return null;

            const style = getStyles(pos);

            return (
              <motion.div
                key={index}
                className="carousel-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={style}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="carousel-content">
                  <img src={item.image} alt={item.title} className="carousel-image" />
                  <h2 className="carousel-title">{item.title}</h2>
                  <p className="carousel-description">{item.description}</p>
                  <Link to={item.gameRoute} className="play-button">
                    JOGAR
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <button onClick={nextSlide} className="nav-button">▶</button>
    </div>
  );
};

export default Carousel;
