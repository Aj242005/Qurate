import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface TextMessageProps {
  content: string;
  role: 'user' | 'assistant';
}

export default function TextMessage({ content, role }: TextMessageProps) {
  const voiceLanguage = useSelector((state: RootState) => state.ui.voiceLanguage);

  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = voiceLanguage;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === 'user'
            ? 'rounded-tr-md bg-gradient-brand text-white'
            : 'glass rounded-tl-md text-[var(--foreground)]'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>

        {role === 'assistant' && (
          <button
            onClick={speak}
            className="absolute -bottom-3 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] opacity-0 transition-opacity group-hover:opacity-100"
            title="Read aloud"
          >
            <Volume2 size={12} className="text-[var(--muted-foreground)]" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
