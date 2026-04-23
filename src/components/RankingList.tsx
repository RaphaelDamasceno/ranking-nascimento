import { motion } from 'motion/react';
import { getDirectorateConfig } from '../constants/directorates';

interface RankingListProps {
  winners: { name: string; count: number; directorate: string; team: string }[];
}

export default function RankingList({ winners }: RankingListProps) {
  // Take 4th to 8th (Total Top 8)
  const listItems = winners.slice(3, 8);

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-4 border border-white/50 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-4 shrink-0">
        <div className="col-span-1">Pos</div>
        <div className="col-span-2">Corretor</div>
        <div className="col-span-1 text-center">Leads</div>
        <div className="col-span-1 text-right">Var</div>
      </div>
      
      <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide pr-1">
        {listItems.map((item, idx) => {
          const rank = idx + 4;
          const config = getDirectorateConfig(item.directorate);
          
          return (
            <motion.div
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-5 items-center bg-white p-1.5 rounded-xl border border-slate-50 hover:border-brand-blue/20 hover:shadow-md transition-all group"
            >
              <div className="col-span-1 flex items-center gap-2">
                 <span className="w-5 h-5 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 italic">
                    {rank}º
                 </span>
                 <div className="w-6 h-6 shrink-0 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">
                      {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                 </div>
              </div>
              
              <div className="col-span-2 flex flex-col min-w-0">
                <p className="font-black text-brand-dark uppercase tracking-tighter text-[9px] truncate leading-tight">
                  {item.name.split(' ').slice(0, 2).join(' ')}
                </p>
                <div className="flex items-center gap-1">
                   <img src={config.logo} className="w-2 h-2 object-contain" referrerPolicy="no-referrer" />
                   <span className="text-[6px] font-bold text-slate-300 uppercase truncate">{item.team}</span>
                </div>
              </div>

              <div className="col-span-1 text-center">
                 <p className="font-black text-brand-blue text-xs">{item.count}</p>
              </div>

              <div className="col-span-1 text-right">
                 <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
                    +5%
                 </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
