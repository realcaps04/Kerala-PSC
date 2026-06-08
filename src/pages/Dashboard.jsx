import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import {
  Bell, LogOut, User, ChevronDown, ChevronRight,
  FileText, Ticket, BarChart2, ClipboardList,
  Calendar, MapPin, Mail, Phone, Shield,
  BookOpen, TrendingUp, CheckCircle2, Clock,
  AlertCircle, Download, Eye, Settings,
  Hash, Award, Layers
} from 'lucide-react';

/* ── Data ───────────────────────────────────────────────────────── */
const APPLICATIONS = [
  {
    id: 'APP-2024-7741',
    post: 'Secretariat Assistant',
    dept: 'Kerala Secretariat',
    appliedOn: '12-Mar-2024',
    examDate: '20-Jul-2026',
    status: 'shortlist',
    statusLabel: 'Shortlisted',
  },
  {
    id: 'APP-2024-5523',
    post: 'Lower Division Clerk (LDC)',
    dept: 'Revenue Department – TVM',
    appliedOn: '05-Jan-2024',
    examDate: '14-Sep-2026',
    status: 'applied',
    statusLabel: 'Applied',
  },
  {
    id: 'APP-2023-9912',
    post: 'Village Field Assistant',
    dept: 'Agriculture Department',
    appliedOn: '18-Nov-2023',
    examDate: 'Result Awaited',
    status: 'pending',
    statusLabel: 'Pending Result',
  },
  {
    id: 'APP-2023-4401',
    post: 'University Assistant',
    dept: 'Kerala University',
    appliedOn: '02-Aug-2023',
    examDate: '—',
    status: 'rejected',
    statusLabel: 'Not Selected',
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    icon: <Award size={16} />,
    color: 'green',
    title: 'Shortlist Published – Secretariat Assistant',
    desc: 'You have been shortlisted for the Secretariat Assistant (Cat. No. 235/2023) Main Exam.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    icon: <Ticket size={16} />,
    color: 'blue',
    title: 'Hall Ticket Available',
    desc: 'Admit card for Degree Level Prelims (20-Jul-2026) is ready to download.',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 3,
    icon: <AlertCircle size={16} />,
    color: 'amber',
    title: 'Profile Update Reminder',
    desc: 'Upload your updated community certificate before 30-Jun-2026.',
    time: '3 days ago',
    unread: false,
  },
  {
    id: 4,
    icon: <FileText size={16} />,
    color: 'blue',
    title: 'New Notification: HSST English',
    desc: 'Cat. No. 112/2026 – Apply by 15-Jul-2026. Check eligibility criteria.',
    time: '5 days ago',
    unread: false,
  },
];

const UPCOMING_EXAMS = [
  { day: '20', month: 'Jul', name: 'Degree Level Preliminary Exam', meta: '10:00 AM · District Centre, TVM', badge: 'Confirmed' },
  { day: '14', month: 'Sep', name: 'LDC Main Written Exam', meta: '02:00 PM · Government School, Pattom', badge: 'Registered' },
  { day: '08', month: 'Nov', name: 'Secretariat Asst. Main Exam', meta: 'Venue TBA', badge: 'Shortlisted' },
];

/* ── Components ─────────────────────────────────────────────────── */
function StatusPill({ status, label }) {
  return (
    <span className={`status-pill ${status}`}>
      <span className="status-dot" />
      {label}
    </span>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="dash-user-chip" onClick={() => setOpen(v => !v)} tabIndex={0}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <div className="user-avatar">{initials}</div>
      <span className="user-chip-name">{user.name.split(' ')[0]}</span>
      <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />

      {open && (
        <div className="user-dropdown" onMouseDown={e => e.preventDefault()}>
          <div style={{ padding: '0.85rem 1.1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
          </div>
          <a href="#" className="dropdown-item"><User size={15} /> My Profile</a>
          <a href="#" className="dropdown-item"><Settings size={15} /> Account Settings</a>
          <a href="#" className="dropdown-item"><Shield size={15} /> Security</a>
          <div className="dropdown-divider" />
          <button className="dropdown-item logout" onClick={onLogout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Dashboard Page ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="dashboard-root">

      {/* ── Dashboard Header ── */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <a href="#" className="dash-brand">
            <div className="dash-brand-logo">
              <img src="/kerala_psc_logo.webp" alt="KPSC Logo" />
            </div>
            <div className="dash-brand-text">
              <span className="dash-brand-title">Kerala PSC Thulasi</span>
              <span className="dash-brand-sub">Candidate Dashboard</span>
            </div>
          </a>

          <div className="dash-header-right">
            {/* Notifications Bell */}
            <button
              className="dash-notif-btn"
              aria-label={`${unreadCount} unread notifications`}
              onClick={() => setNotifOpen(v => !v)}
            >
              <Bell size={17} />
              {unreadCount > 0 && <span className="notif-dot" />}
            </button>

            {/* User Chip */}
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="dash-body">

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <div className="welcome-greeting">Welcome back</div>
            <div className="welcome-name">{user.name}</div>
            <div className="welcome-reg">
              <Hash size={12} /> {user.registrationNo}
            </div>
          </div>
          <div className="welcome-actions">
            <a href="#" className="wb-btn wb-btn-primary">
              <Download size={15} /> Download Hall Ticket
            </a>
            <a href="#" className="wb-btn wb-btn-outline">
              <Eye size={15} /> View Rank List
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="dash-stat-card">
            <div className="stat-icon-box blue"><FileText size={20} /></div>
            <div className="stat-card-body">
              <span className="stat-card-value">4</span>
              <span className="stat-card-label">Applications</span>
              <span className="stat-card-sub">1 shortlisted</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon-box green"><Ticket size={20} /></div>
            <div className="stat-card-body">
              <span className="stat-card-value">1</span>
              <span className="stat-card-label">Hall Tickets</span>
              <span className="stat-card-sub">Ready to download</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon-box amber"><Calendar size={20} /></div>
            <div className="stat-card-body">
              <span className="stat-card-value">3</span>
              <span className="stat-card-label">Upcoming Exams</span>
              <span className="stat-card-sub">Next: 20 Jul 2026</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon-box purple"><Bell size={20} /></div>
            <div className="stat-card-body">
              <span className="stat-card-value">{unreadCount}</span>
              <span className="stat-card-label">Unread Alerts</span>
              <span className="stat-card-sub">Action required</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dash-grid">

          {/* LEFT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* My Applications */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title">
                  <Layers size={17} /> My Applications
                </span>
                <a href="#" className="section-link">
                  View All <ChevronRight size={14} />
                </a>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Post / Department</th>
                      <th>App ID</th>
                      <th>Applied On</th>
                      <th>Exam Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {APPLICATIONS.map(app => (
                      <tr key={app.id}>
                        <td>
                          <div className="app-post-name">{app.post}</div>
                          <div className="app-dept">{app.dept}</div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{app.id}</td>
                        <td>{app.appliedOn}</td>
                        <td>{app.examDate}</td>
                        <td><StatusPill status={app.status} label={app.statusLabel} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notifications */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title">
                  <Bell size={17} /> Recent Notifications
                </span>
                <a href="#" className="section-link">
                  All Notifications <ChevronRight size={14} />
                </a>
              </div>
              <div className="notif-list">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className={`notif-icon-wrap ${n.color}`}>{n.icon}</div>
                    <div className="notif-body">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-desc">{n.desc}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                    {n.unread && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#007AD1', flexShrink: 0, marginTop: '0.4rem' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Profile Card */}
            <div className="section-card profile-card">
              <div className="section-card-header">
                <span className="section-card-title"><User size={17} /> My Profile</span>
                <a href="#" className="section-link">Edit <ChevronRight size={14} /></a>
              </div>
              <div className="profile-header-section">
                <div className="profile-avatar">{initials}</div>
                <div>
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-reg">{user.registrationNo}</div>
                  <div className="profile-status">
                    <span className="profile-status-dot" /> OTR Verified
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <div className="profile-row">
                  <span className="profile-row-icon"><MapPin size={13} /></span>
                  <span className="profile-row-label">District</span>
                  <span className="profile-row-value">{user.district}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-row-icon"><Mail size={13} /></span>
                  <span className="profile-row-label">Email</span>
                  <span className="profile-row-value" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{user.email}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-row-icon"><Phone size={13} /></span>
                  <span className="profile-row-label">Mobile</span>
                  <span className="profile-row-value">+91 {user.mobile}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-row-icon"><Shield size={13} /></span>
                  <span className="profile-row-label">Category</span>
                  <span className="profile-row-value">{user.category}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-row-icon"><Clock size={13} /></span>
                  <span className="profile-row-label">Last Login</span>
                  <span className="profile-row-value" style={{ fontSize: '0.74rem' }}>{user.lastLogin}</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="profile-action-btn"><Ticket size={15} /> Download Hall Ticket</button>
                <button className="profile-action-btn"><BarChart2 size={15} /> Check Rank List</button>
                <button className="profile-action-btn"><BookOpen size={15} /> View Syllabus</button>
                <button className="profile-action-btn" style={{ color: '#DC2626' }} onClick={handleLogout}>
                  <LogOut size={15} style={{ color: '#DC2626' }} /> Sign Out
                </button>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title"><Calendar size={17} /> Upcoming Exams</span>
              </div>
              <div className="exam-list">
                {UPCOMING_EXAMS.map((ex, i) => (
                  <div className="exam-item" key={i}>
                    <div className="exam-date-box">
                      <span className="exam-date-day">{ex.day}</span>
                      <span className="exam-date-month">{ex.month}</span>
                    </div>
                    <div className="exam-info">
                      <div className="exam-name">{ex.name}</div>
                      <div className="exam-meta">{ex.meta}</div>
                    </div>
                    <span className="exam-badge">{ex.badge}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
