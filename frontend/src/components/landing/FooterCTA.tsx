import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight, Heart} from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { FaLinkedin } from 'react-icons/fa';
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

export default function FooterCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(134,59,255,0.15) 0%, transparent 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold md:text-5xl">
          Ready to transform your{' '}
          <span className="text-gradient">data experience</span>?
        </h2>
        <p className="mt-6 text-lg text-[var(--muted-foreground)]">
          Join Qurate and start querying your databases in natural language today.
          No SQL knowledge required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GradientButton size="lg" onClick={() => navigate('/signup')}>
            Start for Free
            <ArrowRight size={18} className="ml-2 inline" />
          </GradientButton>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative mx-auto mt-24 max-w-6xl border-t border-[var(--border)] pt-8">
        <div className="flex flex-col items-center gap-6">
          {/* Creators */}
          <div className="flex items-center gap-6">
            {creators.map((creator, i) => (
              <motion.a
                key={i}
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                whileHover={{ scale: 1.1 }}
                className="group relative"
                title={creator.name}
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--border)] transition-all group-hover:ring-[var(--q-purple)]"
                />
                <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                  <FaLinkedin size={8} />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Brand + copyright */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:w-full">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Qurate" className="h-5 w-5" />
              <span className="text-sm font-semibold text-gradient">Qurate</span>
            </div>

            {/* Made in India */}
            <div className="flex ml-58  gap-2 justify-center text-md text-[var(--muted-foreground)]">
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
