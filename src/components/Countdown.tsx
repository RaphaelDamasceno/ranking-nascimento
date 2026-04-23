import { useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';

export default function Countdown() {
  // Target: Saturday, April 25, 2026 at 09:00:00 (assuming it's the morning of the launch)
  const targetDate = new Date(2026, 3, 25, 9, 0, 0); // Month is 0-indexed, so 3 = April
  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      const duration = intervalToDuration({
        start: now,
        end: targetDate,
      });
      setTimeLeft(duration);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { label: 'DIAS', value: timeLeft.days ?? 0 },
    { label: 'HORAS', value: timeLeft.hours ?? 0 },
    { label: 'MINUTOS', value: timeLeft.minutes ?? 0 },
    { label: 'SEGUNDOS', value: timeLeft.seconds ?? 0 },
  ];

  return (
    <div className="flex items-center gap-6">
      <div className="hidden xl:flex flex-col items-end">
        <p className="text-[10px] font-black text-brand-blue tracking-[0.2em] uppercase leading-none">Contagem Regressiva</p>
        <p className="text-sm font-black text-brand-dark italic tracking-tighter">LANÇAMENTO SÁBADO!!</p>
      </div>
      
      <div className="flex items-center gap-3 bg-white border border-slate-100 py-1.5 px-4 rounded-xl shadow-sm">
        {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="text-center min-w-[32px]">
            <p className="text-lg font-black leading-none text-brand-dark tabular-nums tracking-tighter">
              {String(unit.value).padStart(2, '0')}
            </p>
            <p className="text-[8px] uppercase text-slate-400 mt-0.5 font-bold">
              {unit.label.substring(0, 3)}
            </p>
          </div>
          {idx < units.length - 1 && (
            <span className="text-slate-200 font-light text-sm">:</span>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
