export type Category = 'SCHOLARSHIP' | 'CIRCULAR' | 'SCHEME' | 'INTERNSHIP' | 'COMPETITION';
export type Status = 'PENDING' | 'PROCESSED' | 'ERROR';
export type StepStatus = 'PENDING' | 'COMPLETED';

export interface Profile {
  id: string;
  full_name: string;
  grade_level: string;
  created_at: string;
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
  eligibility_analysis?: Record<string, any>;
  required_documents?: string[];
  opportunity_value?: string;
  opportunity_loss_prediction?: string;
  readiness_score?: number;
  risk_score?: number;
  risk_analysis?: Record<string, any>;
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
}
