import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
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
          className="text-center"
        >
          {/* Animated gradient orb */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand shadow-lg shadow-purple-500/20"
          >
            <Sparkles size={32} className="text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold">
            Good {getGreeting()}, {user?.name || 'there'}
          </h2>
          <p className="mt-2 text-[var(--muted-foreground)]">
            How can I help you with your data today?
          </p>

          {/* Quick suggestions */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              'Show all tables in my database',
              'Create a new employees table',
              'Summarize my sales data',
            ].map((suggestion) => (
              <motion.button
                key={suggestion}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-xl px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {suggestion}
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
