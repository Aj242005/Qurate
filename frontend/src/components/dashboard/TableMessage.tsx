import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown } from 'lucide-react';

interface TableData {
  columns: string[];
  rows: (string | number | null)[][];
}

interface TableMessageProps {
  data: TableData;
}

export default function TableMessage({ data }: TableMessageProps) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const { columns, rows } = data;

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colIndex);
      setSortAsc(true);
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortCol === null) return 0;
    const aVal = a[sortCol];
    const bVal = b[sortCol];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="glass max-w-[90%] rounded-2xl rounded-tl-md p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--q-purple)]">Table Result</span>
          <span className="text-xs text-[var(--muted-foreground)]">{rows.length} rows</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--accent)]/50">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(i)}
                    className="cursor-pointer whitespace-nowrap px-4 py-2.5 font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--q-purple)]"
                  >
                    <span className="flex items-center gap-1.5">
                      {col}
                      <ArrowUpDown size={12} className="text-[var(--muted-foreground)]" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-b border-[var(--border)]/50 transition-colors hover:bg-[var(--accent)]/30 ${
                    ri % 2 === 0 ? '' : 'bg-[var(--accent)]/20'
                  }`}
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="whitespace-nowrap px-4 py-2 text-[var(--muted-foreground)]">
                      {cell !== null && cell !== undefined ? String(cell) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
