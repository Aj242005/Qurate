import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Sparkles, ArrowRight } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />

      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #863bff 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 30, -25, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #47bfff 0%, transparent 70%)' }}
      />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass mb-8 flex items-center gap-2 rounded-full px-5 py-2"
      >
        <Sparkles size={14} className="text-[var(--q-purple)]" />
        <span className="text-sm font-medium text-[var(--muted-foreground)]">
          AI-Powered Database Intelligence
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="max-w-4xl text-center text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
      >
        Query your data with{' '}
        <span className="text-gradient">natural language</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 max-w-2xl text-center text-lg text-[var(--muted-foreground)] md:text-xl"
      >
        Talk to your database in plain English, Hindi, or any language.
        Get instant tables, graphs, and insights — no SQL required.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <GradientButton size="lg" onClick={() => navigate('/signup')}>
          Get Started Free
          <ArrowRight size={18} className="ml-2 inline" />
        </GradientButton>
        <GradientButton size="lg" variant="outline" onClick={() => navigate('/pricing')}>
          View Pricing
        </GradientButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[var(--muted-foreground)]"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-[var(--q-purple)] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
