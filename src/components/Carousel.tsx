'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CarouselProps<T> {
  items: T[];
  // ** IMPORTANTE: Aquí la corrección clave **
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  itemWidth: number;
  gap?: number;
  selectedItemId?: string | null;
  onSelectItemId?: (id: string | null) => void;
  autoScrollDuration?: number; 
  autoScrollEnabled?: boolean; 
}

export default function Carousel<T extends { id: string }>(
  {
    items,
    renderItem,
    itemWidth,
    gap = 16,
    selectedItemId,
    onSelectItemId,
    autoScrollDuration = 20, 
    autoScrollEnabled = true,
  }: CarouselProps<T>
) {
  const [isHovered, setIsHovered] = useState(false);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const animationInnerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentScrollLeftRef = useRef<number>(0);
  const scrollDistanceRef = useRef<number>(0);
  const totalOriginalContentWidthRef = useRef<number>(0);

  const duplicatedItems = [...items, ...items, ...items];
  const calculateTotalOriginalContentWidth = useCallback(() => {
    if (carouselViewportRef.current && items.length > 0) {
      const firstItem = animationInnerRef.current?.children[0] as HTMLElement;
      if (firstItem) {
        const itemWithGap = itemWidth + gap;
        totalOriginalContentWidthRef.current = items.length * itemWithGap;
      }
    }
  }, [items.length, itemWidth, gap]);

  useEffect(() => {
    calculateTotalOriginalContentWidth();
    window.addEventListener('resize', calculateTotalOriginalContentWidth);
    return () => {
      window.removeEventListener('resize', calculateTotalOriginalContentWidth);
    };
  }, [calculateTotalOriginalContentWidth, items]);
  const handleSelectItem = useCallback((item: T) => {
    if (onSelectItemId) {
      onSelectItemId(item.id);
    }
  }, [onSelectItemId]);

  const animateScroll = useCallback((timestamp: DOMHighResTimeStamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const durationMs = autoScrollDuration * 1000; 

    const totalWidthToScroll = totalOriginalContentWidthRef.current;
    if (totalWidthToScroll === 0) {
      animationFrameId.current = requestAnimationFrame(animateScroll);
      return;
    }

    let newScrollLeft = (elapsed / durationMs) * totalWidthToScroll;

    if (carouselViewportRef.current) {
      if (newScrollLeft >= totalWidthToScroll) {
        newScrollLeft = newScrollLeft % totalWidthToScroll; 
        startTimeRef.current = timestamp - (newScrollLeft / totalWidthToScroll) * durationMs; 
      }
      carouselViewportRef.current.scrollLeft = newScrollLeft;
      currentScrollLeftRef.current = newScrollLeft;
    }

    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [autoScrollDuration]);

  useEffect(() => {
    if (autoScrollEnabled && !isHovered) {
      startTimeRef.current = null; 
      animationFrameId.current = requestAnimationFrame(animateScroll);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [autoScrollEnabled, isHovered, animateScroll]);

  const handlePrev = () => {
    if (carouselViewportRef.current) {
      const scrollAmount = itemWidth + gap;
      carouselViewportRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 3000);
    }
  };

  const handleNext = () => {
    if (carouselViewportRef.current) {
      const scrollAmount = itemWidth + gap;
      carouselViewportRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
      setIsHovered(true); 
      setTimeout(() => setIsHovered(false), 3000); 
    }
  };

  useEffect(() => {
    if (carouselViewportRef.current && items.length > 0) {
    
      const initialScrollPosition = totalOriginalContentWidthRef.current;
      carouselViewportRef.current.scrollLeft = initialScrollPosition;
      currentScrollLeftRef.current = initialScrollPosition;
    }
  }, [items]); 

  return (
    <div
      className="relative w-full max-w-5xl mx-auto flex items-center justify-center"
    >
    
      <button
        onClick={handlePrev}
        className="carousel-arrow carousel-arrow-left"
        aria-label="Anterior"
      >
        
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="#8F00FF" stroke="#6C63FF" strokeWidth="2"/>
          <path d="M24 12 L16 20 L24 28" stroke="#00BFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      
      <div
        ref={carouselViewportRef}
        className="flex overflow-hidden custom-scrollbar-hide"
        style={{ width: '100%', height: 'auto' }}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <div
          ref={animationInnerRef}
          className="flex gap-4"
          style={{ width: `${totalOriginalContentWidthRef.current * 3}px` }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`} 
              style={{ minWidth: `${itemWidth}px`, maxWidth: `${itemWidth}px` }}
              className="flex-shrink-0"
              onClick={() => handleSelectItem(item)} 
            >
              {renderItem(item, item.id === selectedItemId)}
            </div>
          ))}
        </div>
      </div>

      
      <button
        onClick={handleNext}
        className="carousel-arrow carousel-arrow-right"
        aria-label="Siguiente"
      >
        
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="#8F00FF" stroke="#6C63FF" strokeWidth="2"/>
          <path d="M16 12 L24 20 L16 28" stroke="#00BFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}