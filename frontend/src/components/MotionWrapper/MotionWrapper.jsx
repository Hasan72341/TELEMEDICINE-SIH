import React from 'react';
import { motion } from 'motion/react';

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100vw',
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: '100vw',
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const containerVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
  },
};

const MotionWrapper = ({ 
  children, 
  className = '', 
  variant = 'page',
  stagger = false 
}) => {
  const variants = variant === 'container' ? containerVariants : pageVariants;
  
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
