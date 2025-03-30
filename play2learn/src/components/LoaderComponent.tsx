import React from 'react';
import { Loader2, Trophy } from 'lucide-react';

export const LoaderComponent = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-indigo-800/80 backdrop-blur-lg z-50">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl transform scale-150"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 p-1 rounded-full">
              <img className="w-20 h-19 text-white" src='/img/logo.png' />
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-white text-3xl font-bold mb-1">Play2Learn</h1>
            <div className="flex items-center gap-2 text-white/80">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};