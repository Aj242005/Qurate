import { motion } from 'motion/react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const stats = [
  { value: 12, suffix: '+', label: 'Languages Supported' },
  { value: 3, suffix: '', label: 'Response Types' },
  { value: 99, suffix: '%', label: 'Query Accuracy' },
  { value: 50, suffix: 'ms', label: 'Avg Response Time' },
];

export default function StatsSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold text-gradient md:text-5xl">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                  />
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
