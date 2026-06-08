import { createContext, useContext, useState, useCallback } from 'react';

/* ── Dummy credentials ──────────────────────────────────────────── */
const VALID_CREDENTIALS = {
  userId: 'keralapsclogin@gmail.com',
  password: 'Keralapsc#2026',
  profile: {
    name: 'Arjun Krishnan',
    registrationNo: 'OTR-2024-KL-087642',
    dob: '15-Aug-1998',
    category: 'OBC-NCL',
    district: 'Thiruvananthapuram',
    mobile: '9876543210',
    email: 'keralapsclogin@gmail.com',
    profilePic: null,
    lastLogin: '08-Jun-2026, 10:32 AM',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  const login = useCallback(async ({ userId, password }) => {
    setLoginError('');
    await new Promise(r => setTimeout(r, 1800)); // simulate network
    if (
      userId.trim() === VALID_CREDENTIALS.userId &&
      password === VALID_CREDENTIALS.password
    ) {
      setUser(VALID_CREDENTIALS.profile);
      return { success: true };
    } else {
      const msg = 'Invalid User ID or Password. Please check your credentials.';
      setLoginError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setLoginError('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
