import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Mic, MicOff, Paperclip, Languages } from 'lucide-react';
import { sendPrompt } from '@/store/chatSlice';
import { setVoiceLanguage } from '@/store/uiSlice';
import type { RootState, AppDispatch } from '@/store/store';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'ur-IN', label: 'اردو (Urdu)' },
  { code: 'fr-FR', label: 'Français (French)' },
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

  // Auto-resize textarea
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

  // Voice input via Web Speech API
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

  return (
    <div className="relative border-t border-[var(--border)] bg-[var(--background)] p-4">
      {/* Language picker dropdown */}
      <AnimatePresence>
        {showLangPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 mb-2 max-h-60 w-64 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  dispatch(setVoiceLanguage(lang.code));
                  setShowLangPicker(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--accent)] ${
                  voiceLanguage === lang.code ? 'bg-[var(--accent)] text-[var(--q-purple)]' : 'text-[var(--foreground)]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Action buttons */}
        <div className="flex items-center gap-1 pb-1">
          <button
            onClick={onUploadExcel}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            title="Upload Excel file"
          >
            <Paperclip size={18} />
          </button>

          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            title="Select voice language"
          >
            <Languages size={18} />
          </button>

          <button
            onClick={toggleRecording}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
              isRecording
                ? 'bg-red-500/20 text-red-400 pulse-mic'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your data..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white transition-opacity disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Recording language indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-center text-xs text-red-400"
        >
          🎙️ Recording in {LANGUAGES.find((l) => l.code === voiceLanguage)?.label || voiceLanguage}...
        </motion.div>
      )}
    </div>
  );
}
