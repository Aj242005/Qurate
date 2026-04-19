import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PanelLeft } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import ChatArea from '@/components/dashboard/ChatArea';
import ChatInput from '@/components/dashboard/ChatInput';
import ExcelUpload from '@/components/dashboard/ExcelUpload';
import { fetchChatHistory } from '@/store/chatSlice';
import { toggleSidebar } from '@/store/uiSlice';
import type { RootState, AppDispatch } from '@/store/store';

export default function Dashboard() {
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const sidebarOpen = useSelector((s: RootState) => s.ui.sidebarOpen);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar onUploadExcel={() => setExcelModalOpen(true)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar when sidebar is closed */}
        {!sidebarOpen && (
          <div className="flex items-center border-b border-[var(--border)] px-4 py-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <PanelLeft size={18} />
            </button>
            <div className="ml-3 flex items-center gap-2">
              <img src="/favicon.svg" alt="Qurate" className="h-5 w-5 " />
              <span className="text-sm font-semibold text-gradient">Qurate</span>
            </div>
          </div>
        )}

        <ChatArea />
        <ChatInput onUploadExcel={() => setExcelModalOpen(true)} />
      </div>

      {/* Excel upload modal */}
      <ExcelUpload
        isOpen={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
      />
    </div>
  );
}
