import { FitnessClass, Trainer, ServiceItem, Testimonial, BlogPost, ScheduleSlot, MembershipPlan } from '../types';

export const CLASSES_DATA: FitnessClass[] = [
  {
    id: 'boxing-power',
    title: 'BOXING POWER & TECHNIQUE',
    category: 'boxing',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy bag drills, footwork, speed combinations and intense cardiovascular conditioning.',
    durationMinutes: 50,
    intensity: 'Advanced',
    trainerName: 'Shaban Faridi',
    caloriesBurned: '700-900 kcal',
    scheduleDays: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'tone-muscle',
    title: 'STRENGTH & HYPERTROPHY',
    category: 'strength',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    description: 'Progressive overload, periodized compound lifting, and functional muscle building.',
    durationMinutes: 60,
    intensity: 'Advanced',
    trainerName: 'Sadeem',
    caloriesBurned: '600-800 kcal',
    scheduleDays: ['Tuesday', 'Thursday', 'Saturday']
  },
  {
    id: 'tactical-cardio',
    title: 'TACTICAL METABOLIC BLAST',
    category: 'cardio',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    description: 'High-intensity interval training designed to push your endurance and build functional stamina.',
    durationMinutes: 45,
    intensity: 'Intermediate',
    trainerName: 'Moheeb Khan',
    caloriesBurned: '550-750 kcal',
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
  headline?: string;
  secondaryBio?: string;
  clientsServed?: number;
}

export const TRAINERS_DATA: BxTrainer[] = [
  {
    id: 'shaban-faridi',
    name: 'Shaban Faridi',
    role: 'Head Coach | Boxing Instructor | Physiotherapy Professional',
    coachPosition: 'HEADCOACH',
    headline: 'HEADCOACH | BOXING INSTRUCTOR | PHYSIOTHERAPY PROFESSIONAL',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    bio: 'Head Coach with over 10 years of industry experience combining boxing instruction, strength & conditioning, and physiotherapy-based rehabilitation. Trained at IG Stadium to master boxing technique and athlete development. Brings 6+ years of entrepreneurial experience as a gym owner/operator, delivering personalized transformations to over 1,000 clients worldwide.',
    secondaryBio: 'He has trained and transformed more than 1000+ clients in India, Canada, UK, Australia, Saudi Arabia, UAE',
    specialties: ['Boxing Technique', 'Physiotherapy & Rehab', 'Strength & Conditioning', 'Combat Movement'],
    experienceYears: 10,
    clientsServed: 1000,
    rating: 4.9,
    languages: ['English', 'Hindi'],
    availability: 'Mon - Sat (Morning & Evening)',
    certification: 'Diploma in Physiotherapy | Boxing Techniques & Coaching Methods | Boxing Instructor | Rehab & Corrective Exercise | Fitness & Conditioning | Gym Owner & Head Coach | Business Developer & Fitness Trainer',
    certifications: [
      'Diploma in Physiotherapy',
      'Boxing Techniques & Coaching Methods',
      'Boxing Instructor',
      'Rehab & Corrective Exercise',
      'Fitness & Conditioning',
      'Gym Owner & Head Coach',
      'Business Developer & Fitness Trainer'
    ],
    achievements: [
      'Head Coach for 50+ Professional Fight Camps',
      'Over 98% Post-Injury Rehabilitation Recovery Rate',
      '2025 UK Elite Combat Performance Coach Award'
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
    ],
    galleryVideos: [
      'https://assets.mixkit.co/videos/preview/mixkit-boxer-getting-ready-for-a-fight-42994-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-man-training-in-a-boxing-gym-42995-large.mp4'
    ],
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    id: 'sadeem',
    name: 'Sadeem',
    role: 'Senior Strength & Conditioning Specialist',
    coachPosition: 'SENIOR COACH',
    headline: 'FITNESS TRAINER | STRENGTH & CONDITIONING COACH | VIRTUAL FITNESS COACH',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Elite Strength & Conditioning Specialist and Virtual Performance Coach dedicated to body recomposition, muscular hypertrophy, and remote client transformation.',
    secondaryBio: 'Sadeem specializes in progressive overload programming and interactive virtual coaching, helping athletes and clients worldwide achieve peak physique and athletic endurance.',
    specialties: ['Hypertrophy & Body Recomposition', 'Virtual Fitness Coaching', 'Athletic Conditioning'],
    experienceYears: 9,
    clientsServed: 400,
    rating: 4.9,
    languages: ['English', 'Urdu'],
    availability: 'Mon - Fri (Flexible & Online)',
    certification: 'REPs Level 4 Strength & Virtual Conditioning Master',
    certifications: [
      'REPs Level 4 Master Strength Trainer',
      'Certified Virtual Fitness Coach Specialist',
      'Precision Nutrition Level 2 Certified',
      'FMS Functional Movement Screen Certified'
    ],
    achievements: [
      'Coached 400+ Global Virtual Clients Worldwide',
      'Featured Specialist in International Fitness Podcasts',
      '1,500+ Hours of 1-on-1 Performance Coaching'
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'
    ],
    galleryVideos: [
      'https://assets.mixkit.co/videos/preview/mixkit-man-doing-muscular-exercises-in-a-gym-43308-large.mp4'
    ],
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    id: 'moheeb-khan',
    name: 'Moheeb Khan',
    role: 'Fitness Trainer & Tactical Conditioning Lead',
    coachPosition: 'SENIOR COACH',
    headline: 'FITNESS TRAINER | STRENGTH & CONDITIONING COACH | VIRTUAL FITNESS COACH',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    bio: 'High-intensity fitness specialist and tactical strength coach focused on functional power, metabolic conditioning, and athletic movement mastery.',
    secondaryBio: 'Combining explosive plyometrics with tailored nutritional protocols, Moheeb empowers clients to build resilient power and unbreakable cardiovascular stamina.',
    specialties: ['Functional Fitness', 'Metabolic Conditioning', 'Core & Explosive Power'],
    experienceYears: 8,
    clientsServed: 300,
    rating: 4.9,
    languages: ['English', 'Urdu'],
    availability: 'Tue - Sun (Morning & Evening)',
    certification: 'UKSCA Tactical Conditioning & Functional Fitness Master',
    certifications: [
      'UK Strength & Conditioning Association (UKSCA)',
      'Certified Functional Movement & Mobility Specialist',
      'Advanced HIIT & EPOC Conditioning Master'
    ],
    achievements: [
      'Transformed 300+ Corporate Executives & Athletes',
      'Developer of BxStrength Tactical Metabolic Protocol',
      'Top Rated Virtual Coach 2024 & 2025'
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
    ],
    galleryVideos: [
      'https://assets.mixkit.co/videos/preview/mixkit-man-training-with-crossfit-ropes-in-a-gym-43309-large.mp4'
    ],
    socials: { linkedin: '#', instagram: '#' }
  }
];

export const SCHEDULE_DATA: ScheduleSlot[] = [
  { id: '1', day: 'Monday', time: '07:00 AM - 08:00 AM', className: 'Boxing Power & Technique', trainer: 'Shaban Faridi', room: 'Ring Arena B', spotsLeft: 4 },
  { id: '2', day: 'Monday', time: '10:00 AM - 11:30 AM', className: 'Strength & Hypertrophy', trainer: 'Sadeem', room: 'Strength Zone 2', spotsLeft: 2 },
  { id: '3', day: 'Monday', time: '05:00 PM - 06:00 PM', className: 'Tactical Metabolic Blast', trainer: 'Moheeb Khan', room: 'Main Turf', spotsLeft: 8 },
  { id: '4', day: 'Tuesday', time: '08:00 AM - 09:15 AM', className: 'Boxing Power & Technique', trainer: 'Shaban Faridi', room: 'Ring Arena B', spotsLeft: 5 },
  { id: '5', day: 'Tuesday', time: '04:00 PM - 05:00 PM', className: 'Strength & Hypertrophy', trainer: 'Sadeem', room: 'Strength Zone 1', spotsLeft: 3 },
  { id: '6', day: 'Wednesday', time: '07:00 AM - 08:00 AM', className: 'Tactical Metabolic Blast', trainer: 'Moheeb Khan', room: 'Main Turf', spotsLeft: 6 },
  { id: '7', day: 'Wednesday', time: '06:00 PM - 07:00 PM', className: 'Boxing Power & Technique', trainer: 'Shaban Faridi', room: 'Ring Arena B', spotsLeft: 1 },
  { id: '8', day: 'Thursday', time: '09:00 AM - 10:00 AM', className: 'Strength & Hypertrophy', trainer: 'Sadeem', room: 'Strength Zone 2', spotsLeft: 10 },
  { id: '9', day: 'Thursday', time: '05:30 PM - 06:45 PM', className: 'Tactical Metabolic Blast', trainer: 'Moheeb Khan', room: 'Main Turf', spotsLeft: 4 },
  { id: '10', day: 'Friday', time: '07:00 AM - 08:00 AM', className: 'Boxing Power & Technique', trainer: 'Shaban Faridi', room: 'Ring Arena B', spotsLeft: 3 },
  { id: '11', day: 'Friday', time: '05:00 PM - 06:00 PM', className: 'Strength & Hypertrophy', trainer: 'Sadeem', room: 'Strength Zone 1', spotsLeft: 2 },
  { id: '12', day: 'Saturday', time: '09:00 AM - 10:30 AM', className: 'Tactical Metabolic Blast', trainer: 'Moheeb Khan', room: 'Main Turf', spotsLeft: 7 },
  { id: '13', day: 'Saturday', time: '11:00 AM - 12:00 PM', className: 'Boxing Power & Technique', trainer: 'Shaban Faridi', room: 'Ring Arena B', spotsLeft: 5 },
  { id: '14', day: 'Sunday', time: '10:00 AM - 11:30 AM', className: 'Strength & Hypertrophy', trainer: 'Sadeem', room: 'Strength Zone 2', spotsLeft: 12 }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't1',
    name: 'SARAH CONNOR',
    role: 'Fitness Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    comment: 'BxStrength completely reshaped my discipline. The coaches care deeply about your form and progress. The atmosphere is energetic and welcoming!',
    rating: 5
  },
  {
    id: 't2',
    name: 'MICHAEL BENNETT',
    role: 'Marathon Runner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    comment: 'The Boxing Power and Strength programs increased my leg power significantly. Shaban and Sadeem are world-class trainers!',
    rating: 5
  },
  {
    id: 't3',
    name: 'EMILY ZHANG',
    role: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    comment: 'The Personal Training and Tactical Metabolic sessions with Moheeb help me stay focused and energized. High quality facilities and super clean environment!',
    rating: 5
  }
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential Hydration & Recovery Tips For Combat Conditioning',
    excerpt: 'Proper hydration starts 24 hours before your fight session. Discover how electrolytes boost muscular power and stamina.',
    content: 'Full guide on electrolyte balance, intra-workout mineral intake, and recovery post-boxing session...',
    category: 'Nutrition',
    author: 'Shaban Faridi',
    date: 'JULY 18, 2026',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'How Progressive Hypertrophy Training Accelerates Metabolism',
    excerpt: 'Building lean muscular tissue increases your resting metabolic rate even while sleeping. Here is the science behind it.',
    content: 'Detailed breakdown of progressive overload, rep ranges, time under tension, and protein synthesis recovery windows...',
    category: 'Workouts',
    author: 'Sadeem',
    date: 'JULY 12, 2026',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Mindful Breathwork: Decreasing Cortisol After Heavy Fight Sessions',
    excerpt: 'Integrating 10 minutes of parasympathetic breathwork lowers systemic inflammation and speeds up recovery times.',
    content: 'Guided box breathing techniques, post-workout heart rate variability recovery, and sleep quality improvements...',
    category: 'Mind & Body',
    author: 'Moheeb Khan',
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
