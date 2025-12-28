
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from './types';
import { getImageInsights } from './services/geminiService';
import Navbar from './components/Navbar';
import ImageCard from './components/ImageCard';
import ProcessingOverlay from './components/ProcessingOverlay';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = (Array.from(files) as File[]).map((file: File) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'idle',
      originalSize: file.size,
    }));

    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return filtered;
    });
  };

  const convertImage = async (image: ImageFile) => {
    return new Promise<ImageFile>((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const convertedUrl = URL.createObjectURL(blob);
          const reader = new FileReader();
          reader.readAsDataURL(image.file);
          reader.onloadend = async () => {
            const base64 = reader.result as string;
            const insights = await getImageInsights(base64, image.file.name);
            
            resolve({
              ...image,
              convertedUrl,
              convertedSize: blob.size,
              status: 'completed',
              insights
            });
          };
        }, 'image/png');
      };
      img.src = image.previewUrl;
    });
  };

  const processAll = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    
    const updatedImages = [...images];
    
    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === 'completed') continue;
      
      setCurrentProcessIndex(i);
      updatedImages[i] = { ...updatedImages[i], status: 'processing' };
      setImages([...updatedImages]);
      
      const result = await convertImage(updatedImages[i]);
      updatedImages[i] = result;
      setImages([...updatedImages]);
    }
    
    setIsProcessing(false);
  };

  const downloadAll = () => {
    images.forEach(img => {
      if (img.convertedUrl) {
        const a = document.createElement('a');
        a.href = img.convertedUrl;
        a.download = img.file.name.replace(/\.[^/.]+$/, "") + ".png";
        a.click();
      }
    });
  };

  const hasCompleted = images.some(i => i.status === 'completed');

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-32">
      <Navbar />
      
      <main 
        className="max-w-xl mx-auto px-4 pt-8"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {images.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col items-center justify-center h-[60vh] text-center rounded-3xl border-2 border-dashed transition-colors duration-300 ${
                isDragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 bg-white/50'
              }`}
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-50 to-white rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                <i className={`fa-solid fa-cloud-arrow-up text-4xl transition-transform duration-300 ${isDragging ? 'scale-110 text-indigo-500' : 'text-indigo-300'}`}></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Drop your JPGs here</h2>
              <p className="px-12 text-gray-500 leading-relaxed max-w-sm">
                Fast, lossless conversion to PNG with AI-powered quality insights.
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
              >
                Browse Files
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Queue <span className="text-indigo-600 ml-1">({images.length})</span>
                </h3>
                <button 
                  onClick={() => setImages([])} 
                  className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                >
                  CLEAR ALL
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {images.map((img) => (
                    <ImageCard 
                      key={img.id} 
                      image={img} 
                      onRemove={() => removeImage(img.id)} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Floating Bottom Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: images.length > 0 ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 p-4 z-40 max-w-xl mx-auto"
      >
        <div className="glass border border-white/50 p-4 rounded-[2.5rem] shadow-2xl flex items-center space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/jpg" 
            multiple 
            className="hidden" 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-white border border-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-plus text-xl"></i>
          </button>

          <button 
            onClick={hasCompleted ? downloadAll : processAll}
            disabled={isProcessing}
            className={`flex-1 flex items-center justify-center h-14 rounded-full text-white font-bold text-base transition-all ${
              isProcessing 
                ? 'bg-indigo-300' 
                : hasCompleted 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-100 active:scale-95'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-500 shadow-lg shadow-indigo-100 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <i className="fa-solid fa-spinner-third fa-spin mr-2"></i>
                Converting...
              </span>
            ) : hasCompleted ? (
              <span className="flex items-center">
                <i className="fa-solid fa-download mr-2"></i>
                Download All PNGs
              </span>
            ) : (
              <span className="flex items-center">
                <i className="fa-solid fa-bolt mr-2"></i>
                Convert to PNG
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {isProcessing && (
        <ProcessingOverlay 
          current={currentProcessIndex + 1} 
          total={images.length} 
        />
      )}
    </div>
  );
};

export default App;
