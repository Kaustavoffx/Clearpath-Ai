// lib/readiness-engine.ts

export interface ReadinessMetrics {
  applicationReadiness: number;
  requirementsReady: number;
  requirementsTotal: number;
  documentsReady: number;
  documentsTotal: number;
  profileMatch: number;
  deadlineRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  executionConfidence: number;
  estimatedCompletionTimeMinutes: number;
}

export class ReadinessEngine {
  static calculate(
    opportunity: any,
    documents: any[],
    tasks: any[],
    profile: any
  ): ReadinessMetrics {
    // 1. Requirements Ready
    const eligibilityReqs = opportunity.eligibility_analysis?.requirements || [];
    const requirementsTotal = eligibilityReqs.length;
    let requirementsReady = 0;
    eligibilityReqs.forEach((req: any) => {
      if (req.value?.includes('[MATCHED]') || req.includes?.('[MATCHED]')) {
        requirementsReady++;
      }
    });

    const profileMatch = requirementsTotal > 0 ? Math.round((requirementsReady / requirementsTotal) * 100) : 100;

    // 2. Documents Ready
    const documentsTotal = documents.length > 0 ? documents.length : (opportunity.required_documents?.length || 0);
    let documentsReady = 0;
    if (documents.length > 0) {
      documentsReady = documents.filter((d: any) => d.status === 'verified' || d.status === 'uploaded').length;
    }

    // 3. Deadline Risk
    let deadlineRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    if (opportunity.deadline) {
      const daysUntilDeadline = Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline < 0) deadlineRisk = 'Critical';
      else if (daysUntilDeadline <= 3) deadlineRisk = 'Critical';
      else if (daysUntilDeadline <= 7) deadlineRisk = 'High';
      else if (daysUntilDeadline <= 14) deadlineRisk = 'Medium';
      else deadlineRisk = 'Low';
    }

    // 4. Tasks & Execution Time
    let estimatedCompletionTimeMinutes = 0;
    let tasksCompleted = 0;
    const tasksTotal = tasks.length;
    
    tasks.forEach((task: any) => {
      estimatedCompletionTimeMinutes += (task.estimated_time_minutes || 15);
      if (task.status === 'COMPLETED' || task.completion_percent === 100) {
        tasksCompleted++;
      }
    });

    if (tasksTotal === 0 && estimatedCompletionTimeMinutes === 0) {
      estimatedCompletionTimeMinutes = (opportunity.action_checklist?.length || 0) * 15;
    }

    const executionConfidence = opportunity.confidence_score || 85;

    // 5. Overall Application Readiness
    // Weights: Documents 40%, Profile Match 40%, Tasks 20%
    const docScore = documentsTotal > 0 ? (documentsReady / documentsTotal) : 1;
    const taskScore = tasksTotal > 0 ? (tasksCompleted / tasksTotal) : 0;
    
    let applicationReadiness = Math.round(
      (docScore * 40) + 
      ((profileMatch / 100) * 40) + 
      (taskScore * 20)
    );

    // Penalize if critical deadline but no tasks done
    if (deadlineRisk === 'Critical' && applicationReadiness < 100) {
      applicationReadiness = Math.max(0, applicationReadiness - 10);
    }

    return {
      applicationReadiness,
      requirementsReady,
      requirementsTotal,
      documentsReady,
      documentsTotal,
      profileMatch,
      deadlineRisk,
      executionConfidence,
      estimatedCompletionTimeMinutes
    };
  }
}
