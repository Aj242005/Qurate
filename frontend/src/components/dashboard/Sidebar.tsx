import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  MessageSquarePlus, History, FileSpreadsheet, LogOut,
  PanelLeftClose, PanelLeft, Trash2,
} from 'lucide-react';
import type { RootState, AppDispatch } from '@/store/store';
import { logout } from '@/store/authSlice';
import { clearChatHistory, clearMessages } from '@/store/chatSlice';
import { toggleSidebar } from '@/store/uiSlice';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface SidebarProps {
  onUploadExcel: () => void;
}

export default function Sidebar({ onUploadExcel }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((s: RootState) => s.ui.sidebarOpen);
  const user = useSelector((s: RootState) => s.auth.user);

  const handleNewChat = () => {
    dispatch(clearMessages());
  };

  const handleClearHistory = () => {
    dispatch(clearChatHistory());
    dispatch(clearMessages());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {/* Collapse toggle (always visible) */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="focus-ring fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] md:hidden"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] md:relative"
          >
            {/* Logo */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <button onClick={() => navigate('/')} className="focus-ring flex items-center gap-2 rounded-xl transition-opacity hover:opacity-80">
                <img src="/favicon.svg" alt="Qurate" className="h-6 w-6" />
                <span className="text-lg font-bold text-gradient">Qurate</span>
              </button>
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="focus-ring hidden h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--accent)] md:flex"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={14} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <button
                onClick={handleNewChat}
                className="focus-ring mb-2 flex w-full items-center gap-2.5 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--q-purple-deep)]"
              >
                <MessageSquarePlus size={16} /> New Chat
              </button>

              <div className="mt-6 mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Tools
              </div>

              <button
                onClick={onUploadExcel}
                className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              >
                <FileSpreadsheet size={16} /> Upload Excel
              </button>

              <button
                onClick={handleClearHistory}
                className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              >
                <Trash2 size={16} /> Clear History
              </button>

              <button
                className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-[var(--muted-foreground)]/60"
                disabled
              >
                <History size={16} /> Chat History
              </button>
            </div>

            {/* Bottom user section */}
            <div className="border-t border-[var(--border)] px-3 py-4">
              <div className="mb-3 flex items-center justify-between px-2">
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-3 rounded-xl px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{user?.email || ''}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="focus-ring rounded-lg text-[var(--muted-foreground)] transition-colors hover:text-red-500"
                  title="Logout"
                  aria-label="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
