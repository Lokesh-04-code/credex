import { motion } from 'framer-motion';
import StackSaverLogo from './StackSaverLogo';

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-brand-500/10" />
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center gap-5 px-6 sm:max-w-xl sm:px-0"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <StackSaverLogo size="xl" className="flex-col justify-center gap-4 sm:flex-row sm:gap-3" />
          </motion.div>
          <p className="mt-4 text-base font-semibold text-gray-200 sm:text-lg">Finding waste in your AI stack</p>
        </div>
        <div className="h-1.5 w-full max-w-64 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-emerald-400"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
