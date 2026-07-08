import { motion } from 'motion/react';
import { MessageSquare, Table2, BarChart3, Mic, FileSpreadsheet, Globe, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language Queries',
    description: 'Ask practical questions in everyday language and get SQL-powered answers without seeing the complexity.',
    span: 'col-span-1 md:col-span-2',
    glow: 'purple' as const,
  },
  {
    icon: Table2,
    title: 'Smart Tables',
    description: 'Readable result tables with clear row counts, sorting, and scannable values.',
    span: 'col-span-1',
    glow: 'none' as const,
  },
  {
    icon: BarChart3,
    title: 'Instant Graphs',
    description: 'Turn answers into charts when a trend is easier to understand visually.',
    span: 'col-span-1',
    glow: 'none' as const,
  },
  {
    icon: Mic,
    title: 'Multi-Language Voice',
    description: 'Speak prompts in regional languages so database work does not depend on English fluency.',
    span: 'col-span-1 md:col-span-2',
    glow: 'cyan' as const,
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel Upload',
    description: 'Import Excel or CSV files and start querying them like structured databases.',
    span: 'col-span-1',
    glow: 'none' as const,
  },
  {
    icon: Globe,
    title: 'Cross-Language Prompts',
    description: 'Move between languages naturally while keeping the data task clear.',
    span: 'col-span-1 md:col-span-2',
    glow: 'none' as const,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <motion.div
        aria-hidden
        animate={{ x: ['-8%', '8%', '-8%'], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-40 max-w-5xl rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,157,181,0.12),rgba(255,184,107,0.16),transparent)] blur-2xl"
      />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-3xl"
        >
          <h2 className="text-3xl font-black tracking-[-0.025em] md:text-5xl">
            Database power, shaped for first-time users.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Qurate keeps the interface conversational while still showing users enough structure to trust the output.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              whileHover={{ y: -5 }}
              className={feature.span}
            >
              <GlassCard
              hover
              glow={feature.glow}
                className="h-full"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                  <feature.icon size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="aurora-sheen mt-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
              <ShieldCheck size={24} className="text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-[-0.02em]">Safer execution, without making users feel technical.</h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
                Generated SQL is treated as an inspectable step. Users get clear results, readable tables, and confidence cues without being pushed into an enterprise workbench.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--primary)]">
              Auditable by design
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
