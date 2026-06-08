import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User, Lock, ShieldCheck, Eye, EyeOff, RefreshCw,
  Phone, LogIn, KeyRound, Smartphone, CheckCircle2,
  ArrowRight, X, AlertCircle
} from 'lucide-react';

/* ── Captcha generator ─────────────────────────────────────────── */
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateCaptcha(len = 5) {
  return Array.from({ length: len }, () =>
    CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]
  ).join('');
}

/* ── OTP countdown hook ────────────────────────────────────────── */
function useCountdown(initial = 30) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setSeconds(initial);
    setRunning(true);
  }, [initial]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return { seconds, running, start };
}

/* ── CaptchaDisplay ────────────────────────────────────────────── */
const CHAR_COLORS = ['#007AD1', '#005FA8', '#C8960C', '#1D4ED8'];
const CHAR_ROTATIONS = [-15, 8, -10, 12, -6, 9, -13, 7];

function CaptchaDisplay({ code }) {
  return (
    <div className="captcha-display" aria-label="CAPTCHA: type the characters shown">
      {code.split('').map((ch, i) => (
        <span
          key={i}
          className="captcha-char"
          style={{
            transform: `rotate(${CHAR_ROTATIONS[i % CHAR_ROTATIONS.length]}deg) translateY(${i % 2 === 0 ? '-2px' : '2px'})`,
            color: CHAR_COLORS[i % CHAR_COLORS.length],
            fontStyle: i % 3 === 0 ? 'italic' : 'normal',
            fontSize: `${1.3 + (i % 3) * 0.1}rem`,
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

/* ── PasswordTab ───────────────────────────────────────────────── */
function PasswordTab() {
  const navigate = useNavigate();
  const { login, loginError, setLoginError } = useAuth();

  const [userId, setUserId]             = useState('');
  const [password, setPassword]         = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode]   = useState(() => generateCaptcha());
  const [showPw, setShowPw]             = useState(false);
  const [remember, setRemember]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});

  // Clear server error when user types
  useEffect(() => {
    if (loginError) setLoginError('');
  }, [userId, password]);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
  };

  const validate = () => {
    const e = {};
    if (!userId.trim())              e.userId = 'User ID is required';
    else if (userId.trim().length < 5) e.userId = 'User ID must be at least 5 characters';
    if (!password)                   e.password = 'Password is required';
    else if (password.length < 6)   e.password = 'Password must be at least 6 characters';
    if (!captchaInput.trim())        e.captcha = 'Please enter the CAPTCHA';
    else if (captchaInput.trim().toUpperCase() !== captchaCode) {
      e.captcha = 'CAPTCHA does not match — try again';
      refreshCaptcha();
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const result = await login({ userId: userId.trim(), password });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      refreshCaptcha();
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>

      {/* Server-level error banner */}
      {loginError && (
        <div className="login-error-banner">
          <AlertCircle size={15} />
          <span>{loginError}</span>
        </div>
      )}

      {/* User ID */}
      <div className="form-group">
        <label className="form-label" htmlFor="userId">
          <span className="label-icon"><User size={14} /></span>
          User ID / Registration Number
        </label>
        <div className="input-wrapper">
          <input
            id="userId"
            type="text"
            className={`form-input ${errors.userId ? 'error' : userId ? 'success' : ''}`}
            placeholder="Enter your User ID or email"
            value={userId}
            onChange={e => { setUserId(e.target.value); setErrors(p => ({...p, userId: ''})); }}
            autoComplete="username"
            maxLength={60}
            style={{ paddingRight: userId ? '2.5rem' : '0.95rem' }}
          />
          {userId && (
            <span className="input-clear" onClick={() => setUserId('')}>
              <X size={13} />
            </span>
          )}
        </div>
        {errors.userId && (
          <span className="form-error"><X size={12} /> {errors.userId}</span>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="password">
          <span className="label-icon"><Lock size={14} /></span>
          Password
        </label>
        <div className="input-wrapper">
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
            autoComplete="current-password"
            style={{ paddingRight: '2.75rem' }}
          />
          <button
            type="button"
            className="toggle-pw"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && (
          <span className="form-error"><X size={12} /> {errors.password}</span>
        )}
      </div>

      {/* CAPTCHA */}
      <div className="form-group">
        <label className="form-label" htmlFor="captchaInput">
          <span className="label-icon"><ShieldCheck size={14} /></span>
          Security Verification
        </label>
        <div className="captcha-row">
          <CaptchaDisplay code={captchaCode} />
          <button
            type="button"
            className="captcha-refresh"
            onClick={refreshCaptcha}
            aria-label="Refresh CAPTCHA"
            title="Refresh CAPTCHA"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <input
          id="captchaInput"
          type="text"
          className={`form-input ${errors.captcha ? 'error' : ''}`}
          placeholder="Type the characters shown above"
          value={captchaInput}
          onChange={e => { setCaptchaInput(e.target.value.toUpperCase()); setErrors(p => ({...p, captcha: ''})); }}
          maxLength={6}
          autoComplete="off"
          spellCheck={false}
          style={{ letterSpacing: '0.18em', fontWeight: 700 }}
        />
        {errors.captcha && (
          <span className="form-error"><X size={12} /> {errors.captcha}</span>
        )}
      </div>

      {/* Options */}
      <div className="options-row">
        <label className="checkbox-label" htmlFor="rememberMe">
          <input type="checkbox" id="rememberMe" checked={remember} onChange={e => setRemember(e.target.checked)} />
          <span className="checkmark" />
          Remember my User ID
        </label>
        <a href="#" className="forgot-link">Forgot Password?</a>
      </div>

      {/* Submit */}
      <button type="submit" className="btn-login" id="btnLogin" disabled={loading}>
        {loading ? (
          <><span className="btn-spinner" /><span>Signing in…</span></>
        ) : (
          <><LogIn size={16} /><span>Sign In to Portal</span><ArrowRight size={16} className="btn-arrow" /></>
        )}
      </button>

      <div className="or-divider"><span>or</span></div>

      <div className="register-cta">
        <p>New to KPSC Thulasi?</p>
        <a href="#" className="btn-register">Create Free Account</a>
      </div>
    </form>
  );
}

/* ── OTPTab ────────────────────────────────────────────────────── */
function OTPTab() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mobile, setMobile]             = useState('');
  const [otpSent, setOtpSent]           = useState(false);
  const [otp, setOtp]                   = useState(Array(6).fill(''));
  const [mobileError, setMobileError]   = useState('');
  const [otpError, setOtpError]         = useState('');
  const [loadingSend, setLoadingSend]   = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const boxRefs = useRef([]);
  const { seconds, running, start } = useCountdown(30);

  const handleSendOTP = async () => {
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setMobileError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setMobileError('');
    setLoadingSend(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoadingSend(false);
    setOtpSent(true);
    start();
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) boxRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) boxRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    if (otp.join('').length < 6) { setOtpError('Please enter the full 6-digit OTP'); return; }
    setOtpError('');
    setLoadingVerify(true);
    // For OTP demo, simulate success directly
    const result = await login({ userId: 'keralapsclogin@gmail.com', password: 'Keralapsc#2026' });
    setLoadingVerify(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <form className="login-form" onSubmit={e => e.preventDefault()}>
      <div className="form-group">
        <label className="form-label" htmlFor="otpMobile">
          <span className="label-icon"><Phone size={14} /></span>
          Registered Mobile Number
        </label>
        <div className="input-wrapper">
          <span className="input-prefix">+91</span>
          <input
            id="otpMobile"
            type="tel"
            className={`form-input with-prefix ${mobileError ? 'error' : mobile.length === 10 ? 'success' : ''}`}
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobileError(''); }}
            disabled={otpSent}
            inputMode="numeric"
          />
        </div>
        {mobileError && <span className="form-error"><X size={12} /> {mobileError}</span>}
      </div>

      {!otpSent ? (
        <button type="button" className="btn-login" onClick={handleSendOTP} disabled={loadingSend}>
          {loadingSend
            ? <><span className="btn-spinner" /><span>Sending OTP…</span></>
            : <><Smartphone size={16} /><span>Send OTP</span><ArrowRight size={16} className="btn-arrow" /></>
          }
        </button>
      ) : (
        <div className="otp-verify-section">
          <div className="otp-label">
            <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '0.3rem', color: '#22C55E', verticalAlign: 'middle' }} />
            OTP sent to +91 {mobile.slice(0, 2)}****{mobile.slice(-2)}
          </div>
          <div className="otp-boxes">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => boxRefs.current[idx] = el}
                type="text"
                className={`otp-box ${digit ? 'filled' : ''}`}
                maxLength={1}
                inputMode="numeric"
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(idx, e)}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {otpError && (
            <span className="form-error" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
              <X size={12} /> {otpError}
            </span>
          )}
          <div className="otp-timer-row">
            <span className="otp-timer">
              {running ? <>Resend in <strong>{seconds}s</strong></> : 'OTP expired'}
            </span>
            <button type="button" className="resend-btn" disabled={running}
              onClick={() => { setOtp(Array(6).fill('')); start(); }}>
              Resend OTP
            </button>
          </div>
          <button type="button" className="btn-login" onClick={handleVerify} disabled={loadingVerify}>
            {loadingVerify
              ? <><span className="btn-spinner" /><span>Verifying…</span></>
              : <><KeyRound size={16} /><span>Verify &amp; Login</span><ArrowRight size={16} className="btn-arrow" /></>
            }
          </button>
        </div>
      )}

      <div className="register-cta" style={{ marginTop: '1.5rem' }}>
        <p>New to KPSC Thulasi?</p>
        <a href="#" className="btn-register">Create Free Account</a>
      </div>
    </form>
  );
}

/* ── Secure Badge SVGs ─────────────────────────────────────────── */
function SSLIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function ShieldIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function CheckIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }

/* ── Main LoginCard ────────────────────────────────────────────── */
export default function LoginCard() {
  const [activeTab, setActiveTab] = useState('password');

  return (
    <div className="login-card">
      <div className="card-header">
        <div className="card-emblem">
          <img src="/kerala_psc_logo.webp" alt="Kerala Public Service Commission Emblem" />
        </div>
        <h2 className="card-title">Candidate Login</h2>
        <p className="card-subtitle">Sign in to your Thulasi account</p>
      </div>

      <div className="login-tabs" role="tablist">
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          role="tab" aria-selected={activeTab === 'password'}
          onClick={() => setActiveTab('password')}
        >
          <Lock size={14} /> Password Login
        </button>
        <button
          className={`tab-btn ${activeTab === 'otp' ? 'active' : ''}`}
          role="tab" aria-selected={activeTab === 'otp'}
          onClick={() => setActiveTab('otp')}
        >
          <Smartphone size={14} /> OTP Login
        </button>
      </div>

      <div className={`tab-panel ${activeTab === 'password' ? 'active' : ''}`}>
        <PasswordTab />
      </div>
      <div className={`tab-panel ${activeTab === 'otp' ? 'active' : ''}`}>
        <OTPTab />
      </div>

      <div className="card-footer">
        <div className="secure-badges">
          <span className="secure-badge"><SSLIcon /> 256-bit SSL</span>
          <span className="secure-badge"><ShieldIcon /> Govt Secured</span>
          <span className="secure-badge"><CheckIcon /> NIC Certified</span>
        </div>
        <p className="card-footer-text">
          Technical support: <a href="mailto:support@keralapsc.gov.in">support@keralapsc.gov.in</a><br />
          Helpline: <strong>1800-425-2099</strong> (Toll Free, 10am–5pm)
        </p>
      </div>
    </div>
  );
}
