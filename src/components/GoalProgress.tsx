import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface GoalProgressProps {
  current: number;
  goal: number;
}

export default function GoalProgress({ current, goal }: GoalProgressProps) {
  const percentage = Math.min(100, Math.round((current / goal) * 100));
  
  return (
    <div className="flex flex-col justify-center h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Meta Global</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-brand-blue tracking-tighter">{percentage}%</h3>
            <span className="text-[8px] font-bold text-slate-300 uppercase leading-none text-wrap max-w-[60px]">do total projetado</span>
          </div>
        </div>
        <div className="bg-brand-blue/10 p-1.5 rounded-lg text-brand-blue">
          <TrendingUp size={16} />
        </div>
      </div>
      
      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden relative p-0.5 shadow-inner z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-600 via-brand-blue to-blue-400 rounded-full shadow-lg relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
      
      <div className="flex justify-between mt-2 px-0.5 text-[8px] font-black text-slate-400 uppercase tracking-widest relative z-10 leading-none">
        <span>{current} Agendados</span>
        <span>Meta: {goal}</span>
      </div>
    </div>
  );
}
