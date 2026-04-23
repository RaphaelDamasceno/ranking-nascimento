import { motion } from 'motion/react';
import { TrendingUp, Award, Zap } from 'lucide-react';

export default function DailyHighlights() {
  const highlights = [
    {
      title: 'Crescimento',
      name: 'Wilma Helena',
      value: '+32% vs ontem',
      icon: <TrendingUp className="text-emerald-500" size={14} />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'Lançamento',
      name: 'Djair Agostinho',
      value: '22 Agend. hoje',
      icon: <Award className="text-brand-blue" size={14} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    }
  ];

  return (
    <div className="space-y-2">
      {highlights.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + idx * 0.1 }}
          className={`${item.bgColor} border ${item.borderColor} p-2 rounded-2xl flex items-center gap-3 hover:shadow-md transition-all`}
        >
          <div className="bg-white p-2 rounded-xl shadow-sm">
            {item.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[7px] font-black uppercase text-slate-400 tracking-wider mb-0.5">{item.title}</p>
            <p className="text-[10px] font-black text-brand-dark uppercase tracking-tight truncate">{item.name}</p>
            <p className="text-[8px] font-bold text-slate-500 opacity-80">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
