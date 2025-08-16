import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for the table
const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function DataTable({ headers, data, renderRow, keyField }) {
  return (
    <div className="overflow-hidden bg-[var(--background)] shadow-md">
      <div className="overflow-x-auto">
        <motion.table
          className="min-w-full"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            {/* Unified Header Style */}
            <tr className="bg-[var(--background)]">
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${header.className || 'text-left'}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, index) => (
              <motion.tr
                key={item[keyField] || index}
                variants={rowVariants}
                className="transition-colors duration-200 hover:bg-muted"
              >
                {/* The magic happens here: renderRow is a function passed as a prop */}
                {renderRow(item, index)}
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
}

export default DataTable;
