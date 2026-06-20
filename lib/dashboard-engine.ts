import { ReadinessEngine } from "./readiness-engine"

export interface DashboardStats {
  activeCount: number;
  urgentDeadlinesCount: number;
  missingDocsCount: number;
  potentialFundingTotal: number;
  completedCount: number;
  readyToSubmitCount: number;
  averageReadiness: number;
}

export class DashboardEngine {
  static calculateStats(opportunities: any[], opportunityDocuments: any[], allTasks: any[]): DashboardStats {
    let activeCount = 0;
    let urgentDeadlinesCount = 0;
    let missingDocsCount = 0;
    let potentialFundingTotal = 0;
    let completedCount = 0;
    let readyToSubmitCount = 0;
    let totalReadiness = 0;

    const now = new Date().getTime();
    const next7Days = now + (7 * 24 * 60 * 60 * 1000);

    opportunities.forEach(opp => {
      if (opp.status === 'TRASHED') return;

      if (opp.status === 'COMPLETED') {
        completedCount++;
      } else if (opp.status === 'PROCESSED' || !opp.status) {
        activeCount++;
      }

      // Deadline
      if (opp.deadline && opp.status !== 'COMPLETED') {
        const dTime = new Date(opp.deadline).getTime();
        if (dTime >= now && dTime <= next7Days) {
          urgentDeadlinesCount++;
        }
      }

      // Funding Parsing
      if (opp.opportunity_value) {
        // basic regex to extract numbers from ₹60,000 etc
        const match = opp.opportunity_value.match(/\d+(?:,\d+)*(?:\.\d+)?/);
        if (match) {
          const val = parseFloat(match[0].replace(/,/g, ''));
          if (!isNaN(val)) potentialFundingTotal += val;
        }
      }

      // Readiness
      const oppTasks = allTasks.filter(t => t.opportunity_id === opp.id);
      const oppDocs = opportunityDocuments.filter(d => d.opportunity_id === opp.id);
      const metrics = ReadinessEngine.calculate(opp, oppDocs, oppTasks, {});
      
      totalReadiness += metrics.applicationReadiness;

      if (metrics.applicationReadiness >= 90 && opp.status !== 'COMPLETED') {
        readyToSubmitCount++;
      }

      // Missing Docs
      const reqDocs = opp.required_documents || [];
      const requiredNames = Array.isArray(reqDocs) ? reqDocs.map((d: any) => d.value || String(d)) : [];
      const missing = requiredNames.filter(name => !oppDocs.find(d => d.name === name));
      missingDocsCount += missing.length;
    });

    const averageReadiness = activeCount > 0 ? Math.round(totalReadiness / (activeCount + completedCount)) : 0;

    return {
      activeCount,
      urgentDeadlinesCount,
      missingDocsCount,
      potentialFundingTotal,
      completedCount,
      readyToSubmitCount,
      averageReadiness
    };
  }
}
