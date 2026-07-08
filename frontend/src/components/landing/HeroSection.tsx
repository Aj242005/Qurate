import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight, Database, FileSpreadsheet, Mic, ShieldCheck, Table2, WandSparkles } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';

const proofPoints = [
  { icon: Mic, label: 'Voice prompts in 12+ languages' },
  { icon: FileSpreadsheet, label: 'Excel and CSV become databases' },
  { icon: ShieldCheck, label: 'SQL generated with safety checks' },
];

const sampleRows = [
  ['North', '$62,400', '+18%'],
  ['West', '$48,900', '+11%'],
  ['South', '$41,700', '+9%'],
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-shell relative overflow-hidden px-6 pb-20 pt-28 md:pb-24 md:pt-32">
      <motion.div
        aria-hidden
        animate={{ x: ['-12%', '10%', '-12%'], y: [0, -16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-0 top-20 h-56 w-full bg-[linear-gradient(100deg,transparent,rgba(255,143,171,0.14),rgba(255,184,107,0.12),transparent)] blur-3xl"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)]">
            <span className="flex h-2 w-2 rounded-full bg-[var(--success)]" />
            Built for people who do not speak SQL
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.035em] text-[var(--foreground)] md:text-7xl">
            Manage your database by talking to it.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)] md:text-xl">
            Qurate turns voice, natural language, Excel, and CSV files into trustworthy tables,
            charts, and database actions without asking users to learn SQL first.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <GradientButton size="lg" onClick={() => navigate('/signup')}>
              Start querying free
              <ArrowRight size={18} className="ml-2" />
            </GradientButton>
            <GradientButton size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
              View product demo
            </GradientButton>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-3 text-sm text-[var(--muted-foreground)]">
                <point.icon size={18} className="shrink-0 text-[var(--primary)]" />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
          whileHover={{ y: -4, rotateX: 1.5, rotateY: -1.5 }}
          className="product-shadow aurora-sheen relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-3"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-[var(--primary)]" />
                <span className="text-sm font-semibold">sales_upload.db</span>
              </div>
              <span className="rounded-full bg-[var(--success)]/12 px-3 py-1 text-xs font-semibold text-[var(--success)]">
                Ready
              </span>
            </div>

            <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-[var(--border)] p-5 md:border-b-0 md:border-r">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <Mic size={16} className="text-[var(--primary)]" />
                  Natural prompt
                </div>
                <motion.div
                  animate={{ boxShadow: ['0 0 0 rgba(255,157,181,0)', '0 0 26px rgba(255,157,181,0.18)', '0 0 0 rgba(255,157,181,0)'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm leading-6 text-[var(--foreground)]"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--primary)]">
                    <WandSparkles size={14} />
                    Soft-spoken, structured answer
                  </div>
                  "From the sales sheet, compare Q1 revenue by region and highlight the strongest market."
                </motion.div>
                <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <div className="mb-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span>Generated SQL</span>
                    <span>audited</span>
                  </div>
                  <code className="block whitespace-pre-wrap text-xs leading-5 text-[var(--muted-foreground)]">
                    SELECT region, revenue, growth FROM sales_q1 ORDER BY revenue DESC;
                  </code>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <Table2 size={16} className="text-[var(--primary)]" />
                  Instant result
                </div>
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--accent)]/70 text-xs text-[var(--muted-foreground)]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Region</th>
                        <th className="px-4 py-3 font-semibold">Revenue</th>
                        <th className="px-4 py-3 font-semibold">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((row) => (
                        <tr key={row[0]} className="border-t border-[var(--border)]">
                          {row.map((cell, index) => (
                            <td key={cell} className={`px-4 py-3 ${index === 2 ? 'font-semibold text-[var(--success)]' : ''}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 h-24 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <div className="flex h-full items-end gap-3">
                    {[80, 62, 52, 44, 35].map((height, index) => (
                      <div key={height} className="flex flex-1 flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
                          className="w-full rounded-t-lg bg-[var(--primary)]"
                          style={{ opacity: 1 - index * 0.08 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
