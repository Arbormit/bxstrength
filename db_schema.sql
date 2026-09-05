-- Velocity Fitness High-Scale Enterprise NeonDB PostgreSQL Schema
-- Optimized for 500,000+ (5 Lakh) active users & concurrent transactions

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  phone VARCHAR(50),
  age INT,
  gender VARCHAR(50),
  emergency_contact VARCHAR(255),
  fitness_goals TEXT,
  is_verified BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS body_stats (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  height_cm NUMERIC(5,2) NOT NULL,
  bmi NUMERIC(4,1) NOT NULL,
  bmi_category VARCHAR(50) NOT NULL,
  body_fat_percentage NUMERIC(4,1),
  chest_cm NUMERIC(5,2),
  waist_cm NUMERIC(5,2),
  biceps_cm NUMERIC(5,2),
  thighs_cm NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_schedules (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  trainer_id VARCHAR(64),
  trainer_name VARCHAR(255) NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  start_time VARCHAR(20) NOT NULL,
  end_time VARCHAR(20) NOT NULL,
  room VARCHAR(100) NOT NULL,
  max_capacity INT NOT NULL DEFAULT 20,
  booked_count INT NOT NULL DEFAULT 0,
  price NUMERIC(8,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  class_id VARCHAR(64) REFERENCES class_schedules(id) ON DELETE CASCADE,
  class_name VARCHAR(255) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
  booking_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workout_programs (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(50) NOT NULL DEFAULT 'Beginner',
  duration_weeks INT NOT NULL DEFAULT 4,
  assigned_to_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_user_name VARCHAR(255),
  created_by VARCHAR(255) NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nutrition_plans (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  assigned_to_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_user_name VARCHAR(255),
  daily_calories INT NOT NULL DEFAULT 2000,
  target_protein_g INT NOT NULL DEFAULT 150,
  target_carbs_g INT NOT NULL DEFAULT 200,
  target_fat_g INT NOT NULL DEFAULT 65,
  meals JSONB NOT NULL DEFAULT '[]',
  created_by VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  class_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Attended',
  marked_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly',
  price NUMERIC(8,2) NOT NULL,
  start_date DATE NOT NULL,
  next_billing_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  assigned_notes TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(64),
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  target_role VARCHAR(50) DEFAULT 'all',
  priority VARCHAR(50) DEFAULT 'medium',
  author_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS trainers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  coach_position VARCHAR(100) DEFAULT 'SENIOR COACH',
  headline TEXT,
  image TEXT NOT NULL,
  bio TEXT NOT NULL,
  secondary_bio TEXT,
  specialties TEXT,
  experience_years INT DEFAULT 5,
  clients_served INT DEFAULT 1000,
  rating NUMERIC(3,1) DEFAULT 5.0,
  languages TEXT,
  availability VARCHAR(255),
  certification TEXT,
  certifications TEXT,
  achievements TEXT,
  socials TEXT,
  gallery_photos TEXT,
  gallery_videos TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE trainers ADD COLUMN IF NOT EXISTS coach_position VARCHAR(100) DEFAULT 'SENIOR COACH';
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS secondary_bio TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS specialties TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 5;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS clients_served INT DEFAULT 1000;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 5.0;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS languages TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS availability VARCHAR(255);
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS certification TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS certifications TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS socials TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS gallery_photos TEXT;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS gallery_videos TEXT;

-- HIGH PERFORMANCE B-TREE INDEXES FOR 5 LAKH (500,000) ACTIVE USERS
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_body_stats_user_date ON body_stats(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_class_date ON bookings(class_id, date);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day ON class_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_workout_programs_assigned ON workout_programs(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_assigned ON nutrition_plans(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

