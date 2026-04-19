import { NavLink, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import ThemeToggle from '@/components/ui/ThemeToggle';
import GradientButton from '@/components/ui/GradientButton';

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/pricing', label: 'Pricing' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Qurate" className="h-7 w-7" />
          <span className="text-xl font-bold text-gradient">Qurate</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex ml-30 ">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--q-purple)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <GradientButton size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </GradientButton>
              <GradientButton size="sm" variant="ghost" onClick={handleLogout}>
                Logout
              </GradientButton>
            </>
          ) : (
            <>
              <GradientButton size="sm" variant="ghost" onClick={() => navigate('/login')}>
                Login
              </GradientButton>
              <GradientButton size="sm" onClick={() => navigate('/signup')}>
                Get Started
              </GradientButton>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center md:hidden text-[var(--foreground)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-[var(--border)] px-6 py-4 md:hidden glass-strong"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <GradientButton size="sm" onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
                  Dashboard
                </GradientButton>
              ) : (
                <>
                  <GradientButton size="sm" variant="ghost" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                    Login
                  </GradientButton>
                  <GradientButton size="sm" onClick={() => { navigate('/signup'); setMobileOpen(false); }}>
                    Get Started
                  </GradientButton>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}