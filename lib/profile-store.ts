export interface StudentProfile {
  name: string
  gradeLevel: string
  state: string
  incomeRange: string
  category: string
  careerInterest: string
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex Student',
  gradeLevel: 'Class 12',
  state: 'West Bengal',
  incomeRange: 'Below ₹2.5L',
  category: 'General',
  careerInterest: 'Computer Science / Engineering'
}

export function getStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const stored = localStorage.getItem('clearpath_student_profile')
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to parse student profile', e)
  }
  return DEFAULT_PROFILE
}

export function saveStudentProfile(profile: StudentProfile) {
  if (typeof window === 'undefined') return
  localStorage.setItem('clearpath_student_profile', JSON.stringify(profile))
}
