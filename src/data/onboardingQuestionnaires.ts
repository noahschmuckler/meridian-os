// Onboarding questionnaires keyed to mentorship-pathway phases.
//
// Source: Optum onboarding deck (phone photos in ~/incoming_noah/IMG_0560–0564).
// The Week-8 / Month-Two satisfaction set is delivered at w8 and repeated at
// m3 and m6. The Month-12 variant is a distinct retention/growth set that only
// appears at q4.

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  scale?: { high: string; low: string };
  openEnded?: boolean;
}

export interface Questionnaire {
  id: string;
  title: string;
  subtitle?: string;
  questions: QuestionnaireQuestion[];
}

const Q0_HIRING: Questionnaire = {
  id: 'q0',
  title: 'Initial Hiring Process',
  subtitle: 'Post-hire evaluation · upon starting',
  questions: [
    { id: 'q0-1', text: 'What aspects of the hiring process stood out as particularly positive for you?', openEnded: true },
    { id: 'q0-2', text: 'Were there any points in the hiring process that felt unclear or overwhelming?', openEnded: true },
    { id: 'q0-3', text: 'How did the onboarding communication (e.g., emails, calls, materials) prepare you for your first day?', openEnded: true },
    { id: 'q0-4', text: 'Was the timeline between your offer acceptance and start date appropriate, or could it be improved?', openEnded: true },
    { id: 'q0-5', text: 'What suggestions do you have for improving the hiring experience for future candidates?', openEnded: true },
  ],
};

const Q1_ORIENTATION: Questionnaire = {
  id: 'q1',
  title: 'Week 1 — Orientation',
  questions: [
    { id: 'q1-1', text: 'Do you have email access on your phone?', openEnded: true },
    { id: 'q1-2', text: 'Can you access Epic on your laptop in the office? Can you access your email & Epic when working from home?', openEnded: true },
    { id: 'q1-3', text: 'What were two positive or most helpful moments of this week? Was there anything particularly stunning you wish to discuss?', openEnded: true },
    { id: 'q1-4', text: 'Is there anything specific you would like to learn or gain more clarity on this week?', openEnded: true },
  ],
};

const Q2_FIRST_CLINICAL: Questionnaire = {
  id: 'q2',
  title: 'Week 2 — First Clinical Week',
  questions: [
    { id: 'q2-1', text: 'Are you able to ePrescribe? Any issues sending controlled substances? Did you have loopback access?', openEnded: true },
    { id: 'q2-2', text: 'Has the Epic workflow allowed you enough time to learn and adapt at a manageable pace? Why or why not?', openEnded: true },
    { id: 'q2-3', text: 'Are there any resources or tools that would help you perform better in your role?', openEnded: true },
    { id: 'q2-4', text: 'How do you feel about the interactions with colleagues, staff, and leadership so far? Which team member has been incredibly helpful? How attentive has medical leadership been during this process?', openEnded: true },
    { id: 'q2-5', text: 'Is there anything specific you would like to learn to gain more clarity on this week?', openEnded: true },
  ],
};

const Q3_WEEK3: Questionnaire = {
  id: 'q3',
  title: 'Week 3',
  questions: [
    { id: 'q3-1', text: 'Has the workflow been organized in a way that supports you in identifying areas where additional learning or support is needed?', openEnded: true },
    { id: 'q3-2', text: 'Are there any resources or tools that would help you perform better in your role?', openEnded: true },
    { id: 'q3-3', text: 'How are your interactions with colleagues, staff, and leadership so far? Which team member has been incredibly helpful? How attentive has medical leadership been during this process?', openEnded: true },
    { id: 'q3-4', text: 'How are you finding the functionality of Epic? How would you rate the ease of use? Are there any specific areas where Epic has been efficient with high-level coding accurately — for example, documentation time, managing the in-basket, or utilizing the AVS smart set?', openEnded: true },
    { id: 'q3-5', text: 'Is there anything specific you would like to learn to gain more clarity on this week?', openEnded: true },
  ],
};

const Q4_MONTH1: Questionnaire = {
  id: 'q4',
  title: 'Week 4 — Month 1',
  questions: [
    { id: 'q4-1', text: 'How satisfied are you with your onboarding experience so far?', scale: { high: 'great experience', low: 'poor experience' } },
    { id: 'q4-2', text: 'On a scale of 0–10, how clearly were your job responsibilities explained during the onboarding process?', scale: { high: 'extremely clear', low: 'not clear at all' } },
    { id: 'q4-3', text: 'To what extent do you feel prepared to perform your job after completing the initial onboarding?', scale: { high: 'very prepared', low: 'not at all prepared' } },
    { id: 'q4-4', text: 'How effective was the training you received in helping you understand your role?', scale: { high: 'extremely effective', low: 'not effective at all' } },
    { id: 'q4-5', text: 'How clear and consistent has communication been from your manager and team?', scale: { high: 'very clear', low: 'very unclear' } },
    { id: 'q4-6', text: 'What part of the onboarding process was most helpful and what could be improved?', openEnded: true },
  ],
};

const Q6_MONTH2: Questionnaire = {
  id: 'q6',
  title: 'Week 6 — Month 2',
  questions: [
    { id: 'q6-1', text: 'On a scale of 0–10, how confident do you feel in performing your job responsibilities?', scale: { high: 'very confident', low: 'not confident at all' } },
    { id: 'q6-2', text: 'How well do you feel integrated into your team?', scale: { high: 'fully integrated', low: 'not at all integrated' } },
    { id: 'q6-3', text: 'On a scale of 0–10, how confident do you feel navigating EPIC?', scale: { high: 'very confident', low: 'not confident at all' } },
    { id: 'q6-4', text: 'How effective was the side-by-side Epic training in preparing you for patient care?', scale: { high: 'very effective', low: 'not effective at all' } },
    { id: 'q6-5', text: 'How confident are you about your ability to navigate work-level coding accurately?', scale: { high: 'very confident', low: 'not confident at all' } },
    { id: 'q6-6', text: 'What additional support or resources would help you succeed in your role going forward?', openEnded: true },
  ],
};

const Q_SAT: Questionnaire = {
  id: 'q-sat',
  title: 'Week 8 / Month Two — Satisfaction & Alignment',
  subtitle: 'Repeated at Month 3 and Month 6',
  questions: [
    { id: 'q-sat-1', text: 'How satisfied are you with your role and responsibilities so far?', scale: { high: 'extremely satisfied', low: 'not satisfied at all' } },
    { id: 'q-sat-2', text: 'How accessible is your medical director when you need guidance?', scale: { high: 'very accessible', low: 'not accessible at all' } },
    { id: 'q-sat-3', text: 'How would you rate the communication with your clinical team?', scale: { high: 'great communication', low: 'poor communication' } },
    { id: 'q-sat-4', text: 'How well do you understand and align with the company’s culture and values?', scale: { high: 'very clear', low: 'not at all clear' } },
    { id: 'q-sat-5', text: 'Do you have a clear understanding of growth and development opportunities?', scale: { high: 'very clear', low: 'not clear at all' } },
    { id: 'q-sat-6', text: 'Looking back on your first 90 days, what has gone well and what could have been better?', openEnded: true },
  ],
};

const Q_GROWTH: Questionnaire = {
  id: 'q-growth',
  title: 'Month 12 — Motivation & Retention',
  questions: [
    { id: 'q-growth-1', text: 'How motivated do you feel in your current role?', scale: { high: 'extremely motivated', low: 'not at all motivated' } },
    { id: 'q-growth-2', text: 'How would you rate your current work-life balance?', scale: { high: 'excellent', low: 'very poor' } },
    { id: 'q-growth-3', text: 'How often do you feel recognized for your contributions?', scale: { high: 'always', low: 'never' } },
    { id: 'q-growth-4', text: 'How satisfied are you with your career growth and development over the past year?', scale: { high: 'very satisfied', low: 'very dissatisfied' } },
    { id: 'q-growth-5', text: 'How supported do you feel by your manager in achieving your goals?', scale: { high: 'fully supported', low: 'not supported at all' } },
    { id: 'q-growth-6', text: 'What would make your experience here even better in the next 12 months?', openEnded: true },
  ],
};

export const QUESTIONNAIRES_BY_PHASE: Record<string, Questionnaire[]> = {
  w1: [Q0_HIRING, Q1_ORIENTATION],
  w2: [Q2_FIRST_CLINICAL],
  w3: [Q3_WEEK3],
  w4: [Q4_MONTH1],
  w6: [Q6_MONTH2],
  w8: [Q_SAT],
  m3: [Q_SAT],
  m6: [Q_SAT],
  q4: [Q_GROWTH],
};

// Phase order used by the "all phases" sentinel view, so questionnaires appear
// in the same order as the phase tabs.
export const PHASE_ORDER: string[] = ['w1', 'w2', 'w3', 'w4', 'w6', 'w8', 'm3', 'm6', 'q4'];

export function questionnairesForPhase(phaseId: string | null): Questionnaire[] {
  if (!phaseId) return [];
  return QUESTIONNAIRES_BY_PHASE[phaseId] ?? [];
}

export function allQuestionnairesInOrder(): Array<{ phaseId: string; questionnaires: Questionnaire[] }> {
  return PHASE_ORDER.map((phaseId) => ({
    phaseId,
    questionnaires: QUESTIONNAIRES_BY_PHASE[phaseId] ?? [],
  }));
}
