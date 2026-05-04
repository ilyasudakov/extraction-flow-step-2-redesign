/* Icon set — small, hand-tuned strokes */
const Icon = {
  Search: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m3 8 3.5 3.5L13 5" />
    </svg>
  ),
  X: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  ),
  Caret: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m4 6 4 4 4-4" />
    </svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z"/>
      <circle cx="8" cy="8" r="2"/>
    </svg>
  ),
  Filter: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 3h12l-4.5 5.5V13l-3 1V8.5L2 3Z"/>
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </svg>
  ),
  Drag: (p) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
      <circle cx="6" cy="4" r="1.2"/><circle cx="10" cy="4" r="1.2"/>
      <circle cx="6" cy="8" r="1.2"/><circle cx="10" cy="8" r="1.2"/>
      <circle cx="6" cy="12" r="1.2"/><circle cx="10" cy="12" r="1.2"/>
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
    </svg>
  ),
  Info: (p) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <circle cx="8" cy="8" r="6"/><path d="M8 11V7.5"/><circle cx="8" cy="5.2" r="0.6" fill="currentColor"/>
    </svg>
  ),
};

window.Icon = Icon;
