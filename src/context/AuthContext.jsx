import { createContext, useContext, useState, useCallback } from 'react';

/* ── Storage key ─────────────────────────────────────────────────── */
const STORAGE_KEY = 'kpsc_auth_user';

/* ── Dummy credentials ───────────────────────────────────────────── */
const VALID_CREDENTIALS = {
  userId: 'keralapsclogin@gmail.com',
  password: 'Keralapsc#2026',
  profile: {
    name: 'Edison Biju',
    designation: 'Developer',
    registrationNo: 'OTR-2024-KL-087642',
    dob: '15-Aug-1998',
    category: 'OBC-NCL',
    district: 'Thiruvananthapuram',
    mobile: '9876543210',
    email: 'keralapsclogin@gmail.com',
    profilePic: null,
    lastLogin: new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
  },
};

/* ── Helpers ─────────────────────────────────────────────────────── */
function readPersistedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable */ }
}

/* ── Context ─────────────────────────────────────────────────────── */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage so refresh keeps the session alive
  const [user, setUser] = useState(() => readPersistedUser());
  const [loginError, setLoginError] = useState('');

  const login = useCallback(async ({ userId, password }) => {
    setLoginError('');
    await new Promise(r => setTimeout(r, 1800)); // simulate network

    if (
      userId.trim() === VALID_CREDENTIALS.userId &&
      password        === VALID_CREDENTIALS.password
    ) {
      const profile = VALID_CREDENTIALS.profile;
      setUser(profile);
      persistUser(profile);           // ← save to localStorage
      return { success: true };
    } else {
      const msg = 'Invalid User ID or Password. Please check your credentials.';
      setLoginError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);                // ← clear localStorage
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
