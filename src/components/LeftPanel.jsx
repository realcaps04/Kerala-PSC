import { useEffect, useRef } from 'react';
import { FolderOpen, Ticket, BarChart2, BellRing } from 'lucide-react';

const STATS = [
  { target: 1800000, label: 'Registered Candidates' },
  { target: 450,     label: 'Active Notifications'  },
  { target: 14,      label: 'District Offices'       },
  { target: 68,      label: 'Years of Service'       },
];

const FEATURES = [
  {
    icon: <FolderOpen size={20} strokeWidth={1.75} />,
    title: 'One-Time Registration',
    desc:  'Create your lifelong KPSC profile once, apply forever with a single click',
  },
  {
    icon: <Ticket size={20} strokeWidth={1.75} />,
    title: 'Instant Hall Tickets',
    desc:  'Download admit cards directly from your personalised dashboard',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.75} />,
    title: 'Live Rank List Tracking',
    desc:  'Check your position in published district and state rank lists in real time',
  },
  {
    icon: <BellRing size={20} strokeWidth={1.75} />,
    title: 'Smart Exam Alerts',
    desc:  'Get notified for new notifications matching your qualification and district',
  },
];

function useCountUp(ref, target, duration = 1800) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent =
        value >= 1000000
          ? (value / 1000000).toFixed(1) + 'M'
          : value >= 1000
          ? (value / 1000).toFixed(0) + 'K'
          : value;
      if (progress < 1) requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(step); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
}

function StatCard({ stat }) {
  const ref = useRef(null);
  useCountUp(ref, stat.target);
  return (
    <div className="stat-card">
      <span className="stat-num" ref={ref}>0</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

export default function LeftPanel() {
  return (
    <section className="left-panel" aria-label="Portal information">
      <div className="left-content">
        <div className="welcome-badge">
          <span className="badge-dot" />
          Official Government Portal
        </div>

        <h2 className="left-heading">
          Your Gateway to <br />
          <em>Kerala's Civil Services</em>
        </h2>

        <p className="left-desc">
          Access the KPSC Thulasi portal to apply for state government positions, download
          hall tickets, track your application status, and view published rank lists —
          all in one secure, constitutionally mandated platform.
        </p>

        <div className="stats-grid">
          {STATS.map(s => <StatCard key={s.label} stat={s} />)}
        </div>

        <div className="features-list">
          {FEATURES.map(f => (
            <div className="feature-item" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-text">
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-decoration" aria-hidden="true">
        <div className="deco-circle deco-c1" />
        <div className="deco-circle deco-c2" />
        <div className="deco-line deco-l1" />
        <div className="deco-line deco-l2" />
      </div>
    </section>
  );
}
