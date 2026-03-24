import { motion } from 'framer-motion';

export default function NumberButton({ number, onClick, isWrong }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      onClick={() => onClick(number)}
      className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-5xl font-black shadow-lg shadow-purple-500/50 flex items-center justify-center border-b-8 border-purple-800 active:border-b-0 active:translate-y-2 transition-all cursor-pointer select-none"
    >
      {number}
    </motion.button>
  );
}
