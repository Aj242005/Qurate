import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function MacbookScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Transforms for the 3D laptop effect
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6], [35, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.8, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  // Screen content slides up
  const screenY = useTransform(scrollYProgress, [0.3, 0.6], [40, 0]);
  const screenOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <section ref={containerRef} className="relative px-6 py-32 md:py-48">
      <motion.div
        style={{ opacity }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold md:text-5xl">
          See it in <span className="text-gradient">action</span>
        </h2>
        <p className="mt-4 text-[var(--muted-foreground)]">
          A conversational interface that transforms how you interact with your data
        </p>
      </motion.div>

      {/* Laptop frame */}
      <motion.div
        style={{ rotateX, scale, y }}
        className="mx-auto max-w-5xl"
      >
        <div
          className="overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--card)]"
          style={{ perspective: '1500px' }}
        >
          {/* Laptop top bar */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
            <div className="ml-4 flex-1 rounded-md bg-[var(--muted)] px-3 py-1 text-center text-xs text-[var(--muted-foreground)]">
              qurate.app/dashboard
            </div>
          </div>

          {/* Screen content */}
          <motion.div
            style={{ y: screenY, opacity: screenOpacity }}
            className="relative aspect-[16/9] overflow-hidden bg-[var(--background)]"
          >
            {/* Simulated dashboard UI */}
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-4">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-brand" />
                  <div className="h-3 w-16 rounded " >Username</div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-8 rounded-lg ${i === 1 ? 'bg-[var(--accent)]' : 'bg-transparent'}`}
                      style={{ width: `${70 + i * 5}%` }}
                    >
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className="h-3 w-3 rounded bg-[var(--muted-foreground)]/30" />
                        <div className="h-2 flex-1 rounded bg-[var(--muted-foreground)]/20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main chat area */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-2 h-4 w-48 rounded bg-[var(--muted)]" />
                  <div className="mx-auto h-3 w-32 rounded bg-[var(--muted-foreground)]/20" />
                </div>

                {/* Chat bubbles */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-md bg-gradient-brand px-4 py-2">
                      <div className="h-2 w-40 rounded bg-white/50" />
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="space-y-1.5">
                        <div className="h-2 w-52 rounded bg-[var(--muted-foreground)]/30" />
                        <div className="h-2 w-44 rounded bg-[var(--muted-foreground)]/20" />
                        {/* Mini table */}
                        <div className="mt-2 rounded-lg border border-[var(--border)] p-2">
                          <div className="grid grid-cols-3 gap-1">
                            {[...Array(9)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 rounded ${i < 3 ? 'bg-[var(--q-purple)]/30' : 'bg-[var(--muted-foreground)]/15'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="mt-4 flex gap-2">
                  <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
                    <div className="h-2 w-32 rounded bg-[var(--muted-foreground)]/20" />
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-brand" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Laptop bottom */}
        <div className="relative mx-auto h-4 rounded-b-xl bg-[var(--card)] border-x border-b border-[var(--border)]"
          style={{ width: '80%' }}
        >
          <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b bg-[var(--muted)]" />
        </div>
      </motion.div>
    </section>
  );
}
