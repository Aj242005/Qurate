import { motion } from 'motion/react';
import { Heart, Sparkles, Globe, Shield, Mic, Table2, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import {BsLinkedin} from 'react-icons/bs'
const creators = [
  {
    name: 'Akshit Jain',
    role: 'Software Developer & AI Engineer',
    image: 'https://ik.imagekit.io/evkfzbhzw/image.png',
    linkedin: 'https://www.linkedin.com/in/akshitjain24/',
  },
  {
    name: 'Veneya Kharkhodi',
    role: 'Software Developer',
    image: 'https://ik.imagekit.io/evkfzbhzw/1751793876147.jpg',
    linkedin: 'https://www.linkedin.com/in/veneya-kharkhodi24/',
  },
];

const timeline = [
  {
    icon: Sparkles,
    title: 'The Problem',
    description: 'Non-technical users struggle with SQL. They depend on engineers for simple data queries, creating bottlenecks and delays.',
  },
  {
    icon: Globe,
    title: 'The Vision',
    description: 'What if anyone could talk to their database in any language — English, Hindi, Telugu, Punjabi — and get instant results?',
  },
  {
    icon: Shield,
    title: 'The Solution',
    description: 'Qurate: an AI-powered platform that generates SQL from natural language, audits it for security, and returns formatted responses.',
  },
];

const capabilities = [
  { icon: Mic, label: '12+ Languages', desc: 'Voice input in regional languages' },
  { icon: Table2, label: 'Smart Tables', desc: 'Sortable, filterable data tables' },
  { icon: BarChart3, label: 'Auto Charts', desc: 'AI-generated visualizations' },
  { icon: Shield, label: 'Sandboxed DBs', desc: 'Isolated per-user databases' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-block rounded-full border border-[var(--q-purple)]/30 bg-[var(--q-purple)]/10 px-4 py-1.5 text-xs font-semibold text-[var(--q-purple)]">
              ABOUT US
            </div>
            <h1 className="text-4xl font-bold md:text-6xl">
              The story behind <span className="text-gradient">Qurate</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--muted-foreground)] leading-relaxed">
              We believe data should be accessible to everyone — not just those who speak SQL.
              Qurate is our answer to bridging the gap between human language and database intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
          >
            Our <span className="text-gradient">Journey</span>
          </motion.h2>

          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <GlassCard className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand">
                    <item.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {item.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
          >
            What Qurate <span className="text-gradient">can do</span>
          </motion.h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover className="text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand/10">
                    <cap.icon size={20} className="text-[var(--q-purple)]" />
                  </div>
                  <h4 className="text-sm font-semibold">{cap.label}</h4>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{cap.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
          >
            Meet the <span className="text-gradient">Creators</span>
          </motion.h2>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {creators.map((creator, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <GlassCard hover glow="purple" className="flex flex-col items-center px-8 py-8">
                  <div className="relative mb-4">
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="h-28 w-28 rounded-full object-cover ring-3 ring-[var(--q-purple)]/30"
                    />
                    <a
                      href={creator.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg transition-transform hover:scale-110"
                    >
                      <BsLinkedin size={14} />
                    </a>
                  </div>
                  <h3 className="text-lg font-semibold">{creator.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{creator.role}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Made in India */}
      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="glass inline-flex items-center gap-3 rounded-full px-6 py-3">
            <span className="text-2xl">🇮🇳</span>
            <span className="text-sm font-medium">
              Made in <span className="font-bold text-gradient">India</span> for{' '}
              <span className="font-bold text-gradient">India</span>
            </span>
            <Heart size={16} className="fill-red-500 text-red-500" />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Qurate" className="h-5 w-5" />
            <span className="text-sm font-semibold text-gradient">Qurate</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Qurate. AI-Powered Database Intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}
