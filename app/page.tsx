'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Animated Score Ring ───────────────────────────────────────────────────
function ScoreRing() {
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const target = 94;
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= target) { setScore(target); clearInterval(timer); }
      else setScore(current);
    }, 1400 / (target / 2));
    return () => clearInterval(timer);
  }, [started]);

  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#6366f1';
  const r = 58, c = 2 * Math.PI * r, dash = (score / 100) * c;

  return (
    <div ref={ref} style={{ position: 'relative', width: '136px', height: '136px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="136" height="136" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="8" />
        <circle cx="68" cy="68" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 0.04s linear', filter: `drop-shadow(0 0 8px ${color}88)` }} />
      </svg>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '32px', fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>ATS Score</div>
      </div>
    </div>
  );
}

// ─── Mock Resume Card ──────────────────────────────────────────────────────
function MockAnalysisCard() {
  return (
    <div className="glass" style={{ borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'white', fontSize: '16px' }}>Software Engineer</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>resume_john_doe.pdf</div>
        </div>
        <ScoreRing />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Skills detected</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map(s => (
              <span key={s} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '99px', background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#fca5a5', marginBottom: '8px' }}>Missing keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Docker', 'Kubernetes'].map(s => (
              <span key={s} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '99px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--muted)' }}>Overall verdict</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: '#10b981' }}>Strong ✓</span>
        </div>
      </div>
    </div>
  );
}

// ─── Feature Card ──────────────────────────────────────────────────────────
function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="glass" style={{ borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '28px', lineHeight: 1 }}>{icon}</div>
      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'white', fontSize: '17px' }}>{title}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--muted)' }}>{body}</div>
    </div>
  );
}

// ─── Step ──────────────────────────────────────────────────────────────────
function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '15px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
        {n}
      </div>
      <div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'white', fontSize: '15px', marginBottom: '6px' }}>{title}</div>
        <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)' }}>{body}</div>
      </div>
    </div>
  );
}

// ─── Stat ──────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div className="grad-text" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2rem', fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const W = { maxWidth: '1100px', margin: '0 auto', padding: '0 32px' };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,8,16,0.9)' }}>
        <div style={{ ...W, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '15px', color: 'white' }}>R</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '17px', color: 'white' }}>ResumeAI</span>
          </div>
          <Link href="/analyze"
            style={{ background: 'var(--indigo)', color: 'white', padding: '9px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Try it free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ ...W, padding: '100px 32px 88px' }}>
        <div className="grid-hero">
          <div>
            <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '7px 16px', marginBottom: '32px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
              <span style={{ fontSize: '13px', color: '#a5b4fc', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500 }}>Powered by Groq · llama-3.3-70b</span>
            </div>

            <h1 className="fade-up-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2.6rem, 5.5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }}>
              Land your<br />
              <span className="grad-text">dream job</span><br />
              with a better resume.
            </h1>

            <p className="fade-up-2" style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '480px', marginBottom: '40px' }}>
              Upload your resume and get an instant ATS score, AI-powered improvement suggestions, and a job match report — completely free.
            </p>

            <div className="fade-up-3" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link href="/analyze"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white', padding: '15px 32px', borderRadius: '13px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 0 36px rgba(99,102,241,0.4)', display: 'inline-block' }}>
                Analyze my resume →
              </Link>
              <a href="#how-it-works"
                style={{ color: 'var(--muted)', padding: '15px 26px', borderRadius: '13px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', border: '1px solid var(--border)', display: 'inline-block' }}>
                See how it works
              </a>
            </div>

            <p className="fade-up-4" style={{ fontSize: '12px', color: 'var(--muted-2)' }}>
              No sign-up required · Free forever · Results in &lt;15 seconds
            </p>
          </div>

          <div className="fade-up-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <MockAnalysisCard />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ ...W, padding: '44px 32px' }}>
          <div className="grid-stats">
            <Stat value="&lt; 15s" label="Average analysis time" />
            <Stat value="100%" label="Free — no hidden fees" />
            <Stat value="AI-grade" label="Powered by Groq LLM" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...W, padding: '100px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '12px', color: '#818cf8', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>What you get</div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Everything your resume needs<br />
            <span className="grad-text">to get past the bots.</span>
          </h2>
        </div>
        <div className="grid-features">
          <FeatureCard icon="📊" title="ATS Score"
            body="Get a 0–100 score broken down by contact info, experience, skills, education, and formatting — exactly how automated screening systems see you." />
          <FeatureCard icon="🤖" title="AI Analysis"
            body="Groq's llama-3.3-70b extracts your skills, maps your career trajectory, identifies your strengths, and gives you prioritized, specific improvements." />
          <FeatureCard icon="🎯" title="Job Matching"
            body="Paste any job description and get a match score, a list of missing keywords, skill gaps, and a tailored rewrite guide for that exact role." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...W, padding: '100px 32px' }}>
          <div className="grid-how">
            <div>
              <div style={{ fontSize: '12px', color: '#818cf8', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>How it works</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '48px' }}>
                From upload to<br />insight in four steps.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Step n="1" title="Upload your resume" body="Drag and drop your PDF. We accept any text-based resume up to 5 MB." />
                <Step n="2" title="AI extracts the content" body="PyMuPDF reads every word, then Groq's LLM structures it into skills, roles, and experience." />
                <Step n="3" title="Get your ATS score" body="A detailed breakdown shows exactly where you score and what's holding you back." />
                <Step n="4" title="Match against a job" body="Paste a job description and instantly see your fit score, missing keywords, and how to tailor your resume for that role." />
              </div>
            </div>

            {/* Mock match card */}
            <div className="glass" style={{ borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>Job Match Report</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'white', fontSize: '16px' }}>Senior Frontend Engineer</div>
                  <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>Stripe · San Francisco</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '32px', color: '#10b981', lineHeight: 1 }}>82</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>/ 100</div>
                </div>
              </div>
              {[
                { label: 'Skills match', value: 28, max: 35, color: '#10b981' },
                { label: 'Experience',   value: 24, max: 30, color: '#10b981' },
                { label: 'Keywords',     value: 17, max: 20, color: '#f59e0b' },
                { label: 'Education',    value: 13, max: 15, color: '#10b981' },
              ].map(({ label, value, max, color }) => (
                <div key={label} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--muted)' }}>{label}</span>
                    <span style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>{value}/{max}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(99,102,241,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: '99px' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>Missing keywords to add</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {['GraphQL', 'Performance budgets', 'A/B testing'].map(k => (
                    <span key={k} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '99px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '100px 32px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '28px', padding: '72px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '260px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.13), transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '18px', position: 'relative' }}>
            Your next job starts<br />
            <span className="grad-text">with a better resume.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '420px', margin: '0 auto 40px', position: 'relative' }}>
            No account needed. Upload your PDF and get a full AI analysis in seconds.
          </p>
          <Link href="/analyze"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white', padding: '17px 40px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 0 48px rgba(99,102,241,0.45)', display: 'inline-block', position: 'relative' }}>
            Get my ATS score — free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '36px 32px' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>R</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: 'white' }}>ResumeAI</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted-2)' }}>Built with Next.js · Django · Groq AI · Open source</p>
        </div>
      </footer>
    </div>
  );
}
