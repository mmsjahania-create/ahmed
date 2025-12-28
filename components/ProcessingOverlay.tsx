
import React from 'react';
import { motion } from 'framer-motion';

interface ProcessingOverlayProps {
  current: number;
  total: number;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[3rem] w-full max-w-sm p-10 flex flex-col items-center text-center shadow-2xl border border-white/20"
      >
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 58}
              initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - current / total) }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              strokeLinecap="round"
              className="text-indigo-600"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-900 leading-none">{percentage}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Progress</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-2">Syncing Pixels</h3>
        <p className="text-sm font-medium text-gray-500 mb-8 px-4 leading-relaxed">
          Optimizing image {current} of {total} with Gemini smart processing.
        </p>
        
        <div className="w-full bg-indigo-50/50 rounded-3xl p-5 flex items-start space-x-4 border border-indigo-50">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <i className="fa-solid fa-sparkles text-indigo-500"></i>
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">AI Engine</span>
            <span className="block text-[11px] leading-relaxed text-gray-600 font-medium italic">
              "Analyzing visual density to provide lossless compression recommendations..."
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingOverlay;
