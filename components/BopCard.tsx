import React from 'react';
import { BopProfile } from '../types';
import { Badge } from './Badge';

interface BopCardProps {
  bop: BopProfile;
}

export const BopCard: React.FC<BopCardProps> = ({ bop }) => {
  
  const getRatingConfig = (rating: number) => {
    if (rating < 2) return { label: 'SAINT 😇', color: 'text-blue-400', barColor: 'bg-blue-400' };
    if (rating < 4) return { label: 'ANGEL 👼', color: 'text-cyan-500', barColor: 'bg-cyan-500' };
    if (rating < 7) return { label: 'MEH! 😐', color: 'text-gray-500', barColor: 'bg-gray-400' };
    if (rating < 8) return { label: 'DEMI-BOP ⚡', color: 'text-orange-500', barColor: 'bg-orange-500' };
    return { label: 'BOP! 🔥', color: 'text-red-600', barColor: 'bg-red-600' }; // 8-10
  };

  const config = getRatingConfig(bop.rating);
  const barWidth = Math.min(100, Math.max(5, bop.rating * 10));

  return (
    <div className="w-full bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6 transition-transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="sm:w-1/3 h-64 sm:h-auto relative border-b-2 sm:border-b-0 sm:border-r-2 border-black bg-gray-100">
           <img 
             src={bop.imageUrl} 
             alt={bop.name} 
             className="w-full h-full object-cover absolute inset-0"
           />
           <div className="absolute top-2 left-2">
             <Badge color="yellow">#{bop.rating.toFixed(1)} Rated</Badge>
           </div>
        </div>

        {/* Content Section */}
        <div className="sm:w-2/3 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">{bop.name}</h3>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mt-1">
                  <span>{bop.school}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{bop.year}</span>
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-black font-medium leading-relaxed">
                "{bop.description}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
             <div className="flex items-center gap-2 w-full mr-4">
               <span className="text-xs font-bold uppercase text-gray-400 whitespace-nowrap">Bop Meter</span>
               <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-300 relative">
                 <div 
                   className={`h-full ${config.barColor}`} 
                   style={{ width: `${barWidth}%` }}
                 ></div>
               </div>
             </div>
             <div className="flex flex-col items-end min-w-[80px]">
               <span className={`text-3xl font-black leading-none ${config.color}`}>
                 {bop.rating}
               </span>
               <span className="text-[10px] font-black text-black uppercase tracking-wider mt-1">
                 {config.label}
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};