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
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-strong fixed left-0 right-0 top-0 z-50"
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6">
        <NavLink to="/" className="focus-ring flex w-fit items-center gap-2.5 rounded-xl">
          <img src="/favicon.svg" alt="Qurate" className="h-7 w-7" />
          <span className="text-xl font-bold text-gradient">Qurate</span>
        </NavLink>

        <div className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `focus-ring rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)]/70 hover:text-[var(--foreground)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden items-center justify-end gap-3 md:flex">
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
          className="focus-ring col-start-3 ml-auto flex h-11 w-11 items-center justify-center rounded-xl text-[var(--foreground)] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
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
          className="glass-strong border-t border-[var(--border)] px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="focus-ring rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
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
