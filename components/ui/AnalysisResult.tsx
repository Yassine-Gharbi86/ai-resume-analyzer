'use client';
import { AnalysisResult, Improvement } from '@/lib/api';

const S = {
  section: { borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-card-2)', overflow: 'hidden' as const },
  sectionHead: { padding: '12px 18px', borderBottom: '1px solid var(--border)', fontSize: '11px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  sectionBody: { padding: '18px' },
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const r = 46; const c = 2 * Math.PI * r; const dash = (score / 100) * c;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', width: '112px', height: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="112" height="112" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="7" />
          <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`} style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
        </svg>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '28px', fontWeight: 800, color }}>{score}</div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>/ 100</div>
        </div>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, color }}>ATS Score</span>
    </div>
  );
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
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

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

const PRI = {
  high:   { label: 'High',   bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  text: '#fca5a5' },
  medium: { label: 'Medium', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#fcd34d' },
  low:    { label: 'Low',    bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', text: '#a5b4fc' },
};

export default function AnalysisResultView({ analysis, filename }: { analysis: AnalysisResult; filename: string }) {
  const vc = { Strong: '#10b981', Good: '#60a5fa', Average: '#f59e0b', 'Needs Work': '#ef4444' }[analysis.overall_verdict] || '#6366f1';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px' }}>
        <div>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#6ee7b7', fontSize: '14px' }}>Analysis complete</p>
          <p style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace', marginTop: '2px' }}>{filename}</p>
        </div>
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: vc }}>{analysis.overall_verdict}</span>
      </div>

      {/* Score */}
      <div style={S.section}>
        <div style={S.sectionHead}>ATS Score</div>
        <div style={{ ...S.sectionBody, display: 'flex', alignItems: 'center', gap: '28px' }}>
          <ScoreRing score={analysis.ats_score} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Bar label="Work Experience" value={analysis.score_breakdown.work_experience} max={30} />
            <Bar label="Skills"          value={analysis.score_breakdown.skills}          max={25} />
            <Bar label="Contact Info"    value={analysis.score_breakdown.contact_info}    max={20} />
            <Bar label="Education"       value={analysis.score_breakdown.education}       max={15} />
            <Bar label="Formatting"      value={analysis.score_breakdown.formatting}      max={10} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={S.section}>
        <div style={S.sectionHead}>Summary</div>
        <div style={S.sectionBody}><p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7 }}>{analysis.summary}</p></div>
      </div>

      {/* Experience */}
      <div style={S.section}>
        <div style={S.sectionHead}>Experience</div>
        <div style={S.sectionBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            {[['Seniority', analysis.experience_summary.seniority_level], ['Experience', analysis.experience_summary.years_of_experience]].map(([l, v]) => (
              <div key={l} style={{ padding: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{l}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: 'white' }}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Top Roles</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{analysis.experience_summary.top_roles.map(r => <Tag key={r} label={r} color="indigo" />)}</div>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Industries</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{analysis.experience_summary.industries.map(i => <Tag key={i} label={i} color="emerald" />)}</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div style={S.section}>
        <div style={S.sectionHead}>Skills</div>
        <div style={S.sectionBody}>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Technical</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{analysis.skills.technical.map(s => <Tag key={s} label={s} color="indigo" />)}</div>
          </div>
          <div style={{ marginBottom: analysis.skills.missing_keywords.length > 0 ? '12px' : 0 }}>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Soft Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{analysis.skills.soft.map(s => <Tag key={s} label={s} color="emerald" />)}</div>
          </div>
          {analysis.skills.missing_keywords.length > 0 && (
            <div>
              <p style={{ fontSize: '11px', color: '#fca5a5', marginBottom: '8px' }}>Missing Keywords</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{analysis.skills.missing_keywords.map(s => <Tag key={s} label={s} color="red" />)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths */}
      <div style={S.section}>
        <div style={S.sectionHead}>Strengths</div>
        <div style={{ ...S.sectionBody, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {analysis.strengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }}>✓</span>{s}
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div style={S.section}>
        <div style={S.sectionHead}>Improvements</div>
        <div style={{ ...S.sectionBody, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {analysis.improvements.map((item: Improvement, i: number) => {
            const p = PRI[item.priority];
            return (
              <div key={i} style={{ padding: '14px', borderRadius: '12px', background: p.bg, border: `1px solid ${p.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: p.text }}>{item.issue}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: p.text }}>{p.label}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{item.suggestion}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keywords */}
      <div style={S.section}>
        <div style={S.sectionHead}>Keywords Found</div>
        <div style={S.sectionBody}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{analysis.keywords_found.map(k => <Tag key={k} label={k} color="amber" />)}</div>
        </div>
      </div>
    </div>
  );
}
