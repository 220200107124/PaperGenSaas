export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string; 
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
  hasActiveSubscription?: boolean;
  subjectId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const SourceType = {
  GLOBAL: 'GLOBAL',
  SCHOOL: 'SCHOOL',
} as const;

export type SourceType = (typeof SourceType)[keyof typeof SourceType];

export const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const QuestionType = {
  MCQ: 'MCQ',
  TRUE_FALSE: 'TRUE_FALSE',
  FILL_BLANK: 'FILL_BLANK',
  SHORT: 'SHORT',
  LONG: 'LONG',
  MATCH: 'MATCH',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id: string;
  questionType: QuestionType;
  standardId: string;
  subjectId: string;
  chapterId: string;
  questionText: string;
  options?: any;
  answer?: any;
  difficulty: Difficulty;
  marks: number;
  sourceType: SourceType;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
  standard?: Standard;
  subject?: Subject;
  chapter?: Chapter;
}

export interface School {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  status: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Standard {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  standardId: string;
  status: boolean;
  createdAt: string;
  standard?: Standard;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  status: boolean;
  createdAt: string;
  subject?: Subject;
}

export interface Paper {
  id: string;
  title: string;
  standardId: string;
  subjectId: string;
  sections: PaperSection[];
  totalMarks: number;
  createdAt: string;
  teacherId: string;
}

export interface PaperSection {
  id: string;
  title: string;
  questions: {
    questionId: string;
    marks: number;
    order: number;
  }[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  schoolId?: string;
  userId?: string;
  type: 'school' | 'teacher';
  planName: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: boolean;
  modulePermissions?: any;
  createdAt: string;
  school?: School;
  user?: User;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SchoolRequest {
  id: string;
  schoolName: string;
  email: string;
  contactPerson?: string;
  phone: string;
  city: string;
  status: RequestStatus;
  createdAt: string;
}

