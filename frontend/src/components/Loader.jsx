import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh]">
      <div className="flex items-center justify-center overflow-hidden w-full h-24 relative">
        
        {/* The 'M' Block slidding in from the left */}
        <div className="animate-m-connect relative z-10 mr-2">
          <div className="bg-orange-600 text-white p-3 rounded transform rotate-45 flex items-center justify-center w-14 h-14 shadow-lg border-2 border-white">
            <span className="font-extrabold text-2xl transform -rotate-45 block mt-0.5">M</span>
          </div>
        </div>

        {/* The 'STORE' Block slidding in from the right */}
        <div className="animate-store-connect relative z-0">
          <div className="flex flex-col">
            <span className="font-extrabold text-4xl sm:text-5xl leading-none text-black tracking-tight drop-shadow-sm">STORE</span>
          </div>
        </div>

      </div>
      
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs sm:text-sm mt-4 animate-[pulse_1.5s_infinite]">
        Curating your premium experience...
      </p>
    </div>
  );
}
