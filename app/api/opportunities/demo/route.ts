import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/security/rate-limit'
import { logger } from '@/lib/logger'
import { safeDate } from '@/lib/date-utils'

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => ({}))
    const type = rawBody.type || 'scholarship'
    const profile = rawBody.profile || {}
    
    const supabase = await createClient()

    // 1. Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      logger.warn('Unauthorized demo access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate Limiting
    const rateLimitResult = await rateLimit(`demo_api_${user.id}`, 10, 60000)
    if (!rateLimitResult.success) {
      logger.warn({ userId: user.id }, 'Demo rate limit exceeded')
      return NextResponse.json({ error: 'Too Many Requests.' }, { status: 429 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let oppData: any = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stepsData: any[] = []

    if (type === 'scholarship') {
      oppData = {
        title: 'National Merit STEM Scholarship & Apprenticeship Program 2026',
        category: 'SCHOLARSHIP',
        storage_path: 'demo-documents/national-merit-stem.pdf',
        simplified_summary: 'This is a highly competitive scholarship that provides $10,000 per year and a guaranteed summer internship at a top tech company. You need to maintain a 3.8 GPA and submit three letters of recommendation.',
        deadline: safeDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
        eligibility_analysis: {
          requirements: [
            `[MATCHED] Current high school junior or senior (Student: ${profile.gradeLevel || 'Unknown'})`,
            `[MISMATCH] Minimum unweighted GPA of 3.8 (Student: Not specified)`,
            `[MATCHED] US Citizen or Permanent Resident (Student: Assumed)`
          ],
          is_student_eligible_by_default: null
        },
        required_documents: ["Official High School Transcript", "3 Letters of Recommendation", "Personal Statement"],
        opportunity_value: "$40,000 over 4 years + Internship Stipend",
        opportunity_loss_prediction: "Missing this means losing out on $40,000 in college funding.",
        readiness_score: 35,
        confidence_score: 95,
        evidence_references: [
           { claim: "Provides $10,000 per year", quote_from_document: "The scholarship guarantees a $10,000 annual disbursement." }
        ]
      }
      stepsData = [
        { step_number: 1, title: "Request Recommendations", description: "Email your AP Math and AP Science teachers." },
        { step_number: 2, title: "Draft Personal Statement", description: "Write the first draft of your 1000-word essay." },
        { step_number: 3, title: "Submit Final Application", description: "Upload all documents." }
      ]
    } else if (type === 'scheme') {
      oppData = {
        title: 'State Digital Empowerment Grant 2026',
        category: 'SCHEME',
        storage_path: 'demo-documents/state-digital-grant.pdf',
        simplified_summary: 'A government scheme providing free laptops to students from lower-income families who are entering college.',
        deadline: safeDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)),
        eligibility_analysis: {
          requirements: [
            `[MATCHED] State resident for at least 5 years (Student: ${profile.state || 'Unknown'})`,
            `[MATCHED] Family income below ₹2.5L (Student: ${profile.incomeRange || 'Unknown'})`,
            `[MISMATCH] Enrolled in a recognized public university (Student: Need proof of enrollment)`
          ],
          is_student_eligible_by_default: null
        },
        required_documents: ["Income Certificate", "Aadhaar Card", "College Admission Letter"],
        opportunity_value: "Free Laptop worth ₹45,000",
        opportunity_loss_prediction: "You will have to purchase a laptop out of pocket for your college studies.",
        readiness_score: 60,
        confidence_score: 90,
        evidence_references: [
           { claim: "Income must be below ₹2.5L", quote_from_document: "Gross annual family income must not exceed ₹2,50,000." }
        ]
      }
      stepsData = [
        { step_number: 1, title: "Verify Income Certificate", description: "Ensure your income certificate is valid for the current financial year." },
        { step_number: 2, title: "Get College Admission Letter", description: "Download the official admission offer letter." },
        { step_number: 3, title: "Apply on State Portal", description: "Submit the online form with Aadhaar linked." }
      ]
    } else if (type === 'circular') {
      oppData = {
        title: 'Emergency Circular: Board Exam Center Reallocation',
        category: 'CIRCULAR',
        storage_path: 'demo-documents/board-exam-circular.pdf',
        simplified_summary: 'Due to unforeseen circumstances, the board exam center for District A has been changed. You must download a new admit card before the 15th.',
        deadline: safeDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)),
        eligibility_analysis: {
          requirements: [
            `[MATCHED] Student appearing for Board Exams (Student: ${profile.gradeLevel || 'Unknown'})`,
            `[MATCHED] Originally assigned to District A Centers (Student: ${profile.state || 'Unknown'})`
          ],
          is_student_eligible_by_default: null
        },
        required_documents: ["Old Admit Card", "School ID Card"],
        opportunity_value: "Exam Access Guarantee",
        opportunity_loss_prediction: "If you go to the old center, you will not be allowed to sit for the board examination.",
        readiness_score: 10,
        confidence_score: 99,
        evidence_references: [
           { claim: "Center changed", quote_from_document: "All candidates previously assigned to Center Code 405 must report to Center Code 802." }
        ]
      }
      stepsData = [
        { step_number: 1, title: "Check Center Code", description: "Look at your current admit card to see if your center code is 405." },
        { step_number: 2, title: "Download New Admit Card", description: "Visit the board portal and print the revised admit card." },
        { step_number: 3, title: "Verify New Route", description: "Plan your travel to the new center location 1 day before the exam." }
      ]
    }

    const { data: oppRecord, error: oppError } = await supabase
      .from('opportunities')
      .insert({
        user_id: user.id,
        status: 'PROCESSED',
        ...oppData
      })
      .select()
      .single()

    if (oppError || !oppRecord) {
      throw new Error('Failed to create demo opportunity')
    }

    const stepsToInsert = stepsData.map(step => ({
      ...step,
      opportunity_id: oppRecord.id,
      status: 'PENDING'
    }))

    await supabase.from('action_steps').insert(stepsToInsert)

    return NextResponse.json({ id: oppRecord.id })

  } catch (error: unknown) {
    logger.error({ error }, 'Fatal Demo Route Error')
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
