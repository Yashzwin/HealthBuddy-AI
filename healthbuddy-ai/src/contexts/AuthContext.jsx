import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const createGuestUser = () => {
  const guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: guestId,
    name: 'Guest User',
    email: `${guestId}@healthbuddy.local`,
    role: 'guest',
  };
};

const makeUser = (email, role = 'user', name = '') => ({
  id: role === 'admin' ? 'admin-user' : `user-${(email || 'local').toLowerCase()}`,
  name: role === 'admin' ? 'Admin' : name?.trim() || email?.split('@')?.[0] || 'HealthBuddy User',
  email: email || 'local@healthbuddy.local',
  role,
});

function readStoredUser() {
  try {
    const raw = localStorage.getItem('healthbuddy_session_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalProfile(user) {
  if (!user) return;
  try {
    const profiles = JSON.parse(localStorage.getItem('healthbuddy_local_profiles') || '[]');
    const nextProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastActiveDate: new Date().toISOString(),
    };
    const filtered = profiles.filter((profile) => profile.id !== user.id);
    localStorage.setItem('healthbuddy_local_profiles', JSON.stringify([nextProfile, ...filtered].slice(0, 50)));
  } catch {
    // localStorage may be unavailable in some private browser modes.
  }
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredUser();
    setCurrentUser(stored);
    saveLocalProfile(stored);
    setInitialLoading(false);
  }, []);

  const login = async (email = '', password = '') => {
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = normalizedEmail === 'yashversemusic@gmail.com' && password === 'admin10$$';
    const user = isAdmin ? makeUser(normalizedEmail, 'admin') : makeUser(normalizedEmail, 'user');
    localStorage.setItem('healthbuddy_session_user', JSON.stringify(user));
    saveLocalProfile(user);
    setCurrentUser(user);
    return { record: user };
  };

  const guestLogin = async () => {
    const guestUser = createGuestUser();
    localStorage.setItem('healthbuddy_session_user', JSON.stringify(guestUser));
    saveLocalProfile(guestUser);
    setCurrentUser(guestUser);
    return { record: guestUser };
  };

  const signup = async (email = '', password = '', passwordConfirm = '', name = '') => {
    const user = makeUser(email, 'user', name);
    localStorage.setItem('healthbuddy_session_user', JSON.stringify(user));
    saveLocalProfile(user);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('healthbuddy_session_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    guestLogin,
    signup,
    logout,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'admin',
    initialLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
