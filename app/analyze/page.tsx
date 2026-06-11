/**
 * app/analyze/page.tsx — The tool page
 *
 * This is where users actually upload and analyze their resumes.
 * Separated from the landing page so the landing can be static/fast
 * and the tool page handles all the interactive state.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { uploadResume, analyzeResume, createJobMatch, type ResumeRecord, type JobMatchRecord } from '@/lib/api';
import UploadZone from '@/components/ui/UploadZone';
import AnalysisResultView from '@/components/ui/AnalysisResult';
import JobMatchResult from '@/components/ui/JobMatchResult';

type Tab           = 'analysis' | 'match';
type UploadStatus  = 'idle' | 'uploading' | 'done' | 'error';
type AnalysisStatus = 'idle' | 'running' | 'done' | 'error';
type MatchStatus   = 'idle' | 'running' | 'done' | 'error';

function Spinner({ label }: { label: string }) {
  return (
    <div style={{ border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.04)', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '20px', animation: 'bounce 1s infinite' }}>🤖</div>
      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#a5b4fc', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Powered by Groq · llama-3.3-70b</p>
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '260px', margin: '24px auto 0' }}>
        {['Extracting text from PDF', 'Sending to Groq LLM', 'Parsing AI response', 'Saving to database'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', animationDelay: `${i * 150}ms` }} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>❌</span>
        <div>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#fca5a5', marginBottom: '4px', fontSize: '14px' }}>Something went wrong</p>
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#f87171' }}>{message}</p>
        </div>
      </div>
      <button onClick={onRetry} style={{ width: '100%', padding: '12px', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  );
}

export default function AnalyzePage() {
  const [activeTab,      setActiveTab]      = useState<Tab>('analysis');
  const [uploadStatus,   setUploadStatus]   = useState<UploadStatus>('idle');
  const [resume,         setResume]         = useState<ResumeRecord | null>(null);
  const [uploadError,    setUploadError]    = useState('');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisError,  setAnalysisError]  = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchStatus,    setMatchStatus]    = useState<MatchStatus>('idle');
  const [matchResult,    setMatchResult]    = useState<JobMatchRecord | null>(null);
  const [matchError,     setMatchError]     = useState('');

  const handleFileSelect = async (file: File) => {
    setUploadStatus('uploading');
    try {
      const res = await uploadResume(file);
      setResume(res.resume);
      setUploadStatus('done');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      setUploadStatus('error');
    }
  };

  const handleReset = () => {
    setUploadStatus('idle'); setResume(null); setUploadError('');
    setAnalysisStatus('idle'); setAnalysisError('');
    setMatchStatus('idle'); setMatchResult(null); setMatchError('');
    setJobDescription('');
  };

  const handleAnalyze = async () => {
    if (!resume) return;
    setAnalysisStatus('running'); setAnalysisError('');
    try {
      const res = await analyzeResume(resume.id);
      setResume(res.resume);
      setAnalysisStatus('done');
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalysisStatus('error');
    }
  };

  const handleMatch = async () => {
    if (!resume) return;
    setMatchStatus('running'); setMatchError(''); setMatchResult(null);
    try {
      const res = await createJobMatch(resume.id, jobDescription);
      setMatchResult(res.match);
      setMatchStatus('done');
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : 'Match failed');
      setMatchStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)', background: 'rgba(8,8,16,0.85)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>R</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '15px', color: 'white' }}>ResumeAI</span>
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Free · No sign-up</span>
        </div>
      </nav>

      {/* Tool */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Analyze your resume
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Upload a PDF to get started. No account needed.</p>
        </div>

        {/* Main card */}
        <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>

          {/* Tabs — only shown after upload */}
          {uploadStatus === 'done' && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {(['analysis', 'match'] as Tab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '14px', fontSize: '13px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === tab ? 'var(--indigo)' : 'transparent'}`, color: activeTab === tab ? '#a5b4fc' : 'var(--muted)', transition: 'color 0.2s', marginBottom: '-1px' }}>
                  {tab === 'analysis' ? '🧠  Resume Analysis' : '🎯  Job Match'}
                </button>
              ))}
            </div>
          )}

          {/* File strip */}
          {resume && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(99,102,241,0.04)' }}>
              <span style={{ fontSize: '18px' }}>📄</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume.original_name}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{resume.file_size_kb} KB · saved</p>
              </div>
              <button onClick={handleReset} style={{ fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>
            </div>
          )}

          <div style={{ padding: '28px' }}>

            {/* IDLE */}
            {uploadStatus === 'idle' && <UploadZone onFileSelect={handleFileSelect} />}

            {/* UPLOADING */}
            {uploadStatus === 'uploading' && (
              <div style={{ border: '2px dashed rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📤</div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#a5b4fc' }}>Uploading…</p>
              </div>
            )}

            {/* UPLOAD ERROR */}
            {uploadStatus === 'error' && <ErrorBox message={uploadError} onRetry={handleReset} />}

            {/* ANALYSIS TAB */}
            {uploadStatus === 'done' && activeTab === 'analysis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analysisStatus === 'idle' && (
                  <>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', lineHeight: 1.7 }}>
                      The AI will score your resume on ATS criteria, extract your skills and experience, identify strengths, and give you prioritized improvement suggestions.
                    </div>
                    <button onClick={handleAnalyze} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', cursor: 'pointer', boxShadow: '0 0 24px rgba(99,102,241,0.3)' }}>
                      🧠  Analyze my resume
                    </button>
                  </>
                )}
                {analysisStatus === 'running' && <Spinner label="Analyzing your resume…" />}
                {analysisStatus === 'error'   && <ErrorBox message={analysisError} onRetry={() => setAnalysisStatus('idle')} />}
                {analysisStatus === 'done' && resume?.analysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AnalysisResultView analysis={resume.analysis} filename={resume.original_name} />
                    <button onClick={() => { setActiveTab('match'); setMatchStatus('idle'); }}
                      style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#a5b4fc', fontSize: '14px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', cursor: 'pointer' }}>
                      🎯  Match this resume to a job →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MATCH TAB */}
            {uploadStatus === 'done' && activeTab === 'match' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {matchStatus !== 'done' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--muted)', marginBottom: '8px' }}>
                        Paste the full job description
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        disabled={matchStatus === 'running'}
                        placeholder="Paste the job title, requirements, responsibilities — everything in the posting…"
                        rows={10}
                        style={{ width: '100%', background: 'rgba(15,15,26,0.8)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '13px', fontFamily: 'monospace', padding: '14px', resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
                      />
                      <p style={{ fontSize: '11px', color: 'var(--muted-2)', textAlign: 'right', marginTop: '4px' }}>
                        {jobDescription.length} / 4000 chars
                      </p>
                    </div>
                    {matchStatus === 'idle' && (
                      <button onClick={handleMatch} disabled={jobDescription.trim().length < 50}
                        style={{ width: '100%', padding: '14px', background: jobDescription.trim().length >= 50 ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'var(--muted-2)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', cursor: jobDescription.trim().length >= 50 ? 'pointer' : 'not-allowed', boxShadow: jobDescription.trim().length >= 50 ? '0 0 24px rgba(99,102,241,0.3)' : 'none' }}>
                        🎯  Match resume to job
                      </button>
                    )}
                    {matchStatus === 'running' && <Spinner label="Matching your resume to the job…" />}
                    {matchStatus === 'error'   && <ErrorBox message={matchError} onRetry={() => setMatchStatus('idle')} />}
                  </>
                )}
                {matchStatus === 'done' && matchResult?.match_result && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <JobMatchResult match={matchResult.match_result} jobTitle={matchResult.job_title} company={matchResult.company} />
                    <button onClick={() => { setMatchStatus('idle'); setMatchResult(null); setJobDescription(''); }}
                      style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--muted)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif', cursor: 'pointer' }}>
                      Match against a different job
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
