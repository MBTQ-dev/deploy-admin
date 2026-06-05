/**
 * MBTQ UNIVERSE — ADMIN SHELL v1.0
 * ─────────────────────────────────────────────
 * Framework-portable React app
 * Converts to: Next.js | Vue 3 | Svelte | Astro
 *
 * Modules:
 *   INTERNAL → PinkFlow · PinkSync · DeafAuth · FibronRose · Agents · DAO
 *   PRIVATE  → 360Magicians Console
 *
 * Architecture: Component-isolated, prop-driven, zero hard deps beyond React
 * Genmath: Fibonacci ratios used for spacing, scoring, and layout proportions
 * Deaf-first: Visual-only feedback, no audio gates, ASL-ready layouts
 */

import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg:        "#07070f",
  surface:   "#0d0d1a",
  surfaceAlt:"#111127",
  border:    "#1e1e3a",
  borderGlow:"#2a2a5a",
  // Accents by module
  pink:      "#ff4d8f",
  rose:      "#e8267a",
  cyan:      "#00e5ff",
  gold:      "#d4a843",
  emerald:   "#00ff94",
  violet:    "#9b59ff",
  amber:     "#ffb347",
  // Text
  textPrimary:  "#f0eeff",
  textSecondary:"#8888bb",
  textMuted:    "#4a4a7a",
  // Fibonacci-derived font sizes (px * 1.618 ratio)
  f0: "10px", f1: "12px", f2: "13px", f3: "15px", f4: "18px",
  f5: "24px", f6: "32px", f7: "52px",
};

// Fibonacci-based spacing scale (8 * Fib[n])
const FIB = [8, 8, 16, 24, 40, 64, 104, 168];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Syncopate:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body, #root {
      background: ${T.bg};
      color: ${T.textPrimary};
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: ${T.surface}; }
    ::-webkit-scrollbar-thumb { background: ${T.borderGlow}; border-radius: 2px; }

    .mono { font-family: 'Space Mono', monospace; }
    .synco { font-family: 'Syncopate', sans-serif; }

    @keyframes pulse-glow {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }
    @keyframes scan-line {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes fiber-in {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    .fib-in { animation: fiber-in 0.35s ease forwards; }
    .pulse   { animation: pulse-glow 2s ease-in-out infinite; }
    .float-anim { animation: float 4s ease-in-out infinite; }

    .shimmer-text {
      background: linear-gradient(90deg,
        ${T.textPrimary} 0%,
        ${T.cyan} 30%,
        ${T.pink} 50%,
        ${T.gold} 70%,
        ${T.textPrimary} 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }

    .btn {
      cursor: pointer;
      border: none;
      outline: none;
      font-family: 'Space Mono', monospace;
      font-size: ${T.f1};
      letter-spacing: 0.08em;
      transition: all 0.2s ease;
    }
    .btn:hover { filter: brightness(1.2); }
    .btn:active { transform: scale(0.97); }

    .card {
      background: ${T.surface};
      border: 1px solid ${T.border};
      border-radius: 12px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      border-color: ${T.borderGlow};
      box-shadow: 0 0 20px rgba(155, 89, 255, 0.08);
    }

    .tag {
      display: inline-flex; align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Space Mono', monospace;
      font-size: ${T.f0};
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    input, textarea, select {
      background: ${T.surfaceAlt};
      border: 1px solid ${T.border};
      border-radius: 8px;
      color: ${T.textPrimary};
      font-family: 'DM Sans', sans-serif;
      font-size: ${T.f3};
      padding: 10px 14px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
    }
    input:focus, textarea:focus, select:focus {
      border-color: ${T.violet};
      box-shadow: 0 0 0 3px rgba(155, 89, 255, 0.12);
    }

    .progress-bar {
      background: ${T.border};
      border-radius: 4px;
      height: 6px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Fibonacci spiral decoration */
    .fib-spiral {
      position: absolute;
      border-radius: 50%;
      border: 1px solid;
      pointer-events: none;
      opacity: 0.06;
    }
  `}</style>
);

// ─── FIB SPIRAL DECORATION ────────────────────────────────────────────────────
const FibSpiral = ({ color = T.violet, style = {} }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
    {[168, 104, 64, 40, 24].map((s, i) => (
      <div key={i} className="fib-spiral" style={{
        width: s, height: s,
        borderColor: color,
        right: -s * 0.2,
        bottom: -s * 0.2,
        opacity: 0.03 + i * 0.012,
      }} />
    ))}
  </div>
);

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const Badge = ({ label, color = T.violet, bg = null }) => (
  <span className="tag" style={{
    background: bg || `${color}22`,
    color: color,
    border: `1px solid ${color}44`,
  }}>{label}</span>
);

const StatusDot = ({ status }) => {
  const colors = { active: T.emerald, idle: T.amber, offline: T.textMuted, error: T.pink };
  return (
    <span style={{
      display: "inline-block",
      width: 8, height: 8,
      borderRadius: "50%",
      background: colors[status] || T.textMuted,
      boxShadow: status === "active" ? `0 0 8px ${colors.active}` : "none",
      animation: status === "active" ? "pulse-glow 2s ease-in-out infinite" : "none",
      flexShrink: 0,
    }} />
  );
};

const SectionHeader = ({ icon, title, subtitle, color = T.violet, action }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <h2 style={{
          fontFamily: "'Syncopate', sans-serif",
          fontSize: T.f5, fontWeight: 700,
          color: T.textPrimary, letterSpacing: "0.05em",
        }}>{title}</h2>
        {subtitle && <p style={{ fontSize: T.f2, color: T.textSecondary, marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

const MetricCard = ({ label, value, delta, color = T.violet, icon }) => (
  <div className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
    <FibSpiral color={color} />
    <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f6, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: T.f2, color: T.textSecondary, marginTop: 4 }}>{label}</div>
    {delta && <div style={{ fontSize: T.f1, color: delta > 0 ? T.emerald : T.pink, marginTop: 6 }}>
      {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
    </div>}
  </div>
);

const Pill = ({ children, active, color, onClick }) => (
  <button className="btn" onClick={onClick} style={{
    padding: "6px 14px",
    borderRadius: 20,
    background: active ? `${color}22` : "transparent",
    border: `1px solid ${active ? color : T.border}`,
    color: active ? color : T.textSecondary,
    fontSize: T.f1,
  }}>{children}</button>
);

// ─── MODULE: FRAMEWORK EXPORTER ───────────────────────────────────────────────
// @convert-to: Remove this component in production builds (admin-only UI utility)
const FrameworkExporter = () => {
  const [selected, setSelected] = useState(null);
  const frameworks = [
    { id: "nextjs",   label: "Next.js 15",  icon: "▲", color: T.textPrimary, note: "app/ dir + RSC" },
    { id: "vue3",     label: "Vue 3",        icon: "◈", color: T.emerald,     note: "Composition API" },
    { id: "svelte5",  label: "Svelte 5",     icon: "◆", color: T.amber,       note: "Runes syntax" },
    { id: "astro",    label: "Astro 4",      icon: "✦", color: T.violet,      note: "Islands arch" },
    { id: "remix",    label: "Remix",        icon: "⬡", color: T.pink,        note: "Loaders + Actions" },
  ];
  return (
    <div className="card" style={{ padding: 20, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>⚡</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textSecondary, letterSpacing: "0.1em" }}>
          FRAMEWORK EXPORT LAYER
        </span>
        <Badge label="DEV TOOL" color={T.amber} />
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {frameworks.map(f => (
          <button key={f.id} className="btn" onClick={() => setSelected(f.id === selected ? null : f.id)} style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: selected === f.id ? `${f.color}18` : T.surfaceAlt,
            border: `1px solid ${selected === f.id ? f.color : T.border}`,
            color: selected === f.id ? f.color : T.textSecondary,
            display: "flex", alignItems: "center", gap: 6,
            fontSize: T.f2,
          }}>
            <span>{f.icon}</span> {f.label}
            <span style={{ fontSize: T.f0, color: T.textMuted }}>{f.note}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{
          marginTop: 12, padding: "10px 14px",
          background: T.surfaceAlt, borderRadius: 8,
          fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textSecondary,
        }}>
          <span style={{ color: T.gold }}>$</span> mbtq export --framework={selected} --mode=admin --modules=all
          <span style={{ color: T.cyan, marginLeft: 8, animation: "blink 1s step-end infinite" }}>█</span>
        </div>
      )}
    </div>
  );
};

// ─── MODULE 1: PINKFLOW ───────────────────────────────────────────────────────
// @framework-note: Convert search handler to API route in Next.js
const PinkFlowModule = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState([]);

  const categories = ["all", "aria", "wcag", "asl", "keyboard", "contrast"];
  const db = [
    { id: 1, title: "ASL Navigation Pattern", cat: "asl", desc: "Sign-language-first nav with visual gesture indicators and skip-link equivalents", score: 98 },
    { id: 2, title: "Deaf-First Alert Component", cat: "aria", desc: "Visual flash + vibration alerts replacing audio cues, WCAG 2.1 AA compliant", score: 97 },
    { id: 3, title: "High Contrast Fibonacci Layout", cat: "contrast", desc: "Golden-ratio grid with 7:1 contrast ratios across all breakpoints", score: 94 },
    { id: 4, title: "Keyboard-Only Video Controls", cat: "keyboard", desc: "Full playback control sans pointer device, ASL-video optimized frame rates", score: 92 },
    { id: 5, title: "WCAG 2.2 Form Validation", cat: "wcag", desc: "Real-time visual feedback, no timed interactions, error identification without color alone", score: 96 },
    { id: 6, title: "Sign Language Caption Layer", cat: "asl", desc: "Embedded ASL caption track with simultaneous text + visual rendering pipeline", score: 99 },
  ];

  const filtered = db
    .filter(r => activeFilter === "all" || r.cat === activeFilter)
    .filter(r => !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase()));

  const catColors = { asl: T.cyan, aria: T.violet, keyboard: T.gold, wcag: T.emerald, contrast: T.pink };

  return (
    <div className="fib-in">
      <SectionHeader icon="🔍" title="PinkFlow" subtitle="Accessibility Query Interface — Deaf-first component discovery" color={T.cyan} />
      <FrameworkExporter />

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.cyan, fontSize: 16 }}>⌕</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search accessibility patterns, WCAG criteria, ASL components..."
          style={{ paddingLeft: 42, borderColor: T.cyan + "44", background: T.surface }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map(c => (
          <Pill key={c} active={activeFilter === c} color={catColors[c] || T.cyan} onClick={() => setActiveFilter(c)}>
            {c.toUpperCase()}
          </Pill>
        ))}
      </div>

      {/* Results */}
      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((r, i) => (
          <div key={r.id} className="card" style={{ padding: 18, display: "flex", gap: 16, alignItems: "flex-start", animationDelay: `${i * 0.05}s` }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: `${catColors[r.cat] || T.cyan}18`,
              border: `1px solid ${catColors[r.cat] || T.cyan}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Mono', monospace", fontSize: T.f1,
              color: catColors[r.cat] || T.cyan,
              flexShrink: 0,
            }}>{r.score}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: T.f3, fontWeight: 600, color: T.textPrimary }}>{r.title}</span>
                <Badge label={r.cat} color={catColors[r.cat] || T.cyan} />
              </div>
              <p style={{ fontSize: T.f2, color: T.textSecondary, lineHeight: 1.6 }}>{r.desc}</p>
            </div>
            <div className="progress-bar" style={{ width: 60, alignSelf: "center" }}>
              <div className="progress-fill" style={{ width: `${r.score}%`, background: catColors[r.cat] || T.cyan }} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: T.textMuted, fontFamily: "'Space Mono', monospace", fontSize: T.f2 }}>
            NO RESULTS — refine query or expand filters
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MODULE 2: PINKSYNC ───────────────────────────────────────────────────────
// @framework-note: Replace mock nodes with real Supabase/GraphQL queries
const PinkSyncModule = () => {
  const [activeEndpoint, setActiveEndpoint] = useState("/api/graph/nodes");
  const [response, setResponse] = useState(null);

  const endpoints = [
    { path: "/api/graph/nodes",     method: "GET",    color: T.emerald, desc: "Fetch all ecosystem nodes" },
    { path: "/api/graph/edges",     method: "GET",    color: T.emerald, desc: "Fetch trust relationships" },
    { path: "/api/sync/push",       method: "POST",   color: T.cyan,    desc: "Push media to PinkSync" },
    { path: "/api/sync/status/:id", method: "GET",    color: T.emerald, desc: "Check sync job status" },
    { path: "/api/webhook/trigger", method: "POST",   color: T.cyan,    desc: "Trigger webhook event" },
    { path: "/api/graph/anchor",    method: "DELETE", color: T.pink,    desc: "Remove anchored node" },
  ];

  const mockResponses = {
    "/api/graph/nodes": { nodes: 142, edges: 387, clusters: 7, lastSync: "2s ago", health: "nominal" },
    "/api/graph/edges": { total: 387, active: 312, flagged: 4, type_breakdown: { trust: 180, dao: 95, creator: 112 } },
    "/api/sync/push": { job_id: "psync_9f3a2b", status: "queued", eta_ms: 1200 },
    "/api/sync/status/:id": { job_id: "psync_9f3a2b", status: "complete", processed: "4 files", duration_ms: 892 },
    "/api/webhook/trigger": { triggered: true, subscribers: 14, latency_ms: 43 },
    "/api/graph/anchor": { removed: true, affected_edges: 3, warning: "trust_score recalculated" },
  };

  const methodColors = { GET: T.emerald, POST: T.cyan, DELETE: T.pink, PUT: T.gold };

  const nodes = [
    { id: "PinkSync", x: 50, y: 45, color: T.cyan, size: 22 },
    { id: "DeafAUTH", x: 20, y: 20, color: T.violet, size: 16 },
    { id: "FibonRose", x: 78, y: 22, color: T.rose, size: 18 },
    { id: "360Mag", x: 82, y: 70, color: T.gold, size: 14 },
    { id: "DAO", x: 18, y: 72, color: T.emerald, size: 14 },
    { id: "Agents", x: 50, y: 82, color: T.amber, size: 12 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[2,3],[4,5]];

  return (
    <div className="fib-in">
      <SectionHeader icon="⬡" title="PinkSync" subtitle="Graph API Visualization — Universal agnostic gateway" color={T.cyan} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Graph Viz */}
        <div className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: T.f1, color: T.textMuted, fontFamily: "'Space Mono', monospace", marginBottom: 12, letterSpacing: "0.1em" }}>
            LIVE GRAPH — {nodes.length} NODES / {edges.length} EDGES
          </div>
          <svg width="100%" viewBox="0 0 100 100" style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.bg }}>
            {edges.map(([a, b], i) => (
              <line key={i}
                x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
                stroke={T.borderGlow} strokeWidth="0.5" strokeDasharray="1,2"
              />
            ))}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={n.size / 5 + 2} fill={n.color} opacity={0.15} />
                <circle cx={n.x} cy={n.y} r={n.size / 5} fill={n.color} />
                <text x={n.x} y={n.y + n.size / 5 + 4} textAnchor="middle"
                  fill={T.textSecondary} fontSize="3" fontFamily="monospace">{n.id}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* API Explorer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {endpoints.map(ep => (
            <button key={ep.path} className="btn card" onClick={() => {
              setActiveEndpoint(ep.path);
              setResponse(mockResponses[ep.path]);
            }} style={{
              padding: "10px 14px", textAlign: "left", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              border: activeEndpoint === ep.path ? `1px solid ${T.cyan}` : undefined,
              background: activeEndpoint === ep.path ? `${T.cyan}08` : T.surface,
            }}>
              <span className="tag" style={{ background: `${methodColors[ep.method]}22`, color: methodColors[ep.method], border: `1px solid ${methodColors[ep.method]}44`, minWidth: 52, justifyContent: "center" }}>
                {ep.method}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.cyan }}>{ep.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response viewer */}
      {response && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, marginBottom: 12 }}>
            RESPONSE — <span style={{ color: T.emerald }}>200 OK</span> · <span style={{ color: T.textMuted }}>{activeEndpoint}</span>
          </div>
          <pre style={{
            fontFamily: "'Space Mono', monospace", fontSize: T.f1,
            color: T.textPrimary, lineHeight: 1.8,
            background: T.bg, borderRadius: 8, padding: 16,
            overflow: "auto", maxHeight: 180,
          }}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// ─── MODULE 3: DEAFAUTH ───────────────────────────────────────────────────────
// @framework-note: Replace PASETO mock with real /auth endpoint call
const DeafAuthModule = () => {
  const [tab, setTab] = useState("overview");
  const [signingIn, setSigningIn] = useState(false);
  const [done, setDone] = useState(false);

  const sessions = [
    { id: "da_0f3b", user: "pinky@mbtq.dev", role: "ADMIN", granted: "now", ip: "::1", active: true },
    { id: "da_9a12", user: "magician_arc@mbtq.dev", role: "MAGICIAN", granted: "4m ago", ip: "10.0.0.4", active: true },
    { id: "da_2c78", user: "creator_v@mbtq.dev", role: "CREATOR", granted: "22m ago", ip: "10.0.0.7", active: false },
  ];
  const roleColors = { ADMIN: T.gold, MAGICIAN: T.violet, CREATOR: T.cyan, DAO: T.emerald };

  return (
    <div className="fib-in">
      <SectionHeader icon="🔐" title="DeafAUTH" subtitle="PASETO-based auth — Identity cortex of the ecosystem" color={T.violet} />

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["overview", "sessions", "tokens"].map(t => (
          <Pill key={t} active={tab === t} color={T.violet} onClick={() => setTab(t)}>{t.toUpperCase()}</Pill>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            <MetricCard icon="👤" label="Active Sessions" value="2" color={T.violet} delta={12} />
            <MetricCard icon="🎟️" label="Tokens Issued" value="47" color={T.cyan} delta={8} />
            <MetricCard icon="🛡️" label="Auth Failures" value="0" color={T.emerald} />
          </div>

          {/* Visual auth flow — Deaf-first (no audio, full visual) */}
          <div className="card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
            <FibSpiral color={T.violet} />
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 20 }}>
              AUTH FLOW VISUALIZATION
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
              {["Sign Request", "PASETO Verify", "DeafAUTH Gate", "Role Assign", "Access Grant"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    padding: "8px 14px", borderRadius: 8,
                    background: `${T.violet}${18 + i * 8}`,
                    border: `1px solid ${T.violet}${44 + i * 10}`,
                    fontSize: T.f2, color: T.violet,
                    fontFamily: "'Space Mono', monospace",
                    whiteSpace: "nowrap",
                  }}>{step}</div>
                  {i < 4 && <div style={{ width: 24, height: 1, background: `${T.violet}44` }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "sessions" && (
        <div style={{ display: "grid", gap: 12 }}>
          {sessions.map(s => (
            <div key={s.id} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
              <StatusDot status={s.active ? "active" : "idle"} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: T.f3, fontWeight: 500 }}>{s.user}</span>
                  <Badge label={s.role} color={roleColors[s.role] || T.violet} />
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted, marginTop: 4 }}>
                  {s.id} · {s.ip} · {s.granted}
                </div>
              </div>
              <button className="btn" style={{
                padding: "4px 10px", borderRadius: 6,
                background: `${T.pink}18`, border: `1px solid ${T.pink}44`,
                color: T.pink, fontSize: T.f0,
              }}>REVOKE</button>
            </div>
          ))}
        </div>
      )}

      {tab === "tokens" && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, marginBottom: 16 }}>
            GENERATE PASETO TOKEN
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <input placeholder="User identifier / wallet address" style={{ borderColor: `${T.violet}44` }} />
            <select style={{ borderColor: `${T.violet}44` }}>
              <option>ROLE: ADMIN</option>
              <option>ROLE: MAGICIAN</option>
              <option>ROLE: CREATOR</option>
              <option>ROLE: DAO_VOTER</option>
              <option>ROLE: READONLY</option>
            </select>
            <button className="btn" onClick={() => { setSigningIn(true); setTimeout(() => { setSigningIn(false); setDone(true); }, 1200); }}
              style={{
                padding: "12px 24px", borderRadius: 8,
                background: signingIn ? `${T.violet}33` : `${T.violet}22`,
                border: `1px solid ${T.violet}`,
                color: T.violet, fontSize: T.f2,
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
              }}>
              {signingIn ? "⟳ SIGNING..." : done ? "✓ TOKEN ISSUED" : "ISSUE PASETO TOKEN"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MODULE 4: FIBRONROSE ─────────────────────────────────────────────────────
// @framework-note: Blockchain anchor calls go through PinkSync gateway
const FibronRoseModule = () => {
  const trustMetrics = [
    { label: "Identity Score",    score: 94, color: T.rose, fib: 89 },
    { label: "DAO Participation", score: 87, color: T.violet, fib: 55 },
    { label: "Creator Activity",  score: 92, color: T.cyan, fib: 89 },
    { label: "Stake Weight",      score: 78, color: T.gold, fib: 55 },
    { label: "Session Ledger",    score: 96, color: T.emerald, fib: 89 },
    { label: "Anchor Integrity",  score: 100, color: T.pink, fib: 144 },
  ];

  const ledger = [
    { ts: "14:03:11", event: "Creator session anchored", hash: "0xfb3a...2e1", type: "anchor" },
    { ts: "13:58:44", event: "DAO vote recorded", hash: "0x91cd...0f7", type: "dao" },
    { ts: "13:45:02", event: "Trust score recalculated", hash: null, type: "score" },
    { ts: "13:31:29", event: "ERC-1155 badge minted", hash: "0x4b7e...d3a", type: "badge" },
    { ts: "13:20:17", event: "Reputation edge created", hash: null, type: "graph" },
  ];
  const eventColors = { anchor: T.rose, dao: T.violet, score: T.gold, badge: T.cyan, graph: T.emerald };

  // Fibonacci spiral graph points
  const spiralPoints = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 2.399963; // golden angle in radians
    const r = 3 + i * 4.5;
    return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle), size: 2 + i * 0.5 };
  });

  return (
    <div className="fib-in">
      <SectionHeader icon="🌹" title="FibronRose" subtitle="Trust Dashboard — Ethics engine & blockchain anchor" color={T.rose} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, marginBottom: 24 }}>
        {/* Trust metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {trustMetrics.map((m, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: T.f2, color: T.textSecondary }}>{m.label}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f4, color: m.color, fontWeight: 700 }}>
                  {m.score}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${m.score}%`, background: `linear-gradient(90deg, ${m.color}88, ${m.color})` }} />
              </div>
              <div style={{ fontSize: T.f0, color: T.textMuted, marginTop: 6, fontFamily: "'Space Mono', monospace" }}>
                FIB WEIGHT: {m.fib}
              </div>
            </div>
          ))}
        </div>

        {/* Fibonacci spiral graph */}
        <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: T.f0, color: T.textMuted, fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", marginBottom: 12 }}>
            GENMATH GRAPH
          </div>
          <svg width="100%" viewBox="0 0 100 100" style={{ background: T.bg, borderRadius: 8 }}>
            {spiralPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.size}
                fill={`hsl(${340 + i * 15}, 80%, 60%)`} opacity={0.7 + i * 0.02}
              />
            ))}
            {spiralPoints.slice(1).map((p, i) => (
              <line key={i}
                x1={spiralPoints[i].x} y1={spiralPoints[i].y}
                x2={p.x} y2={p.y}
                stroke={T.rose} strokeWidth="0.3" opacity={0.3}
              />
            ))}
            <text x="50" y="53" textAnchor="middle" fill={T.rose} fontSize="5" fontFamily="monospace">φ</text>
          </svg>
          <div style={{ marginTop: 10, fontSize: T.f0, color: T.textMuted, textAlign: "center", fontFamily: "'Space Mono', monospace" }}>
            φ = 1.618<br />TRUST SPIRAL
          </div>
        </div>
      </div>

      {/* Session Ledger */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 16 }}>
          SESSION LEDGER — BLOCKCHAIN ANCHORED
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {ledger.map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: T.surfaceAlt }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: eventColors[entry.type], flexShrink: 0 }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted, flexShrink: 0 }}>{entry.ts}</span>
              <span style={{ flex: 1, fontSize: T.f2, color: T.textPrimary }}>{entry.event}</span>
              {entry.hash && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: eventColors[entry.type] }}>{entry.hash}</span>
              )}
              <Badge label={entry.type} color={eventColors[entry.type]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MODULE 5: AGENTS ─────────────────────────────────────────────────────────
// @framework-note: WebSocket connection replaces polling in production
const AgentsModule = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 3000); return () => clearInterval(t); }, []);

  const agents = [
    { id: "agent_arc_01", name: "ARC-01", role: "Accessibility Auditor", status: "active", tasks: 4, cpu: 12, color: T.cyan },
    { id: "agent_fibr_02", name: "FIBR-02", role: "Trust Scorer", status: "active", tasks: 8, cpu: 34, color: T.rose },
    { id: "agent_sync_03", name: "SYNC-03", role: "Media Processor", status: "active", tasks: 2, cpu: 67, color: T.emerald },
    { id: "agent_dao_04", name: "DAO-04", role: "Governance Monitor", status: "idle", tasks: 0, cpu: 0, color: T.gold },
    { id: "agent_auth_05", name: "AUTH-05", role: "Session Watchdog", status: "active", tasks: 1, cpu: 8, color: T.violet },
    { id: "agent_ml_06", name: "ML-06", role: "Sign Recognizer", status: "idle", tasks: 0, cpu: 2, color: T.amber },
  ];

  const logs = [
    `[${new Date().toLocaleTimeString()}] SYNC-03 completed job psync_9f3a2b — 4 files processed`,
    `[${new Date(Date.now()-12000).toLocaleTimeString()}] FIBR-02 recalculated trust scores — 14 nodes updated`,
    `[${new Date(Date.now()-35000).toLocaleTimeString()}] ARC-01 flagged 2 contrast violations in /creator/upload`,
    `[${new Date(Date.now()-62000).toLocaleTimeString()}] AUTH-05 session watchdog: 0 anomalies detected`,
    `[${new Date(Date.now()-88000).toLocaleTimeString()}] DAO-04 entering standby — no active proposals`,
  ];

  return (
    <div className="fib-in">
      <SectionHeader icon="🤖" title="Agents" subtitle="AI Agent Status — All agents in recommend-only mode" color={T.emerald}
        action={<Badge label="WRITE-LOCKED" color={T.pink} />}
      />

      {/* System overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <MetricCard icon="✅" label="Active Agents" value={agents.filter(a => a.status === "active").length} color={T.emerald} />
        <MetricCard icon="💤" label="Idle Agents" value={agents.filter(a => a.status === "idle").length} color={T.amber} />
        <MetricCard icon="📋" label="Queued Tasks" value={agents.reduce((s, a) => s + a.tasks, 0)} color={T.cyan} />
        <MetricCard icon="🔒" label="Write Access" value="NONE" color={T.pink} />
      </div>

      {/* Agent cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
        {agents.map(a => (
          <div key={a.id} className="card" style={{ padding: 18, position: "relative", overflow: "hidden" }}>
            <FibSpiral color={a.color} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: `${a.color}18`, border: `1px solid ${a.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f3, color: a.color }}>{a.name}</span>
                  <StatusDot status={a.status} />
                </div>
                <div style={{ fontSize: T.f2, color: T.textSecondary }}>{a.role}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <span style={{ fontSize: T.f1, color: T.textMuted }}>Tasks: <span style={{ color: T.textPrimary }}>{a.tasks}</span></span>
                  <span style={{ fontSize: T.f1, color: T.textMuted }}>CPU: <span style={{ color: a.color }}>{a.cpu}%</span></span>
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{ width: `${a.cpu || 2}%`, background: a.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity log */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 14 }}>
          LIVE ACTIVITY LOG <span className="pulse" style={{ color: T.emerald }}>●</span>
        </div>
        {logs.map((l, i) => (
          <div key={`${i}-${tick}`} style={{
            fontSize: T.f1, fontFamily: "'Space Mono', monospace",
            color: i === 0 ? T.textPrimary : T.textMuted,
            padding: "6px 0", borderBottom: i < logs.length - 1 ? `1px solid ${T.border}` : "none",
            lineHeight: 1.6,
          }}>{l}</div>
        ))}
      </div>
    </div>
  );
};

// ─── MODULE 6: DAO ────────────────────────────────────────────────────────────
// @framework-note: Replace mock votes with on-chain read via ethers.js/wagmi
const DAOModule = () => {
  const [voted, setVoted] = useState({});

  const proposals = [
    { id: "MBP-018", title: "Allocate 500 MBTQ to Deaf Creator Fund Q2", status: "active", for: 68, against: 12, abstain: 8, ends: "3d 4h", type: "treasury" },
    { id: "MBP-017", title: "Enable FibonRose ERC-1155 Badge Tier IV", status: "active", for: 82, against: 5, abstain: 2, ends: "1d 12h", type: "protocol" },
    { id: "MBP-016", title: "Add ML-06 as permanent sign recognizer agent", status: "passed", for: 94, against: 3, abstain: 1, ends: "Ended", type: "governance" },
    { id: "MBP-015", title: "Deprecate legacy PinkFlow v0 endpoint", status: "passed", for: 76, against: 18, abstain: 6, ends: "Ended", type: "infra" },
  ];

  const typeColors = { treasury: T.gold, protocol: T.violet, governance: T.emerald, infra: T.cyan };

  return (
    <div className="fib-in">
      <SectionHeader icon="🏛️" title="DAO" subtitle="Governance Interface — Community-controlled deployment permissions" color={T.gold} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricCard icon="📜" label="Active Proposals" value="2" color={T.gold} />
        <MetricCard icon="🗳️" label="Total Votes Cast" value="1.4k" color={T.violet} delta={22} />
        <MetricCard icon="✅" label="Proposals Passed" value="14" color={T.emerald} />
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {proposals.map(p => (
          <div key={p.id} className="card" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
            <FibSpiral color={typeColors[p.type]} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted }}>{p.id}</span>
                  <Badge label={p.type} color={typeColors[p.type]} />
                  <Badge label={p.status} color={p.status === "active" ? T.emerald : T.textMuted} />
                </div>
                <h3 style={{ fontSize: T.f4, fontWeight: 500, color: T.textPrimary }}>{p.title}</h3>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                {p.ends}
              </div>
            </div>

            {/* Vote bars */}
            <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
              {[{ label: "FOR", val: p.for, color: T.emerald }, { label: "AGAINST", val: p.against, color: T.pink }, { label: "ABSTAIN", val: p.abstain, color: T.textMuted }].map(v => (
                <div key={v.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: v.color, width: 48 }}>{v.label}</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${v.val}%`, background: v.color }} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textSecondary, width: 32, textAlign: "right" }}>{v.val}%</span>
                </div>
              ))}
            </div>

            {p.status === "active" && !voted[p.id] && (
              <div style={{ display: "flex", gap: 8 }}>
                {["FOR", "AGAINST", "ABSTAIN"].map((v, i) => (
                  <button key={v} className="btn" onClick={() => setVoted(prev => ({ ...prev, [p.id]: v }))} style={{
                    padding: "8px 16px", borderRadius: 8, flex: 1,
                    background: [`${T.emerald}18`, `${T.pink}18`, `${T.textMuted}18`][i],
                    border: `1px solid ${[T.emerald, T.pink, T.textMuted][i]}44`,
                    color: [T.emerald, T.pink, T.textMuted][i],
                    fontSize: T.f1,
                  }}>{v}</button>
                ))}
              </div>
            )}
            {voted[p.id] && (
              <div style={{ padding: "10px 16px", borderRadius: 8, background: `${T.emerald}12`, border: `1px solid ${T.emerald}33`, fontSize: T.f2, color: T.emerald, fontFamily: "'Space Mono', monospace" }}>
                ✓ VOTED {voted[p.id]} — ANCHORING TO CHAIN...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MODULE 7: 360 MAGICIANS (PRIVATE) ────────────────────────────────────────
// @access: PRIVATE — requires MAGICIAN role PASETO token
// @framework-note: Gate this entire module behind server-side role check
const MagiciansModule = () => {
  const [activeAgent, setActiveAgent] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const magicians = [
    { id: "mag_arc",   name: "ARCHITECT",   glyph: "△", color: T.violet,  role: "System design & infra planning",     model: "claude-sonnet", scope: ["read:all", "recommend:infra"] },
    { id: "mag_def",   name: "DEFENDER",    glyph: "🛡", color: T.emerald, role: "Security audit & access review",     model: "claude-sonnet", scope: ["read:auth", "recommend:security"] },
    { id: "mag_crft",  name: "CRAFTSMAN",   glyph: "⚒", color: T.gold,    role: "UI/UX & accessibility builder",      model: "claude-sonnet", scope: ["read:frontend", "recommend:ui"] },
    { id: "mag_orc",   name: "ORACLE",      glyph: "👁", color: T.cyan,    role: "Data insights & trust analysis",     model: "claude-sonnet", scope: ["read:fibronrose", "recommend:data"] },
    { id: "mag_chr",   name: "CHRONICLER",  glyph: "📖", color: T.rose,    role: "Session ledger & audit trail",       model: "claude-sonnet", scope: ["read:ledger", "recommend:audit"] },
    { id: "mag_sig",   name: "SIGNAL",      glyph: "〜", color: T.amber,   role: "PinkSync routing & media ops",       model: "claude-sonnet", scope: ["read:pinksync", "recommend:media"] },
  ];

  const handleRecommend = async () => {
    if (!prompt.trim() || !activeAgent) return;
    setLoading(true);
    const agent = magicians.find(m => m.id === activeAgent);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ${agent.name}, a 360Magician in the MBTQ Universe ecosystem. Your role: ${agent.role}. 
You operate in RECOMMEND-ONLY mode — you have zero write access to production. You analyze and advise.
Your scope: ${agent.scope.join(", ")}.
The ecosystem is Deaf-first, Fibonacci-driven, DAO-governed, with PinkSync as the gateway, DeafAUTH as identity, FibronRose as trust engine.
Respond concisely as ${agent.name}. Format recommendations as numbered action items. Be precise, technical, and ecosystem-aware.`,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "No recommendation generated.";
      setRecommendations(prev => [{
        agent: agent.name, color: agent.color, glyph: agent.glyph,
        prompt, text, ts: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 10));
      setPrompt("");
    } catch {
      setRecommendations(prev => [{ agent: agent.name, color: agent.color, glyph: agent.glyph, prompt, text: "⚠ API unreachable — ensure Claude API key is configured.", ts: new Date().toLocaleTimeString() }, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="fib-in">
      <SectionHeader icon="✦" title="360 Magicians" subtitle="Private Magicians Console — Recommend-only AI agents" color={T.violet}
        action={<div style={{ display: "flex", gap: 8 }}>
          <Badge label="PRIVATE" color={T.rose} />
          <Badge label="WRITE: LOCKED" color={T.pink} />
        </div>}
      />

      {/* Agent selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 14 }}>
          SELECT MAGICIAN
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {magicians.map(m => (
            <button key={m.id} className="btn card" onClick={() => setActiveAgent(m.id === activeAgent ? null : m.id)} style={{
              padding: "16px", textAlign: "left", cursor: "pointer",
              border: activeAgent === m.id ? `1px solid ${m.color}` : `1px solid ${T.border}`,
              background: activeAgent === m.id ? `${m.color}10` : T.surface,
              position: "relative", overflow: "hidden",
            }}>
              <FibSpiral color={m.color} style={{ opacity: activeAgent === m.id ? 1 : 0 }} />
              <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: T.f5, marginBottom: 8 }}>{m.glyph}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f2, color: m.color, fontWeight: 700, marginBottom: 4 }}>
                {m.name}
              </div>
              <div style={{ fontSize: T.f1, color: T.textMuted, lineHeight: 1.5 }}>{m.role}</div>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.scope.map(s => <Badge key={s} label={s} color={m.color} />)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt interface */}
      {activeAgent && (
        <div className="card" style={{ padding: 22, marginBottom: 24 }}>
          {(() => {
            const agent = magicians.find(m => m.id === activeAgent);
            return (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Syncopate', sans-serif", fontSize: T.f4 }}>{agent.glyph}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", color: agent.color, fontSize: T.f3 }}>{agent.name}</span>
                  <Badge label="RECOMMEND ONLY" color={agent.color} />
                </div>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={`Ask ${agent.name} for a recommendation...`}
                  rows={4}
                  style={{ marginBottom: 12, borderColor: `${agent.color}44`, resize: "vertical" }}
                  onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleRecommend(); }}
                />
                <button className="btn" onClick={handleRecommend} disabled={loading || !prompt.trim()} style={{
                  padding: "12px 28px", borderRadius: 8,
                  background: loading ? `${agent.color}22` : `${agent.color}18`,
                  border: `1px solid ${agent.color}${loading ? "44" : ""}`,
                  color: loading ? T.textMuted : agent.color,
                  fontSize: T.f2,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {loading ? <>⟳ CONSULTING {agent.name}...</> : <>✦ GET RECOMMENDATION</>}
                </button>
                <div style={{ marginTop: 8, fontSize: T.f0, color: T.textMuted, fontFamily: "'Space Mono', monospace" }}>
                  ⌘+ENTER to submit · All recommendations logged to FibronRose ledger
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Recommendation log */}
      {recommendations.length > 0 && (
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 14 }}>
            RECOMMENDATION LOG
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {recommendations.map((r, i) => (
              <div key={i} className="card" style={{ padding: 20, borderLeft: `3px solid ${r.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: T.f4 }}>{r.glyph}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", color: r.color, fontWeight: 700 }}>{r.agent}</span>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted }}>{r.ts}</span>
                </div>
                <div style={{ fontSize: T.f1, color: T.textMuted, fontFamily: "'Space Mono', monospace", marginBottom: 10, padding: "8px 12px", background: T.surfaceAlt, borderRadius: 6 }}>
                  ❯ {r.prompt}
                </div>
                <div style={{ fontSize: T.f2, color: T.textPrimary, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!activeAgent && recommendations.length === 0 && (
        <div style={{ textAlign: "center", padding: 64 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} className="float-anim">✦</div>
          <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: T.f4, color: T.textMuted, letterSpacing: "0.15em" }}>
            SELECT A MAGICIAN TO BEGIN
          </div>
          <div style={{ marginTop: 8, fontSize: T.f2, color: T.textMuted }}>
            All magicians operate in recommend-only mode
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_INTERNAL = [
  { id: "pinkflow",   label: "PinkFlow",   icon: "🔍", color: T.cyan },
  { id: "pinksync",   label: "PinkSync",   icon: "⬡",  color: T.cyan },
  { id: "deafauth",   label: "DeafAUTH",   icon: "🔐", color: T.violet },
  { id: "fibronrose", label: "FibronRose", icon: "🌹", color: T.rose },
  { id: "agents",     label: "Agents",     icon: "🤖", color: T.emerald },
  { id: "dao",        label: "DAO",        icon: "🏛️", color: T.gold },
];

const Sidebar = ({ active, setActive, privateView, setPrivateView }) => (
  <div style={{
    width: 220, flexShrink: 0,
    background: T.surface,
    borderRight: `1px solid ${T.border}`,
    display: "flex", flexDirection: "column",
    height: "100vh", position: "sticky", top: 0,
    overflow: "hidden",
  }}>
    {/* Logo */}
    <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${T.border}` }}>
      <div className="synco shimmer-text" style={{ fontSize: T.f5, fontWeight: 700, letterSpacing: "0.1em" }}>MBTQ</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted, marginTop: 4, letterSpacing: "0.12em" }}>
        UNIVERSE · ADMIN
      </div>
    </div>

    {/* View toggle */}
    <div style={{ padding: "14px 14px 0" }}>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}` }}>
        <button className="btn" onClick={() => setPrivateView(false)} style={{
          flex: 1, padding: "7px 0", fontSize: T.f0,
          background: !privateView ? `${T.violet}22` : "transparent",
          color: !privateView ? T.violet : T.textMuted,
          letterSpacing: "0.08em",
        }}>INTERNAL</button>
        <button className="btn" onClick={() => setPrivateView(true)} style={{
          flex: 1, padding: "7px 0", fontSize: T.f0,
          background: privateView ? `${T.violet}22` : "transparent",
          color: privateView ? T.violet : T.textMuted,
          letterSpacing: "0.08em",
          borderLeft: `1px solid ${T.border}`,
        }}>PRIVATE</button>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: "14px 0", overflowY: "auto" }}>
      {!privateView && (
        <div>
          <div style={{ padding: "0 20px 8px", fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted, letterSpacing: "0.12em" }}>
            MODULES
          </div>
          {NAV_INTERNAL.map(item => (
            <button key={item.id} className="btn" onClick={() => setActive(item.id)} style={{
              width: "100%", padding: "11px 20px",
              display: "flex", alignItems: "center", gap: 10,
              background: active === item.id ? `${item.color}14` : "transparent",
              borderLeft: active === item.id ? `3px solid ${item.color}` : "3px solid transparent",
              color: active === item.id ? item.color : T.textSecondary,
              fontSize: T.f2, textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      )}

      {privateView && (
        <div>
          <div style={{ padding: "0 20px 8px", fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted, letterSpacing: "0.12em" }}>
            PRIVATE
          </div>
          <button className="btn" onClick={() => setActive("magicians")} style={{
            width: "100%", padding: "11px 20px",
            display: "flex", alignItems: "center", gap: 10,
            background: `${T.violet}14`,
            borderLeft: `3px solid ${T.violet}`,
            color: T.violet, fontSize: T.f2, textAlign: "left",
          }}>
            <span style={{ fontSize: 16 }}>✦</span> 360 Magicians
          </button>
        </div>
      )}
    </nav>

    {/* Footer */}
    <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <StatusDot status="active" />
        <div>
          <div style={{ fontSize: T.f2, color: T.textPrimary }}>pinky@mbtq.dev</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.gold }}>ADMIN</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const TopBar = ({ module, privateView }) => (
  <div style={{
    height: 56,
    borderBottom: `1px solid ${T.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px",
    background: T.surface,
    flexShrink: 0,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f1, color: T.textMuted }}>/</span>
      {privateView && <Badge label="PRIVATE" color={T.rose} />}
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f2, color: T.textSecondary }}>
        {module.toUpperCase()}
      </span>
    </div>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: T.f0, color: T.textMuted }}>
        φ = 1.618034 &nbsp;·&nbsp; GENMATH ACTIVE
      </div>
      <div style={{ width: 1, height: 18, background: T.border }} />
      <Badge label="v1.0.0" color={T.textMuted} />
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: `${T.violet}22`, border: `1px solid ${T.violet}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, cursor: "pointer",
      }}>⚙</div>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
/**
 * CONVERSION GUIDE:
 * ─────────────────
 * Next.js  → Move each Module to app/(admin)/[module]/page.tsx
 *             TopBar → layout.tsx server component
 *             Sidebar → client component with "use client"
 *             MagiciansModule → app/(private)/magicians/page.tsx + middleware auth
 *
 * Vue 3    → Each Module becomes a <script setup> SFC
 *             Sidebar becomes a persistent layout component
 *             Replace useState → ref/reactive, useEffect → onMounted
 *
 * Svelte 5 → Each Module as a .svelte file with $state() runes
 *             Sidebar as a layout snippet
 *
 * Astro    → Static modules as .astro files, Magicians as React island
 */
export default function MBTQAdminShell() {
  const [active, setActive] = useState("pinkflow");
  const [privateView, setPrivateView] = useState(false);

  useEffect(() => {
    if (privateView) setActive("magicians");
    else setActive("pinkflow");
  }, [privateView]);

  const modules = {
    pinkflow:   <PinkFlowModule />,
    pinksync:   <PinkSyncModule />,
    deafauth:   <DeafAuthModule />,
    fibronrose: <FibronRoseModule />,
    agents:     <AgentsModule />,
    dao:        <DAOModule />,
    magicians:  <MagiciansModule />,
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
        <Sidebar active={active} setActive={setActive} privateView={privateView} setPrivateView={setPrivateView} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <TopBar module={active} privateView={privateView} />
          <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            {modules[active]}
          </main>
        </div>
      </div>
    </>
  );
}
