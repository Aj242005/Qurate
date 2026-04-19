import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import GradientButton from '@/components/ui/GradientButton';
import GlassCard from '@/components/ui/GlassCard';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '100 queries/month',
      '1 database connection',
      'Text & table responses',
      'English language support',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For power users and teams',
    features: [
      'Unlimited queries',
      '10 database connections',
      'Text, table & graph responses',
      '12+ language voice input',
      'Excel upload & import',
      'Priority support',
      'Chat history export',
    ],
    cta: 'Coming Soon',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations at scale',
    features: [
      'Everything in Pro',
      'Unlimited connections',
      'SSO & SAML auth',
      'Custom model fine-tuning',
      'On-premise deployment',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="relative px-6 pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh" />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-block rounded-full border border-[var(--q-purple)]/30 bg-[var(--q-purple)]/10 px-4 py-1.5 text-xs font-semibold text-[var(--q-purple)]">
              PRICING
            </div>
            <h1 className="text-4xl font-bold md:text-6xl">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Choose the plan that works best for you
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard
                  glow={plan.highlighted ? 'purple' : 'none'}
                  className={`relative h-full flex flex-col ${
                    plan.highlighted ? 'border-[var(--q-purple)]/30 scale-[1.02]' : ''
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-4 py-1 text-xs font-bold text-white">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-[var(--muted-foreground)]">{plan.period}</span>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check size={16} className="mt-0.5 shrink-0 text-[var(--q-purple)]" />
                        <span className="text-[var(--muted-foreground)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <GradientButton
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full justify-center"
                    disabled={plan.cta === 'Coming Soon' || plan.cta === 'Contact Us'}
                  >
                    {plan.cta}
                  </GradientButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
