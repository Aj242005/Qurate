import { motion } from 'motion/react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

interface GraphData {
  x: (string | number)[];
  y: number[];
  x_label?: string;
  y_label?: string;
}

export default function GraphMessage({ data }: { data: GraphData }) {
  const chartData = data.x.map((xVal, i) => ({ x: xVal, y: data.y[i] ?? 0 }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="glass max-w-[90%] rounded-2xl rounded-tl-md p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--q-purple)]">Graph Result</span>
          <span className="text-xs text-[var(--muted-foreground)]">{data.x.length} points</span>
        </div>
        {(data.x_label || data.y_label) && (
          <div className="mb-2 flex gap-4 text-xs text-[var(--muted-foreground)]">
            {data.x_label && <span>X: {data.x_label}</span>}
            {data.y_label && <span>Y: {data.y_label}</span>}
          </div>
        )}
        <div className="h-64 w-full min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#863bff" />
                  <stop offset="100%" stopColor="#47bfff" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,59,255,0.1)" />
              <XAxis dataKey="x" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="y" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
