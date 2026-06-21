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
  static calculateStats(opportunities: any[], documentVault: any[], allTasks: any[]): DashboardStats {
    let activeCount = 0;
    let urgentDeadlinesCount = 0;
    let missingDocsCount = 0;
    let potentialFundingTotal = 0;
    let completedCount = 0;
    let readyToSubmitCount = 0;
    let totalReadiness = 0;

    const now = new Date().getTime();
    const next7Days = now + (7 * 24 * 60 * 60 * 1000);

    const userDocTypes = documentVault.map(d => d.document_type?.toLowerCase() || d.file_name?.toLowerCase() || '');

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
      if (opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document') {
        const match = opp.opportunity_value.match(/\d+(?:,\d+)*(?:\.\d+)?/);
        if (match) {
          const val = parseFloat(match[0].replace(/,/g, ''));
          if (!isNaN(val)) potentialFundingTotal += val;
        } else if (opp.opportunity_value.toLowerCase().includes('waiver') || opp.opportunity_value.toLowerCase().includes('fully funded')) {
          potentialFundingTotal += 50000; // Proxy value for dashboard summing
        }
      }

      // Readiness using document_vault
      const oppTasks = allTasks.filter(t => t.opportunity_id === opp.id);
      
      const rawDocs = opp.required_documents || []
      const requiredDocsInsights = Array.isArray(rawDocs) ? rawDocs : []
      let uploadedDocsCount = 0
      let localMissingCount = 0

      requiredDocsInsights.forEach((req: any) => {
        const requiredName = (req.value || String(req)).toLowerCase()
        const hasDoc = userDocTypes.some(vaultType => 
          vaultType.includes(requiredName) || requiredName.includes(vaultType)
        )

        if (hasDoc) {
          uploadedDocsCount++
        } else {
          localMissingCount++
        }
      })

      const totalRequiredDocs = requiredDocsInsights.length
      let readinessScore = 0

      if (totalRequiredDocs > 0) {
        readinessScore = Math.round((uploadedDocsCount / totalRequiredDocs) * 100)
      } else {
        const eligibilityReqs = opp.eligibility_analysis?.requirements || []
        let completedCount = 0
        eligibilityReqs.forEach((req: any) => {
          if (req.value && req.value.includes('[MATCHED]')) completedCount++
        })
        if (eligibilityReqs.length > 0) {
          readinessScore = Math.round((completedCount / eligibilityReqs.length) * 100)
        }
      }

      totalReadiness += readinessScore;

      if (readinessScore >= 90 && opp.status !== 'COMPLETED') {
        readyToSubmitCount++;
      }

      // Missing Docs
      missingDocsCount += localMissingCount;
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
