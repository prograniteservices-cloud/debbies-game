import { motion } from 'framer-motion';
import { Apple } from 'lucide-react';

export default function ItemGrid({ count, itemIcon: Icon = Apple, itemColor = "text-red-500" }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    show: { scale: 1, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 200 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      key={count}
      className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 w-full max-w-4xl mx-auto content-center`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={item}>
          <Icon className={`w-16 h-16 sm:w-24 sm:h-24 ${itemColor} drop-shadow-xl`} />
        </motion.div>
      ))}
    </motion.div>
  );
}
