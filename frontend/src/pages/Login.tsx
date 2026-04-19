import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginUser, clearError } from '@/store/authSlice';
import type { RootState, AppDispatch } from '@/store/store';
import GradientButton from '@/components/ui/GradientButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] bg-gradient-mesh px-6">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Qurate" className="h-7 w-7" />
          <span className="text-xl font-bold text-gradient">Qurate</span>
        </NavLink>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-strong w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Sign in to your Qurate account
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-11 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Don't have an account?{' '}
          <NavLink to="/signup" className="font-medium text-[var(--q-purple)] hover:underline">
            Sign up
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}
