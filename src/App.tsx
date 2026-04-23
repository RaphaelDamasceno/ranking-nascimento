/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2,
  AlertCircle,
  Star,
  Volume2,
  VolumeX,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { fetchSheetData, Statistics } from './services/dataService';
import Countdown from './components/Countdown';
import Podium from './components/Podium';
import RankingList from './components/RankingList';
import DirectorateRanking from './components/DirectorateRanking';
import GoalProgress from './components/GoalProgress';
import RegistrationQRCode from './components/RegistrationQRCode';

export default function App() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [nextUpdateIn, setNextUpdateIn] = useState(20);
  const [recentAchiever, setRecentAchiever] = useState<string | null>(null);
  const prevTotalRef = useRef<number | null>(null);
  const prevRankingRef = useRef<{ name: string; count: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const updateAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isCelebrationActive, setIsCelebrationActive] = useState(false);

  const triggerCelebration = (achieverName?: string) => {
    setIsCelebrationActive(true);
    setTimeout(() => setIsCelebrationActive(false), 3000);

    if (achieverName) {
      setRecentAchiever(achieverName);
      setTimeout(() => setRecentAchiever(null), 8000);
    }

    // Explosão principal
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Explosão central
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003366', '#FFD700', '#FFFFFF']
    });

    // Som de celebração
    if (audioEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Celebration audio play failed:', e));
    }
  };

  const [showSyncCheck, setShowSyncCheck] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSheetData();
      setStats(data);
      setLastUpdate(new Date());
      setError(null);
      setShowSyncCheck(true);
      setTimeout(() => setShowSyncCheck(false), 2000);
      
      // Som de atualização
      if (audioEnabled && updateAudioRef.current) {
        updateAudioRef.current.currentTime = 0;
        updateAudioRef.current.play().catch(e => console.log('Update audio play failed:', e));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Não foi possível ler os dados da planilha.');
    } finally {
      setLoading(false);
      setNextUpdateIn(10); // Faster updates: 10 seconds
    }
  }, [audioEnabled]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Countdown logical loop
  useEffect(() => {
    const timer = setInterval(() => {
      setNextUpdateIn((prev) => {
        if (prev <= 1) {
          loadData();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadData]);

  useEffect(() => {
    if (stats && prevTotalRef.current !== null && stats.total > prevTotalRef.current) {
      // Find who achieved the new record
      let achiever = "";
      if (prevRankingRef.current.length > 0) {
        for (const currentEntry of stats.ranking) {
          const prevEntry = prevRankingRef.current.find(p => p.name === currentEntry.name);
          if (!prevEntry || currentEntry.count > prevEntry.count) {
            achiever = currentEntry.name;
            break;
          }
        }
      }
      triggerCelebration(achiever);
    }
    if (stats) {
      prevTotalRef.current = stats.total;
      prevRankingRef.current = [...stats.ranking];
    }
  }, [stats?.total]);

  // Derived metrics
  const goal = 100;
  const remaining = stats ? goal - stats.total : goal;

  return (
    <motion.div 
      animate={isCelebrationActive ? {
        x: [0, -8, 8, -8, 8, -8, 8, 0],
        transition: { duration: 0.3, repeat: 10 }
      } : {}}
      className="h-screen flex flex-col bg-app-bg text-brand-dark overflow-hidden"
    >
      {/* Header */}
      <header className="glass-header px-4 md:px-8 shrink-0 py-3 relative z-50">
        <div className="max-w-full mx-auto flex justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <img 
              src="https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png" 
              alt="Nascimento por Nogueira" 
              className="h-10 md:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <Countdown />

          <div className="flex items-center gap-4">
            {/* Som e Sincronização automáticos - Interface limpa para TV */}
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block relative">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <motion.p 
                  key={lastUpdate.getTime()}
                  initial={{ color: '#3b82f6' }}
                  animate={{ color: '#64748b' }}
                  transition={{ duration: 2 }}
                  className="text-xs font-black leading-none mb-0.5"
                >
                  {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </motion.p>
                <p className="text-[7px] font-bold text-brand-blue uppercase">
                  {stats ? `${stats.total} Registros Lidos` : 'Sincronizando...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:px-8 md:py-4 overflow-hidden w-full max-w-full">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              key="error"
              className="premium-card text-center p-10 h-full flex flex-col justify-center items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <AlertCircle size={40} className="text-red-500 mb-4" />
              <h2 className="text-xl font-black mb-2">Conexão Pendente</h2>
              <p className="text-slate-500 mb-6 text-sm">{error}</p>
              <button onClick={loadData} className="btn-primary">Tentar Agora</button>
            </motion.div>
          ) : !stats ? (
            <motion.div 
              key="loading"
              className="flex flex-col justify-center items-center h-full gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sincronizando...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden"
            >
              {/* Left Column: Elite Podium + Ranking List */}
              <section className="col-span-12 lg:col-span-8 flex flex-col min-h-0 gap-4">
                <header className="shrink-0">
                   <h2 className="text-3xl font-black text-brand-blue tracking-tighter uppercase italic leading-none mb-1">Elite do Lançamento</h2>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Os Melhores Destaques do Dia</p>
                </header>

                <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
                  <div className="flex-[6] min-h-0 flex items-center justify-center w-full">
                    <Podium winners={stats.ranking} />
                  </div>
                  <div className="flex-[4] min-h-0 overflow-hidden">
                    <RankingList winners={stats.ranking} />
                  </div>
                </div>
              </section>

              {/* Right Column: Sidebar Stats */}
              <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden h-full">
                {/* Progress to Goal + QR Integration */}
                <div className="shrink-0 flex gap-4 items-stretch h-56">
                  <div className="w-40 shrink-0 flex items-center justify-center p-4">
                    <RegistrationQRCode compact={false} noBg={true} hideLabel={true} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <GoalProgress current={stats.total} goal={goal} />
                  </div>
                </div>

                {/* Directorate Battle */}
                <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 border border-white shadow-sm flex-1 min-h-0 overflow-hidden">
                   <DirectorateRanking ranking={stats.directorateRanking} />
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-3 bg-white border-t border-slate-50 shrink-0">
        <div className="flex items-center justify-center gap-4 px-8">
           <img 
            src="https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png" 
            alt="Nascimento por Nogueira" 
            className="h-6 opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="h-4 w-px bg-slate-100" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Nascimento por Nogueira © 2026</p>
        </div>
      </footer>

      {/* Achiever Celebration Overlay */}
      <AnimatePresence>
        {recentAchiever && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ 
                backgroundColor: ['rgba(0, 51, 102, 0.4)', 'rgba(0, 102, 204, 0.4)', 'rgba(0, 51, 102, 0.4)'],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
              className="bg-brand-blue text-white px-16 py-12 rounded-[4rem] shadow-[0_0_150px_rgba(0,51,102,0.8)] border-8 border-white flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Spinning background effect */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -z-10 opacity-10"
              >
                <div className="w-[800px] h-[800px] bg-gradient-to-r from-transparent via-white to-transparent transform scale-y-10" />
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 15, 0] 
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Trophy size={120} className="mb-6 text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" />
              </motion.div>
              
              <motion.h2 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-3xl font-black uppercase tracking-[0.2em] text-blue-200 mb-2"
              >
                ESTOUROU! 🍾
              </motion.h2>
              
              <h1 className="text-8xl font-black italic uppercase tracking-tighter mb-6 drop-shadow-2xl">
                {recentAchiever}
              </h1>
              
              <div className="bg-white text-brand-blue px-10 py-4 rounded-full font-black text-3xl shadow-2xl flex items-center gap-4">
                AGENDOU MAIS UM! 🍾
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2897/2897-preview.mp3" 
        preload="auto"
      />
      <audio 
        ref={updateAudioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" 
        preload="auto"
      />
    </motion.div>
  );
}

