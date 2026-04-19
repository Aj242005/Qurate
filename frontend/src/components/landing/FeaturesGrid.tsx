import { motion } from 'motion/react';
import { MessageSquare, Table2, BarChart3, Mic, FileSpreadsheet, Globe } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language Queries',
    description: 'Ask questions in plain English and get instant SQL-powered results. No database expertise needed.',
    span: 'col-span-1 md:col-span-2',
    glow: 'purple' as const,
  },
  {
    icon: Table2,
    title: 'Smart Tables',
    description: 'Get beautifully formatted data tables with sorting and filtering built in.',
    span: 'col-span-1',
    glow: 'none' as const,
  },
  {
    icon: BarChart3,
    title: 'Instant Graphs',
    description: 'Visualize trends and patterns with auto-generated charts and graphs.',
    span: 'col-span-1',
    glow: 'none' as const,
  },
  {
    icon: Mic,
    title: 'Multi-Language Voice',
    description: 'Speak your queries in Hindi, Tamil, Telugu, Punjabi, or any of 12+ supported languages.',
    span: 'col-span-1 md:col-span-2',
    glow: 'cyan' as const,
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel Upload',
    description: 'Upload any Excel file to instantly create and query new database tables.',
    span: 'col-span-1',
    glow: 'none' as const,
  },
  {
    icon: Globe,
    title: 'Cross-Language Prompts',
    description: 'Ask in one language, get results in another. Our AI understands multilingual context.',
    span: 'col-span-1 md:col-span-2',
    glow: 'none' as const,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            Features & <span className="text-gradient">Benefits</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Everything you need to transform raw data into actionable insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature, i) => (
            <GlassCard
              key={i}
              hover
              glow={feature.glow}
              className={feature.span}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand/10">
                  <feature.icon size={22} className="text-[var(--q-purple)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </motion.div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
