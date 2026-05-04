/* TopBar + Stepper — chrome around Step 2 */
const { useState } = React;

function TopBar() {
  return (
    <div className="topbar">
      <div className="brand">
        <img src="logo.png" alt="Improvado" className="brand-logo" />
      </div>
      <div className="crumbs">
        <span>Data sources</span>
        <span className="sep">/</span>
        <span>Google Ads</span>
        <span className="sep">/</span>
        <span className="current">New extraction</span>
      </div>
    </div>
  );
}

function Stepper({ current = 2 }) {
  const steps = [
    { n: 1, label: 'Select accounts' },
    { n: 2, label: 'Select templates' },
    { n: 3, label: 'Configure templates' },
    { n: 4, label: 'Review orders' },
  ];
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className={`step ${s.n < current ? 'done' : s.n === current ? 'current' : ''}`}>
            <div className="num">
              {s.n < current ? <Icon.Check style={{ width: 12, height: 12 }} /> : s.n}
            </div>
            <span>{s.label}</span>
          </div>
          {i < steps.length - 1 && <Icon.ArrowRight className="step-arrow" style={{ width: 14, height: 14 }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

window.TopBar = TopBar;
window.Stepper = Stepper;
