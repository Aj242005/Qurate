import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Sparkles, MessageSquarePlus, FileSpreadsheet, Trash2, History,
  LogOut, Send, Paperclip
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function MacbookScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<'empty' | 'typing' | 'thinking' | 'result'>('empty');
  const [typedText, setTypedText] = useState('');

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

  useEffect(() => {
    let timer: any;
    let typingInterval: any;
    let charIndex = 0;
    const prompt = "Show our Q1 performance analysis...";

    const runSimulation = () => {
      setStep('empty');
      setTypedText('');
      
      timer = setTimeout(() => {
        setStep('typing');
        charIndex = 0;
        typingInterval = setInterval(() => {
          if (charIndex < prompt.length) {
            setTypedText(prompt.substring(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            timer = setTimeout(() => {
              setStep('thinking');
              setTypedText('');
              timer = setTimeout(() => {
                setStep('result');
                timer = setTimeout(() => {
                  runSimulation();
                }, 6000);
              }, 1500);
            }, 1000);
          }
        }, 60);
      }, 3000);
    };

    runSimulation();

    return () => {
      clearTimeout(timer);
      clearInterval(typingInterval);
    };
  }, []);

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
            {/* Real Qurate Dashboard Inside Look */}
            <div className="flex h-full select-none">
              {/* Sidebar */}
              <div className="w-48 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar)] flex flex-col justify-between py-3">
                <div>
                  {/* Logo */}
                  <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 pb-3">
                    <img src="/favicon.svg" alt="Qurate" className="h-5 w-5" />
                    <span className="text-sm font-bold text-gradient">Qurate</span>
                  </div>

                  {/* Actions */}
                  <div className="px-3 py-3">
                    <button className="flex w-full items-center gap-2.5 rounded-xl bg-gradient-brand px-3 py-2 text-xs font-semibold text-white shadow-sm opacity-95 pointer-events-none">
                      <MessageSquarePlus size={13} /> New Chat
                    </button>
                  </div>

                  {/* Tools */}
                  <div className="px-3 py-1 space-y-0.5">
                    <div className="px-2 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]/60">
                      Tools
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[var(--muted-foreground)] hover:bg-[var(--accent)]/50 hover:text-[var(--foreground)] transition-colors">
                      <FileSpreadsheet size={13} /> Upload Excel
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[var(--muted-foreground)] hover:bg-[var(--accent)]/50 hover:text-[var(--foreground)] transition-colors">
                      <Trash2 size={13} /> Clear History
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[var(--muted-foreground)] hover:bg-[var(--accent)]/50 hover:text-[var(--foreground)] transition-colors">
                      <History size={13} /> Chat History
                    </div>
                  </div>
                </div>

                {/* Bottom user section */}
                <div className="border-t border-[var(--border)] px-3 pt-3">
                  <div className="flex items-center gap-2 rounded-xl px-2 py-1.5 bg-[var(--accent)]/5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white shrink-0">
                      D
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="truncate text-xs font-semibold leading-none">Demo User</p>
                      <p className="truncate text-[8px] text-[var(--muted-foreground)] mt-0.5 leading-none">demo@qurate.com</p>
                    </div>
                    <LogOut size={12} className="text-[var(--muted-foreground)] shrink-0" />
                  </div>
                </div>
              </div>

              {/* Main chat area */}
              <div className="flex flex-1 flex-col overflow-hidden bg-[var(--background)]">
                {/* Chat window viewport */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                  {step === 'empty' || step === 'typing' ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg shadow-purple-500/10">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <h3 className="text-base font-bold text-[var(--foreground)]">
                        Good morning, Demo User
                      </h3>
                      <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                        How can I help you with your data today?
                      </p>
                      <div className="mt-4 flex flex-col gap-1.5 w-full max-w-[280px]">
                        {[
                          'Show all tables in my database',
                          'Create a new employees table',
                          'Summarize my sales data',
                        ].map((suggestion) => (
                          <div
                            key={suggestion}
                            className="glass rounded-xl px-3 py-1.5 text-[10px] text-[var(--muted-foreground)] border border-[var(--border)] cursor-default bg-[var(--card)]/40 text-center"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : step === 'thinking' ? (
                    <div className="flex-1 p-4 space-y-4">
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="rounded-2xl rounded-tr-md bg-gradient-brand px-3.5 py-2 max-w-[80%] shadow-sm">
                          <p className="text-xs text-white">Show our Q1 performance analysis...</p>
                        </div>
                      </div>
                      {/* Thinking response */}
                      <div className="flex justify-start">
                        <div className="glass rounded-2xl rounded-tl-md px-3.5 py-3 border border-[var(--border)] flex items-center gap-2 bg-[var(--card)]/30">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="text-[var(--q-purple)]"
                          >
                            <Sparkles size={14} />
                          </motion.div>
                          <span className="text-xs text-[var(--muted-foreground)]">Thinking and executing query...</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto text-left">
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="rounded-2xl rounded-tr-md bg-gradient-brand px-3.5 py-2 max-w-[80%] shadow-sm">
                          <p className="text-xs text-white">Show our Q1 performance analysis...</p>
                        </div>
                      </div>
                      
                      {/* Assistant message */}
                      <div className="space-y-3">
                        {/* Response Text */}
                        <div className="flex justify-start">
                          <div className="glass rounded-2xl rounded-tl-md px-3.5 py-2 border border-[var(--border)] max-w-[90%] bg-[var(--card)]/30">
                            <p className="text-xs text-[var(--foreground)]">
                              Here is the performance analysis for Q1 2026:
                            </p>
                          </div>
                        </div>

                        {/* Table result */}
                        <div className="flex justify-start">
                          <div className="glass w-full max-w-[90%] rounded-2xl rounded-tl-md p-3 border border-[var(--border)] bg-[var(--card)]/30">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[10px] font-medium text-[var(--q-purple)] uppercase tracking-wider">Table Result</span>
                              <span className="text-[10px] text-[var(--muted-foreground)]">3 rows</span>
                            </div>
                            <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]/50">
                              <table className="w-full text-left text-[10px]">
                                <thead>
                                  <tr className="border-b border-[var(--border)] bg-[var(--accent)]/10 font-semibold text-[var(--foreground)]">
                                    <th className="px-3 py-1.5">Month</th>
                                    <th className="px-3 py-1.5">Revenue</th>
                                    <th className="px-3 py-1.5">Users</th>
                                    <th className="px-3 py-1.5">Growth</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[
                                    { month: 'Jan', revenue: '$45,000', users: '1,200', growth: '+12%' },
                                    { month: 'Feb', revenue: '$52,000', users: '1,450', growth: '+15%' },
                                    { month: 'Mar', revenue: '$61,000', users: '1,800', growth: '+18%' },
                                  ].map((row, i) => (
                                    <tr key={i} className="border-b border-[var(--border)]/50 text-[var(--muted-foreground)]">
                                      <td className="px-3 py-1.5 font-medium text-[var(--foreground)]">{row.month}</td>
                                      <td className="px-3 py-1.5">{row.revenue}</td>
                                      <td className="px-3 py-1.5">{row.users}</td>
                                      <td className="px-3 py-1.5 text-emerald-500 font-medium">{row.growth}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Chart result */}
                        <div className="flex justify-start">
                          <div className="glass w-full max-w-[90%] rounded-2xl rounded-tl-md p-3 border border-[var(--border)] bg-[var(--card)]/30">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[10px] font-medium text-[var(--q-purple)] uppercase tracking-wider">Graph Result</span>
                              <span className="text-[10px] text-[var(--muted-foreground)]">Growth trend</span>
                            </div>
                            <div className="h-32 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                  { month: 'Jan', revenue: 45000 },
                                  { month: 'Feb', revenue: 52000 },
                                  { month: 'Mar', revenue: 61000 },
                                ]}>
                                  <defs>
                                    <linearGradient id="mockBarGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#863bff" />
                                      <stop offset="100%" stopColor="#47bfff" />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,59,255,0.05)" />
                                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: 'var(--muted-foreground)' }} />
                                  <YAxis tick={{ fontSize: 8, fill: 'var(--muted-foreground)' }} width={25} />
                                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 9 }} />
                                  <Bar dataKey="revenue" fill="url(#mockBarGrad)" radius={[3, 3, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <div className="mt-auto border-t border-[var(--border)]/50 p-3 bg-[var(--card)]/30 backdrop-blur-md">
                  <div className="flex gap-2 items-center">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--foreground)] transition-colors pointer-events-none shrink-0">
                      <Paperclip size={13} />
                    </button>
                    <div className="flex-1 relative flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] overflow-hidden h-8">
                      {step === 'typing' ? (
                        <span className="text-[var(--foreground)] flex items-center">
                          {typedText}
                          <span className="w-0.5 h-3.5 bg-[var(--q-purple)] ml-0.5 animate-pulse" />
                        </span>
                      ) : step === 'empty' ? (
                        <span>Ask anything about your database...</span>
                      ) : (
                        <span className="text-[var(--muted-foreground)]/40">Ask anything about your database...</span>
                      )}
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white hover:opacity-90 transition-opacity pointer-events-none shrink-0">
                      <Send size={13} />
                    </button>
                  </div>
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
