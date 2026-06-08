import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import {
  Home, Phone, Map, LogOut,
  User, CreditCard, FileCheck, KeyRound,
  Bell, FileText, Ticket, Megaphone, CalendarCheck,
  ThumbsUp, Scale, MessageSquare, ClipboardEdit,
  Trophy, Star, Camera, PenLine,
  Rss, HelpCircle,
  ChevronRight, Menu, X, Download, Eye,
  Hash, MapPin, Mail, Shield, Clock,
  BarChart2, Layers, Calendar, ExternalLink,
  Award, AlertCircle
} from 'lucide-react';

/* ══════════════════════════════════════════════════
   NAV STRUCTURE
══════════════════════════════════════════════════ */
const NAV_GROUPS = [
  {
    id: 'general',
    label: 'General',
    items: [
      { id: 'home',    label: 'Home',     icon: <Home size={15} /> },
      { id: 'contact', label: 'Contact',  icon: <Phone size={15} /> },
      { id: 'sitemap', label: 'Site Map', icon: <Map size={15} /> },
    ],
  },
  {
    id: 'account',
    label: 'My Account',
    items: [
      { id: 'profile',          label: 'My Profile',        icon: <User size={15} /> },
      { id: 'registration',     label: 'Registration Card', icon: <CreditCard size={15} /> },
      { id: 'otv',              label: 'OTR Certificate',   icon: <FileCheck size={15} /> },
      { id: 'change-password',  label: 'Change Password',   icon: <KeyRound size={15} /> },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    items: [
      { id: 'notifications',   label: 'Notifications',          icon: <Bell size={15} /> },
      { id: 'my-application',  label: 'My Application',         icon: <FileText size={15} /> },
      { id: 'admission-ticket',label: 'Admission Ticket',        icon: <Ticket size={15} /> },
      { id: 'announcements',   label: 'Announcements',           icon: <Megaphone size={15} /> },
      { id: 'confirmation',    label: 'Confirmation for Exams',  icon: <CalendarCheck size={15} />, external: true },
      { id: 'willingness',     label: 'Willingness for Appointment', icon: <ThumbsUp size={15} /> },
      { id: 'affidavit',       label: 'File Affidavit',          icon: <Scale size={15} /> },
      { id: 'profile-messages',label: 'Profile Messages',        icon: <MessageSquare size={15} /> },
      { id: 'answer-key',      label: 'Answer Key Complaint',    icon: <ClipboardEdit size={15} /> },
      { id: 'results',         label: 'My Results',              icon: <Trophy size={15} /> },
      { id: 'feedback',        label: 'Feedback',                icon: <Star size={15} /> },
      { id: 'photograph',      label: 'Photograph',              icon: <Camera size={15} /> },
      { id: 'signature',       label: 'Signature',               icon: <PenLine size={15} /> },
    ],
  },
  {
    id: 'info',
    label: 'Information',
    items: [
      { id: 'bulletin', label: 'Bulletin Subscription', icon: <Rss size={15} />, external: true },
      { id: 'faq',      label: 'Frequently Asked Questions', icon: <HelpCircle size={15} /> },
    ],
  },
];

/* ══════════════════════════════════════════════════
   DUMMY DATA
══════════════════════════════════════════════════ */
const APPLICATIONS = [
  { id: 'APP-2024-7741', post: 'Secretariat Assistant',    dept: 'Kerala Secretariat',          applied: '12-Mar-2024', exam: '20-Jul-2026', status: 'shortlist', label: 'Shortlisted' },
  { id: 'APP-2024-5523', post: 'Lower Division Clerk (LDC)', dept: 'Revenue Dept – TVM',        applied: '05-Jan-2024', exam: '14-Sep-2026', status: 'applied',   label: 'Applied'     },
  { id: 'APP-2023-9912', post: 'Village Field Assistant',  dept: 'Agriculture Department',      applied: '18-Nov-2023', exam: 'Result Awaited', status: 'pending', label: 'Pending'     },
  { id: 'APP-2023-4401', post: 'University Assistant',     dept: 'Kerala University',           applied: '02-Aug-2023', exam: '—',            status: 'rejected', label: 'Not Selected'},
];

const NOTIFICATIONS = [
  { id: 1, icon: <Award size={15} />,      color: 'green', title: 'Shortlist Published – Secretariat Assistant', desc: 'You have been shortlisted for Main Exam (Cat. 235/2023).', time: '2 hours ago',  unread: true  },
  { id: 2, icon: <Ticket size={15} />,     color: 'blue',  title: 'Hall Ticket Available',                        desc: 'Admit card for Degree Level Prelims (20-Jul-2026) ready.', time: '1 day ago',   unread: true  },
  { id: 3, icon: <AlertCircle size={15} />,color: 'amber', title: 'Profile Update Reminder',                      desc: 'Upload updated community certificate before 30-Jun-2026.',  time: '3 days ago',  unread: false },
  { id: 4, icon: <FileText size={15} />,   color: 'blue',  title: 'New Notification: HSST English',               desc: 'Cat. No. 112/2026 – Apply by 15-Jul-2026.',                time: '5 days ago',  unread: false },
];

const UPCOMING_EXAMS = [
  { day: '20', month: 'Jul', name: 'Degree Level Preliminary Exam', meta: '10:00 AM · District Centre, TVM',      badge: 'Confirmed'   },
  { day: '14', month: 'Sep', name: 'LDC Main Written Exam',         meta: '02:00 PM · Govt School, Pattom',       badge: 'Registered'  },
  { day: '08', month: 'Nov', name: 'Secretariat Asst. Main Exam',   meta: 'Venue TBA',                             badge: 'Shortlisted' },
];

/* ══════════════════════════════════════════════════
   PAGE TITLE MAP
══════════════════════════════════════════════════ */
const PAGE_META = {
  home:             { title: 'Dashboard',                  subtitle: 'Welcome to your KPSC Thulasi portal' },
  contact:          { title: 'Contact Us',                 subtitle: 'Get in touch with KPSC offices' },
  sitemap:          { title: 'Site Map',                   subtitle: 'Navigate the Thulasi portal' },
  profile:          { title: 'My Profile',                 subtitle: 'View and update your personal details' },
  registration:     { title: 'Registration Card',          subtitle: 'Download your OTR registration card' },
  otv:              { title: 'OTR Certificate',            subtitle: 'Download your One-Time Registration certificate' },
  'change-password':{ title: 'Change Password',            subtitle: 'Update your account password securely' },
  notifications:    { title: 'Notifications',              subtitle: 'All alerts and updates for your account' },
  'my-application': { title: 'My Applications',            subtitle: 'Track all your submitted applications' },
  'admission-ticket':{ title: 'Admission Ticket',          subtitle: 'Download your hall tickets' },
  announcements:    { title: 'Announcements',              subtitle: 'Official announcements from KPSC' },
  confirmation:     { title: 'Confirmation for Exams',     subtitle: 'Confirm your exam participation' },
  willingness:      { title: 'Willingness for Appointment',subtitle: 'Indicate your willingness for appointment' },
  affidavit:        { title: 'File Affidavit',             subtitle: 'Submit your affidavit online' },
  'profile-messages':{ title: 'Profile Messages',          subtitle: 'Messages related to your profile' },
  'answer-key':     { title: 'Answer Key Complaint',       subtitle: 'Raise objections on published answer keys' },
  results:          { title: 'My Results',                 subtitle: 'View your examination scores and results' },
  feedback:         { title: 'Feedback',                   subtitle: 'Share your experience with KPSC' },
  photograph:       { title: 'Photograph',                 subtitle: 'Upload or update your profile photograph' },
  signature:        { title: 'Signature',                  subtitle: 'Upload or update your digital signature' },
  bulletin:         { title: 'Bulletin Subscription',      subtitle: 'Subscribe to KPSC bulletins and newsletters' },
  faq:              { title: 'Frequently Asked Questions', subtitle: 'Answers to common queries' },
};

/* ══════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════ */
function StatusPill({ status, label }) {
  return (
    <span className={`status-pill ${status}`}>
      <span className="status-dot" />{label}
    </span>
  );
}

function PlaceholderPage({ pageId }) {
  const meta = PAGE_META[pageId] || { title: pageId, subtitle: '' };
  const iconMap = {
    contact: <Phone size={28} />, sitemap: <Map size={28} />, registration: <CreditCard size={28} />,
    otv: <FileCheck size={28} />, 'change-password': <KeyRound size={28} />, notifications: <Bell size={28} />,
    'my-application': <FileText size={28} />, 'admission-ticket': <Ticket size={28} />,
    announcements: <Megaphone size={28} />, confirmation: <CalendarCheck size={28} />,
    willingness: <ThumbsUp size={28} />, affidavit: <Scale size={28} />,
    'profile-messages': <MessageSquare size={28} />, 'answer-key': <ClipboardEdit size={28} />,
    results: <Trophy size={28} />, feedback: <Star size={28} />, photograph: <Camera size={28} />,
    signature: <PenLine size={28} />, bulletin: <Rss size={28} />, faq: <HelpCircle size={28} />,
  };

  return (
    <div className="section-card">
      <div className="placeholder-page">
        <div className="placeholder-icon">
          {iconMap[pageId] || <FileText size={28} />}
        </div>
        <div className="placeholder-title">{meta.title}</div>
        <p className="placeholder-desc">
          This section is part of the Kerala PSC Thulasi portal. Full functionality will be
          available in subsequent releases. Please visit the official portal for live data.
        </p>
        <a href="https://thulasi.psc.kerala.gov.in" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem',
            background: 'var(--brand-primary)', color: '#fff', borderRadius: 'var(--r-md)',
            fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none', marginTop: '0.25rem' }}>
          <ExternalLink size={14} /> Open Official Portal
        </a>
      </div>
    </div>
  );
}

function ProfilePage({ user }) {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className="section-card">
      <div className="profile-quick">
        <div className="profile-q-avatar">{initials}</div>
        <div className="profile-q-name">{user.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--brand-primary-lt)',
            color: 'var(--brand-primary)',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '0.15rem 0.55rem',
            borderRadius: '4px',
            letterSpacing: '0.04em',
          }}>{user.designation}</span>
          <div className="profile-q-reg">{user.registrationNo}</div>
        </div>
        <div className="profile-q-badge"><span style={{width:6,height:6,borderRadius:'50%',background:'#16A34A',display:'inline-block'}}/>OTR Verified</div>
      </div>
      <div className="profile-detail-list">
        {[
          { icon: <MapPin size={13} />, label: 'District',    val: user.district },
          { icon: <Mail size={13} />,   label: 'Email',       val: user.email },
          { icon: <Phone size={13} />,  label: 'Mobile',      val: '+91 ' + user.mobile },
          { icon: <Shield size={13} />, label: 'Category',    val: user.category },
          { icon: <User size={13} />,   label: 'Date of Birth',val: user.dob },
          { icon: <Clock size={13} />,  label: 'Last Login',  val: user.lastLogin },
        ].map(r => (
          <div className="profile-detail-row" key={r.label}>
            <span className="profile-detail-icon">{r.icon}</span>
            <span className="profile-detail-label">{r.label}</span>
            <span className="profile-detail-val" style={{ wordBreak: 'break-all' }}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage({ user, setActivePage }) {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const unread   = NOTIFICATIONS.filter(n => n.unread).length;
  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-greeting">Welcome back</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <div className="welcome-name" style={{ marginBottom: 0 }}>{user.name}</div>
            <span style={{
              background: 'rgba(255,255,255,.18)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--r-full)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,.25)',
            }}>{user.designation}</span>
          </div>
          <div className="welcome-tags">
            <span className="welcome-tag"><Hash size={11} /> {user.registrationNo}</span>
            <span className="welcome-tag"><MapPin size={11} /> {user.district}</span>
            <span className="welcome-tag"><Shield size={11} /> {user.category}</span>
          </div>
        </div>
        <div className="welcome-actions">
          <button className="wb-btn wb-btn-primary" onClick={() => setActivePage('admission-ticket')}>
            <Download size={14} /> Hall Ticket
          </button>
          <button className="wb-btn wb-btn-outline" onClick={() => setActivePage('results')}>
            <Eye size={14} /> My Results
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="dash-stat-card">
          <div className="stat-icon-box blue"><Layers size={19} /></div>
          <div className="stat-card-body">
            <span className="stat-card-value">4</span>
            <span className="stat-card-label">Applications</span>
            <span className="stat-card-sub">1 shortlisted</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon-box green"><Ticket size={19} /></div>
          <div className="stat-card-body">
            <span className="stat-card-value">1</span>
            <span className="stat-card-label">Hall Tickets</span>
            <span className="stat-card-sub">Ready to download</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon-box amber"><Calendar size={19} /></div>
          <div className="stat-card-body">
            <span className="stat-card-value">3</span>
            <span className="stat-card-label">Upcoming Exams</span>
            <span className="stat-card-sub">Next: 20 Jul 2026</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon-box purple"><Bell size={19} /></div>
          <div className="stat-card-body">
            <span className="stat-card-value">{unread}</span>
            <span className="stat-card-label">Unread Alerts</span>
            <span className="stat-card-sub">Action required</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="dash-grid">
        {/* Left Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Applications */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title"><Layers size={16} /> My Applications</span>
              <button className="section-link" onClick={() => setActivePage('my-application')}>
                View All <ChevronRight size={13} />
              </button>
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
                  {APPLICATIONS.map(a => (
                    <tr key={a.id}>
                      <td><div className="app-post-name">{a.post}</div><div className="app-dept">{a.dept}</div></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{a.id}</td>
                      <td>{a.applied}</td>
                      <td>{a.exam}</td>
                      <td><StatusPill status={a.status} label={a.label} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title"><Bell size={16} /> Recent Notifications</span>
              <button className="section-link" onClick={() => setActivePage('notifications')}>
                All <ChevronRight size={13} />
              </button>
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
                  {n.unread && <div className="notif-unread-dot" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Profile Card */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title"><User size={16} /> My Profile</span>
              <button className="section-link" onClick={() => setActivePage('profile')}>
                Edit <ChevronRight size={13} />
              </button>
            </div>
            <div className="profile-quick">
              <div className="profile-q-avatar">{initials}</div>
              <div className="profile-q-name">{user.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'var(--brand-primary-lt)',
                  color: 'var(--brand-primary)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.55rem',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                }}>{user.designation}</span>
                <div className="profile-q-reg">{user.registrationNo}</div>
              </div>
              <div className="profile-q-badge">
                <span style={{width:6,height:6,borderRadius:'50%',background:'#16A34A',display:'inline-block'}}/>
                OTR Verified
              </div>
            </div>
            <div className="profile-detail-list">
              <div className="profile-detail-row">
                <span className="profile-detail-icon"><MapPin size={13} /></span>
                <span className="profile-detail-label">District</span>
                <span className="profile-detail-val">{user.district}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-icon"><Shield size={13} /></span>
                <span className="profile-detail-label">Category</span>
                <span className="profile-detail-val">{user.category}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-icon"><Clock size={13} /></span>
                <span className="profile-detail-label">Last Login</span>
                <span className="profile-detail-val" style={{ fontSize: '0.73rem' }}>{user.lastLogin}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title"><Calendar size={16} /> Upcoming Exams</span>
            </div>
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
    </>
  );
}

/* ══════════════════════════════════════════════════
   SIDEBAR COMPONENT
══════════════════════════════════════════════════ */
function Sidebar({ activePage, setActivePage, user, onLogout, open, onClose }) {
  const [collapsed, setCollapsed] = useState({});
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const toggle = (groupId) =>
    setCollapsed(prev => ({ ...prev, [groupId]: !prev[groupId] }));

  const handleNav = (pageId) => {
    setActivePage(pageId);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={onClose} />

      <aside className={`dash-sidebar ${open ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img src="/kerala_psc_logo.webp" alt="KPSC Logo" />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">Kerala PSC</span>
            <span className="sidebar-brand-sub">Thulasi Portal</span>
          </div>
        </div>

        {/* User Chip */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-reg" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(0,122,209,.35)',
                color: '#60A5FA',
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '3px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>{user.designation}</span>
              <span style={{ opacity: 0.45, fontSize: '0.65rem' }}>{user.registrationNo}</span>
            </div>
          </div>
          <div className="sidebar-user-status">
            <span className="sidebar-status-dot" />
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group, gi) => (
            <div className="nav-group" key={group.id}>
              {gi > 0 && <div className="nav-separator" />}

              {/* Group label (collapsible) */}
              <button
                className={`nav-group-label ${!collapsed[group.id] ? 'open' : ''}`}
                onClick={() => toggle(group.id)}
              >
                <ChevronRight size={11} />
                <span className="nav-group-label-text">{group.label}</span>
              </button>

              {/* Group items */}
              <div
                className={`nav-group-items ${collapsed[group.id] ? 'collapsed' : ''}`}
                style={{ maxHeight: collapsed[group.id] ? '0' : `${group.items.length * 44}px` }}
              >
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    {item.icon}
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    {item.external && (
                      <span className="nav-badge-ext">
                        <ExternalLink size={8} /> EXT
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="nav-separator" />

          {/* Logout */}
          <button className="nav-item danger" onClick={onLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

/* ══════════════════════════════════════════════════
   TOPBAR COMPONENT
══════════════════════════════════════════════════ */
function TopBar({ activePage, user, onLogout, onToggleSidebar }) {
  const [dropOpen, setDropOpen] = useState(false);
  const meta    = PAGE_META[activePage] || { title: activePage };
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const unread  = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="dash-topbar">
      <div className="dash-topbar-inner">
        <div className="dash-topbar-left">
          <button className="dash-sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <Menu size={18} />
          </button>
          <div className="dash-breadcrumb">
            <span>Thulasi</span>
            <ChevronRight size={13} className="dash-breadcrumb-sep" />
            <span className="dash-breadcrumb-current">{meta.title}</span>
          </div>
        </div>

        <div className="dash-topbar-right">
          <button className="topbar-icon-btn" aria-label={`${unread} notifications`}>
            <Bell size={16} />
            {unread > 0 && <span className="topbar-notif-dot" />}
          </button>

          <div
            className="topbar-user-chip"
            tabIndex={0}
            onClick={() => setDropOpen(v => !v)}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropOpen(false); }}
          >
            <div className="topbar-avatar">{initials}</div>
            <span className="topbar-user-name">{user.name.split(' ')[0]}</span>
            <ChevronRight size={13} style={{ color: 'var(--text-muted)', transform: dropOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />

            {dropOpen && (
              <div className="user-dropdown" onMouseDown={e => e.preventDefault()}>
                <div className="dropdown-header">
                  <div className="dropdown-header-name">{user.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '3px' }}>
                    <span style={{
                      background: 'var(--brand-primary-lt)',
                      color: 'var(--brand-primary)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '3px',
                      letterSpacing: '0.04em',
                    }}>{user.designation}</span>
                    <div className="dropdown-header-email">{user.email}</div>
                  </div>
                </div>
                <button className="dropdown-item"><User size={14} /> My Profile</button>
                <button className="dropdown-item"><KeyRound size={14} /> Change Password</button>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={onLogout}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const meta = PAGE_META[activePage] || { title: activePage, subtitle: '' };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    if (activePage === 'home')    return <HomePage user={user} setActivePage={setActivePage} />;
    if (activePage === 'profile') return <ProfilePage user={user} />;
    return <PlaceholderPage pageId={activePage} />;
  };

  return (
    <div className="dash-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main">
        <TopBar
          activePage={activePage}
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
        />

        <div className="dash-content">
          {/* Page Title */}
          {activePage !== 'home' && (
            <div className="page-title-row">
              <div>
                <div className="page-title">{meta.title}</div>
                {meta.subtitle && <div className="page-subtitle">{meta.subtitle}</div>}
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
