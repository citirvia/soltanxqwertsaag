import { motion } from 'framer-motion';

export const CrownLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(176, 38, 255, 0.8)) drop-shadow(0 0 40px rgba(176, 38, 255, 0.4))' }}
  >
    {/* Geometric Crown Path - Tall Middle Peak */}
    <motion.path
      d="M20 45 L35 75 L50 25 L65 75 L80 45"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="miter"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
    
    {/* Left Diamond - Floating above left peak */}
    <motion.path
      d="M20 25 L24 33 L20 41 L16 33 Z"
      fill="white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    />

    {/* Center Diamond - Highest point */}
    <motion.path
      d="M50 5 L55 13 L50 21 L45 13 Z"
      fill="white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    />

    {/* Right Diamond - Floating above right peak */}
    <motion.path
      d="M80 25 L84 33 L80 41 L76 33 Z"
      fill="white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    />
  </svg>
);
