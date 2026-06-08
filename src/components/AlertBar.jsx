import { useState } from 'react';
import {
  Megaphone, Bell, FileText, GraduationCap,
  AlertTriangle, ClipboardList, Trophy, X
} from 'lucide-react';

const ALERTS = [
  { icon: <Bell size={13} />,           text: 'LDC 2024 Rank List published — Check your status now' },
  { icon: <FileText size={13} />,       text: 'Degree Level Preliminary Exam scheduled: 20-Jul-2026' },
  { icon: <GraduationCap size={13} />,  text: 'Kerala Administrative Service (KAS) Main Exam results announced' },
  { icon: <AlertTriangle size={13} />,  text: 'Profile update window open until 30-Jun-2026' },
  { icon: <ClipboardList size={13} />,  text: 'HSST (English) rank list published for Ernakulam district' },
  { icon: <Trophy size={13} />,         text: 'CPO 2025 Final List: Check your name at Thulasi portal' },
];

export default function AlertBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="alert-bar">
      <div className="alert-inner">
        <span className="alert-icon">
          <Megaphone size={15} />
        </span>

        <div className="alert-ticker">
          <span>
            {ALERTS.map((a, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                {a.icon}
                {a.text}
                {i < ALERTS.length - 1 && (
                  <span className="alert-separator">|</span>
                )}
              </span>
            ))}
          </span>
        </div>

        <button
          className="alert-close"
          onClick={() => setVisible(false)}
          aria-label="Close alert bar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
