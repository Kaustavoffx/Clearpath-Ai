export class RuleEngine {
  static extract(text: string) {
    const lowerText = text.toLowerCase();
    
    // Determine category based on keywords
    let category = "OTHER";
    if (lowerText.includes("scholarship") || lowerText.includes("grant") || lowerText.includes("funding")) {
      category = "SCHOLARSHIP";
    } else if (lowerText.includes("internship")) {
      category = "INTERNSHIP";
    } else if (lowerText.includes("scheme")) {
      category = "SCHEME";
    } else if (lowerText.includes("competition")) {
      category = "COMPETITION";
    } else if (lowerText.includes("circular") || lowerText.includes("notice")) {
      category = "CIRCULAR";
    }

    // Attempt to find deadlines (rough regex for dates)
    const dateRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*|\s+)\d{4}\b/gi;
    const dates = text.match(dateRegex) || [];
    const deadline = dates.length > 0 ? dates[dates.length - 1] : null;

    // Find Amounts
    const amountRegex = /(?:rs\.?|₹|\$)\s*\d+(?:,\d{3})*(?:\.\d{2})?/gi;
    const amounts = text.match(amountRegex) || [];
    const opportunity_value = amounts.length > 0 ? amounts[0] : "Amount not specified";

    // Required Documents (Looking for keywords near "certificate", "card", "proof")
    const docKeywords = ["certificate", "card", "proof", "mark sheet", "marksheet", "passport", "photo", "signature"];
    const required_documents = [];
    
    const sentences = text.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      for (const keyword of docKeywords) {
        if (sentence.toLowerCase().includes(keyword)) {
          // Extract a clean snippet (up to 150 chars around the keyword)
          required_documents.push({
            value: `Document containing '${keyword}'`,
            source_quote: sentence.substring(0, 150).trim() + (sentence.length > 150 ? "..." : ""),
            page_number: "Unknown",
            confidence_score: 50
          });
          break; // move to next sentence
        }
      }
    }

    // Eligibility constraints & Other Info
    const eligibility_requirements = [];
    if (lowerText.includes("eligibility") || lowerText.includes("criteria")) {
      eligibility_requirements.push({
        value: "General Eligibility Criteria mentioned.",
        source_quote: "Please review the official document for exact eligibility criteria.",
        page_number: "Unknown",
        confidence_score: 30
      });
    }

    // Extract Emails
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const emails = text.match(emailRegex) || [];
    if (emails.length > 0) {
      eligibility_requirements.push({
        value: "Contact Email",
        source_quote: emails[0],
        page_number: "Unknown",
        confidence_score: 80
      });
    }

    // Extract Phone Numbers
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex) || [];
    if (phones.length > 0) {
      eligibility_requirements.push({
        value: "Contact Phone",
        source_quote: phones[0],
        page_number: "Unknown",
        confidence_score: 80
      });
    }

    // Extract Websites
    const websiteRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.gov\.in)/gi;
    const websites = text.match(websiteRegex) || [];
    if (websites.length > 0) {
      eligibility_requirements.push({
        value: "Official Website",
        source_quote: websites[0],
        page_number: "Unknown",
        confidence_score: 80
      });
    }

    return {
      title: "Extracted Opportunity (Recovery Mode)",
      category,
      plain_language_summary: "The AI was unable to parse this document perfectly. We have extracted key details using fallback rules.",
      important_dates: { deadline },
      eligibility_analysis: { requirements: eligibility_requirements },
      required_documents: required_documents.slice(0, 5), // take top 5
      opportunity_value,
      opportunity_loss_analysis: "Missing this deadline means you will not be considered for this opportunity.",
      risk_score: 90, // High risk since it's a fallback
      confidence_score: 20, // Low confidence
      evidence_references: [
        {
          claim: "Fallback Extraction Activated",
          quote_from_document: "This is a deterministic extraction because the AI could not confidently parse the original text.",
          confidence_score: 100,
          risk_assessment: "Information may be incomplete."
        }
      ],
      action_checklist: [
        {
          step_number: 1,
          title: "Manual Verification Required",
          description: "Please read the source document manually to verify deadlines and requirements.",
          source_quote: "N/A",
          page_number: "Unknown",
          confidence_score: 100
        }
      ]
    };
  }
}
