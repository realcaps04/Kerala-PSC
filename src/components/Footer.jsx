import { Phone, Printer, Mail, Globe } from 'lucide-react';

const FOOTER_COLS = [
  {
    title: 'Kerala PSC',
    type: 'text',
    content: `Kerala Public Service Commission\nThulasi Hills, Pattom,\nThiruvananthapuram – 695 004\nKerala, India`,
  },
  {
    title: 'Quick Links',
    type: 'links',
    links: [
      'About KPSC',
      'Exam Calendar',
      'Syllabus & Patterns',
      'Previous Papers',
      'RTI Applications',
    ],
  },
  {
    title: 'Services',
    type: 'links',
    links: [
      'One-Time Registration',
      'Hall Ticket Download',
      'Rank List Status',
      'Mark Sheet',
      'Certificate Verification',
    ],
  },
  {
    title: 'Contact',
    type: 'contact',
    items: [
      { icon: <Phone size={13} />,   text: '0471-2546390' },
      { icon: <Printer size={13} />, text: '0471-2545236' },
      { icon: <Mail size={13} />,    text: 'keralapsc@keralapsc.gov.in', href: 'mailto:keralapsc@keralapsc.gov.in' },
      { icon: <Globe size={13} />,   text: 'www.keralapsc.gov.in',       href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {FOOTER_COLS.map(col => (
          <div className="footer-col" key={col.title}>
            <h3>{col.title}</h3>

            {col.type === 'text' && (
              <p style={{ whiteSpace: 'pre-line' }}>{col.content}</p>
            )}

            {col.type === 'links' && (
              <ul>
                {col.links.map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            )}

            {col.type === 'contact' && (
              <ul>
                {col.items.map((item, i) => (
                  <li key={i}>
                    <span className="footer-contact-icon">{item.icon}</span>
                    {item.href
                      ? <a href={item.href}>{item.text}</a>
                      : <span>{item.text}</span>
                    }
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Kerala Public Service Commission. All rights reserved.&nbsp;|&nbsp;
          Designed by NIC Kerala&nbsp;|&nbsp;
          <a href="#">Privacy Policy</a>&nbsp;|&nbsp;
          <a href="#">Terms of Use</a>&nbsp;|&nbsp;
          <a href="#">Accessibility</a>
        </p>
      </div>
    </footer>
  );
}
