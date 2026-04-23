import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { QrCode } from 'lucide-react';

interface QRCodeProps {
  compact?: boolean;
  noBg?: boolean;
  noMotion?: boolean;
  hideLabel?: boolean;
}

export default function RegistrationQRCode({ compact = false, noBg = false, noMotion = false, hideLabel = false }: QRCodeProps) {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdCTD9gInj7U8hz5RfkjbL4S8Xbw-NBlpT71ambrHizSha5nQ/viewform';

  const content = (
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
      {!compact && !hideLabel && (
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="text-brand-blue" size={16} />
          <h3 className={`text-[8px] font-black uppercase tracking-[0.2em] ${noBg ? 'text-brand-dark' : 'text-white'}`}>Registro</h3>
        </div>
      )}

      <div className={`bg-white ${compact ? 'p-1.5 rounded-lg' : 'p-3 rounded-2xl'} inline-block`}>
        <QRCodeSVG 
          value={formUrl} 
          size={compact ? 60 : (hideLabel ? 140 : 100)}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "https://i.postimg.cc/6p0rCpQr/NASCIMENTO.png",
            x: undefined,
            y: undefined,
            height: compact ? 12 : (hideLabel ? 28 : 20),
            width: compact ? 12 : (hideLabel ? 28 : 20),
            excavate: true,
          }}
        />
      </div>

      {!hideLabel && (
        <p className={`${compact ? 'text-[7px]' : 'text-[8px]'} font-bold ${noBg ? 'text-slate-400' : 'text-slate-400'} uppercase tracking-widest leading-tight mt-2`}>
          {compact ? 'Scan' : 'Aponte a câmera'}<br /> 
          <span className="text-brand-blue">Formulário</span>
        </p>
      )}
    </div>
  );

  if (noBg) return content;

  return (
    <motion.div 
      initial={noMotion ? {} : { opacity: 0, y: 20 }}
      animate={noMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className={`bg-brand-dark ${compact ? 'p-3 rounded-[1.5rem]' : 'p-6 rounded-[2.5rem]'} text-center shadow-xl border-2 border-white/10 relative overflow-hidden group`}
    >
      {/* Decorative background circle */}
      {!compact && <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl" />}
      {content}
    </motion.div>
  );
}
