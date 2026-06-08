import { Ticket, ClipboardList, Bell, BarChart2 } from 'lucide-react';

const QUICK_LINKS = [
  { icon: <Ticket size={17} strokeWidth={1.75} />,       label: 'Download Hall Ticket', id: 'qlHallTicket' },
  { icon: <ClipboardList size={17} strokeWidth={1.75} />, label: 'View Rank Lists',      id: 'qlRankList'   },
  { icon: <Bell size={17} strokeWidth={1.75} />,          label: 'New Notifications',    id: 'qlNotif'      },
  { icon: <BarChart2 size={17} strokeWidth={1.75} />,     label: 'Exam Results',         id: 'qlResults'    },
];

export default function QuickLinks() {
  return (
    <div className="quick-links">
      {QUICK_LINKS.map(link => (
        <a key={link.id} href="#" className="quick-link" id={link.id}>
          <span className="quick-link-icon">{link.icon}</span>
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
