import { motion } from 'motion/react';
import { Trophy, Star, Medal } from 'lucide-react';
import { getDirectorateConfig } from '../constants/directorates';

interface PodiumProps {
  winners: { name: string; count: number; directorate: string; team: string }[];
}

export default function Podium({ winners }: PodiumProps) {
  const top3 = winners.slice(0, 3);
  
  // Reorder to 2nd, 1st, 3rd for visual podium layout
  const displayOrder = [
    top3[1], // 2nd
    top3[0], // 1st
    top3[2]  // 3rd
  ].filter(Boolean);

  const getRankConfig = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          size: 'w-60 h-60',
          borderColor: 'border-yellow-400',
          badgeColor: 'bg-yellow-400',
          icon: <Trophy size={32} className="text-white" />,
          y: -20,
          scale: 1.1
        };
      case 2:
        return {
          size: 'w-44 h-44',
          borderColor: 'border-slate-300',
          badgeColor: 'bg-slate-300',
          icon: <Medal size={24} className="text-slate-600" />,
          y: 0,
          scale: 1
        };
      case 3:
        return {
          size: 'w-44 h-44',
          borderColor: 'border-amber-600',
          badgeColor: 'bg-amber-600',
          icon: <Star size={24} className="text-white" />,
          y: 0,
          scale: 1
        };
      default:
        return null;
    }
  };

  return (
    <div className="flex items-end justify-center gap-6 md:gap-16 pb-8 overflow-visible w-full max-w-7xl mx-auto">
      {displayOrder.map((winner, idx) => {
        // Find actual rank
        const actualRank = winners.findIndex(w => w.name === winner.name) + 1;
        const config = getRankConfig(actualRank);
        const dirConfig = getDirectorateConfig(winner.directorate);
        
        if (!config) return null;

        return (
          <motion.div
            key={winner.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: config.y }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
            className="flex flex-col items-center relative group"
          >
            {/* Logo Container (Simplified) */}
            <div className={`relative ${config.size} flex items-center justify-center mb-2`}>
                 <img 
                    src={dirConfig.logo} 
                    alt={winner.directorate} 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                 />
                 
                 {/* Rank Badge */}
                 <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${config.badgeColor} text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-4 border-white shadow-2xl`}>
                   {actualRank}º
                 </div>
            </div>

            {/* Winner Info */}
            <div className="text-center w-full px-2">
              <h3 className="font-black text-brand-dark uppercase tracking-tighter text-xl leading-tight mb-0.5 max-w-[260px] mx-auto truncate">
                {winner.name.split(' ').slice(0, 2).join(' ')}
              </h3>
              
              <div className="flex items-center justify-center mb-2">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{winner.team}</span>
              </div>

              <div className="bg-brand-blue text-white px-5 py-1.5 rounded-full shadow-[0_10px_20px_rgba(0,51,102,0.2)] inline-flex items-baseline gap-2">
                <span className="text-2xl font-black leading-none">{winner.count}</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] opacity-80">Agendamentos</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
