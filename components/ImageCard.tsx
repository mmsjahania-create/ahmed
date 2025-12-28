
import React from 'react';
import { motion } from 'framer-motion';
import { ImageFile } from '../types';

interface ImageCardProps {
  image: ImageFile;
  onRemove: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isComplete = image.status === 'completed';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      className={`relative group bg-white rounded-3xl p-5 border transition-all duration-300 ${
        isComplete ? 'border-indigo-100 shadow-md' : 'border-gray-100 android-card-shadow'
      }`}
    >
      <div className="flex items-center space-x-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <div className="absolute inset-0 bg-gray-100 rounded-[1.5rem] overflow-hidden">
            <img 
              src={image.previewUrl} 
              alt="thumbnail" 
              className="w-full h-full object-cover"
            />
          </div>
          {image.status === 'processing' && (
            <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] rounded-[1.5rem] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {isComplete && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
              <i className="fa-solid fa-check text-xs"></i>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate pr-6 mb-1">
                {image.file.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">JPG</span>
                <span className="text-[11px] font-medium text-gray-500">{formatSize(image.originalSize)}</span>
              </div>
            </div>
            <button 
              onClick={onRemove}
              className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full">
                  <span className="text-[10px] font-black">PNG</span>
                  <i className="fa-solid fa-circle text-[4px]"></i>
                  <span className="text-[10px] font-bold">{formatSize(image.convertedSize || 0)}</span>
                </div>
                
                <button 
                  onClick={() => {
                    if (image.convertedUrl) {
                      const a = document.createElement('a');
                      a.href = image.convertedUrl;
                      a.download = image.file.name.replace(/\.[^/.]+$/, "") + ".png";
                      a.click();
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-bold hover:bg-gray-800 transition-colors shadow-sm"
                >
                  DOWNLOAD
                </button>
              </div>
              
              {image.insights && (
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/30 to-white border border-indigo-50 p-3 rounded-2xl">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <i className="fa-solid fa-sparkles text-2xl text-indigo-600"></i>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-700 italic font-medium relative z-10">
                    <span className="text-indigo-600 font-bold not-italic mr-1">Gemini:</span> 
                    {image.insights}
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {image.status === 'idle' && (
             <div className="mt-4 flex items-center text-[11px] font-bold text-indigo-400">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
               READY TO SYNC
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
