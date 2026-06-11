/**
 * lib/api.ts — Central API utility (Phase 4 update)
 * Added: createJobMatch(), listJobMatches(), getJobMatch()
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Improvement {
  priority: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
}

export interface AnalysisResult {
  ats_score: number;
  score_breakdown: { contact_info: number; work_experience: number; skills: number; education: number; formatting: number };
  summary: string;
  experience_summary: { years_of_experience: string; seniority_level: string; top_roles: string[]; industries: string[] };
  skills: { technical: string[]; soft: string[]; missing_keywords: string[] };
  strengths: string[];
  improvements: Improvement[];
  keywords_found: string[];
  overall_verdict: 'Strong' | 'Good' | 'Average' | 'Needs Work';
  extracted_text_preview: string;
  text_length: number;
}

export interface ResumeRecord {
  id: number;
  original_name: string;
  file: string;
  file_size: number;
  file_size_kb: number;
  uploaded_at: string;
  analysis_status: 'pending' | 'analyzing' | 'completed' | 'failed';
  analysis: AnalysisResult | null;
  analysis_error: string | null;
  analyzed_at: string | null;
  ats_score: number | null;
}

export interface TailoringSuggestion {
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface MatchGap {
  area: string;
  detail: string;
}

export interface MatchResult {
  match_score: number;
  verdict: 'Excellent Match' | 'Good Match' | 'Partial Match' | 'Poor Match';
  summary: string;
  score_breakdown: { skills_match: number; experience_match: number; education_match: number; keywords_match: number };
  matched_keywords: string[];
  missing_keywords: string[];
  matched_skills: string[];
  missing_skills: string[];
  strengths_for_role: string[];
  gaps: MatchGap[];
  tailoring_suggestions: TailoringSuggestion[];
  job_title_detected: string;
  company_detected: string | null;
}

export interface JobMatchRecord {
  id: number;
  resume: number;
  job_description: string;
  job_title: string;
  company: string;
  match_status: 'pending' | 'matching' | 'completed' | 'failed';
  match_result: MatchResult | null;
  match_error: string | null;
  created_at: string;
  matched_at: string | null;
  match_score: number | null;
}

export interface UploadResponse { message: string; resume: ResumeRecord }
export interface ListResumesResponse { count: number; resumes: ResumeRecord[] }
export interface MatchResponse { message: string; match: JobMatchRecord }

// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

export async function uploadResume(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/resumes/upload/`, { method: 'POST', body: formData });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Upload failed: ${response.status}`);
  }
  return response.json();
}

export async function analyzeResume(id: number): Promise<{ message: string; resume: ResumeRecord }> {
  return fetchAPI(`/resumes/${id}/analyze/`, { method: 'POST' });
}

export async function getResume(id: number): Promise<ResumeRecord> {
  return fetchAPI<ResumeRecord>(`/resumes/${id}/`);
}

/**
 * POST /api/resumes/<id>/match/
 * Sends the job description text to the backend and returns the full match report.
 */
export async function createJobMatch(resumeId: number, jobDescription: string): Promise<MatchResponse> {
  return fetchAPI(`/resumes/${resumeId}/match/`, {
    method: 'POST',
    body: JSON.stringify({ job_description: jobDescription }),
  });
}

export async function listJobMatches(resumeId: number) {
  return fetchAPI(`/resumes/${resumeId}/matches/`);
}

export async function getJobMatch(matchId: number): Promise<JobMatchRecord> {
  return fetchAPI<JobMatchRecord>(`/matches/${matchId}/`);
}
