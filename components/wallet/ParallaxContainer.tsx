'use client';
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParallaxContainerProps {
  children: React.ReactNode;
  maxTilt?: number; // max tilt in degrees
  className?: string;
}

const DEFAULT_MAX_TILT = 12;

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  maxTilt = DEFAULT_MAX_TILT,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isInteracting, setIsInteracting] = useState(false);

  // Motion values for rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 120, damping: 16 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 16 });

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    rotateY.set(percentX * maxTilt);
    rotateX.set(-percentY * maxTilt);
    setIsInteracting(true);
  };

  // Mouse leave handler
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsInteracting(false);
  };

  // Touch move handler
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    rotateY.set(percentX * maxTilt);
    rotateX.set(-percentY * maxTilt);
    setIsInteracting(true);
  };

  const handleTouchEnd = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsInteracting(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative w-full transition-shadow ${isInteracting ? 'shadow-xl' : 'shadow-md'} ${className}`}
      style={{
        perspective: 1200,
        willChange: 'transform',
      }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transition: 'box-shadow 0.2s',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ParallaxContainer; 