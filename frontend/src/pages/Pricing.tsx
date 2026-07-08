import { motion } from 'motion/react';
import { Check, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import GradientButton from '@/components/ui/GradientButton';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For trying Qurate with a small dataset.',
    features: [
      '100 prompts per month',
      '1 database connection',
      'Text and table answers',
      'English prompts',
      'Community support',
    ],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For users who want voice, files, and charts.',
    features: [
      'Unlimited prompts',
      '10 database connections',
      'Text, table, and chart answers',
      '12+ language voice input',
      'Excel and CSV import',
      'Priority support',
    ],
    cta: 'Coming soon',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams with strict data and deployment needs.',
    features: [
      'Everything in Pro',
      'Unlimited connections',
      'SSO and SAML auth',
      'Custom deployment options',
      'Dedicated account support',
      'SLA coverage',
    ],
    cta: 'Contact us',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="relative px-6 pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mb-14 max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)]">
              <ShieldCheck size={16} className="text-[var(--primary)]" />
              Plans for learning-free database access
            </div>
            <h1 className="text-4xl font-black tracking-[-0.035em] md:text-6xl">
              Start simple. Add power when your data grows.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              Qurate pricing is structured around prompts, connections, voice, and file import, not database jargon.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                className={`relative flex h-full flex-col rounded-3xl border bg-[var(--card)] p-6 ${
                  plan.highlighted ? 'border-[var(--primary)] product-shadow' : 'border-[var(--border)]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-6 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-bold text-white">
                    Best fit
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-black">{plan.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted-foreground)]">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black tracking-[-0.03em]">{plan.price}</span>
                  <span className="text-[var(--muted-foreground)]">{plan.period}</span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-[var(--success)]" />
                      <span className="text-[var(--muted-foreground)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <GradientButton
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  className="w-full"
                  disabled={plan.cta === 'Coming soon' || plan.cta === 'Contact us'}
                >
                  {plan.cta}
                </GradientButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
