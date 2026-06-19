export type Category = 'SCHOLARSHIP' | 'CIRCULAR' | 'SCHEME' | 'INTERNSHIP' | 'COMPETITION' | 'OTHER';
export type Status = 'PENDING' | 'PROCESSED' | 'ERROR';
export type StepStatus = 'PENDING' | 'COMPLETED';

export interface Profile {
  id: string;
  full_name: string;
  grade_level: string;
  created_at: string;
}

export interface EvidenceBackedInsight {
  value: string;
  source_quote: string;
  page_number?: string | number;
  confidence_score: number;
}

export interface Opportunity {
  id: string;
  user_id: string;
  title: string;
  category: Category;
  storage_path: string;
  simplified_summary: string;
  deadline: string | null;
  status: Status;
  eligibility_analysis?: { requirements?: EvidenceBackedInsight[] };
  required_documents?: EvidenceBackedInsight[];
  opportunity_value?: string;
  opportunity_loss_prediction?: string;
  readiness_score?: number;
  risk_score?: number;
  risk_analysis?: Record<string, unknown>;
  confidence_score?: number;
  evidence_references?: Record<string, string>[];
  created_at: string;
}

export interface ActionStep {
  id: string;
  opportunity_id: string;
  step_number: number;
  title: string;
  description: string;
  status: StepStatus;
  source_quote?: string;
  page_number?: string | number;
  confidence_score?: number;
}
