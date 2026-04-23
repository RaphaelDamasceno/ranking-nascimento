export const DIRECTORATE_CONFIG: Record<string, { logo: string; color: string; hover: string; border: string; text: string }> = {
  'NASCIMENTO': { 
    logo: 'https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png',
    color: 'bg-sky-400',
    hover: 'hover:bg-sky-500',
    border: 'border-sky-400',
    text: 'text-white'
  },
  'ALBUQUERQUE': { 
    logo: 'https://i.postimg.cc/4Nm90Qw8/ALBUQUERQUE.png',
    color: 'bg-green-950',
    hover: 'hover:bg-green-900',
    border: 'border-green-950',
    text: 'text-white'
  },
  'ALLBUQUERQUE': { // Variation with double L just in case
    logo: 'https://i.postimg.cc/4Nm90Qw8/ALBUQUERQUE.png',
    color: 'bg-green-950',
    hover: 'hover:bg-green-900',
    border: 'border-green-950',
    text: 'text-white'
  },
  'MOURA': { 
    logo: 'https://i.postimg.cc/vHcVKtXp/MOURA.png',
    color: 'bg-yellow-400',
    hover: 'hover:bg-yellow-500',
    border: 'border-yellow-400',
    text: 'text-brand-dark'
  },
  'RIBEIRO': { 
    logo: 'https://i.postimg.cc/Nf5HnkbV/RIBEIRO.png',
    color: 'bg-slate-500',
    hover: 'hover:bg-slate-600',
    border: 'border-slate-500',
    text: 'text-white'
  },
  'RIVEIRO': { // Variation with V as mentioned by user typo
    logo: 'https://i.postimg.cc/Nf5HnkbV/RIBEIRO.png',
    color: 'bg-slate-500',
    hover: 'hover:bg-slate-600',
    border: 'border-slate-500',
    text: 'text-white'
  }
};

export const getDirectorateConfig = (name: string) => {
  const normalized = name.toUpperCase().trim();
  // Try to find by partial match since the CSV might have extra spaces or text
  const key = Object.keys(DIRECTORATE_CONFIG).find(k => normalized.includes(k));
  return key ? DIRECTORATE_CONFIG[key] : {
    logo: 'https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png', // Default
    color: 'bg-slate-500',
    hover: 'hover:bg-slate-600',
    border: 'border-slate-500',
    text: 'text-white'
  };
};
