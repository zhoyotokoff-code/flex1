import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../types';

interface CategoryCircleProps {
  category: Category;
}

const CategoryCircle: React.FC<CategoryCircleProps> = ({ category }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center gap-3 cursor-pointer shrink-0"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border border-border overflow-hidden">
        <div className="w-full h-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover scale-110 group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <span className="text-[10px] md:text-xs uppercase font-bold tracking-[0.2em] text-text-secondary">
        {category.name}
      </span>
    </motion.div>
  );
};

export default CategoryCircle;
