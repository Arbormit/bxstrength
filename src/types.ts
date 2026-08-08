export type ViewPage = 'home' | 'about' | 'schedule' | 'trainers' | 'blog' | 'contact' | 'dashboard' | 'admin' | 'terms' | 'privacy';

export type UserRole = 'admin' | 'coach' | 'client' | 'user';

export type CoachPosition = 'Head Coach' | 'Super Senior Coach' | 'Senior Coach' | 'Junior Coach' | 'Lead Specialist';

export interface CoachPermissions {
  allowFinancials: boolean;        // Client Payments & Subscriptions tab
  allowLeadPipeline: boolean;      // CRM Overview tab
  allowClientRoster: boolean;      // Client Directory tab
  allowClassSchedules: boolean;    // Class Schedule tab
  allowWorkoutPrograms: boolean;   // Workout Program Builder tab
  allowNutritionPlans: boolean;    // Diet Plans tab
  allowSupportTickets: boolean;    // Support Ticket Desk tab
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  coachPosition?: CoachPosition | string;
  avatarUrl?: string;
  phone?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  emergencyContact?: string;
  fitnessGoals?: string;
  isVerified: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLoginAt?: string;
}

export interface BodyStat {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  bicepsCm?: number;
  thighsCm?: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetMuscle: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  assignedToUserId?: string;
  assignedToUserName?: string;
  createdBy: string;
  createdAt: string;
  exercises: ExerciseItem[];
}

export interface MealItem {
  id: string;
  mealName: string;
  timeSlot: string;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface NutritionPlan {
  id: string;
  title: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  dailyCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  meals: MealItem[];
  createdBy: string;
  updatedAt: string;
}

export interface ClassSchedule {
  id: string;
  title: string;
  category: 'cycling' | 'strength' | 'mindbody' | 'boxing' | 'cardio';
  trainerId: string;
  trainerName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room: string;
  maxCapacity: number;
  bookedCount: number;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  classId: string;
  className: string;
  trainerName: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Cancelled' | 'Attended';
  bookingCode: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  className: string;
  date: string;
  status: 'Attended' | 'Absent' | 'Excused';
  markedBy: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'annual';
  price: number;
  startDate: string;
  nextBillingDate: string;
  status: 'active' | 'past_due' | 'cancelled';
  autoRenew: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'resolved';
  assignedNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  targetRole: 'all' | 'client' | 'coach' | 'staff';
  priority: 'low' | 'medium' | 'high';
  authorName: string;
}

export interface FitnessClass {
  id: string;
  title: string;
  category: 'cycling' | 'strength' | 'mindbody' | 'boxing' | 'cardio';
  image: string;
  description: string;
  durationMinutes: number;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  trainerName: string;
  caloriesBurned: string;
  scheduleDays: string[];
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  experienceYears: number;
  rating: number;
  certifications?: string[];
  achievements?: string[];
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'personal' | 'boxing' | 'fitness' | 'nutrition' | 'crossfit';
  benefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

export interface ScheduleSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  className: string;
  trainer: string;
  room: string;
  spotsLeft: number;
}

export interface BookingDetails {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  className: string;
  trainerName: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending';
  code: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  popular?: boolean;
  features: string[];
}

export type LeadPipelineStage = 
  | 'Lead'
  | 'Assessment'
  | 'Consultation'
  | 'Recommendation'
  | 'Payment'
  | 'Coach Assigned'
  | 'Active Client'
  | 'Review'
  | 'Renewal'
  | 'Referral';

export interface SelfAssessmentData {
  goal: string;
  obstacle: string;
  experience: string;
  commitment: string;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
}

export interface ConsultationBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  goal: string;
  coachPreference: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Missed';
  notes?: string;
  remindersSent?: {
    h24?: boolean;
    h2?: boolean;
    m30?: boolean;
  };
  createdAt: string;
}

export interface CoachVerification {
  id: string;
  coachName: string;
  email: string;
  step: 'Application' | 'Document Review' | 'Interview' | 'Approval' | 'Published';
  status: 'Pending' | 'Verified' | 'Rejected';
  documents: string[];
  submittedAt: string;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'Training' | 'Nutrition' | 'Billing' | 'Schedule' | 'General';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  status: TicketStatus;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}


