'use client';
import { MatchResult, TailoringSuggestion, MatchGap } from '@/lib/api';

const S = {
  section: { borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-card-2)', overflow: 'hidden' as const },
  sectionHead: { padding: '12px 18px', borderBottom: '1px solid var(--border)', fontSize: '11px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  sectionBody: { padding: '18px' },
};

function Tag({ label, color = 'indigo' }: { label: string; color?: string }) {
  const t: Record<string, { bg: string; text: string; border: string }> = {
    indigo:  { bg: 'rgba(99,102,241,0.1)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.25)' },
    emerald: { bg: 'rgba(16,185,129,0.1)',  text: '#6ee7b7', border: 'rgba(16,185,129,0.25)' },
    red:     { bg: 'rgba(239,68,68,0.1)',   text: '#fca5a5', border: 'rgba(239,68,68,0.2)'  },
    amber:   { bg: 'rgba(245,158,11,0.1)',  text: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
  };
  const s = t[color] || t.indigo;
  return <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '99px', background: s.bg, color: s.text, border: `1px solid ${s.border}`, display: 'inline-block' }}>{label}</span>;
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color }}>{value}/{max}</span>
      </div>
      <div style={{ height: '5px', background: 'rgba(99,102,241,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px' }} />
      </div>
    </div>
  );
}

const PRI = {
  high:   { label: 'High',   bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  text: '#fca5a5' },
  medium: { label: 'Medium', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#fcd34d' },
  low:    { label: 'Low',    bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', text: '#a5b4fc' },
};

export default function JobMatchResult({ match, jobTitle, company }: { match: MatchResult; jobTitle: string; company: string }) {
  const vc = { 'Excellent Match': '#10b981', 'Good Match': '#60a5fa', 'Partial Match': '#f59e0b', 'Poor Match': '#ef4444' }[match.verdict] || '#6366f1';
  const vbg = { 'Excellent Match': 'rgba(16,185,129,0.08)', 'Good Match': 'rgba(96,165,250,0.08)', 'Partial Match': 'rgba(245,158,11,0.08)', 'Poor Match': 'rgba(239,68,68,0.08)' }[match.verdict] || 'rgba(99,102,241,0.08)';
  const vborder = { 'Excellent Match': 'rgba(16,185,129,0.2)', 'Good Match': 'rgba(96,165,250,0.2)', 'Partial Match': 'rgba(245,158,11,0.2)', 'Poor Match': 'rgba(239,68,68,0.2)' }[match.verdict] || 'rgba(99,102,241,0.2)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: vbg, border: `1px solid ${vborder}`, borderRadius: '14px' }}>
        <div>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: vc, fontSize: '15px' }}>{match.verdict}</p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            {jobTitle || 'Role'}{company ? ` · ${company}` : ''}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '32px', color: vc }}>{match.match_score}</div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>/ 100</div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={S.section}>
        <div style={S.sectionHead}>Score Breakdown</div>
        <div style={{ ...S.sectionBody, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Bar label="Skills Match"     value={match.score_breakdown.skills_match}     max={35} />
          <Bar label="Experience Match" value={match.score_breakdown.experience_match} max={30} />
          <Bar label="Keywords Match"   value={match.score_breakdown.keywords_match}   max={20} />
          <Bar label="Education Match"  value={match.score_breakdown.education_match}  max={15} />
        </div>
      </div>

      {/* Summary */}
      <div style={S.section}>
        <div style={S.sectionHead}>Summary</div>
        <div style={S.sectionBody}><p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7 }}>{match.summary}</p></div>
      </div>

      {/* Keywords */}
      <div style={S.section}>
        <div style={S.sectionHead}>Keywords</div>
        <div style={S.sectionBody}>
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '11px', color: '#6ee7b7', marginBottom: '8px' }}>✓ Matched in your resume</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{match.matched_keywords.map(k => <Tag key={k} label={k} color="emerald" />)}</div>
          </div>
          {match.missing_keywords.length > 0 && (
            <div>
              <p style={{ fontSize: '11px', color: '#fca5a5', marginBottom: '8px' }}>✗ Missing — add these to your resume</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{match.missing_keywords.map(k => <Tag key={k} label={k} color="red" />)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div style={S.section}>
        <div style={S.sectionHead}>Skills</div>
        <div style={S.sectionBody}>
          <div style={{ marginBottom: match.missing_skills.length > 0 ? '14px' : 0 }}>
            <p style={{ fontSize: '11px', color: '#6ee7b7', marginBottom: '8px' }}>✓ Skills you have</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{match.matched_skills.map(s => <Tag key={s} label={s} color="emerald" />)}</div>
          </div>
          {match.missing_skills.length > 0 && (
            <div>
              <p style={{ fontSize: '11px', color: '#fca5a5', marginBottom: '8px' }}>✗ Skills to develop</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{match.missing_skills.map(s => <Tag key={s} label={s} color="red" />)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths for role */}
      <div style={S.section}>
        <div style={S.sectionHead}>Why You&apos;re a Fit</div>
        <div style={{ ...S.sectionBody, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {match.strengths_for_role.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>{s}
            </div>
          ))}
        </div>
      </div>

      {/* Gaps */}
      {match.gaps.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Gaps to Address</div>
          <div style={{ ...S.sectionBody, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {match.gaps.map((gap: MatchGap, i: number) => (
              <div key={i} style={{ padding: '12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '10px' }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#fcd34d', marginBottom: '4px' }}>{gap.area}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{gap.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tailoring suggestions */}
      <div style={S.section}>
        <div style={S.sectionHead}>How to Tailor Your Resume</div>
        <div style={{ ...S.sectionBody, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {match.tailoring_suggestions.map((item: TailoringSuggestion, i: number) => {
            const p = PRI[item.priority];
            return (
              <div key={i} style={{ padding: '14px', borderRadius: '12px', background: p.bg, border: `1px solid ${p.border}` }}>
                <span style={{ fontSize: '11px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: p.text, display: 'block', marginBottom: '6px' }}>{p.label} Priority</span>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{item.suggestion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
