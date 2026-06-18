import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/security/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      logger.warn('Unauthorized demo access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate Limiting (Prevent DB spamming: 3 demo creations per minute)
    const rateLimitResult = await rateLimit(`demo_api_${user.id}`, 3, 60000)
    if (!rateLimitResult.success) {
      logger.warn({ userId: user.id }, 'Demo rate limit exceeded')
      return NextResponse.json({ error: 'Too Many Requests. Please wait a minute before trying again.' }, { status: 429 })
    }

    logger.info({ userId: user.id }, 'Generating demo opportunity')

    // Generate a realistic, highly complex demo opportunity
    const { data: oppRecord, error: oppError } = await supabase
      .from('opportunities')
      .insert({
        user_id: user.id,
        title: 'National Merit STEM Scholarship & Apprenticeship Program 2026',
        category: 'SCHOLARSHIP',
        storage_path: 'demo-documents/national-merit-stem.pdf',
        simplified_summary: 'This is a highly competitive scholarship that provides $10,000 per year and a guaranteed summer internship at a top tech company. You need to maintain a 3.8 GPA and submit three letters of recommendation.',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        eligibility_analysis: {
          requirements: [
            "Current high school junior or senior",
            "Minimum unweighted GPA of 3.8",
            "Demonstrated leadership in STEM (e.g., Robotics Club, Science Olympiad)",
            "US Citizen or Permanent Resident"
          ],
          is_student_eligible_by_default: null
        },
        required_documents: [
          "Official High School Transcript",
          "3 Letters of Recommendation (2 from STEM teachers)",
          "Personal Statement (1000 words)",
          "Proof of US Citizenship"
        ],
        opportunity_value: "$40,000 over 4 years + Internship Stipend",
        opportunity_loss_prediction: "Missing this opportunity means losing out on $40,000 in college funding and a direct pipeline to top-tier tech internships, which could significantly impact your early career trajectory.",
        readiness_score: 35,
        risk_score: 85,
        confidence_score: 95,
        risk_analysis: {
          risks: [
            "Requires 3 separate recommendation letters, which take time to coordinate.",
            "Personal statement has a strict 1000-word limit and requires multiple drafts.",
            "Highly competitive: historic acceptance rate is < 5%."
          ],
          complexity: "HIGH"
        },
        evidence_references: [
           { claim: "Provides $10,000 per year", quote_from_document: "The scholarship guarantees a $10,000 annual disbursement for up to 4 years." },
           { claim: "3.8 GPA Required", quote_from_document: "Applicants must hold a minimum unweighted GPA of 3.8 at the time of application." }
        ],
        status: 'PROCESSED'
      })
      .select()
      .single()

    if (oppError || !oppRecord) {
      logger.error({ error: oppError }, 'Failed to create demo opportunity')
      throw new Error('Failed to create demo opportunity')
    }

    // Insert realistic action steps
    const steps = [
      { step_number: 1, title: "Request Recommendations", description: "Email your AP Math, AP Science, and one other teacher asking for a recommendation letter. Provide them with your resume." },
      { step_number: 2, title: "Draft Personal Statement", description: "Write the first draft of your 1000-word essay focusing on a time you solved a complex problem." },
      { step_number: 3, title: "Request Official Transcript", description: "Submit the transcript request form to your high school guidance counselor." },
      { step_number: 4, title: "Review and Revise Essay", description: "Have your English teacher or counselor review your personal statement for feedback." },
      { step_number: 5, title: "Final Submission", description: "Upload all documents and submit the final application via the portal." }
    ]

    const stepsToInsert = steps.map(step => ({
      ...step,
      opportunity_id: oppRecord.id,
      status: 'PENDING'
    }))

    await supabase.from('action_steps').insert(stepsToInsert)

    logger.info({ userId: user.id, demoId: oppRecord.id }, 'Successfully created demo opportunity')
    return NextResponse.json({ id: oppRecord.id })

  } catch (error: unknown) {
    const err = error as Error
    logger.error({ error: err.message }, 'Fatal Demo Route Error')
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
