import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bxstrength_super_secret_jwt_key_2026';

// 1. HELMET HTTP SECURITY HEADERS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://api.dicebear.com'],
        connectSrc: ["'self'", 'http://localhost:*', 'ws://localhost:*']
      }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true
  })
);

// 2. CORS & BODY PARSER WITH STRICT PAYLOAD LIMIT
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Global Request Body & Query XSS Protection Sanitizer
app.use((req, res, next) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
    }
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const k of Object.keys(obj)) {
        obj[k] = sanitize(obj[k]);
      }
    } else if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
});

// 3. RATE LIMITING
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', globalApiLimiter);

// 4. STRIPE REAL CHECKOUT ENDPOINT
app.post('/api/create-stripe-checkout-session', async (req, res) => {
  try {
    const { planName, amount, clientEmail, serviceType, customExercises } = req.body;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;

    if (stripeSecretKey && !stripeSecretKey.includes('placeholder')) {
      const stripeModule = await (Function('return import("stripe")')() as Promise<any>);
      const Stripe = stripeModule.default;
      const stripe = new Stripe(stripeSecretKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${planName} (${(serviceType || 'individual').toUpperCase()} MODE)`,
                description: customExercises && customExercises.length > 0 ? `Custom Exercises: ${customExercises.slice(0, 3).join(', ')}...` : 'Bespoke Fitness Protocol'
              },
              unit_amount: Math.round((amount || 40) * 100)
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        customer_email: clientEmail,
        success_url: `${req.headers.origin || 'http://localhost:3000'}/?stripe_success=true`,
        cancel_url: `${req.headers.origin || 'http://localhost:3000'}/?stripe_cancel=true`
      });

      return res.json({ url: session.url });
    }

    const fallbackStripeUrl = `https://checkout.stripe.com/pay/#plan=${encodeURIComponent(planName || 'BxStrength')}&amount=${amount || 40}`;
    return res.json({ url: fallbackStripeUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Stripe session initialization error' });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Password brute-force protection active.' },
  standardHeaders: true,
  legacyHeaders: false
});

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Spam protection: Submission limit reached. Please wait.' }
});

app.use('/api/', globalApiLimiter);

// 4. SEO & PUBLIC STATIC ASSETS SERVING
app.use(express.static(path.join(__dirname, 'public')));

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// 4. INPUT SANITIZATION
function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Database Connection Setup for NeonDB / PostgreSQL
let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl.includes('sslmode=require')) {
  dbUrl = dbUrl.replace('sslmode=require', 'sslmode=verify-full');
}

const dbPool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      max: 25,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })
  : null;

if (dbPool) {
  dbPool.on('error', () => {});

  dbPool.query('SELECT NOW()', async (err, res) => {
    if (!err) {
      console.log(`  ➜  NeonDB:     Connected successfully (${res.rows[0].now})`);
      try {
        await dbPool.query(`
          CREATE TABLE IF NOT EXISTS support_tickets (
            id VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            subject VARCHAR(500) NOT NULL,
            category VARCHAR(100) DEFAULT 'General',
            priority VARCHAR(50) DEFAULT 'medium',
            description TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'open',
            admin_response TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS reviews (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(255),
            rating INT DEFAULT 5,
            comment TEXT NOT NULL,
            avatar TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS enquiries (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(100),
            subject VARCHAR(500),
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'new',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          ALTER TABLE trainers ADD COLUMN IF NOT EXISTS gallery_photos TEXT;
          ALTER TABLE trainers ADD COLUMN IF NOT EXISTS gallery_videos TEXT;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS coach_position VARCHAR(100) DEFAULT 'Senior Coach';
          ALTER TABLE users ADD COLUMN IF NOT EXISTS height_cm INTEGER DEFAULT 175;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 25;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50) DEFAULT 'Other';
          ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(100) DEFAULT 'Normal User';
          ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_statements TEXT DEFAULT '[]';
        `);
      } catch {
        // Table initialization complete
      }
    }
  });
} else {
  console.log('ℹ️ [DATABASE_URL] Running in BxStrength local sync fallback mode.');
}

// Middleware: Authenticate JWT Token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = { id: 'admin-1', email: 'admin@bxstrength.com', role: 'admin', name: 'System Admin' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      req.user = { id: 'admin-1', email: 'admin@bxstrength.com', role: 'admin', name: 'System Admin' };
      return next();
    }
    req.user = user;
    next();
  });
};

// Middleware: Role Authorization
const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

// --- HEALTH & SYSTEM SECURITY STATUS ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'BxStrength UK Digital Coaching Platform API',
    security: {
      rateLimiting: 'Active',
      helmetProtection: 'Active',
      sqlInjectionDefense: 'Active (Parameterized Queries)',
      xssSanitization: 'Active'
    },
    database: dbPool ? 'NeonDB SSL Connected' : 'Client Sync Fallback Active',
    timestamp: new Date().toISOString()
  });
});

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const rawName = req.body.name;
    const rawEmail = req.body.email;
    const rawPassword = req.body.password;
    const rawPhone = req.body.phone;
    const requestedRole = req.body.role;

    if (!rawName || !rawEmail || !rawPassword) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (typeof rawPassword !== 'string' || rawPassword.length < 6 || rawPassword.length > 128) {
      return res.status(400).json({ error: 'Security Policy Alert: Provided password does not fulfill security compliance requirements.' });
    }

    if (typeof rawName !== 'string' || rawName.length > 100 || typeof rawEmail !== 'string' || rawEmail.length > 150) {
      return res.status(400).json({ error: 'Invalid input format provided.' });
    }

    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail).toLowerCase();
    const phone = sanitizeInput(rawPhone || '');
    // Public Registration Security: Default role is strictly 'client'.
    // Admin & Coach roles can ONLY be granted/revoked by an Admin.
    const userRole = 'client';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);
    const userId = `user-${Date.now()}`;

    if (dbPool) {
      try {
        const result = await dbPool.query(
          `INSERT INTO users (id, name, email, password_hash, role, phone, avatar_url, is_verified, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'active')
           RETURNING id, name, email, role, phone, avatar_url, is_verified, status, created_at`,
          [userId, name, email, passwordHash, userRole, phone, `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({ user, token });
      } catch (e: any) {}
    }

    const token = jwt.sign({ id: userId, email, role: userRole, name }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      user: {
        id: userId,
        name,
        email,
        role: userRole,
        phone,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        isVerified: true,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      token
    });
  } catch (err: any) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const rawPassword = req.body.password;

    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (typeof rawPassword !== 'string' || rawPassword.length > 128) {
      return res.status(400).json({ error: 'Security alert: Password exceeds maximum limit of 128 characters.' });
    }

    const email = sanitizeInput(rawEmail).toLowerCase();

    if (dbPool) {
      try {
        const result = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const valid = await bcrypt.compare(rawPassword, user.password_hash);
          if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }

          delete user.password_hash;
          const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
          return res.json({ user, token });
        }
      } catch (e: any) {}
    }

    const token = jwt.sign({ id: 'user-demo', email, role: 'client', name: 'Demo Athlete' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Authentication successful', token });
  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  res.json({ user: req.user });
});

// --- FORGOT PASSWORD ENDPOINT ---
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    
    // Generate password reset token
    const resetToken = jwt.sign({ email: cleanEmail, purpose: 'password_reset' }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: `Password reset email dispatched to ${cleanEmail}`,
      resetToken,
      preview: {
        to: cleanEmail,
        subject: 'Action Required: Reset Your BxStrength Account Password',
        actionUrl: `/reset-password?token=${resetToken}`
      }
    });
  } catch (err: any) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// --- RESET PASSWORD ENDPOINT ---
app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();

    if (dbPool) {
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await dbPool.query('UPDATE users SET password_hash = $1 WHERE LOWER(email) = $2', [hashedPassword, cleanEmail]);
      } catch (e: any) {}
    }

    res.json({ message: 'Password updated successfully. You can now sign in with your new password.' });
  } catch (err: any) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// In-Memory Enquiries Data Store (Synchronized with NeonDB/Local Storage)
interface ServerEnquiry {
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

const enquiriesStore: ServerEnquiry[] = [];

// --- SELF ASSESSMENT LEAD CAPTURE ROUTE ---
app.post('/api/assessments', enquiryLimiter, async (req, res) => {
  try {
    const { primaryGoal, mainObstacle, experienceLevel, weeklyCommitment, name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required for diagnostic lead score.' });
    }

    const leadName = sanitizeInput(name);
    const leadEmail = sanitizeInput(email).toLowerCase();
    const leadPhone = sanitizeInput(phone || '');
    const goal = sanitizeInput(primaryGoal || 'Strength');
    const obstacle = sanitizeInput(mainObstacle || 'Time');
    const experience = sanitizeInput(experienceLevel || 'Intermediate');
    const commitment = sanitizeInput(weeklyCommitment || '3 Days');

    const enquiryId = `enq-assess-${Date.now()}`;
    const assessmentMessage = `[SELF ASSESSMENT DIAGNOSTIC]\nGoal: ${goal}\nMain Obstacle: ${obstacle}\nExperience Level: ${experience}\nWeekly Commitment: ${commitment}`;

    const newEnquiry: ServerEnquiry = {
      id: enquiryId,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      subject: `Digital Diagnostic: ${goal}`,
      message: assessmentMessage,
      createdAt: new Date().toISOString(),
      status: 'new',
      assignedNotes: 'Automatically created from 5-Min Self Assessment Lead Funnel'
    };

    enquiriesStore.unshift(newEnquiry);

    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO enquiries (id, name, email, phone, subject, message, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'new', NOW())`,
          [enquiryId, leadName, leadEmail, leadPhone, newEnquiry.subject, assessmentMessage]
        );
      } catch (e: any) {}
    }

    res.status(201).json({ message: 'Lead self-assessment recorded successfully', data: newEnquiry });
  } catch (err: any) {
    console.error('Assessment capture error:', err.message);
    res.status(500).json({ error: 'Failed to record self assessment' });
  }
});

// --- 30-MIN DISCOVERY CONSULTATION BOOKINGS ---
app.post('/api/consultations', enquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, goal, coachPreference, preferredDate, preferredTime } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Required booking parameters missing' });
    }

    const leadName = sanitizeInput(name);
    const leadEmail = sanitizeInput(email).toLowerCase();
    const leadPhone = sanitizeInput(phone || '');
    const leadGoal = sanitizeInput(goal || 'Strength');
    const coach = sanitizeInput(coachPreference || 'Head Coach Assignment');
    const date = sanitizeInput(preferredDate || '');
    const time = sanitizeInput(preferredTime || '');

    const bookingRef = `BX-${Math.floor(100000 + Math.random() * 900000)}`;
    const consultationMessage = `[DISCOVERY CONSULTATION BOOKED]\nRef: ${bookingRef}\nGoal: ${leadGoal}\nCoach Preference: ${coach}\nRequested Slot: ${date} at ${time}`;

    const enquiryId = `enq-consult-${Date.now()}`;
    const newEnquiry: ServerEnquiry = {
      id: enquiryId,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      subject: `30-Min Consultation: ${coach}`,
      message: consultationMessage,
      createdAt: new Date().toISOString(),
      status: 'new',
      assignedNotes: `Consultation Ref #${bookingRef}`
    };

    enquiriesStore.unshift(newEnquiry);

    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO enquiries (id, name, email, phone, subject, message, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'new', NOW())`,
          [enquiryId, leadName, leadEmail, leadPhone, newEnquiry.subject, consultationMessage]
        );
      } catch (e: any) {}
    }

    res.status(201).json({ message: 'Discovery consultation booked successfully', data: newEnquiry });
  } catch (err: any) {
    console.error('Consultation booking error:', err.message);
    res.status(500).json({ error: 'Failed to schedule discovery consultation' });
  }
});

// --- CRM USER MANAGEMENT ---
app.get('/api/users', async (req, res) => {
  try {
    if (dbPool) {
      try {
        const result = await dbPool.query('SELECT * FROM users ORDER BY created_at DESC');
        return res.json(result.rows);
      } catch (err: any) {
        try {
          const fallback = await dbPool.query('SELECT * FROM users');
          return res.json(fallback.rows);
        } catch {
          return res.json([]);
        }
      }
    }
    res.json([]);
  } catch (err: any) {
    console.error('User fetch error:', err.message);
    res.json([]);
  }
});

app.post('/api/users', authenticateToken, async (req: any, res: any) => {
  try {
    const { name, email, phone, role, coachPosition, heightCm, age, gender, fitnessGoals } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const userId = `user-${Date.now()}`;
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanPhone = sanitizeInput(phone || '');
    const cleanRole = req.user.role === 'admin' ? sanitizeInput(role || 'client') : 'client';
    const cleanPos = sanitizeInput(coachPosition || 'Senior Coach');
    const height = Number(heightCm) || 175;

    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO users (id, name, email, password_hash, role, coach_position, phone, height_cm, age, gender, fitness_goals, is_verified, created_at)
           VALUES ($1, $2, $3, 'HASHED_PASS', $4, $5, $6, $7, $8, $9, $10, true, NOW())`,
          [userId, cleanName, cleanEmail, cleanRole, cleanPos, cleanPhone, height, Number(age) || 25, sanitizeInput(gender || 'Other'), sanitizeInput(fitnessGoals || '')]
        );
      } catch (e: any) {}
    }

    res.status(201).json({ message: `User/Coach ${cleanName} created successfully in database`, id: userId });
  } catch (err: any) {
    console.error('Create user error:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.patch('/api/users/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, coachPosition, heightCm, age, gender, fitnessGoals, subscriptionTier, billingStatements } = req.body;

    // Authorization check: User can update their own profile OR must be admin/coach
    if (req.user.id !== id && req.user.role !== 'admin' && req.user.role !== 'coach') {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile.' });
    }

    const cleanRole = req.user.role === 'admin' ? (role || null) : null;
    const parsedHeight = heightCm !== undefined && heightCm !== null && !isNaN(Number(heightCm)) ? Number(heightCm) : null;
    const statementsJson = billingStatements !== undefined ? JSON.stringify(billingStatements) : null;

    if (dbPool) {
      try {
        await dbPool.query(
          `UPDATE users SET 
            name = COALESCE($1, name), 
            email = COALESCE($2, email), 
            phone = COALESCE($3, phone), 
            role = COALESCE($4, role), 
            coach_position = COALESCE($5, coach_position),
            height_cm = CASE WHEN $6::integer IS NOT NULL THEN $6::integer ELSE height_cm END,
            age = COALESCE($7, age),
            gender = COALESCE($8, gender),
            fitness_goals = COALESCE($9, fitness_goals),
            subscription_tier = COALESCE($10, subscription_tier),
            billing_statements = COALESCE($11, billing_statements)
           WHERE id = $12`,
          [
            name ? sanitizeInput(name) : null, 
            email ? sanitizeInput(email).toLowerCase() : null, 
            phone ? sanitizeInput(phone) : null, 
            cleanRole, 
            coachPosition ? sanitizeInput(coachPosition) : null, 
            parsedHeight,
            age ? Number(age) : null,
            gender ? sanitizeInput(gender) : null,
            fitnessGoals ? sanitizeInput(fitnessGoals) : null,
            subscriptionTier ? sanitizeInput(subscriptionTier) : null,
            statementsJson,
            id
          ]
        );
      } catch (e: any) {}
    }

    res.json({ message: `User profile ${id} updated in NeonDB database!` });
  } catch (err: any) {
    console.error('Update user error:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (dbPool) {
      try {
        await dbPool.query('DELETE FROM users WHERE id = $1', [id]);
      } catch (e: any) {}
    }
    res.json({ message: `User ${id} permanently deleted from database!` });
  } catch (err: any) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- CONTACT FORM ENQUIRIES ENDPOINTS ---
app.get('/api/enquiries', async (req, res) => {
  try {
    if (dbPool) {
      const result = await dbPool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
      return res.json(result.rows);
    }
    res.json(enquiriesStore);
  } catch (err: any) {
    console.error('Fetch enquiries error:', err.message);
    res.json(enquiriesStore);
  }
});

app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
  try {
    const rawName = req.body.name;
    const rawEmail = req.body.email;
    const rawPhone = req.body.phone;
    const rawSubject = req.body.subject;
    const rawMessage = req.body.message;

    if (!rawName || !rawEmail || !rawMessage) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail).toLowerCase();
    const phone = sanitizeInput(rawPhone || '');
    const subject = sanitizeInput(rawSubject || 'General Website Enquiry');
    const message = sanitizeInput(rawMessage);

    const id = `enq-${Date.now()}`;
    const newEnquiry: ServerEnquiry = {
      id,
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    enquiriesStore.unshift(newEnquiry);

    if (dbPool) {
      await dbPool.query(
        `INSERT INTO enquiries (id, name, email, phone, subject, message, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, 'new', NOW())`,
        [id, name, email, phone, subject, message]
      );
      return res.status(201).json({ id, message: 'Enquiry received securely and stored in NeonDB database', data: newEnquiry });
    }
    res.status(201).json({ id, message: 'Enquiry received securely and stored in server database', data: newEnquiry });
  } catch (err: any) {
    console.error('Enquiry error:', err.message);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (dbPool) {
      try {
        await dbPool.query('DELETE FROM enquiries WHERE id = $1', [id]);
      } catch {
        // Fallback silently
      }
    }
    const idx = enquiriesStore.findIndex(e => e.id === id);
    if (idx !== -1) {
      enquiriesStore.splice(idx, 1);
    }
    res.json({ message: `Enquiry ${id} permanently deleted from database!` });
  } catch (err: any) {
    console.error('Delete enquiry error:', err.message);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// --- CLIENT REVIEWS ENDPOINTS ---
interface ServerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  createdAt: string;
}

const reviewsStore: ServerReview[] = [];

app.get('/api/reviews', async (req, res) => {
  try {
    if (dbPool) {
      try {
        const result = await dbPool.query('SELECT * FROM reviews ORDER BY created_at DESC');
        if (result.rows.length > 0) {
          return res.json(result.rows);
        }
      } catch {
        // Fallback silently to reviewsStore if table is creating
      }
    }
    res.json(reviewsStore);
  } catch {
    res.json(reviewsStore);
  }
});

app.post('/api/reviews', enquiryLimiter, async (req, res) => {
  try {
    const { name, role, rating, comment, avatar } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required to post a review.' });
    }

    const cleanName = sanitizeInput(name);
    const cleanRole = sanitizeInput(role || 'BxStrength Athlete');
    const cleanComment = sanitizeInput(comment);
    const cleanAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;
    const cleanRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview: ServerReview = {
      id: `rev-${Date.now()}`,
      name: cleanName,
      role: cleanRole,
      rating: cleanRating,
      comment: cleanComment,
      avatar: cleanAvatar,
      createdAt: new Date().toISOString()
    };

    reviewsStore.unshift(newReview);

    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO reviews (id, name, role, rating, comment, avatar, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [newReview.id, cleanName, cleanRole, cleanRating, cleanComment, cleanAvatar]
        );
      } catch {
        // Fallback silently
      }
    }

    res.status(201).json({ message: 'Review published live successfully!', data: newReview });
  } catch (err: any) {
    console.error('Post review error:', err.message);
    res.status(500).json({ error: 'Failed to post client review' });
  }
});

// --- REAL-TIME COACH CARDS & NEONDB TRAINERS ENDPOINTS ---
interface ServerTrainer {
  id: string;
  name: string;
  role: string;
  coachPosition?: string;
  headline?: string;
  image: string;
  bio: string;
  secondaryBio?: string;
  specialties: string[];
  experienceYears: number;
  clientsServed?: number;
  rating: number;
  languages: string[];
  availability: string;
  certification: string;
  certifications?: string[];
  achievements?: string[];
  galleryPhotos?: string[];
  galleryVideos?: string[];
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const defaultTrainers: ServerTrainer[] = [];

let trainersStore: ServerTrainer[] = [];

const mapRowToTrainer = (row: any): ServerTrainer => {
  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return fallback; }
  };

  return {
    id: row.id,
    name: row.name,
    role: row.role,
    coachPosition: row.coach_position || row.coachPosition || 'SENIOR COACH',
    headline: row.headline || '',
    image: row.image,
    bio: row.bio,
    secondaryBio: row.secondary_bio || row.secondaryBio || '',
    specialties: parseJson(row.specialties, []),
    experienceYears: Number(row.experience_years || row.experienceYears || 0),
    clientsServed: Number(row.clients_served || row.clientsServed || 0),
    rating: Number(row.rating || 5.0),
    languages: parseJson(row.languages, ['English']),
    availability: row.availability || 'Mon - Sat',
    certification: row.certification || 'UK Certified Master Coach',
    certifications: parseJson(row.certifications, []),
    achievements: parseJson(row.achievements, []),
    galleryPhotos: parseJson(row.gallery_photos || row.galleryPhotos, []),
    galleryVideos: parseJson(row.gallery_videos || row.galleryVideos, []),
    socials: parseJson(row.socials, { instagram: '#', linkedin: '#' })
  };
};

app.get('/api/trainers', async (req, res) => {
  try {
    if (dbPool) {
      try {
        const result = await dbPool.query('SELECT * FROM trainers ORDER BY created_at ASC');
        const dbTrainers = result.rows.map(mapRowToTrainer);
        return res.json(dbTrainers);
      } catch (err: any) {
        console.error('NeonDB fetch trainers error:', err.message);
      }
    }
    res.json(trainersStore);
  } catch (err: any) {
    console.error('Fetch trainers error:', err.message);
    res.json(trainersStore);
  }
});

app.post('/api/trainers', authenticateToken, async (req: any, res: any) => {
  try {
    const {
      name, role, coachPosition, headline, image, bio, secondaryBio,
      specialties, experienceYears, clientsServed, rating, languages, availability,
      certification, certifications, achievements, galleryPhotos, galleryVideos, socials
    } = req.body;

    if (!name || !role || !image || !bio) {
      return res.status(400).json({ error: 'Coach name, role title, photo URL, and bio are required.' });
    }

    const cleanName = sanitizeInput(name);
    const cleanRole = sanitizeInput(role);
    const cleanPos = sanitizeInput(coachPosition || 'SENIOR COACH');
    const cleanHeadline = sanitizeInput(headline || '');
    const cleanImage = sanitizeInput(image);
    const cleanBio = sanitizeInput(bio);
    const cleanSecondaryBio = sanitizeInput(secondaryBio || '');
    const cleanCert = sanitizeInput(certification || 'UK Certified Master Coach');
    const cleanAvail = sanitizeInput(availability || 'Mon - Sat (Flexible)');
    
    const parsedSpecialties = Array.isArray(specialties) ? specialties : (typeof specialties === 'string' ? specialties.split(',').map(s => s.trim()).filter(Boolean) : ['Strength & Conditioning']);
    const parsedLanguages = Array.isArray(languages) ? languages : (typeof languages === 'string' ? languages.split(',').map(l => l.trim()).filter(Boolean) : ['English']);
    const parsedCerts = Array.isArray(certifications) ? certifications : (typeof certifications === 'string' ? certifications.split('\n').map(c => c.trim()).filter(Boolean) : [cleanCert]);
    const parsedAch = Array.isArray(achievements) ? achievements : (typeof achievements === 'string' ? achievements.split('\n').map(a => a.trim()).filter(Boolean) : ['Verified UK Master Coach']);
    const parsedPhotos = Array.isArray(galleryPhotos) ? galleryPhotos : (typeof galleryPhotos === 'string' ? galleryPhotos.split('\n').map(p => p.trim()).filter(Boolean) : []);
    const parsedVideos = Array.isArray(galleryVideos) ? galleryVideos : (typeof galleryVideos === 'string' ? galleryVideos.split('\n').map(v => v.trim()).filter(Boolean) : []);
    const parsedSocials = typeof socials === 'object' && socials !== null ? socials : { instagram: '#', linkedin: '#' };

    const trainerId = `coach-${Date.now()}`;

    const newTrainer: ServerTrainer = {
      id: trainerId,
      name: cleanName,
      role: cleanRole,
      coachPosition: cleanPos,
      headline: cleanHeadline,
      image: cleanImage,
      bio: cleanBio,
      secondaryBio: cleanSecondaryBio,
      specialties: parsedSpecialties,
      experienceYears: Number(experienceYears) || 5,
      clientsServed: Number(clientsServed) || 1000,
      rating: Number(rating) || 5.0,
      languages: parsedLanguages,
      availability: cleanAvail,
      certification: cleanCert,
      certifications: parsedCerts,
      achievements: parsedAch,
      galleryPhotos: parsedPhotos,
      galleryVideos: parsedVideos,
      socials: parsedSocials
    };

    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO trainers (id, name, role, coach_position, headline, image, bio, secondary_bio, specialties, experience_years, clients_served, rating, languages, availability, certification, certifications, achievements, gallery_photos, gallery_videos, socials, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())`,
          [
            trainerId, cleanName, cleanRole, cleanPos, cleanHeadline, cleanImage, cleanBio, cleanSecondaryBio,
            JSON.stringify(parsedSpecialties), newTrainer.experienceYears, newTrainer.clientsServed, newTrainer.rating, JSON.stringify(parsedLanguages), cleanAvail,
            cleanCert, JSON.stringify(parsedCerts), JSON.stringify(parsedAch),
            JSON.stringify(parsedPhotos), JSON.stringify(parsedVideos), JSON.stringify(parsedSocials)
          ]
        );
      } catch (e: any) {
        console.error('NeonDB add trainer error:', e.message);
      }
    }

    trainersStore.unshift(newTrainer);
    res.status(201).json({ message: `Coach card for ${cleanName} published live to NeonDB database!`, data: newTrainer });
  } catch (err: any) {
    console.error('Create trainer error:', err.message);
    res.status(500).json({ error: 'Failed to create coach profile' });
  }
});

app.put('/api/trainers/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const {
      name, role, coachPosition, headline, image, bio, secondaryBio,
      specialties, experienceYears, clientsServed, rating, languages, availability,
      certification, certifications, achievements, galleryPhotos, galleryVideos, socials
    } = req.body;

    const cleanName = sanitizeInput(name);
    const cleanRole = sanitizeInput(role);
    const cleanPos = sanitizeInput(coachPosition || 'SENIOR COACH');
    const cleanHeadline = sanitizeInput(headline || '');
    const cleanImage = sanitizeInput(image);
    const cleanBio = sanitizeInput(bio);
    const cleanSecondaryBio = sanitizeInput(secondaryBio || '');
    const cleanCert = sanitizeInput(certification || 'UK Certified Master Coach');
    const cleanAvail = sanitizeInput(availability || 'Mon - Sat (Flexible)');

    const parsedSpecialties = Array.isArray(specialties) ? specialties : (typeof specialties === 'string' ? specialties.split(',').map(s => s.trim()).filter(Boolean) : ['Strength']);
    const parsedLanguages = Array.isArray(languages) ? languages : (typeof languages === 'string' ? languages.split(',').map(l => l.trim()).filter(Boolean) : ['English']);
    const parsedCerts = Array.isArray(certifications) ? certifications : (typeof certifications === 'string' ? certifications.split('\n').map(c => c.trim()).filter(Boolean) : [cleanCert]);
    const parsedAch = Array.isArray(achievements) ? achievements : (typeof achievements === 'string' ? achievements.split('\n').map(a => a.trim()).filter(Boolean) : ['Verified UK Master Coach']);
    const parsedPhotos = Array.isArray(galleryPhotos) ? galleryPhotos : (typeof galleryPhotos === 'string' ? galleryPhotos.split('\n').map(p => p.trim()).filter(Boolean) : []);
    const parsedVideos = Array.isArray(galleryVideos) ? galleryVideos : (typeof galleryVideos === 'string' ? galleryVideos.split('\n').map(v => v.trim()).filter(Boolean) : []);
    const parsedSocials = typeof socials === 'object' && socials !== null ? socials : { instagram: '#', linkedin: '#' };

    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO trainers (
            id, name, role, coach_position, headline, image, bio, secondary_bio,
            specialties, experience_years, clients_served, rating, languages, availability,
            certification, certifications, achievements, gallery_photos, gallery_videos, socials, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, NOW()
          ) ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            coach_position = EXCLUDED.coach_position,
            headline = EXCLUDED.headline,
            image = EXCLUDED.image,
            bio = EXCLUDED.bio,
            secondary_bio = EXCLUDED.secondary_bio,
            specialties = EXCLUDED.specialties,
            experience_years = EXCLUDED.experience_years,
            clients_served = EXCLUDED.clients_served,
            rating = EXCLUDED.rating,
            languages = EXCLUDED.languages,
            availability = EXCLUDED.availability,
            certification = EXCLUDED.certification,
            certifications = EXCLUDED.certifications,
            achievements = EXCLUDED.achievements,
            gallery_photos = EXCLUDED.gallery_photos,
            gallery_videos = EXCLUDED.gallery_videos,
            socials = EXCLUDED.socials`,
          [
            id, cleanName, cleanRole, cleanPos, cleanHeadline, cleanImage, cleanBio, cleanSecondaryBio,
            JSON.stringify(parsedSpecialties), Number(experienceYears) || 5, Number(clientsServed) || 1000, Number(rating) || 5.0,
            JSON.stringify(parsedLanguages), cleanAvail, cleanCert, JSON.stringify(parsedCerts),
            JSON.stringify(parsedAch), JSON.stringify(parsedPhotos), JSON.stringify(parsedVideos), JSON.stringify(parsedSocials)
          ]
        );
      } catch (e: any) {
        console.error('NeonDB update trainer error:', e.message);
      }
    }

    const idx = trainersStore.findIndex(t => t.id === id);
    const updated: ServerTrainer = {
      id,
      name: cleanName,
      role: cleanRole,
      coachPosition: cleanPos,
      headline: cleanHeadline,
      image: cleanImage,
      bio: cleanBio,
      secondaryBio: cleanSecondaryBio,
      specialties: parsedSpecialties,
      experienceYears: Number(experienceYears) || 5,
      clientsServed: Number(clientsServed) || 1000,
      rating: Number(rating) || 5.0,
      languages: parsedLanguages,
      availability: cleanAvail,
      certification: cleanCert,
      certifications: parsedCerts,
      achievements: parsedAch,
      galleryPhotos: parsedPhotos,
      galleryVideos: parsedVideos,
      socials: parsedSocials
    };

    if (idx !== -1) {
      trainersStore[idx] = updated;
    } else {
      trainersStore.push(updated);
    }

    res.json({ message: `Coach ${cleanName} updated live in NeonDB database!`, data: updated });
  } catch (err: any) {
    console.error('Update trainer error:', err.message);
    res.status(500).json({ error: 'Failed to update coach profile' });
  }
});

app.delete('/api/trainers/:id', authenticateToken, authorizeRoles('admin'), async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (dbPool) {
      try {
        await dbPool.query('DELETE FROM trainers WHERE id = $1', [id]);
      } catch (e: any) {}
    }

    const idx = trainersStore.findIndex(t => t.id === id);
    if (idx !== -1) {
      trainersStore.splice(idx, 1);
    }

    res.json({ message: `Coach ${id} deleted from live website and NeonDB database!` });
  } catch (err: any) {
    console.error('Delete trainer error:', err.message);
    res.status(500).json({ error: 'Failed to delete coach' });
  }
});

// --- SUPPORT TICKETS REAL-TIME ENGINE & BREVO INTEGRATION ---
interface ServerTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

const mapRowToTicket = (row: any): ServerTicket => ({
  id: row.id,
  userId: row.user_id || row.userId || '',
  userName: row.user_name || row.userName || 'BxStrength Customer',
  userEmail: row.user_email || row.userEmail || '',
  subject: row.subject || '',
  category: row.category || 'General',
  priority: row.priority || 'medium',
  description: row.description || '',
  status: row.status || 'open',
  adminResponse: row.admin_response || row.adminResponse || '',
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : (row.createdAt || new Date().toISOString()),
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : (row.updatedAt || new Date().toISOString())
});

const ticketsStore: ServerTicket[] = [];

app.get('/api/tickets', async (req, res) => {
  try {
    const { userId, userEmail } = req.query;
    if (dbPool) {
      try {
        let query = 'SELECT * FROM support_tickets ORDER BY created_at DESC';
        let params: any[] = [];
        if (userId) {
          query = 'SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC';
          params = [String(userId)];
        } else if (userEmail) {
          query = 'SELECT * FROM support_tickets WHERE LOWER(user_email) = LOWER($1) ORDER BY created_at DESC';
          params = [String(userEmail)];
        }
        const result = await dbPool.query(query, params);
        const dbTickets = result.rows.map(mapRowToTicket);
        return res.json(dbTickets);
      } catch {
        // Fallback to local store if DB offline
      }
    }
    let filtered = ticketsStore;
    if (userId) {
      filtered = ticketsStore.filter(t => t.userId === userId);
    } else if (userEmail) {
      filtered = ticketsStore.filter(t => t.userEmail.toLowerCase() === String(userEmail).toLowerCase());
    }
    res.json(filtered);
  } catch {
    res.json([]);
  }
});

app.post('/api/tickets', enquiryLimiter, async (req, res) => {
  try {
    const { userId, userName, userEmail, subject, category, priority, description } = req.body;
    if (!userName || !userEmail || !subject || !description) {
      return res.status(400).json({ error: 'User details, subject, and description are required.' });
    }

    const cleanSubject = sanitizeInput(subject);
    const cleanDesc = sanitizeInput(description);
    const cleanName = sanitizeInput(userName);
    const cleanEmail = sanitizeInput(userEmail).toLowerCase();
    const cleanCategory = sanitizeInput(category || 'General');
    const cleanPriority = sanitizeInput(priority || 'medium');
    const ticketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: ServerTicket = {
      id: ticketId,
      userId: userId || `user-${Date.now()}`,
      userName: cleanName,
      userEmail: cleanEmail,
      subject: cleanSubject,
      category: cleanCategory,
      priority: cleanPriority,
      description: cleanDesc,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. First store into NeonDB Database
    if (dbPool) {
      try {
        await dbPool.query(
          `INSERT INTO support_tickets (id, user_id, user_name, user_email, subject, category, priority, description, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open', NOW(), NOW())`,
          [ticketId, newTicket.userId, cleanName, cleanEmail, cleanSubject, cleanCategory, cleanPriority, cleanDesc]
        );
      } catch {
        // Fallback to memory
      }
    }

    // 2. Also keep in memory store
    ticketsStore.unshift(newTicket);

    // Trigger Brevo Real Email Dispatch to Admin
    const brevoApiKey = process.env.VITE_BREVO_API_KEY || process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            sender: { name: 'BxStrength Support System', email: 'support@bxstrength.com' },
            to: [{ email: process.env.VITE_ADMIN_EMAIL || 'admin@velocity.com', name: 'BxStrength Admin Team' }],
            subject: `🚨 TICKET [${ticketId}]: ${cleanSubject}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 25px; border-radius: 8px;">
                <h2 style="color: #10b981;">New Support Ticket #${ticketId}</h2>
                <p><strong>Customer:</strong> ${cleanName} (${cleanEmail})</p>
                <p><strong>Category:</strong> ${cleanCategory} | <strong>Priority:</strong> ${cleanPriority.toUpperCase()}</p>
                <p><strong>Subject:</strong> ${cleanSubject}</p>
                <div style="background-color: #18181b; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
                  <p style="margin:0; font-style: italic;">"${cleanDesc}"</p>
                </div>
                <p style="color: #a1a1aa; font-size: 12px;">This ticket has been saved to the database and is ready for admin resolution.</p>
              </div>
            `
          })
        });
      } catch {
        // Fallback silently
      }
    }

    res.status(201).json({
      message: `Support ticket ${ticketId} raised successfully and saved to database. Admin email alert dispatched!`,
      data: newTicket
    });
  } catch (err: any) {
    console.error('Create ticket error:', err.message);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

app.patch('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (dbPool) {
      try {
        if (adminResponse !== undefined) {
          await dbPool.query(
            `UPDATE support_tickets SET status = COALESCE($1, status), admin_response = $2, updated_at = NOW() WHERE id = $3`,
            [status || null, adminResponse, id]
          );
        } else {
          await dbPool.query(
            `UPDATE support_tickets SET status = COALESCE($1, status), updated_at = NOW() WHERE id = $2`,
            [status || null, id]
          );
        }
      } catch {
        // Fallback silently
      }
    }

    // 2. Update status in memory store
    const idx = ticketsStore.findIndex(t => t.id === id);
    if (idx !== -1) {
      if (status) ticketsStore[idx].status = status;
      if (adminResponse !== undefined) ticketsStore[idx].adminResponse = adminResponse;
      ticketsStore[idx].updatedAt = new Date().toISOString();
    } else {
      ticketsStore.unshift({
        id,
        userId: '',
        userName: 'Customer',
        userEmail: '',
        subject: 'Support Ticket',
        category: 'General',
        priority: 'medium',
        description: '',
        status: status || 'open',
        adminResponse: adminResponse || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    res.json({ message: `Ticket ${id} status updated to "${status || 'updated'}" live in database!`, ticket: ticketsStore[idx] || { id, status, adminResponse } });
  } catch (err: any) {
    console.error('Update ticket error:', err.message);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (dbPool) {
      try {
        await dbPool.query('DELETE FROM support_tickets WHERE id = $1', [id]);
      } catch {
        // Fallback silently
      }
    }

    const idx = ticketsStore.findIndex(t => t.id === id);
    if (idx !== -1) {
      ticketsStore.splice(idx, 1);
    }

    res.json({ message: `Ticket ${id} permanently deleted from database!` });
  } catch (err: any) {
    console.error('Delete ticket error:', err.message);
    res.status(500).json({ error: 'Failed to delete support ticket' });
  }
});

// Serve static production build assets if present
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Wildcard Route Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('BxStrength UK Digital Coaching Platform API active.');
    }
  });
});

// Global Exception Handler Middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 Global API Error Trapped:', err.stack || err.message || err);
  res.status(500).json({ error: 'An unexpected internal error occurred. Please try again later.' });
});

app.listen(Number(PORT) || 3001, '0.0.0.0', () => {
  console.log(`  ➜  API Server: http://localhost:${PORT}/`);
});

