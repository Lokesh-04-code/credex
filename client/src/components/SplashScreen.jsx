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
        className="relative flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <StackSaverLogo size="xl" className="justify-center" />
          </motion.div>
          <p className="mt-4 text-lg font-semibold text-gray-200">Finding waste in your AI stack</p>
        </div>
        <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
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
