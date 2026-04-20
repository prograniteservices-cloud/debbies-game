import { motion } from 'framer-motion';

export default function NumberButton({ number, onClick, isWrong }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      animate={isWrong ? { x: [-10, 10, -10, 10, 0], filter: 'grayscale(1)' } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      onClick={() => onClick(number)}
      className="clay-button w-24 h-24 sm:w-32 sm:h-32 !rounded-[2rem] !text-5xl !shadow-xl"
      style={{ '--button-bg': '#7a5fff' }}
    >
      {number}
    </motion.button>
  );
}
