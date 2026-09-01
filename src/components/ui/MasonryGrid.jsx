import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const MasonryGrid = React.forwardRef(
  ({ className, columns, gap = 4, children, ...props }, ref) => {
    // Dynamically create the style object for column layout if columns prop is specified
    const style = {
      ...(columns ? { columnCount: columns } : {}),
      columnGap: `${gap * 0.25}rem`,
    };

    // Animation variants for child elements
    const cardVariants = {
      hidden: { opacity: 0, y: 24, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };

    return (
      <div 
        ref={ref} 
        style={style} 
        className={cn(
          'w-full',
          !columns && 'columns-1 sm:columns-2 lg:columns-3',
          className
        )} 
        {...props}
      >
        {React.Children.map(children, (child, idx) => (
          <motion.div
            key={idx}
            className="mb-4 sm:mb-6 break-inside-avoid"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }
);

MasonryGrid.displayName = 'MasonryGrid';

export { MasonryGrid };
export default MasonryGrid;
