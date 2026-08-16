'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, Shield, Eye, RefreshCw, Lock, Code2, Globe,
  ArrowRight, CheckCircle2, TrendingUp, Activity,
} from 'lucide-react';
import { SiteHeader } from '../components/layout/SiteHeader';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const trustItems = [
  '⚡ Stellar Soroban', '🔒 Non-Custodial', '🌐 SEP-41 Tokens',
  '💳 USDC & XLM', '🔁 Recurring Payments', '📊 On-Chain Analytics',
  '⚡ Stellar Soroban', '🔒 Non-Custodial', '🌐 SEP-41 Tokens',
  '💳 USDC & XLM', '🔁 Recurring Payments', '📊 On-Chain Analytics',
];

export default function HomePage() {
  return (
    <div style={{ background: '#030712', minHeight: '100vh' }}>
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <SiteHeader />

      {/* ── HERO — centered, editorial ──────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center pt-36 pb-20 px-6">

        <motion.div {...inView(0)} className="mb-6">
          <span className="badge">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by Stellar Soroban
          </span>
        </motion.div>

        <motion.h1 {...inView(0.08)}
          className="font-black tracking-tight leading-[1.02] mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', maxWidth: 820 }}
        >
          The billing layer for<br />
          <span className="gradient-text">decentralized apps</span>
        </motion.h1>

        <motion.p {...inView(0.16)}
          className="text-base md:text-lg leading-relaxed mb-10"
          style={{ color: '#64748b', maxWidth: 520 }}
        >
          Automate recurring payments for your SaaS, platform, or community — enforced entirely by smart contracts on Stellar. No intermediaries.
        </motion.p>

        <motion.div {...inView(0.22)} className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Link href="/merchant" className="btn-primary">
            Open Dashboard <ArrowRight size={15} />
          </Link>
          <Link href="/subscriber" className="btn-ghost">
            My Subscriptions
          </Link>
        </motion.div>

        {/* Live stats bar */}
        <motion.div {...inView(0.28)}
          className="flex flex-wrap justify-center gap-px rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
        >
          {[
            { label: 'Total Volume', value: '$2.4M' },
            { label: 'Active Plans', value: '1,280' },
            { label: 'Avg. Tx Fee', value: '$0.001' },
            { label: 'Uptime', value: '99.98%' },
          ].map((s, i) => (
            <div key={s.label}
              className="flex flex-col items-center px-8 py-4"
              style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            >
              <span className="text-xl font-bold text-white">{s.value}</span>
              <span className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 overflow-hidden py-5 mb-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="marquee-track">
          {trustItems.map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium whitespace-nowrap" style={{ color: '#334155' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── BENTO GRID ──────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div {...inView()} className="text-center mb-14">
            <span className="badge mb-5 inline-flex">Platform</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Everything billing needs,<br />
              <span className="gradient-text">nothing it doesn't</span>
            </h2>
          </motion.div>

          {/* Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">

            {/* Large card — subscription preview */}
            <motion.div {...inView(0.05)}
              className="glass-hover md:col-span-2 p-8 flex flex-col justify-between min-h-64 relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <Zap size={16} style={{ color: '#a78bfa' }} />
                  </div>
                  <span className="text-sm font-semibold text-white">Automated Billing</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b', maxWidth: 360 }}>
                  Smart contracts execute payments on schedule. No cron jobs, no servers, no missed cycles — ever.
                </p>
              </div>
              {/* Mini card preview */}
              <div className="mt-8 flex gap-3">
                {[
                  { plan: 'Pro Plan', amount: '$29/mo', status: 'Active', color: '#4ade80' },
                  { plan: 'Starter', amount: '$9/mo', status: 'Active', color: '#4ade80' },
                  { plan: 'Enterprise', amount: '$199/mo', status: 'Paused', color: '#fbbf24' },
                ].map((c) => (
                  <div key={c.plan} className="flex-1 rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-medium text-white mb-1">{c.plan}</p>
                    <p className="text-xs font-bold" style={{ color: '#a78bfa' }}>{c.amount}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-[10px]" style={{ color: '#475569' }}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tall card — one-time auth */}
            <motion.div {...inView(0.1)}
              className="glass-hover p-8 flex flex-col justify-between min-h-64 relative overflow-hidden"
            >
              <div className="absolute -left-6 -bottom-6 w-36 h-36 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Shield size={16} style={{ color: '#60a5fa' }} />
                </div>
                <p className="text-sm font-semibold text-white mb-2">One-Time Auth</p>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                  Subscribers sign once via Freighter. The contract handles all future cycles permissionlessly.
                </p>
              </div>
              <div className="mt-6 space-y-2">
                {['Sign transaction', 'Authorize contract', 'Billing automated'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <CheckCircle2 size={13} style={{ color: i < 2 ? '#4ade80' : '#334155' }} />
                    <span className="text-xs" style={{ color: i < 2 ? '#94a3b8' : '#334155' }}>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stat card */}
            <motion.div {...inView(0.12)}
              className="glass-hover p-8 flex flex-col justify-between min-h-48"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <TrendingUp size={16} style={{ color: '#34d399' }} />
              </div>
              <div>
                <p className="text-3xl font-black text-white mb-1">$0.001</p>
                <p className="text-sm font-medium text-white mb-1">Per Transaction</p>
                <p className="text-xs" style={{ color: '#475569' }}>Stellar's near-zero fees vs. 2.9% + $0.30 on Stripe</p>
              </div>
            </motion.div>

            {/* Transparency card */}
            <motion.div {...inView(0.14)}
              className="glass-hover p-8 flex flex-col justify-between min-h-48 relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />
              <div className="relative">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <Eye size={16} style={{ color: '#a78bfa' }} />
                </div>
                <p className="text-sm font-semibold text-white mb-2">Full Transparency</p>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                  Every payment is on-chain, verifiable, and immutable. No black boxes.
                </p>
              </div>
            </motion.div>

            {/* Activity card */}
            <motion.div {...inView(0.16)}
              className="glass-hover p-8 flex flex-col justify-between min-h-48"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <Activity size={16} style={{ color: '#22d3ee' }} />
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                  Live
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-3">Recent Payments</p>
                <div className="space-y-2">
                  {['+$29.00', '+$9.00', '+$199.00'].map((amt, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#475569' }}>USDC · {i + 1}m ago</span>
                      <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>{amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — horizontal timeline ──────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...inView()} className="text-center mb-16">
            <span className="badge mb-5 inline-flex">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Live in <span className="gradient-text">4 steps</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4) 20%, rgba(59,130,246,0.4) 80%, transparent)' }} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: '01', icon: Zap, title: 'Register', desc: 'Connect Freighter wallet and register your treasury on-chain.', color: '#7C3AED' },
                { n: '02', icon: Code2, title: 'Create Plan', desc: 'Set amount, token, interval, grace period. Deployed instantly.', color: '#6366f1' },
                { n: '03', icon: Shield, title: 'Subscribers Join', desc: 'Users sign once. Contract handles all future billing.', color: '#3B82F6' },
                { n: '04', icon: TrendingUp, title: 'Earn', desc: 'Scheduler calls process_payment. Funds land in your treasury.', color: '#06B6D4' },
              ].map((s, i) => (
                <motion.div key={s.n} {...inView(i * 0.08)}
                  className="glass-hover p-6 text-center relative"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}>
                    <s.icon size={16} style={{ color: s.color }} />
                  </div>
                  <p className="text-xs font-bold mb-2" style={{ color: s.color }}>{s.n}</p>
                  <p className="text-sm font-bold text-white mb-2">{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES GRID ───────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...inView()} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge mb-4 inline-flex">Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Built for the<br /><span className="gradient-text">open economy</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed md:max-w-xs" style={{ color: '#475569' }}>
              No banks. No processors. No chargebacks. Just cryptography and Stellar.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: RefreshCw, title: 'Recurring Payments', desc: 'Automated cycles on Soroban', color: '#7C3AED' },
              { icon: Lock, title: 'Secure by Design', desc: 'Non-custodial, trustless', color: '#3B82F6' },
              { icon: Code2, title: 'Open Interface', desc: 'Permissionless process_payment', color: '#8B5CF6' },
              { icon: Globe, title: 'Global & Open', desc: 'Any SEP-41 token, anywhere', color: '#06B6D4' },
            ].map((c, i) => (
              <motion.div key={c.title} {...inView(i * 0.07)}
                className="glass-hover p-5"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${c.color}12`, border: `1px solid ${c.color}20` }}>
                  <c.icon size={15} style={{ color: c.color }} />
                </div>
                <p className="text-sm font-semibold text-white mb-1">{c.title}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...inView()}
            className="relative rounded-3xl overflow-hidden text-center p-16"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)',
              border: '1px solid rgba(124,58,237,0.2)',
              boxShadow: '0 0 80px rgba(124,58,237,0.1)',
            }}
          >
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <span className="badge mb-6 inline-flex">Get Started Free</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
                Billing that runs<br />
                <span className="gradient-text">while you sleep</span>
              </h2>
              <p className="text-sm md:text-base mb-10" style={{ color: '#64748b' }}>
                Deploy your first plan on Stellar Soroban in under 5 minutes.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/merchant" className="btn-primary !py-3.5 !px-8 !text-sm">
                  Launch Merchant Dashboard <ArrowRight size={16} />
                </Link>
                <Link href="/subscriber" className="btn-ghost !py-3.5 !px-8 !text-sm">
                  View Subscriptions
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}>
              <Zap size={11} fill="white" className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Sa-Billing</span>
            <span className="text-xs" style={{ color: '#1e293b' }}>·</span>
            <span className="text-xs" style={{ color: '#334155' }}>Decentralized Subscription Billing on Stellar</span>
          </div>
          <div className="flex items-center gap-5 text-xs" style={{ color: '#334155' }}>
            <span>MIT License</span>
            <a href="https://github.com/brite-side0/SS-Billing" target="_blank" rel="noreferrer"
              className="hover:text-white transition-colors">GitHub ↗</a>
            <a href="https://stellar.org" target="_blank" rel="noreferrer"
              className="hover:text-white transition-colors">Stellar ↗</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
