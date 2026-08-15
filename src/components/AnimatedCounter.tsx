'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 1,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const spring = useSpring(value, {
    mass: 0.8,
    stiffness: 75,
    damping: 15
  });

  const displayValue = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{displayValue}</motion.span>;
};
