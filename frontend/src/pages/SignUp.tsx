import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signUpUser, clearError, loginUser } from '@/store/authSlice';
import type { RootState, AppDispatch } from '@/store/store';
import GradientButton from '@/components/ui/GradientButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    gender: 'male',
    purpose: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(
      signUpUser({
        ...form,
        phone_number: parseInt(form.phone_number, 10),
      })
    );
    if (signUpUser.fulfilled.match(result)) {
      // Auto-login after signup
      const loginResult = await dispatch(loginUser({ email: form.email, password: form.password }));
      if (loginUser.fulfilled.match(loginResult)) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] bg-gradient-mesh px-6 py-20">
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Start querying your data in seconds
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                id="signup-name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                maxLength={50}
                placeholder="John Doe"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                id="signup-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
              />
            </div>
          </div>

          {/* Phone & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="signup-phone" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => update('phone_number', e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-gender" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">Gender</label>
              <select
                id="signup-gender"
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 px-4 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)] appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
                <option value="do not specify">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
                minLength={6}
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

          {/* Purpose (optional) */}
          <div>
            <label htmlFor="signup-purpose" className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
              Purpose <span className="text-[var(--muted-foreground)]/50">(optional)</span>
            </label>
            <input
              id="signup-purpose"
              type="text"
              value={form.purpose}
              onChange={(e) => update('purpose', e.target.value)}
              placeholder="Data analytics, reporting..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 px-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 outline-none transition-colors focus:border-[var(--q-purple)] focus:ring-1 focus:ring-[var(--q-purple)]"
            />
          </div>

          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Already have an account?{' '}
          <NavLink to="/login" className="font-medium text-[var(--q-purple)] hover:underline">
            Sign in
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}
