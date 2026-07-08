import { motion } from 'motion/react';
import { Heart, Globe, Shield, Mic, Table2, BarChart3, FileSpreadsheet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import { BsLinkedin } from 'react-icons/bs';

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
    icon: Globe,
    title: 'The gap',
    description: 'Many people can explain the answer they need, but cannot translate that question into SQL or database tooling.',
  },
  {
    icon: Mic,
    title: 'The interface',
    description: 'Qurate lets users speak or type in natural language, then turns that intent into structured database work.',
  },
  {
    icon: Shield,
    title: 'The trust layer',
    description: 'The product shows clear outputs as text, tables, and graphs so users can inspect the result instead of guessing what happened.',
  },
];

const capabilities = [
  { icon: Mic, label: '12+ languages', desc: 'Voice input for regional language workflows' },
  { icon: FileSpreadsheet, label: 'File import', desc: 'Excel and CSV become queryable data' },
  { icon: Table2, label: 'Smart tables', desc: 'Readable results with sortable values' },
  { icon: BarChart3, label: 'Auto charts', desc: 'Visual answers when trends matter' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative px-6 pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />
        <div className="relative mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="mb-5 inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)]">
              Built in India for voice-first data work
            </div>
            <h1 className="text-4xl font-black tracking-[-0.035em] md:text-6xl">
              Qurate exists so database access does not require database language.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
              We believe data should be available to the people who need decisions from it, not only to people who know SQL.
              Qurate bridges human language, spreadsheets, and database intelligence in one approachable workflow.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {timeline.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <GlassCard className="h-full">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]">
                  <item.icon size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-black tracking-[-0.025em] md:text-4xl">What Qurate can do</h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              The product centers on the tasks non-technical users ask for most often.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard hover className="h-full text-left">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]">
                    <cap.icon size={20} className="text-[var(--primary)]" />
                  </div>
                  <h4 className="text-sm font-bold">{cap.label}</h4>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{cap.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-black tracking-[-0.025em] md:text-4xl">Meet the creators</h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {creators.map((creator, i) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="text-center"
              >
                <GlassCard hover className="flex flex-col items-center px-8 py-8">
                  <div className="relative mb-4">
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="h-28 w-28 rounded-full object-cover ring-2 ring-[var(--border)]"
                    />
                    <a
                      href={creator.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white"
                      aria-label={`${creator.name} on LinkedIn`}
                    >
                      <BsLinkedin size={14} />
                    </a>
                  </div>
                  <h3 className="text-lg font-bold">{creator.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{creator.role}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-5 text-center text-sm font-medium text-[var(--muted-foreground)]"
        >
          <span>Made in</span>
          <span className="font-bold text-gradient">India</span>
          <span>for</span>
          <span className="font-bold text-gradient">India</span>
          <Heart size={16} className="fill-red-500 text-red-500" />
        </motion.div>
      </section>

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
