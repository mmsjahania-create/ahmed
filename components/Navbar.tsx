
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-100/50 px-6 py-5 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mr-4 transform rotate-3">
          <i className="fa-solid fa-wand-magic-sparkles text-white text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
            PixelSwift
          </h1>
          <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">
            AI Converter
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-circle-question"></i>
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-user-circle"></i>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
