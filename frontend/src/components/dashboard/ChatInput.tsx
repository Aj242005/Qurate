import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Mic, MicOff, Paperclip, Languages } from 'lucide-react';
import { sendPrompt } from '@/store/chatSlice';
import { setVoiceLanguage } from '@/store/uiSlice';
import type { RootState, AppDispatch } from '@/store/store';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'ur-IN', label: 'Urdu' },
  { code: 'fr-FR', label: 'French' },
];

interface ChatInputProps {
  onUploadExcel: () => void;
}

export default function ChatInput({ onUploadExcel }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.chat);
  const voiceLanguage = useSelector((state: RootState) => state.ui.voiceLanguage);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    dispatch(sendPrompt(trimmed));
    setInput('');
  }, [input, isLoading, dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLanguage;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === voiceLanguage)?.label || voiceLanguage;

  return (
    <div className="relative border-t border-[var(--border)] bg-[var(--background)] p-4">
      <AnimatePresence>
        {showLangPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 z-50 mb-2 max-h-64 w-64 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl"
          >
            <div className="px-3 pb-2 pt-1 text-xs font-semibold text-[var(--muted-foreground)]">
              Voice language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  dispatch(setVoiceLanguage(lang.code));
                  setShowLangPicker(false);
                }}
                className={`focus-ring w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--accent)] ${
                  voiceLanguage === lang.code ? 'bg-[var(--accent)] text-[var(--primary)]' : 'text-[var(--foreground)]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1 pb-1">
          <button
            onClick={onUploadExcel}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            title="Upload Excel file"
            aria-label="Upload Excel or CSV file"
          >
            <Paperclip size={18} />
          </button>

          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            title="Select voice language"
            aria-label="Select voice language"
            aria-expanded={showLangPicker}
          >
            <Languages size={18} />
          </button>

          <button
            onClick={toggleRecording}
            className={`focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              isRecording
                ? 'pulse-mic bg-red-500/20 text-red-500'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
            aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your data..."
          rows={1}
          className="focus-ring min-h-11 flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)]"
          aria-label="Ask Qurate about your data"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white transition-colors hover:bg-[var(--q-purple-deep)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send prompt"
        >
          <Send size={18} />
        </button>
      </div>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-center text-xs font-medium text-red-500"
        >
          Recording in {currentLanguage}...
        </motion.div>
      )}
    </div>
  );
}
