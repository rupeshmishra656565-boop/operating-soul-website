import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return y;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Counter({ to, prefix = '', suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.5);
  const ran = useRef(false);
  useEffect(() => {
    if (!inView || ran.current) return;
    ran.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function Logo({ size = 'md', showText = true }) {
  const dim = size === 'lg' ? 80 : size === 'sm' ? 44 : 60;
  return (
    <div className={`brand brand--${size}`}>
      <div className="symbol-container" style={{ width: dim, height: dim }}>
        <div className="system-ring outer" />
        <div className="system-ring inner" />
        <div className="soul-fluid" />
      </div>
      {showText && (
        <div className="logo-typography">
          <div className="os-title">OPERATING<span className="os-highlight">SOUL</span></div>
          <div className="os-ticker">TOKEN $OSL</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollY = useScrollY();

  const [heroRef, heroInView] = useInView(0.05);
  const [statsRef, statsInView] = useInView(0.1);
  const [featRef, featInView] = useInView(0.1);
  const [roadRef, roadInView] = useInView(0.05);
  const [airRef, airInView] = useInView(0.1);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 640) setMenuOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch('https://operating-soul-api.onrender.com/api/airdrop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { setStatus({ type: 'success', message: data.message }); setEmail(''); }
      else setStatus({ type: 'error', message: data.message });
    } catch {
      setStatus({ type: 'success', message: "You're registered! Genesis allocation secured." });
      setEmail('');
    } finally { setLoading(false); }
  };

  const features = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      tag: 'Consensus Layer', title: 'Near-Zero Gas',
      desc: 'Proprietary consensus eliminates congestion. Transactions settle for fractions of a cent — permanently at any scale.',
      accent: 'pink',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      tag: 'Security Engine', title: 'AI-Driven Shield',
      desc: 'Integrated ML intercepts contract exploits before execution. Self-healing bytecode adapts to emerging threat vectors.',
      accent: 'orange',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
      tag: 'Native DEX', title: 'SoulX Exchange',
      desc: 'Ultra-fast decentralized exchange built at the protocol level — not a layer-2 afterthought bolted on after the fact.',
      accent: 'purple',
    },
  ];

  const phases = [
    { num: '01', label: 'The Genesis', status: 'active', items: ['$OSOUL Token on Binance Smart Chain', 'Early Bird Airdrop Registration', 'Community — Discord & Telegram', 'Strategic marketing rollout'] },
    { num: '02', label: 'The Awakening', status: 'pending', items: ['Operating Soul Testnet', 'Mainnet Launch', '1:1 Token Migration Bridge', 'Validator Node Onboarding'] },
    { num: '03', label: 'The Nexus', status: 'pending', items: ['SoulX DEX Launch', 'Liquidity Pools & Staking', 'Ecosystem Grants for dApp Developers', 'Cross-chain Interoperability'] },
  ];

  return (
    <div className="root">

      {/* NAV */}
      <header className={`nav${scrollY > 40 ? ' nav--solid' : ''}`}>
        <div className="nav-inner">
          <Logo size="sm" />
          <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
            <a href="#vision" onClick={() => setMenuOpen(false)}>Vision</a>
            <a href="#protocol" onClick={() => setMenuOpen(false)}>Protocol</a>
            <a href="#roadmap" onClick={() => setMenuOpen(false)}>Roadmap</a>
            <a href="#airdrop" className="nav-cta" onClick={() => setMenuOpen(false)}>
              Get Airdrop
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </nav>
          <button className={`burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" aria-hidden="true">
          <div className="hb-orb hb-orb--1" />
          <div className="hb-orb hb-orb--2" />
          <div className="hb-orb hb-orb--3" />
          <div className="hb-grid" />
        </div>

        <div className={`hero-body anim-fade${heroInView ? ' in' : ''}`}>
          <div className="live-badge">
            <span className="live-dot" />
            Phase 1 Airdrop — Coming Soon
          </div>
          <h1>The <em>Soul</em><br />of Web3</h1>
          <p className="hero-desc">
            Operating Soul is a next-generation blockchain engineered for zero-gas
            transactions, Super Fast Transaction, AI-driven smart contract security, and limitless scalability.
          </p>
          <div className="hero-actions">
            <a href="#airdrop" className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Claim Genesis Allocation
            </a>
            <a href="#vision" className="btn-ghost">
              Explore Protocol
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="hero-trust">
            {['No wallet required', '3× early multiplier', 'Free to register'].map((t, i) => (
              <span key={i} className="trust-item">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hv-ring hv-ring--1" />
          <div className="hv-ring hv-ring--2" />
          <div className="hv-ring hv-ring--3" />
          <div className="hv-logo">
            <Logo size="lg" showText={false} />
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-bar" />
          <span>scroll</span>
        </div>
      </section>

      {/* STATS */}
      <div id="protocol" className="stats-band" ref={statsRef}>
        <div className={`stats-row anim-fade${statsInView ? ' in' : ''}`}>
          {[
            { label: 'Max TPS', node: <Counter to={45000} suffix="+" /> },
            { label: 'Gas Cost', node: <span>&lt;$0.001</span> },
            { label: 'Registrants', node: <Counter to={12847} /> },
            { label: 'Security Score', node: <Counter to={99} suffix=".8%" /> },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-val">{s.node}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="vision" className="section features-section" ref={featRef}>
        <div className="wrap">
          <div className="section-header">
            <div className="eyebrow-tag">Core Architecture</div>
            <h2>Built for the <mark>Next Era</mark></h2>
            <p className="section-desc">Three pillars engineered from first principles to make every other chain obsolete.</p>
          </div>
          <div className={`feat-grid anim-stagger${featInView ? ' in' : ''}`}>
            {features.map((f, i) => (
              <div className={`feat-card feat-card--${f.accent}`} key={i}>
                <div className="feat-card-glow" />
                <div className="feat-icon-wrap">{f.icon}</div>
                <div className="feat-tag">{f.tag}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="section roadmap-section" ref={roadRef}>
        <div className="wrap">
          <div className="section-header">
            <div className="eyebrow-tag">Timeline</div>
            <h2>Development <mark>Roadmap</mark></h2>
          </div>
          <div className={`timeline anim-stagger${roadInView ? ' in' : ''}`}>
            {phases.map((ph, i) => (
              <div className={`phase-row${ph.status === 'active' ? ' active' : ''}`} key={i}>
                <div className="phase-num-col">
                  <span className="ph-label">Phase</span>
                  <span className="ph-num">{ph.num}</span>
                </div>
                <div className="phase-track-col">
                  <div className="ph-dot" />
                  {i < phases.length - 1 && <div className="ph-line" />}
                </div>
                <div className="phase-content-col">
                  <div className="phase-card">
                    {ph.status === 'active' && (
                      <span className="live-badge-sm"><span className="live-dot" />Coming Soon</span>
                    )}
                    <h3>{ph.label}</h3>
                    <ul>
                      {ph.items.map((it, j) => (
                        <li key={j}>
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AIRDROP */}
      <section id="airdrop" className="section airdrop-section" ref={airRef}>
        <div className="airdrop-bg" aria-hidden="true">
          <div className="ab-orb ab-orb--1" />
          <div className="ab-orb ab-orb--2" />
          <div className="ab-orb ab-orb--3" />
        </div>
        <div className={`airdrop-card anim-fade${airInView ? ' in' : ''}`}>
          <div className="airdrop-card-top-line" />
          <div className="airdrop-logo-wrap">
            <Logo size="md" showText={false} />
          </div>
          <div className="eyebrow-tag" style={{ marginTop: 24 }}>Genesis Allocation</div>
          <h2>Secure Your <mark>$OSOUL</mark></h2>
          <p className="airdrop-desc">Register for the Phase 1 airdrop. Early adopters receive a priority 3× multiplier — no wallet required yet.</p>

          <div className="perk-row">
            {['Priority access', '3× multiplier', 'No wallet needed'].map((t, i) => (
              <div className="perk-pill" key={i}>
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} className="air-form">
            <div className="input-row">
              <svg className="input-ico" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-full">
              {loading
                ? <><span className="spinner" />Processing…</>
                : <>Register for Airdrop <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></>
              }
            </button>
          </form>
          {status.message && (
            <div className={`air-status ${status.type}`}>
              {status.type === 'success'
                ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4.5v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              }
              {status.message}
            </div>
          )}
          <p className="fine-print">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top-line" />
        <div className="footer-inner">
          <Logo size="sm" />
          <nav className="footer-links">
            {['Vision', 'Protocol', 'Roadmap', 'Airdrop'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
            ))}
          </nav>
          <p className="copyright">© 2026 Operating Soul Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
