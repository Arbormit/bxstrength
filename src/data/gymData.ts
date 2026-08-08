import { FitnessClass, Trainer, ServiceItem, Testimonial, BlogPost, ScheduleSlot, MembershipPlan } from '../types';

export const CLASSES_DATA: FitnessClass[] = [
  {
    id: 'cycling-training',
    title: 'CYCLING TRAINING',
    category: 'cycling',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    description: 'Hath creeping subdue he fish green face whose spirit that seasons today multiply female midst upon.',
    durationMinutes: 45,
    intensity: 'Intermediate',
    trainerName: 'David Williams',
    caloriesBurned: '550-700 kcal',
    scheduleDays: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'tone-muscle',
    title: 'TONE MUSCLE',
    category: 'strength',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    description: 'Hath creeping subdue he fish green face whose spirit that seasons today multiply female midst upon.',
    durationMinutes: 60,
    intensity: 'Advanced',
    trainerName: 'Senior Fall',
    caloriesBurned: '600-800 kcal',
    scheduleDays: ['Tuesday', 'Thursday', 'Saturday']
  },
  {
    id: 'meditation-work',
    title: 'MEDITATION WORK',
    category: 'mindbody',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    description: 'Hath creeping subdue he fish green face whose spirit that seasons today multiply female midst upon.',
    durationMinutes: 50,
    intensity: 'Beginner',
    trainerName: 'Jacob Bare',
    caloriesBurned: '200-350 kcal',
    scheduleDays: ['Monday', 'Thursday', 'Sunday']
  },
  {
    id: 'boxing-power',
    title: 'BOXING POWER',
    category: 'boxing',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy bag drills, footwork, speed combinations and intense cardiovascular conditioning.',
    durationMinutes: 50,
    intensity: 'Advanced',
    trainerName: 'David Williams',
    caloriesBurned: '700-900 kcal',
    scheduleDays: ['Tuesday', 'Friday', 'Saturday']
  },
  {
    id: 'hiit-cardio',
    title: 'CROSSFIT BLAST',
    category: 'cardio',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    description: 'High intensity interval training designed to push your endurance and build functional stamina.',
    durationMinutes: 45,
    intensity: 'Intermediate',
    trainerName: 'Senior Fall',
    caloriesBurned: '500-650 kcal',
    scheduleDays: ['Wednesday', 'Saturday', 'Sunday']
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'personal-training',
    title: 'PERSONAL TRAINING',
    description: 'Two hath creature bearing signs won\'t void signs eve female every together. Thin its mountain rule every fourth cattle thermal grid line accrosse.',
    iconName: 'personal',
    benefits: ['One-on-one custom workout plan', 'Dedicated nutritional guidance', 'Bi-weekly body composition analysis', 'Flexible scheduling']
  },
  {
    id: 'boxing-training',
    title: 'BOXING TRAINING',
    description: 'Two hath creature bearing signs won\'t void signs eve female every together. Thin its mountain rule every fourth cattle thermal grid line accrosse.',
    iconName: 'boxing',
    benefits: ['Professional ring technique', 'Stamina & core conditioning', 'Stress relief & reflexes', 'Sparring option for advanced']
  },
  {
    id: 'fitness-training',
    title: 'FITNESS TRAINING',
    description: 'Two hath creature bearing signs won\'t void signs eve female every together. Thin its mountain rule every fourth cattle thermal grid line accrosse.',
    iconName: 'fitness',
    benefits: ['Full-body functional movement', 'Modern cardio & machine zone', 'Group motivation environment', 'Progress measurement benchmarks']
  }
];

export interface BxTrainer extends Trainer {
  languages: string[];
  availability: string;
  certification: string;
  coachPosition?: string;
}

export const TRAINERS_DATA: BxTrainer[] = [
  {
    id: 'david-williams',
    name: 'DAVID WILLIAMS',
    role: 'Head of Strength & Conditioning',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    bio: 'Former UK Athletics performance coach specializing in periodized barbell strength, biomechanics, and body recomposition.',
    specialties: ['Compound Lifting', 'Hypertrophy', 'Bio-mechanics'],
    experienceYears: 12,
    rating: 5.0,
    languages: ['English', 'German'],
    availability: 'Mon - Fri (Morning & Evening)',
    certification: 'CIMSPA Level 4 Strength Specialist',
    certifications: ['CIMSPA Level 4 Strength Specialist', 'CSCS Certified Strength & Conditioning', 'UK Athletics Performance Master'],
    achievements: ['Coached 500+ Executive Transformations', '2024 UK High-Performance Coach of the Year', '240kg Barbell Squat Elite Club'],
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    id: 'sophia-chen',
    name: 'DR. SOPHIA CHEN',
    role: 'Clinical Performance & Metabolic Lead',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'PhD in Exercise Physiology. Focuses on executive metabolic conditioning, circadian nutrition alignment, and sustainable fat loss.',
    specialties: ['Metabolic Health', 'Fat Loss', 'Executive Longevity'],
    experienceYears: 9,
    rating: 4.9,
    languages: ['English', 'Mandarin'],
    availability: 'Tue - Sat (Flexible Digital)',
    certification: 'UK Registered Exercise Physiologist',
    certifications: ['PhD Exercise Physiology (Imperial College)', 'UK Registered Exercise Physiologist', 'Precision Nutrition Master Level 2'],
    achievements: ['Published 12+ Metabolic Peer Studies', 'Trained 300+ Corporate Executives', 'Keynote Speaker at UK Fitness Summit'],
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    id: 'marcus-vance',
    name: 'MARCUS VANCE',
    role: 'Hypertrophy & Postural Reconstruction',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Master coach dedicated to sculpting lean muscle, correcting desk-job posture, and eliminating chronic back tightness.',
    specialties: ['Postural Correction', 'Hypertrophy', 'Mobility'],
    experienceYears: 10,
    rating: 5.0,
    languages: ['English', 'Spanish'],
    availability: 'Mon - Thu (Afternoon & Evening)',
    certification: 'REPs Level 4 Master Trainer',
    certifications: ['REPs Level 4 Master Trainer', 'FMS Functional Movement Specialist', 'Postural Restoration Certified'],
    achievements: ['Over 98% Postural Pain Elimination Rate', 'Featured in Men’s Health UK', '1,000+ Hours 1-on-1 Biomechanics Coaching'],
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    id: 'alex-mercer',
    name: 'ALEX MERCER',
    role: 'Athletic Conditioning & Agility',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    bio: 'Ex-British Army PT instructor bringing mental toughness, explosive conditioning, and tactical movement drills.',
    specialties: ['Athletic Endurance', 'EPOC Conditioning', 'Speed'],
    experienceYears: 8,
    rating: 4.9,
    languages: ['English', 'French'],
    availability: 'Wed - Sun (Morning & Afternoon)',
    certification: 'UK Strength & Conditioning Assoc (UKSCA)',
    socials: { linkedin: '#', instagram: '#' }
  }
];

export const SCHEDULE_DATA: ScheduleSlot[] = [
  { id: '1', day: 'Monday', time: '07:00 AM - 08:00 AM', className: 'Cycling Training', trainer: 'David Williams', room: 'Cycle Studio A', spotsLeft: 4 },
  { id: '2', day: 'Monday', time: '10:00 AM - 11:30 AM', className: 'Tone Muscle', trainer: 'Senior Fall', room: 'Strength Zone 2', spotsLeft: 2 },
  { id: '3', day: 'Monday', time: '05:00 PM - 06:00 PM', className: 'Meditation Work', trainer: 'Jacob Bare', room: 'Zen Lounge', spotsLeft: 8 },
  { id: '4', day: 'Tuesday', time: '08:00 AM - 09:15 AM', className: 'Boxing Power', trainer: 'David Williams', room: 'Ring Arena B', spotsLeft: 5 },
  { id: '5', day: 'Tuesday', time: '04:00 PM - 05:00 PM', className: 'Tone Muscle', trainer: 'Senior Fall', room: 'Strength Zone 1', spotsLeft: 3 },
  { id: '6', day: 'Wednesday', time: '07:00 AM - 08:00 AM', className: 'Cycling Training', trainer: 'David Williams', room: 'Cycle Studio A', spotsLeft: 6 },
  { id: '7', day: 'Wednesday', time: '06:00 PM - 07:00 PM', className: 'Crossfit Blast', trainer: 'Alex Mercer', room: 'Main Turf', spotsLeft: 1 },
  { id: '8', day: 'Thursday', time: '09:00 AM - 10:00 AM', className: 'Meditation Work', trainer: 'Jacob Bare', room: 'Zen Lounge', spotsLeft: 10 },
  { id: '9', day: 'Thursday', time: '05:30 PM - 06:45 PM', className: 'Tone Muscle', trainer: 'Senior Fall', room: 'Strength Zone 2', spotsLeft: 4 },
  { id: '10', day: 'Friday', time: '07:00 AM - 08:00 AM', className: 'Cycling Training', trainer: 'David Williams', room: 'Cycle Studio A', spotsLeft: 3 },
  { id: '11', day: 'Friday', time: '05:00 PM - 06:00 PM', className: 'Boxing Power', trainer: 'David Williams', room: 'Ring Arena B', spotsLeft: 2 },
  { id: '12', day: 'Saturday', time: '09:00 AM - 10:30 AM', className: 'Crossfit Blast', trainer: 'Alex Mercer', room: 'Main Turf', spotsLeft: 7 },
  { id: '13', day: 'Saturday', time: '11:00 AM - 12:00 PM', className: 'Tone Muscle', trainer: 'Senior Fall', room: 'Strength Zone 1', spotsLeft: 5 },
  { id: '14', day: 'Sunday', time: '10:00 AM - 11:30 AM', className: 'Meditation Work', trainer: 'Jacob Bare', room: 'Zen Lounge', spotsLeft: 12 }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't1',
    name: 'SARAH CONNOR',
    role: 'Fitness Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    comment: 'Fitzone completely reshaped my discipline. The coaches care deeply about your form and progress. The atmosphere is energetic and welcoming!',
    rating: 5
  },
  {
    id: 't2',
    name: 'MICHAEL BENNETT',
    role: 'Marathon Runner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    comment: 'The Cycling Training and Tone Muscle programs increased my leg power significantly. I cut 14 minutes off my personal best marathon time.',
    rating: 5
  },
  {
    id: 't3',
    name: 'EMILY ZHANG',
    role: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    comment: 'The Meditation Work and Personal Training sessions help me unwind from stressful workdays. High quality facilities and super clean environment!',
    rating: 5
  }
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential Hydration Tips For High-Intensity Cardio',
    excerpt: 'Proper hydration starts 24 hours before your workout. Discover how electrolytes boost muscular power and endurance.',
    content: 'Full guide on electrolyte balance, intra-workout mineral intake, and recovery post-cycling session...',
    category: 'Nutrition',
    author: 'David Williams',
    date: 'JULY 18, 2026',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'How Hypertrophy Training Accelerates Metabolism',
    excerpt: 'Building lean muscular tissue increases your resting metabolic rate even while sleeping. Here is the science behind it.',
    content: 'Detailed breakdown of progressive overload, rep ranges, time under tension, and protein synthesis recovery windows...',
    category: 'Workouts',
    author: 'Senior Fall',
    date: 'JULY 12, 2026',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Mindful Breathing: Decreasing Cortisol After Heavy Weight Sessions',
    excerpt: 'Integrating 10 minutes of parasympathetic breathwork lowers systemic inflammation and speeds up recovery times.',
    content: 'Guided box breathing techniques, post-workout heart rate variability recovery, and sleep quality improvements...',
    category: 'Mind & Body',
    author: 'Jacob Bare',
    date: 'JUNE 28, 2026',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    readTime: '4 min read'
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'BASIC PASS',
    price: 39,
    period: 'month',
    features: [
      'Access to Gym Floor & Cardio Zone',
      'Locker & Shower Facility',
      'Free Initial Fitness Assessment',
      'Standard Workout App Access',
      '1 Guest Pass per month'
    ]
  },
  {
    id: 'standard',
    name: 'FITNESS PRO',
    price: 79,
    period: 'month',
    popular: true,
    features: [
      'Unlimited Gym & Studio Access',
      'All Group Classes Included',
      '2 Personal Training Sessions / Mo',
      'Sauna & Recovery Lounge Access',
      'Customized Nutrition Plan',
      '4 Guest Passes per month'
    ]
  },
  {
    id: 'vip',
    name: 'VIP UNLIMITED',
    price: 129,
    period: 'month',
    features: [
      '24/7 VIP Gym Access',
      'Unlimited Personal Training',
      'Priority Class Reservation',
      'Free Towel & Protein Shake Bar',
      'Quarterly Body Composition Scan',
      'Unlimited Guest Passes'
    ]
  }
];
