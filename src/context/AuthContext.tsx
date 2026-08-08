import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { VelocityAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password_or_hash: string) => Promise<User>;
  loginWithGoogle: (email?: string, name?: string, avatarUrl?: string) => Promise<User>;
  register: (name: string, email: string, phone?: string, role?: UserRole, password?: string) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  verifyEmail: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const syncUser = () => {
    const currentUser = VelocityAPI.getCurrentUser();
    const storedToken = localStorage.getItem('velocity_jwt_token');
    if (currentUser) {
      setUser(currentUser);
      setToken(storedToken || `jwt_${currentUser.id}`);
    } else {
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    // Check current logged in user from store on boot
    syncUser();

    // Listen to storage events and poll every 2 seconds for manual role updates
    const handleStorageChange = () => syncUser();
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(syncUser, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = async (email: string, password_or_hash: string): Promise<User> => {
    const res = await VelocityAPI.login(email, password_or_hash);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const loginWithGoogle = async (email?: string, name?: string, avatarUrl?: string): Promise<User> => {
    const res = VelocityAPI.loginWithGoogle(email, name, avatarUrl);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const register = async (name: string, email: string, phone?: string, role?: UserRole, password?: string): Promise<User> => {
    const res = await VelocityAPI.register({ name, email, phone, role, password });
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const logout = () => {
    VelocityAPI.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await VelocityAPI.updateUser(user.id, updates);
    setUser(updated);
    return updated;
  };

  const verifyEmail = async () => {
    if (user && !user.isVerified) {
      const updated = await VelocityAPI.updateUser(user.id, { isVerified: true });
      setUser(updated);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate sending password reset email
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = VelocityAPI.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      VelocityAPI.addAuditLog(found.id, found.name, found.role, 'PASSWORD_RESET_REQUEST', `Password reset token link sent to ${email}`);
      return true;
    }
    return false;
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return VelocityAPI.resetPassword(email, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        token,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        verifyEmail,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
