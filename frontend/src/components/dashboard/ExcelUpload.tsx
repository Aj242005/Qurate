import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, FileSpreadsheet, Loader2, Check } from 'lucide-react';
import { apiUploadExcel } from '@/lib/api';
import GradientButton from '@/components/ui/GradientButton';

interface ExcelUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExcelUpload({ isOpen, onClose }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv'))) {
      setFile(f);
      setResult(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setResult(null); }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const res = await apiUploadExcel(file);
      setResult({
        success: res.data.status === 201 || res.data.status === 200,
        message: res.data.message || 'Upload complete',
      });
    } catch {
      setResult({ success: false, message: 'Upload failed. Please try again.' });
    }
    setUploading(false);
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-md rounded-3xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload Excel File</h3>
              <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X size={20} />
              </button>
            </div>

            {!result ? (
              <>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                    dragOver
                      ? 'border-[var(--q-purple)] bg-[var(--q-purple)]/5'
                      : 'border-[var(--border)] hover:border-[var(--q-purple)]/50'
                  }`}
                >
                  {file ? (
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet size={24} className="text-green-400" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button onClick={reset} className="ml-2 text-[var(--muted-foreground)] hover:text-red-400">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mb-3 text-[var(--muted-foreground)]" />
                      <p className="mb-1 text-sm font-medium">Drop your Excel file here</p>
                      <p className="mb-3 text-xs text-[var(--muted-foreground)]">.xlsx, .xls, or .csv</p>
                      <label className="cursor-pointer rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium transition-colors hover:bg-[var(--accent)]">
                        Browse Files
                        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
                      </label>
                    </>
                  )}
                </div>

                <GradientButton
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="mt-4 w-full justify-center disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Uploading...</span>
                  ) : (
                    'Create Table from File'
                  )}
                </GradientButton>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {result.success ? <Check size={24} className="text-green-400" /> : <X size={24} className="text-red-400" />}
                </div>
                <p className="text-sm font-medium">{result.message}</p>
                <GradientButton size="sm" variant="outline" onClick={() => { reset(); onClose(); }}>
                  Done
                </GradientButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
