import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Database, FileSpreadsheet, Mic, Sparkles } from 'lucide-react';
import type { RootState } from '@/store/store';
import TextMessage from './TextMessage';
import TableMessage from './TableMessage';
import GraphMessage from './GraphMessage';
import LoadingShimmer from '@/components/ui/LoadingShimmer';

export default function ChatArea() {
  const { messages, isLoading } = useSelector((s: RootState) => s.chat);
  const user = useSelector((s: RootState) => s.auth.user);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <Sparkles size={28} className="text-[var(--primary)]" />
          </div>

          <h2 className="text-2xl font-black tracking-[-0.02em]">
            Good {getGreeting()}, {user?.name || 'there'}
          </h2>
          <p className="mx-auto mt-2 max-w-xl leading-7 text-[var(--muted-foreground)]">
            Ask in your own words, speak in your preferred language, or import an Excel file to create a queryable database.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Database, text: 'Show all tables in my database' },
              { icon: FileSpreadsheet, text: 'Create a table from my sales file' },
              { icon: Mic, text: 'Summarize revenue in Hindi' },
            ].map((suggestion) => (
              <motion.button
                key={suggestion.text}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="focus-ring rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-left text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
              >
                <suggestion.icon size={18} className="mb-3 text-[var(--primary)]" />
                {suggestion.text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return <TextMessage key={msg.id} content={msg.content} role="user" />;
          }

          // Assistant messages — render based on type
          switch (msg.type) {
            case 'table':
              return (
                <TableMessage
                  key={msg.id}
                  data={msg.response as { columns: string[]; rows: (string | number | null)[][] }}
                />
              );
            case 'graph':
              return (
                <GraphMessage
                  key={msg.id}
                  data={msg.response as { x: (string | number)[]; y: number[]; x_label?: string; y_label?: string }}
                />
              );
            default:
              return (
                <TextMessage
                  key={msg.id}
                  content={typeof msg.response === 'string' ? msg.response : msg.content}
                  role="assistant"
                />
              );
          }
        })}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass max-w-[80%] rounded-2xl rounded-tl-md px-4 py-4">
              <LoadingShimmer lines={3} />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}
