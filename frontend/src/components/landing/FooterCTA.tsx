import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight, Heart } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { FaLinkedin } from 'react-icons/fa';

const creators = [
  {
    name: 'Akshit Jain',
    image: 'https://ik.imagekit.io/evkfzbhzw/image.png',
    linkedin: 'https://www.linkedin.com/in/akshitjain24/',
  },
  {
    name: 'Veneya Kharkhodi',
    image: 'https://ik.imagekit.io/evkfzbhzw/1751793876147.jpg',
    linkedin: 'https://www.linkedin.com/in/veneya-kharkhodi24/',
  },
];

export default function FooterCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center md:p-12"
      >
        <h2 className="text-3xl font-black tracking-[-0.025em] md:text-5xl">
          Give your database a voice your team can use.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
          Start with a prompt, a spreadsheet, or a question. Qurate keeps the path from data to decision short.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GradientButton size="lg" onClick={() => navigate('/signup')}>
            Start for free
            <ArrowRight size={18} className="ml-2" />
          </GradientButton>
        </div>
      </motion.div>

      <div className="relative mx-auto mt-20 max-w-6xl border-t border-[var(--border)] pt-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-5">
            {creators.map((creator, i) => (
              <motion.a
                key={creator.name}
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
                whileHover={{ y: -2 }}
                className="focus-ring group relative rounded-full"
                title={creator.name}
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--border)] transition-all group-hover:ring-[var(--primary)]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                  <FaLinkedin size={8} />
                </span>
              </motion.a>
            ))}
          </div>

          <div className="flex w-full flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Qurate" className="h-5 w-5" />
              <span className="text-sm font-semibold text-gradient">Qurate</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Made in</span>
              <span className="font-semibold text-gradient">India</span>
              <span>for</span>
              <span className="font-semibold text-gradient">India</span>
              <Heart size={14} className="fill-red-500 text-red-500" />
            </div>

            <p className="text-xs text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} Qurate. AI-Powered Database Intelligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
