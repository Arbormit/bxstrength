import {
  User, UserRole, CoachPosition, CoachPermissions, BodyStat, WorkoutProgram, NutritionPlan,
  ClassSchedule, Booking, AttendanceRecord, Subscription,
  Enquiry, AuditLog, Announcement, BlogPost, Testimonial,
  SupportTicket, TicketStatus, TicketCategory, TicketPriority
} from '../types';
import { BxTrainer, TRAINERS_DATA } from '../data/gymData';

const metaEnv = (import.meta as any).env || {};

export const getApiUrl = (path: string): string => {
  const configured = metaEnv.VITE_API_URL || metaEnv.API_URL || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (configured) {
    return `${configured.replace(/\/$/, '')}${cleanPath}`;
  }

  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return cleanPath;
    }
  }

  return `https://bxstrength-api.onrender.com${cleanPath}`;
};

const STORAGE_KEYS = {
  USERS: 'velocity_users',
  CURRENT_USER: 'velocity_current_user',
  TOKEN: 'velocity_jwt_token',
  BODY_STATS: 'velocity_body_stats',
  CLASSES: 'velocity_classes',
  BOOKINGS: 'velocity_bookings',
  PROGRAMS: 'velocity_programs',
  NUTRITION: 'velocity_nutrition',
  NUTRITION_PLANS: 'velocity_nutrition_plans',
  ATTENDANCE: 'velocity_attendance',
  SUBSCRIPTIONS: 'velocity_subscriptions',
  ENQUIRIES: 'velocity_enquiries',
  AUDIT_LOGS: 'velocity_audit_logs',
  ANNOUNCEMENTS: 'velocity_announcements',
  BLOG_POSTS: 'bxstrength_blog_posts',
  REVIEWS: 'bxstrength_client_reviews',
  TICKETS: 'bxstrength_support_tickets',
  COACH_PERMISSIONS: 'bxstrength_coach_permissions'
};

export const DEFAULT_COACH_PERMISSIONS: CoachPermissions = {
  allowFinancials: false,        // Strict Default: Client Payments & Financials hidden from Coaches
  allowLeadPipeline: true,
  allowClientRoster: true,
  allowClassSchedules: true,
  allowWorkoutPrograms: true,
  allowNutritionPlans: true,
  allowSupportTickets: true,
  allowDirectMessaging: true,

  // Default User Dashboard Features (All Enabled by Default)
  showUserNutritionTracker: true,
  showUserWorkoutLogger: true,
  showUserBillingHistory: true,
  showUserLiveVideoCalls: true,
  showUserSelfAssessment: true,
  showUserCommunityFeed: true,
};

// Seed initial data (Strict Clean Setup: Zero dummy data loaded)
const SEED_USERS: User[] = [];

const SEED_BODY_STATS: BodyStat[] = [];
const SEED_CLASSES: ClassSchedule[] = [];
const SEED_PROGRAMS: WorkoutProgram[] = [];
const SEED_NUTRITION: NutritionPlan[] = [];
const SEED_BOOKINGS: Booking[] = [];
const SEED_SUBSCRIPTIONS: Subscription[] = [];
const SEED_ENQUIRIES: Enquiry[] = [];
const SEED_AUDIT_LOGS: AuditLog[] = [];
const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New Olympic Boxing & Heavy Bag Studio Upgrade',
    message: 'We have installed brand new high-grade Title Boxing heavy bags and speed bags at our London & India training hubs. Free sparring sessions open every Saturday at 10 AM.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    targetRole: 'all',
    priority: 'high',
    authorName: 'Shaban Faridi (Head Coach)'
  },
  {
    id: 'ann-2',
    title: 'Client Strategy Session Slot Availability',
    message: '1-on-1 performance consultation slots with Head Coach Shaban Faridi for next week are now live. Book early to lock in your strategy review.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    targetRole: 'client',
    priority: 'medium',
    authorName: 'System Admin'
  }
];

// Helper to initialize local storage
function getItem<T>(key: string, seed: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return seed;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initializing store
export function initStore() {
  const storeInitialized = localStorage.getItem('bxstrength_store_v2_initialized');
  if (!storeInitialized) {
    getItem(STORAGE_KEYS.USERS, SEED_USERS);
    getItem(STORAGE_KEYS.BODY_STATS, SEED_BODY_STATS);
    getItem(STORAGE_KEYS.CLASSES, SEED_CLASSES);
    getItem(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    getItem(STORAGE_KEYS.PROGRAMS, SEED_PROGRAMS);
    getItem(STORAGE_KEYS.NUTRITION, SEED_NUTRITION);
    getItem(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS);
    getItem(STORAGE_KEYS.ENQUIRIES, []);
    getItem(STORAGE_KEYS.REVIEWS, []);
    getItem(STORAGE_KEYS.TICKETS, []);
    getItem(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    getItem(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    localStorage.setItem('bxstrength_store_v2_initialized', 'true');
  }
}

function sanitizeStr(input: string | undefined): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Service Engine
export const VelocityAPI = {
  // --- AUTHENTICATION ---
  async login(email: string, password_hash_or_raw: string): Promise<{ user: User; token: string }> {
    initStore();

    // Rate Limiting Security Check: Max 5 attempts per email address within 15 minutes
    const attemptKey = `velocity_login_lock_${email.toLowerCase().trim()}`;
    const attemptsRaw = localStorage.getItem(attemptKey);
    if (attemptsRaw) {
      try {
        const { lockUntil } = JSON.parse(attemptsRaw);
        if (lockUntil && Date.now() < lockUntil) {
          const remainingSec = Math.ceil((lockUntil - Date.now()) / 1000);
          const remainingMin = Math.ceil(remainingSec / 60);
          throw new Error(`Security Lockout Active: Too many failed login attempts. Please wait ${remainingMin} minute(s) before trying again.`);
        }
      } catch (e: any) {
        if (e.message && e.message.includes('Security Lockout Active')) throw e;
      }
    }

    const recordFailedAttempt = () => {
      let count = 1;
      let lockUntil = 0;
      if (attemptsRaw) {
        try {
          const prev = JSON.parse(attemptsRaw);
          count = (prev.count || 0) + 1;
        } catch {
          count = 1;
        }
      }
      if (count >= 5) {
        lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
      }
      localStorage.setItem(attemptKey, JSON.stringify({ count, lockUntil }));
    };

    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: password_hash_or_raw
        })
      });

      if (res.status === 429) {
        recordFailedAttempt();
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Too many login attempts from this IP. Account security lockout active for 15 minutes.');
      }

      if (res.ok) {
        const result = await res.json();
        if (result.user) {
          localStorage.removeItem(attemptKey);
          const serverUser: User = {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            phone: result.user.phone || '',
            avatarUrl: result.user.avatar_url || result.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(result.user.name)}`,
            isVerified: true,
            status: 'active',
            createdAt: result.user.created_at || new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          setItem(STORAGE_KEYS.CURRENT_USER, serverUser);
          setItem(STORAGE_KEYS.TOKEN, result.token);
          this.addAuditLog(serverUser.id, serverUser.name, serverUser.role, 'USER_LOGIN_NEONDB', `Logged into NeonDB session`);
          return { user: serverUser, token: result.token };
        }
      } else {
        recordFailedAttempt();
        const errJson = await res.json().catch(() => ({}));
        if (errJson.error) {
          throw new Error(errJson.error);
        }
      }
    } catch (err: any) {
      if (err.message) {
        throw err;
      }
    }

    // Fallback to client store
    const users = getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No account found with this email address. You must create an account first.');
    }

    user.lastLoginAt = new Date().toISOString();
    setItem(STORAGE_KEYS.USERS, users);
    setItem(STORAGE_KEYS.CURRENT_USER, user);

    const token = `jwt_mock_${user.id}_${Date.now()}`;
    setItem(STORAGE_KEYS.TOKEN, token);
    this.addAuditLog(user.id, user.name, user.role, 'USER_LOGIN', `Logged into ${user.role.toUpperCase()} platform session`);

    return { user, token };
  },

  async register(data: { name: string; email: string; phone?: string; role?: UserRole; password?: string }): Promise<{ user: User; token: string }> {
    // Strict Security: Prevent self-assignment of 'admin' role
    const assignedRole = (data.role === 'coach' || data.role === 'user') ? data.role : 'client';

    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password || 'Velocity@123',
          phone: data.phone || '',
          role: assignedRole
        })
      });

      if (res.ok) {
        const result = await res.json();
        const serverUser: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          phone: result.user.phone || '',
          avatarUrl: result.user.avatar_url || result.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(result.user.name)}`,
          isVerified: true,
          status: 'active',
          createdAt: result.user.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        const users = getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
        const existingIdx = users.findIndex(u => u.email.toLowerCase() === serverUser.email.toLowerCase());
        if (existingIdx !== -1) {
          users[existingIdx] = serverUser;
        } else {
          users.push(serverUser);
        }
        setItem(STORAGE_KEYS.USERS, users);
        setItem(STORAGE_KEYS.CURRENT_USER, serverUser);
        setItem(STORAGE_KEYS.TOKEN, result.token);

        this.addAuditLog(serverUser.id, serverUser.name, serverUser.role, 'USER_REGISTER_NEONDB', `Registered & saved into NeonDB PostgreSQL (${serverUser.email})`);
        return { user: serverUser, token: result.token };
      } else {
        const errRes = await res.json();
        if (errRes.error) {
          throw new Error(errRes.error);
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        throw err;
      }
    }

    // Fallback to local store if backend API unavailable
    const users = getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: assignedRole,
      phone: data.phone || '',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      isVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    setItem(STORAGE_KEYS.CURRENT_USER, newUser);

    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    setItem(STORAGE_KEYS.TOKEN, token);
    this.addAuditLog(newUser.id, newUser.name, newUser.role, 'USER_REGISTER', `Registered user session ${newUser.email}`);
    return { user: newUser, token };
  },

  async loginWithGoogle(email: string, name?: string, avatarUrl?: string): Promise<{ user: User; token: string }> {
    initStore();
    const nameToUse = name || email.split('@')[0];
    
    // Try to register/login via backend API to save user in NeonDB
    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameToUse,
          email: email,
          password: `GoogleAuthPass@${email}`,
          phone: '',
          role: 'client'
        })
      });

      if (res.ok) {
        const result = await res.json();
        const serverUser: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          phone: result.user.phone || '',
          avatarUrl: avatarUrl || result.user.avatar_url || result.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToUse)}`,
          isVerified: true,
          status: 'active',
          createdAt: result.user.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        const users = getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
        const existingIdx = users.findIndex(u => u.email.toLowerCase() === serverUser.email.toLowerCase());
        if (existingIdx !== -1) {
          users[existingIdx] = serverUser;
        } else {
          users.push(serverUser);
        }
        setItem(STORAGE_KEYS.USERS, users);
        setItem(STORAGE_KEYS.CURRENT_USER, serverUser);
        setItem(STORAGE_KEYS.TOKEN, result.token);

        this.addAuditLog(serverUser.id, serverUser.name, serverUser.role, 'USER_GOOGLE_REGISTER_NEONDB', `Google user registered & saved into NeonDB (${serverUser.email})`);
        return { user: serverUser, token: result.token };
      } else {
        // If user already exists in NeonDB, attempt backend login
        const loginRes = await fetch(getApiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: `GoogleAuthPass@${email}`
          })
        });

        if (loginRes.ok) {
          const loginResult = await loginRes.json();
          const serverUser: User = {
            id: loginResult.user.id,
            name: loginResult.user.name,
            email: loginResult.user.email,
            role: loginResult.user.role,
            phone: loginResult.user.phone || '',
            avatarUrl: avatarUrl || loginResult.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToUse)}`,
            isVerified: true,
            status: 'active',
            createdAt: loginResult.user.created_at || new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          setItem(STORAGE_KEYS.CURRENT_USER, serverUser);
          setItem(STORAGE_KEYS.TOKEN, loginResult.token);
          this.addAuditLog(serverUser.id, serverUser.name, serverUser.role, 'USER_GOOGLE_LOGIN_NEONDB', `Google user logged in from NeonDB (${serverUser.email})`);
          return { user: serverUser, token: loginResult.token };
        }
      }
    } catch (err: any) {
      console.warn('Backend Google SSO sync notice:', err);
    }

    // Fallback to local storage if backend is unreachable
    const users = this.getUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      found = {
        id: `user-google-${Date.now()}`,
        name: nameToUse,
        email: email,
        role: 'client',
        phone: '',
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToUse)}`,
        isVerified: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      users.push(found);
      setItem(STORAGE_KEYS.USERS, users);
    } else {
      found.lastLoginAt = new Date().toISOString();
      if (avatarUrl) found.avatarUrl = avatarUrl;
      setItem(STORAGE_KEYS.USERS, users);
    }

    setItem(STORAGE_KEYS.CURRENT_USER, found);
    const token = `jwt_google_${found.id}_${Date.now()}`;
    setItem(STORAGE_KEYS.TOKEN, token);
    this.addAuditLog(found.id, found.name, found.role, 'USER_LOGIN_GOOGLE', `Authenticated via Google Single Sign-On (${email})`);
    return { user: found, token };
  },

  getCurrentUser(): User | null {
    initStore();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as User;
      // Sync with latest users store by ID or email to ensure manually updated roles take effect immediately
      const users = this.getUsers();
      const latest = users.find(u => u.id === parsed.id || u.email.toLowerCase() === parsed.email.toLowerCase());
      if (latest) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(latest));
        return latest;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.addAuditLog(user.id, user.name, user.role, 'USER_LOGOUT', 'Logged out of session');
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // --- USERS MANAGEMENT (CRM) ---
  getUsers(): User[] {
    initStore();
    return getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  },

  async createUser(userData: Partial<User> & { name: string; email: string; role: UserRole }): Promise<User> {
    const users = this.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      phone: userData.phone || '',
      age: userData.age || 25,
      gender: userData.gender || 'Other',
      fitnessGoals: userData.fitnessGoals || '',
      isVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);

    try {
      const token = getItem<string>(STORAGE_KEYS.TOKEN, '');
      await fetch(getApiUrl('/api/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(userData)
      });
    } catch (err: any) {
      console.error('NeonDB Create User Error:', err.message);
    }

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.addAuditLog(currentUser.id, currentUser.name, currentUser.role, 'CREATE_USER', `Created user ${newUser.name} (${newUser.email}) as ${newUser.role}`);
    }
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    initStore();
    const users = this.getUsers();
    const current = this.getCurrentUser();

    // Match by ID or by current email
    let idx = users.findIndex((u) => u.id === id || (current && u.email.toLowerCase() === current.email.toLowerCase()));

    let targetUser: User;

    if (idx !== -1) {
      targetUser = { ...users[idx], ...updates };
      users[idx] = targetUser;
    } else {
      // If user came from NeonDB or Google OAuth, create entry in users list
      targetUser = {
        id: id,
        name: updates.name || current?.name || 'User',
        email: updates.email || current?.email || '',
        role: updates.role || current?.role || 'client',
        isVerified: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        ...updates
      };
      users.push(targetUser);
    }

    setItem(STORAGE_KEYS.USERS, users);

    // If logged-in user updated their own profile
    if (current && (current.id === id || current.email.toLowerCase() === targetUser.email.toLowerCase())) {
      setItem(STORAGE_KEYS.CURRENT_USER, targetUser);
    }

    // Real-Time NeonDB Database Sync via REST API
    try {
      const token = getItem<string>(STORAGE_KEYS.TOKEN, '');
      await fetch(getApiUrl(`/api/users/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
    } catch (err: any) {
      console.error('NeonDB Update User Error:', err.message);
    }

    this.addAuditLog(
      current?.id || targetUser.id, 
      current?.name || targetUser.name, 
      current?.role || targetUser.role, 
      'UPDATE_USER_PROFILE', 
      `Updated user profile details for ${targetUser.name}`
    );

    return targetUser;
  },

  resetPassword(email: string, newPassword: string): boolean {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      users[idx].password_or_hash = newPassword;
      setItem(STORAGE_KEYS.USERS, users);
      this.addAuditLog(users[idx].id, users[idx].name, users[idx].role, 'PASSWORD_RESET_SUCCESS', `Password successfully reset for account ${email}`);
      return true;
    }
    return true; // Return true to avoid user enumeration leaking
  },

  async deleteUser(id: string): Promise<void> {
    let users = this.getUsers();
    const target = users.find((u) => u.id === id);
    users = users.filter((u) => u.id !== id);
    setItem(STORAGE_KEYS.USERS, users);

    try {
      const token = getItem<string>(STORAGE_KEYS.TOKEN, '');
      await fetch(getApiUrl(`/api/users/${id}`), {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err: any) {
      console.error('NeonDB Delete User Error:', err.message);
    }

    const current = this.getCurrentUser();
    if (current && target) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_USER', `Deleted user account ${target.name} (${target.email})`);
    }
  },

  async toggleVerifyUser(id: string): Promise<User> {
    const user = this.getUsers().find((u) => u.id === id);
    const isVerified = user ? !user.isVerified : true;
    return await this.updateUser(id, { isVerified });
  },

  // --- BODY STATS & BMI ---
  getBodyStats(userId: string): BodyStat[] {
    initStore();
    const stats = getItem<BodyStat[]>(STORAGE_KEYS.BODY_STATS, SEED_BODY_STATS);
    return stats.filter((s) => s.userId === userId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  addBodyStat(stat: Omit<BodyStat, 'id' | 'bmi' | 'bmiCategory'>): BodyStat {
    const stats = getItem<BodyStat[]>(STORAGE_KEYS.BODY_STATS, SEED_BODY_STATS);

    // Calculate BMI = weight (kg) / (height (m) ^ 2)
    const heightM = stat.heightCm / 100;
    const bmiCalc = Number((stat.weightKg / (heightM * heightM)).toFixed(1));

    let category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' = 'Normal';
    if (bmiCalc < 18.5) category = 'Underweight';
    else if (bmiCalc >= 18.5 && bmiCalc <= 24.9) category = 'Normal';
    else if (bmiCalc >= 25.0 && bmiCalc <= 29.9) category = 'Overweight';
    else category = 'Obese';

    const newStat: BodyStat = {
      ...stat,
      id: `stat-${Date.now()}`,
      bmi: bmiCalc,
      bmiCategory: category
    };

    stats.push(newStat);
    setItem(STORAGE_KEYS.BODY_STATS, stats);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'LOG_BODY_STAT', `Logged body weight ${stat.weightKg}kg, BMI ${bmiCalc} (${category})`);
    }

    return newStat;
  },

  // --- CLASSES & SCHEDULE ---
  getClasses(): ClassSchedule[] {
    initStore();
    return getItem<ClassSchedule[]>(STORAGE_KEYS.CLASSES, SEED_CLASSES);
  },

  saveClass(clsData: Partial<ClassSchedule> & { title: string; category: any; trainerName: string; dayOfWeek: any; startTime: string; endTime: string; room: string; maxCapacity: number }): ClassSchedule {
    const classes = this.getClasses();
    if (clsData.id) {
      const idx = classes.findIndex((c) => c.id === clsData.id);
      if (idx !== -1) {
        classes[idx] = { ...classes[idx], ...clsData };
        setItem(STORAGE_KEYS.CLASSES, classes);
        return classes[idx];
      }
    }

    const newCls: ClassSchedule = {
      id: `cls-${Date.now()}`,
      title: clsData.title,
      category: clsData.category,
      trainerId: clsData.trainerId || 'user-coach-1',
      trainerName: clsData.trainerName,
      dayOfWeek: clsData.dayOfWeek,
      startTime: clsData.startTime,
      endTime: clsData.endTime,
      room: clsData.room,
      maxCapacity: clsData.maxCapacity || 20,
      bookedCount: clsData.bookedCount || 0,
      price: clsData.price || 25
    };
    classes.push(newCls);
    setItem(STORAGE_KEYS.CLASSES, classes);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'SAVE_CLASS', `Created/Updated fitness class "${newCls.title}" scheduled for ${newCls.dayOfWeek}`);
    }

    return newCls;
  },

  deleteClass(id: string): void {
    let classes = this.getClasses();
    const target = classes.find((c) => c.id === id);
    classes = classes.filter((c) => c.id !== id);
    setItem(STORAGE_KEYS.CLASSES, classes);

    const current = this.getCurrentUser();
    if (current && target) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_CLASS', `Removed class schedule "${target.title}"`);
    }
  },

  // --- BOOKINGS ---
  getBookings(userId?: string): Booking[] {
    initStore();
    const bookings = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    if (userId) return bookings.filter((b) => b.userId === userId);
    return bookings;
  },

  bookClass(userId: string, classId: string): Booking {
    const classes = this.getClasses();
    const cls = classes.find((c) => c.id === classId);
    if (!cls) throw new Error('Class not found');

    if (cls.bookedCount >= cls.maxCapacity) {
      throw new Error('This class is fully booked!');
    }

    const user = this.getUsers().find((u) => u.id === userId) || this.getCurrentUser();
    if (!user) throw new Error('User account not found');

    const bookings = this.getBookings();
    const existing = bookings.find((b) => b.userId === userId && b.classId === classId && b.status === 'Confirmed');
    if (existing) {
      throw new Error('You are already booked for this class session!');
    }

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      classId: cls.id,
      className: cls.title,
      trainerName: cls.trainerName,
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: `${cls.startTime} - ${cls.endTime}`,
      status: 'Confirmed',
      bookingCode: `VEL-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    setItem(STORAGE_KEYS.BOOKINGS, bookings);

    // Increment class booked count
    cls.bookedCount += 1;
    setItem(STORAGE_KEYS.CLASSES, classes);

    this.addAuditLog(user.id, user.name, user.role, 'BOOK_CLASS', `Booked class session "${cls.title}" (Code: ${newBooking.bookingCode})`);

    return newBooking;
  },

  cancelBooking(bookingId: string): void {
    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx].status = 'Cancelled';
      setItem(STORAGE_KEYS.BOOKINGS, bookings);

      // Decrement class count
      const classes = this.getClasses();
      const cls = classes.find((c) => c.id === bookings[idx].classId);
      if (cls && cls.bookedCount > 0) {
        cls.bookedCount -= 1;
        setItem(STORAGE_KEYS.CLASSES, classes);
      }

      const current = this.getCurrentUser();
      if (current) {
        this.addAuditLog(current.id, current.name, current.role, 'CANCEL_BOOKING', `Cancelled booking code ${bookings[idx].bookingCode}`);
      }
    }
  },

  // --- WORKOUT PROGRAMS ---
  getPrograms(assignedUserId?: string): WorkoutProgram[] {
    initStore();
    const progs = getItem<WorkoutProgram[]>(STORAGE_KEYS.PROGRAMS, SEED_PROGRAMS);
    if (assignedUserId) return progs.filter((p) => p.assignedToUserId === assignedUserId || !p.assignedToUserId);
    return progs;
  },

  saveProgram(progData: Partial<WorkoutProgram> & { title: string; exercises: any[] }): WorkoutProgram {
    const progs = this.getPrograms();
    if (progData.id) {
      const idx = progs.findIndex((p) => p.id === progData.id);
      if (idx !== -1) {
        progs[idx] = { ...progs[idx], ...progData };
        setItem(STORAGE_KEYS.PROGRAMS, progs);
        return progs[idx];
      }
    }

    const current = this.getCurrentUser();
    const newProg: WorkoutProgram = {
      id: `prog-${Date.now()}`,
      title: progData.title,
      description: progData.description || '',
      level: progData.level || 'Intermediate',
      durationWeeks: progData.durationWeeks || 4,
      assignedToUserId: progData.assignedToUserId,
      assignedToUserName: progData.assignedToUserName,
      createdBy: current ? current.name : 'Admin Coach',
      createdAt: new Date().toISOString(),
      exercises: progData.exercises
    };

    progs.push(newProg);
    setItem(STORAGE_KEYS.PROGRAMS, progs);

    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'SAVE_WORKOUT_PROGRAM', `Created/Assigned workout program "${newProg.title}"`);
    }

    return newProg;
  },

  deleteProgram(id: string): void {
    let progs = this.getPrograms();
    progs = progs.filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PROGRAMS, progs);
  },

  // --- NUTRITION PLANS ---
  getNutritionPlans(assignedUserId?: string): NutritionPlan[] {
    initStore();
    const plans = getItem<NutritionPlan[]>(STORAGE_KEYS.NUTRITION, SEED_NUTRITION);
    if (assignedUserId) return plans.filter((p) => p.assignedToUserId === assignedUserId || !p.assignedToUserId);
    return plans;
  },

  saveNutritionPlan(planData: Partial<NutritionPlan> & { title: string; dailyCalories: number; meals: any[] }): NutritionPlan {
    const plans = this.getNutritionPlans();
    if (planData.id) {
      const idx = plans.findIndex((p) => p.id === planData.id);
      if (idx !== -1) {
        plans[idx] = { ...plans[idx], ...planData, updatedAt: new Date().toISOString() };
        setItem(STORAGE_KEYS.NUTRITION, plans);
        return plans[idx];
      }
    }

    const current = this.getCurrentUser();
    const newPlan: NutritionPlan = {
      id: `nut-${Date.now()}`,
      title: planData.title,
      assignedToUserId: planData.assignedToUserId,
      assignedToUserName: planData.assignedToUserName,
      dailyCalories: planData.dailyCalories,
      targetProteinG: planData.targetProteinG || 150,
      targetCarbsG: planData.targetCarbsG || 200,
      targetFatG: planData.targetFatG || 65,
      meals: planData.meals,
      createdBy: current ? current.name : 'Head Nutritionist',
      updatedAt: new Date().toISOString()
    };

    plans.push(newPlan);
    setItem(STORAGE_KEYS.NUTRITION, plans);

    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'SAVE_NUTRITION_PLAN', `Saved diet plan "${newPlan.title}" (${newPlan.dailyCalories} kcal/day)`);
    }

    return newPlan;
  },

  // --- SUBSCRIPTIONS ---
  getSubscriptions(): Subscription[] {
    initStore();
    return getItem<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS);
  },

  createSubscription(subData: Partial<Subscription> & {
    userId: string;
    planName: string;
    price: number;
    billingCycle?: 'monthly' | 'quarterly' | 'annual' | 'yearly';
  }): Subscription {
    const users = this.getUsers();
    const targetUser = users.find((u) => u.id === subData.userId);
    const userName = targetUser ? targetUser.name : (subData.userName || 'Client Athlete');
    const userEmail = targetUser ? targetUser.email : (subData.userEmail || 'client@domain.com');

    const subs = this.getSubscriptions();
    const nextDate = subData.nextBillingDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const newSub: Subscription = {
      id: subData.id || `sub-${Date.now()}`,
      userId: subData.userId,
      userName: userName,
      userEmail: userEmail,
      planName: subData.planName as any,
      billingCycle: subData.billingCycle || 'monthly',
      price: Number(subData.price),
      startDate: subData.startDate || new Date().toISOString().split('T')[0],
      nextBillingDate: nextDate,
      expiryDate: subData.expiryDate,
      status: subData.status || 'active',
      autoRenew: subData.autoRenew ?? true,
      serviceType: subData.serviceType,
      customExercises: subData.customExercises
    };

    subs.unshift(newSub);
    setItem(STORAGE_KEYS.SUBSCRIPTIONS, subs);

    fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub)
    }).catch(() => {});

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'CREATE_SUBSCRIPTION', `Created subscription "${newSub.planName}" for ${userName}`);
    }

    return newSub;
  },

  updateSubscriptionStatus(id: string, status: 'active' | 'past_due' | 'cancelled'): Subscription {
    const subs = this.getSubscriptions();
    const idx = subs.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Subscription not found');

    subs[idx].status = status;
    setItem(STORAGE_KEYS.SUBSCRIPTIONS, subs);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'UPDATE_SUBSCRIPTION', `Set subscription status for ${subs[idx].userName} to ${status.toUpperCase()}`);
    }

    return subs[idx];
  },

  // --- ENQUIRIES & CONTACT MESSAGES ---
  getEnquiries(emailOrUserId?: string): Enquiry[] {
    initStore();
    const raw = getItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const clean = raw.filter(e => e.id !== 'enq-1' && e.id !== 'enq-2');
    if (clean.length !== raw.length) {
      setItem(STORAGE_KEYS.ENQUIRIES, clean);
    }
    if (emailOrUserId) {
      const search = emailOrUserId.toLowerCase();
      return clean.filter((e) => e.email.toLowerCase() === search || e.id === search);
    }
    return clean;
  },

  createEnquiry(data: { name: string; email: string; phone?: string; subject: string; message: string }): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnq: Enquiry = {
      id: `enq-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    enquiries.unshift(newEnq);
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    return newEnq;
  },

  updateEnquiryStatus(id: string, status: 'new' | 'in_progress' | 'resolved', notes?: string): Enquiry {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Enquiry not found');

    enquiries[idx].status = status;
    if (notes !== undefined) enquiries[idx].assignedNotes = notes;
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'UPDATE_ENQUIRY', `Marked enquiry from ${enquiries[idx].name} as ${status.toUpperCase()}`);
    }

    return enquiries[idx];
  },

  updateEnquiryCoach(id: string, coachName: string): Enquiry {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Enquiry not found');

    enquiries[idx].assignedCoach = coachName;
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'ASSIGN_ENQUIRY_COACH', `Assigned enquiry from ${enquiries[idx].name} to Coach ${coachName}`);
    }

    return enquiries[idx];
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    initStore();
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  },

  addAuditLog(userId: string, userName: string, userRole: UserRole, action: string, details: string): void {
    initStore();
    const logs = getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action,
      details,
      ipAddress: '127.0.0.1 (Verified SSL Session)'
    };
    logs.unshift(newLog);
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // retain last 100 logs
  },

  // --- ANNOUNCEMENTS ---
  getAnnouncements(): Announcement[] {
    initStore();
    return getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
  },

  createAnnouncement(title: string, message: string, targetRole: 'all' | 'client' | 'coach' | 'staff' = 'all', priority: 'low' | 'medium' | 'high' = 'medium'): Announcement {
    const announcements = this.getAnnouncements();
    const current = this.getCurrentUser();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      createdAt: new Date().toISOString(),
      targetRole,
      priority,
      authorName: current ? `${current.name} (${current.role.toUpperCase()})` : 'System Admin'
    };
    announcements.unshift(newAnn);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);

    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'CREATE_ANNOUNCEMENT', `Broadcast announcement: "${title}"`);
    }

    return newAnn;
  },

  updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement {
    const ann = this.getAnnouncements();
    const idx = ann.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Announcement not found');
    ann[idx] = { ...ann[idx], ...updates };
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, ann);
    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'UPDATE_ANNOUNCEMENT', `Updated announcement "${ann[idx].title}"`);
    }
    return ann[idx];
  },

  deleteAnnouncement(id: string): void {
    let ann = this.getAnnouncements();
    const target = ann.find((a) => a.id === id);
    ann = ann.filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, ann);
    const current = this.getCurrentUser();
    if (current && target) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_ANNOUNCEMENT', `Deleted announcement "${target.title}"`);
    }
  },

  deleteNutritionPlan(id: string): void {
    let plans = this.getNutritionPlans();
    plans = plans.filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.NUTRITION, plans);
    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_NUTRITION_PLAN', `Deleted diet plan ${id}`);
    }
  },

  deleteSubscription(id: string): void {
    let subs = this.getSubscriptions();
    const target = subs.find((s) => s.id === id);
    subs = subs.filter((s) => s.id !== id);
    setItem(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    const current = this.getCurrentUser();
    if (current && target) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_SUBSCRIPTION', `Deleted subscription for ${target.userName}`);
    }
  },

  deleteEnquiry(id: string): void {
    let enquiries = this.getEnquiries();
    const target = enquiries.find((e) => e.id === id);
    enquiries = enquiries.filter((e) => e.id !== id);
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    const current = this.getCurrentUser();
    if (current && target) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_ENQUIRY', `Deleted enquiry from ${target.name}`);
    }
  },

  clearAuditLogs(): void {
    setItem(STORAGE_KEYS.AUDIT_LOGS, []);
    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'CLEAR_AUDIT_LOGS', 'Cleared all audit log records to free up database storage');
    }
  },

  assignClientBooking(classId: string, clientId: string): Booking {
    const users = this.getUsers();
    const client = users.find((u) => u.id === clientId);
    if (!client) throw new Error('Selected client not found');

    const classes = this.getClasses();
    const cls = classes.find((c) => c.id === classId);
    if (!cls) throw new Error('Selected class not found');

    const bookings = this.getBookings();
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      userId: client.id,
      userName: client.name,
      userEmail: client.email,
      classId: cls.id,
      className: cls.title,
      trainerName: cls.trainerName,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: `${cls.startTime} - ${cls.endTime}`,
      status: 'Confirmed',
      bookingCode: `VEL-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    setItem(STORAGE_KEYS.BOOKINGS, bookings);

    cls.bookedCount += 1;
    setItem(STORAGE_KEYS.CLASSES, classes);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'ADMIN_ASSIGN_BOOKING', `Assigned client ${client.name} to class "${cls.title}"`);
    }

    return newBooking;
  },

  // --- BLOG POSTS ENGINE ---
  getBlogPosts(): BlogPost[] {
    initStore();
    return getItem<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, []);
  },

  addBlogPost(postData: Omit<BlogPost, 'id' | 'date'>): BlogPost {
    initStore();
    const existing = this.getBlogPosts();
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      category: postData.category || 'Mind & Body',
      author: postData.author || 'Anonymous Client',
      date: new Date().toISOString().split('T')[0],
      image: postData.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      readTime: postData.readTime || '3 min read'
    };

    existing.unshift(newPost);
    setItem(STORAGE_KEYS.BLOG_POSTS, existing);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'PUBLISH_BLOG_POST', `Published short blog: "${newPost.title}"`);
    }

    return newPost;
  },

  // --- CLIENT REVIEWS ENGINE ---
  getReviews(): Testimonial[] {
    initStore();
    const raw = getItem<Testimonial[]>(STORAGE_KEYS.REVIEWS, []);
    const clean = raw.filter(r => r.id !== 'rev-1' && r.id !== 'rev-2' && r.id !== 'rev-3');
    if (clean.length !== raw.length) {
      setItem(STORAGE_KEYS.REVIEWS, clean);
    }
    return clean;
  },

  addReview(reviewData: { name: string; role?: string; rating: number; comment: string; avatar?: string }): Testimonial {
    initStore();
    const existing = this.getReviews();
    const cleanName = reviewData.name.trim();
    const newReview: Testimonial = {
      id: `rev-${Date.now()}`,
      name: cleanName,
      role: reviewData.role?.trim() || 'BxStrength Athlete',
      rating: Math.min(5, Math.max(1, reviewData.rating || 5)),
      comment: reviewData.comment.trim(),
      avatar: reviewData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`
    };

    existing.unshift(newReview);
    setItem(STORAGE_KEYS.REVIEWS, existing);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'PUBLISH_REVIEW', `Published client review: "${newReview.comment.substring(0, 40)}..."`);
    }

    return newReview;
  },

  // --- REAL-TIME SUPPORT TICKETS ENGINE ---
  getTickets(userId?: string): SupportTicket[] {
    initStore();
    const raw = getItem<SupportTicket[]>(STORAGE_KEYS.TICKETS, []);
    // Purge legacy mock seed tickets from user browser localStorage
    const clean = raw.filter(t => t.id !== 'TICKET-849201' && t.id !== 'TICKET-739104');
    if (clean.length !== raw.length) {
      setItem(STORAGE_KEYS.TICKETS, clean);
    }
    if (userId) {
      return clean.filter(t => t.userId === userId || t.userEmail.toLowerCase() === userId.toLowerCase());
    }
    return clean;
  },

  deleteTicket(ticketId: string): boolean {
    initStore();
    const tickets = this.getTickets();
    const filtered = tickets.filter(t => t.id !== ticketId);
    setItem(STORAGE_KEYS.TICKETS, filtered);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'DELETE_SUPPORT_TICKET', `Deleted support ticket #${ticketId}`);
    }

    return true;
  },

  createTicket(data: { userId: string; userName: string; userEmail: string; subject: string; category?: TicketCategory; priority?: TicketPriority; description: string }): SupportTicket {
    initStore();
    const tickets = this.getTickets();
    const ticketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: SupportTicket = {
      id: ticketId,
      userId: data.userId,
      userName: data.userName.trim(),
      userEmail: data.userEmail.trim().toLowerCase(),
      subject: data.subject.trim(),
      category: data.category || 'General',
      priority: data.priority || 'medium',
      description: data.description.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tickets.unshift(newTicket);
    setItem(STORAGE_KEYS.TICKETS, tickets);

    const current = this.getCurrentUser();
    if (current) {
      this.addAuditLog(current.id, current.name, current.role, 'RAISE_SUPPORT_TICKET', `Raised ticket #${ticketId}: "${newTicket.subject}"`);
    }

    return newTicket;
  },

  updateTicketStatus(ticketId: string, status: TicketStatus, adminResponse?: string): SupportTicket | null {
    initStore();
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx !== -1) {
      tickets[idx].status = status;
      if (adminResponse !== undefined) {
        tickets[idx].adminResponse = adminResponse.trim();
      }
      tickets[idx].updatedAt = new Date().toISOString();
      setItem(STORAGE_KEYS.TICKETS, tickets);
      return tickets[idx];
    }
    return null;
  },

  // --- COACH PERMISSIONS MANAGEMENT ---
  getCoachPermissions(): CoachPermissions {
    initStore();
    return getItem<CoachPermissions>(STORAGE_KEYS.COACH_PERMISSIONS, DEFAULT_COACH_PERMISSIONS);
  },

  saveCoachPermissions(newPerms: Partial<CoachPermissions>): CoachPermissions {
    initStore();
    const currentPerms = this.getCoachPermissions();
    const updated = { ...currentPerms, ...newPerms };
    setItem(STORAGE_KEYS.COACH_PERMISSIONS, updated);

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.addAuditLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        'UPDATE_COACH_PERMISSIONS',
        `Admin updated Coach Tab Access: Financials: ${updated.allowFinancials ? 'ALLOWED' : 'RESTRICTED'}`
      );
    }
    return updated;
  },

  // --- REAL-TIME TRAINERS / COACH CARDS API ---
  async getTrainersAsync(): Promise<BxTrainer[]> {
    return TRAINERS_DATA;
  },

  async addTrainerAsync(trainerData: Partial<BxTrainer>): Promise<{ success: boolean; data?: BxTrainer; error?: string }> {
    const newTrainer: BxTrainer = {
      id: `coach-${Date.now()}`,
      name: trainerData.name || 'New Coach',
      role: trainerData.role || 'Senior Coach',
      coachPosition: trainerData.coachPosition || 'SENIOR COACH',
      headline: trainerData.headline || `${trainerData.coachPosition || 'SENIOR COACH'} | ${trainerData.role || 'COACH'}`,
      image: trainerData.image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
      bio: trainerData.bio || 'Certified Fitness Professional',
      secondaryBio: trainerData.secondaryBio || '',
      specialties: trainerData.specialties || ['Strength & Conditioning'],
      experienceYears: Number(trainerData.experienceYears) || 5,
      clientsServed: Number(trainerData.clientsServed) || 1000,
      rating: Number(trainerData.rating) || 5.0,
      languages: trainerData.languages || ['English'],
      availability: trainerData.availability || 'Mon - Sat (Flexible)',
      certification: trainerData.certification || 'UK Certified Master Coach',
      certifications: trainerData.certifications || ['UK Certified Master Coach'],
      achievements: trainerData.achievements || ['Verified UK Master Coach'],
      galleryPhotos: trainerData.galleryPhotos || [],
      galleryVideos: trainerData.galleryVideos || [],
      socials: trainerData.socials || { instagram: '#', linkedin: '#' }
    };

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const res = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(trainerData)
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const currentLocal: BxTrainer[] = JSON.parse(localStorage.getItem('bxstrength_trainers_local_store') || '[]');
        localStorage.setItem('bxstrength_trainers_local_store', JSON.stringify([json.data, ...currentLocal]));
        return { success: true, data: json.data };
      }
    } catch (err: any) {
      console.warn('Backend add trainer notice, saving to local store:', err.message);
    }

    // Fallback sync to local storage
    const currentLocal: BxTrainer[] = JSON.parse(localStorage.getItem('bxstrength_trainers_local_store') || '[]');
    const updatedLocal = [newTrainer, ...currentLocal];
    localStorage.setItem('bxstrength_trainers_local_store', JSON.stringify(updatedLocal));
    return { success: true, data: newTrainer };
  },

  async updateTrainerAsync(id: string, trainerData: Partial<BxTrainer>): Promise<{ success: boolean; data?: BxTrainer; error?: string }> {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const res = await fetch(`/api/trainers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(trainerData)
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const currentLocal: BxTrainer[] = JSON.parse(localStorage.getItem('bxstrength_trainers_local_store') || '[]');
        const idx = currentLocal.findIndex(t => t.id === id);
        if (idx !== -1) currentLocal[idx] = json.data;
        else currentLocal.unshift(json.data);
        localStorage.setItem('bxstrength_trainers_local_store', JSON.stringify(currentLocal));
        return { success: true, data: json.data };
      }
    } catch (err: any) {
      console.warn('Backend update trainer notice, syncing local store:', err.message);
    }

    const currentLocal: BxTrainer[] = JSON.parse(localStorage.getItem('bxstrength_trainers_local_store') || '[]');
    const idx = currentLocal.findIndex(t => t.id === id);
    const updated = { ...(currentLocal[idx] || {}), ...trainerData, id } as BxTrainer;
    if (idx !== -1) currentLocal[idx] = updated;
    else currentLocal.unshift(updated);
    localStorage.setItem('bxstrength_trainers_local_store', JSON.stringify(currentLocal));
    return { success: true, data: updated };
  },

  async deleteTrainerAsync(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      await fetch(`/api/trainers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
    } catch (err: any) {
      console.warn('Backend delete trainer notice, removing from local store:', err.message);
    }

    const currentLocal: BxTrainer[] = JSON.parse(localStorage.getItem('bxstrength_trainers_local_store') || '[]');
    const filtered = currentLocal.filter(t => t.id !== id);
    localStorage.setItem('bxstrength_trainers_local_store', JSON.stringify(filtered));
    return { success: true };
  }
};
