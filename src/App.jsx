import { useState, useEffect, useCallback } from "react";

// ── BRAND TOKENS ──────────────────────────────────────────────
const C = {
  bg: "#F3EEE4",
  bg2: "#EBE4D5",
  bg3: "#E2D9C5",
  paper: "#FAF7F0",
  ink: "#1A1714",
  ink2: "#4A4239",
  ink3: "#847A6C",
  line: "#D9CFB9",
  line2: "#C8BCA1",
  accent: "#C2802F",
  accent2: "#8C5A1C",
  dark: "#111009",
  darkInk: "#F3EEE4",
  darkInk2: "#B8AFA0",
  red: "#C0392B",
  green: "#27AE60",
};

// ── STORAGE HELPERS ───────────────────────────────────────────
const STORAGE_KEY = "graybrief_user";

async function saveData(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch {}
}
async function loadData(key) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function deleteData(key) {
  try { await window.storage.delete(key); } catch {}
}

// ── ICONS ──────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    check: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.36 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── LOGO ──────────────────────────────────────────────────────
const Logo = ({ size = "md" }) => {
  const s = size === "lg" ? { gray: 28, brief: 28 } : { gray: 18, brief: 18 };
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 1 }}>
      <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: s.gray, color: C.ink, letterSpacing: "-0.03em" }}>Gray</span>
      <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: s.brief, color: C.accent, letterSpacing: "-0.02em" }}>Brief</span>
    </span>
  );
};

// ── BUTTON ────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", size = "md", disabled = false, style = {} }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 100, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif", fontWeight: 500, transition: "all 0.15s", opacity: disabled ? 0.5 : 1, ...style };
  const variants = {
    primary: { background: C.ink, color: C.paper, padding: size === "sm" ? "8px 16px" : "11px 22px", fontSize: size === "sm" ? 13 : 15 },
    accent: { background: C.accent, color: "#fff", padding: size === "sm" ? "8px 16px" : "11px 22px", fontSize: size === "sm" ? 13 : 15 },
    ghost: { background: "transparent", color: C.ink2, padding: size === "sm" ? "8px 16px" : "11px 22px", fontSize: size === "sm" ? 13 : 15, border: `1px solid ${C.line2}` },
    danger: { background: C.red, color: "#fff", padding: size === "sm" ? "8px 16px" : "11px 22px", fontSize: size === "sm" ? 13 : 15 },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

// ── INPUT ─────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.ink2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "system-ui" }}>{label}{required && " *"}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: `1px solid ${C.line2}`, borderRadius: 10, padding: "11px 16px", fontSize: 15, fontFamily: "system-ui", color: C.ink, background: C.paper, outline: "none", width: "100%", boxSizing: "border-box" }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder = "", rows = 3 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.ink2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "system-ui" }}>{label}</label>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ border: `1px solid ${C.line2}`, borderRadius: 10, padding: "11px 16px", fontSize: 15, fontFamily: "system-ui", color: C.ink, background: C.paper, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" }} />
  </div>
);

// ── CARD ──────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.04)", ...style }}>{children}</div>
);

// ── SECTION HEADER ────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, fontFamily: "system-ui", fontWeight: 600, marginBottom: 6 }}>{eyebrow}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, fontFamily: "system-ui", letterSpacing: "-0.02em" }}>{title}</div>
  </div>
);

// ── AUTH SCREEN ───────────────────────────────────────────────
const AuthScreen = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    if (mode === "signup" && !name) { setError("Your name is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const userKey = `user_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    if (mode === "signup") {
      const existing = await loadData(userKey);
      if (existing) { setError("An account with this email already exists."); setLoading(false); return; }
      const user = { email, name, password, createdAt: new Date().toISOString() };
      await saveData(userKey, user);
      onAuth({ email, name, userKey });
    } else {
      const user = await loadData(userKey);
      if (!user || user.password !== password) { setError("Invalid email or password."); setLoading(false); return; }
      onAuth({ email: user.email, name: user.name, userKey });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Logo size="lg" />
          <div style={{ marginTop: 12, fontSize: 15, color: C.ink2, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Your AAYL emergency toolkit</div>
        </div>
        <Card>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 0, background: C.bg2, borderRadius: 100, padding: 3 }}>
              {["login", "signup"].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "system-ui", transition: "all 0.15s", background: mode === m ? C.paper : "transparent", color: mode === m ? C.ink : C.ink3, boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {m === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && <Input label="Your name" value={name} onChange={setName} placeholder="Ashley" required />}
            <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="6+ characters" required />
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#FDEDEC", borderRadius: 10, color: C.red, fontSize: 13, fontFamily: "system-ui" }}>
                <Icon name="alert" size={14} color={C.red} /> {error}
              </div>
            )}
            <Btn onClick={handle} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "One moment..." : mode === "login" ? "Sign in" : "Create account"}
            </Btn>
          </div>
          <div style={{ marginTop: 20, padding: "14px 16px", background: C.bg2, borderRadius: 10, fontSize: 12, color: C.ink3, fontFamily: "system-ui", lineHeight: 1.5 }}>
            GrayBrief is an organizational tool, not a secure document vault. Do not store passwords or full account numbers. See our Terms of Service for full data usage details.
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── NAV ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "organizer", label: "Document Organizer", icon: "file" },
  { id: "checklists", label: "Checklists", icon: "check" },
  { id: "contacts", label: "Emergency Contacts", icon: "phone" },
];

const Nav = ({ active, setActive, onLogout, userName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <div style={{ width: 240, minHeight: "100vh", background: C.dark, display: "flex", flexDirection: "column", padding: "24px 16px", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ marginBottom: 36, paddingLeft: 8 }}>
          <Logo size="md" />
          <div style={{ marginTop: 6, fontSize: 11, color: C.darkInk2, fontFamily: "system-ui", letterSpacing: "0.06em", textTransform: "uppercase" }}>AAYL Toolkit</div>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "system-ui", fontSize: 14, fontWeight: active === item.id ? 600 : 400, transition: "all 0.15s", background: active === item.id ? C.accent : "transparent", color: active === item.id ? "#fff" : C.darkInk2, textAlign: "left" }}>
              <Icon name={item.icon} size={16} color={active === item.id ? "#fff" : C.darkInk2} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: `1px solid #2A2720`, paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingLeft: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "system-ui" }}>{userName?.[0]?.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 13, color: C.darkInk, fontFamily: "system-ui", fontWeight: 500 }}>{userName}</div>
          </div>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", color: C.darkInk2, fontSize: 13, fontFamily: "system-ui", padding: "8px 4px" }}>
            <Icon name="logout" size={14} color={C.darkInk2} /> Sign out
          </button>
        </div>
      </div>
      {/* Spacer */}
      <div style={{ width: 240, flexShrink: 0 }} />
    </>
  );
};

// ── DASHBOARD ─────────────────────────────────────────────────
const Dashboard = ({ userData, setActive }) => {
  const completedModules = Object.values(userData.checklists || {}).filter(m => {
    const items = Object.values(m);
    return items.length > 0 && items.every(Boolean);
  }).length;
  const totalContacts = (userData.contacts || []).length;
  const orgFields = Object.values(userData.organizer || {}).filter(v => v && v.toString().trim()).length;

  const stats = [
    { label: "Modules completed", value: `${completedModules}/10`, nav: "checklists" },
    { label: "Emergency contacts", value: totalContacts, nav: "contacts" },
    { label: "Organizer fields filled", value: orgFields, nav: "organizer" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, fontFamily: "system-ui", fontWeight: 600, marginBottom: 8 }}>Your AAYL Toolkit</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: C.ink, fontFamily: "system-ui", letterSpacing: "-0.03em", margin: 0 }}>Good to see you.</h1>
        <p style={{ marginTop: 8, fontSize: 16, color: C.ink2, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Everything you need is here — before you need it.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ cursor: "pointer", transition: "box-shadow 0.15s" }} onClick={() => setActive(s.nav)}>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.accent, fontFamily: "Georgia, serif", marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: C.ink2, fontFamily: "system-ui" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {NAV_ITEMS.filter(n => n.id !== "dashboard").map(item => (
          <Card key={item.id} style={{ cursor: "pointer" }} onClick={() => setActive(item.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={item.icon} size={18} color={C.accent} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, fontFamily: "system-ui" }}>{item.label}</div>
            </div>
            <div style={{ fontSize: 13, color: C.ink2, fontFamily: "system-ui", lineHeight: 1.5 }}>
              {item.id === "organizer" && "Store legal documents, medical info, financial contacts, and final wishes."}
              {item.id === "checklists" && "Track your progress through all 10 AAYL Playbook modules."}
              {item.id === "contacts" && "Keep emergency contacts ready for the moment you need them."}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: "20px 24px", background: C.dark, borderRadius: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 28, fontFamily: "Georgia, serif", color: C.accent, fontWeight: 700 }}>!</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.darkInk, fontFamily: "system-ui", marginBottom: 4 }}>Share this toolkit with your family</div>
          <div style={{ fontSize: 13, color: C.darkInk2, fontFamily: "system-ui" }}>At least two family members should know this information exists and where to find it.</div>
        </div>
      </div>
    </div>
  );
};

// ── DOCUMENT ORGANIZER ────────────────────────────────────────
const ORGANIZER_SECTIONS = [
  {
    id: "aayl", title: "About Your AAYL", fields: [
      { id: "fullName", label: "Full legal name" },
      { id: "dob", label: "Date of birth" },
      { id: "address", label: "Current address" },
      { id: "phone", label: "Primary phone" },
      { id: "ssn", label: "Social Security number (store with caution)", placeholder: "Last 4 digits only recommended" },
    ]
  },
  {
    id: "legal", title: "Legal Documents", fields: [
      { id: "willLocation", label: "Will — location", placeholder: "e.g. Attorney's office, home safe" },
      { id: "willUpdated", label: "Will — last updated" },
      { id: "dpoaName", label: "Durable POA — holder's name" },
      { id: "dpoaLocation", label: "Durable POA — document location" },
      { id: "hcpoaName", label: "Healthcare POA / Proxy — holder's name" },
      { id: "adLocation", label: "Advance Directive — location" },
      { id: "trustLocation", label: "Trust documents — location (if applicable)" },
    ]
  },
  {
    id: "medical", title: "Medical Information", fields: [
      { id: "primaryCare", label: "Primary care physician — name + phone" },
      { id: "specialists", label: "Specialist(s) — name + phone" },
      { id: "conditions", label: "Current diagnoses / medical conditions" },
      { id: "allergies", label: "Known allergies" },
      { id: "medications", label: "Current medications (or note where list is stored)" },
      { id: "healthInsurance", label: "Health insurance carrier + ID#" },
      { id: "medicareNumber", label: "Medicare number" },
      { id: "supplemental", label: "Medigap / Medicare Advantage carrier + ID#" },
      { id: "ltcInsurance", label: "Long-term care insurance carrier + policy#" },
    ]
  },
  {
    id: "financial", title: "Financial Accounts", fields: [
      { id: "checking", label: "Checking account — bank name" },
      { id: "savings", label: "Savings account — bank name" },
      { id: "retirement", label: "Retirement accounts (IRA, 401k) — institution" },
      { id: "lifeInsurance", label: "Life insurance — carrier + beneficiary" },
      { id: "pension", label: "Pension — provider + contact" },
      { id: "ssAmount", label: "Social Security monthly benefit" },
      { id: "safeDeposit", label: "Safe deposit box — location + key location" },
    ]
  },
  {
    id: "property", title: "Property and Assets", fields: [
      { id: "homeAddress", label: "Primary home — address" },
      { id: "deedLocation", label: "Deed — location" },
      { id: "mortgage", label: "Mortgage lender + account# (if applicable)" },
      { id: "vehicle", label: "Vehicle(s) — make/model + title location" },
      { id: "otherProperty", label: "Other real estate or significant assets" },
    ]
  },
  {
    id: "professionals", title: "Key Professionals", fields: [
      { id: "elderLawAttorney", label: "Elder law attorney — name + phone" },
      { id: "financialAdvisor", label: "Financial advisor — name + phone" },
      { id: "accountant", label: "Accountant / tax preparer — name + phone" },
      { id: "insuranceAgent", label: "Insurance agent — name + phone" },
      { id: "gcm", label: "Geriatric care manager — name + phone (if applicable)" },
    ]
  },
  {
    id: "wishes", title: "Final Wishes", fields: [
      { id: "funeralHome", label: "Funeral home — name (if pre-arranged)" },
      { id: "funeralPrefs", label: "Burial / cremation preference" },
      { id: "organDonation", label: "Organ donation preference + documentation location" },
      { id: "obituaryNotes", label: "Obituary notes or special wishes" },
    ]
  },
];

const Organizer = ({ data, onSave }) => {
  const [fields, setFields] = useState(data || {});
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("aayl");

  const set = (id, val) => setFields(f => ({ ...f, [id]: val }));
  const save = () => { onSave(fields); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const section = ORGANIZER_SECTIONS.find(s => s.id === activeSection);
  const filled = Object.values(fields).filter(v => v?.toString().trim()).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <SectionHeader eyebrow="Document Organizer" title="Your AAYL's information, organized" />
        <Btn onClick={save} variant={saved ? "accent" : "primary"} size="sm">
          <Icon name="save" size={14} color="#fff" /> {saved ? "Saved!" : "Save changes"}
        </Btn>
      </div>

      <div style={{ marginBottom: 20, padding: "12px 16px", background: C.bg2, borderRadius: 12, fontSize: 13, color: C.ink2, fontFamily: "system-ui" }}>
        {filled} fields filled in. When something happens, anyone in your family can find what they need here in under 5 minutes.
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {ORGANIZER_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ padding: "7px 14px", borderRadius: 100, border: `1px solid ${activeSection === s.id ? C.accent : C.line2}`, background: activeSection === s.id ? C.accent : C.paper, color: activeSection === s.id ? "#fff" : C.ink2, fontSize: 13, fontFamily: "system-ui", cursor: "pointer", fontWeight: activeSection === s.id ? 600 : 400 }}>
            {s.title}
          </button>
        ))}
      </div>

      <Card>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "system-ui", marginBottom: 20, marginTop: 0 }}>{section.title}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {section.fields.map(f => (
            <div key={f.id} style={{ gridColumn: f.id === "conditions" || f.id === "medications" || f.id === "obituaryNotes" ? "1 / -1" : undefined }}>
              {f.id === "conditions" || f.id === "medications" || f.id === "obituaryNotes"
                ? <Textarea label={f.label} value={fields[f.id] || ""} onChange={v => set(f.id, v)} placeholder={f.placeholder} />
                : <Input label={f.label} value={fields[f.id] || ""} onChange={v => set(f.id, v)} placeholder={f.placeholder} />
              }
            </div>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={save} variant={saved ? "accent" : "primary"} size="sm">
          <Icon name="save" size={14} color="#fff" /> {saved ? "Saved!" : "Save changes"}
        </Btn>
      </div>
    </div>
  );
};

// ── CHECKLISTS ────────────────────────────────────────────────
const MODULES = [
  { id: "m01", num: "01", title: "Start Here: What's Your Situation?", items: ["Downloaded the AAYL Situation Checklist", "Identified which stage my AAYL is in", "Know which module to go to first"] },
  { id: "m02", num: "02", title: "The Language of Elder Care", items: ["Understand Medicare vs. Medicaid distinction", "Know the 5-year Medicaid look-back rule", "Understand Durable POA vs. General POA", "Know what an Advance Directive covers", "Downloaded the GrayBrief Elder Care Glossary"] },
  { id: "m03", num: "03", title: "Your AAYL is 5+ Years from Retirement", items: ["Legal documents in order (Durable POA + Healthcare Proxy)", "Had the money conversation with my AAYL", "Understand the asset landscape", "Discussed Medicaid planning with an elder law attorney if applicable", "Family is aligned on decision-making", "Downloaded the 5-Year Head Start Checklist"] },
  { id: "m04", num: "04", title: "Your AAYL is Already Retired", items: ["Medicare coverage reviewed and understood", "Understand the 100-day SNF rule", "Know AAYL's state Medicaid asset limit and income rule", "Discussed care continuum options with AAYL", "Community Spouse Resource Protection understood if applicable", "Downloaded the Retirement-Stage AAYL Action Plan"] },
  { id: "m05", num: "05", title: "Your AAYL is Disabled or Has a Diagnosis", items: ["Got diagnosis, prognosis, and care needs in writing", "Engaged with discharge planning team if hospitalized", "Confirmed Durable POA status and urgency", "Understand skilled vs. custodial care distinction", "Know Medicaid eligibility status and next steps", "Downloaded the Crisis Response Checklist"] },
  { id: "m06", num: "06", title: "Your AAYL Has Passed Away", items: ["Obtained 10+ certified death certificates", "Notified Social Security Administration", "Located the Will and identified the executor", "Consulted estate attorney about probate", "Notified financial institutions and insurance companies", "Downloaded the Post-Loss Action Checklist"] },
  { id: "m07", num: "07", title: "Always and Forever", items: ["Elder law attorney identified", "Financial advisor (elder care) identified", "Geriatric care manager identified or on file", "The One Folder built and location shared with 2 family members", "Know the Eldercare Locator: 1-800-677-1116", "Downloaded the AAYL Master Document Organizer", "My own estate planning documents are up to date"] },
  { id: "m08", num: "08", title: "The Real Cost of Caregiving", items: ["Know what care costs in my AAYL's area", "Reviewed long-term care insurance policy if applicable", "Checked VA Aid and Attendance eligibility if applicable", "Looked up adult day programs near my AAYL", "Checked state Medicaid waiver programs", "Called Eldercare Locator for local resources", "Downloaded the Caregiving Cost Calculator + Hacks Guide"] },
  { id: "m09", num: "09", title: "The Sandwich Generation", items: ["Shared family calendar created", "Caregiving roles designated among family members", "Had age-appropriate conversation with my kids", "Protecting partnership time despite caregiving demands", "Retirement contributions maintained or have a restart plan", "Downloaded the Sandwich Generation Sanity Planner"] },
  { id: "m10", num: "10", title: "Pausing Your Life in Your Peak Years", items: ["Know my FMLA rights at work", "Talked to HR about flexible arrangements if needed", "Have a financial protection plan for caregiving period", "Reconnecting with professional network", "Have or am seeking personal support (therapy, support group)", "Downloaded the Caregiver's Guide to Not Losing Yourself"] },
];

const Checklists = ({ data, onSave }) => {
  const [checks, setChecks] = useState(data || {});
  const [activeModule, setActiveModule] = useState("m01");
  const [saved, setSaved] = useState(false);

  const toggle = (moduleId, item) => {
    setChecks(c => {
      const mod = { ...(c[moduleId] || {}) };
      mod[item] = !mod[item];
      return { ...c, [moduleId]: mod };
    });
  };

  const save = () => { onSave(checks); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const mod = MODULES.find(m => m.id === activeModule);
  const modChecks = checks[activeModule] || {};
  const modProgress = mod ? Math.round((mod.items.filter(i => modChecks[i]).length / mod.items.length) * 100) : 0;
  const totalDone = MODULES.filter(m => {
    const mc = checks[m.id] || {};
    return m.items.length > 0 && m.items.every(i => mc[i]);
  }).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <SectionHeader eyebrow="Module Checklists" title="Track your progress" />
        <Btn onClick={save} variant={saved ? "accent" : "primary"} size="sm">
          <Icon name="save" size={14} color="#fff" /> {saved ? "Saved!" : "Save progress"}
        </Btn>
      </div>

      <div style={{ marginBottom: 20, padding: "16px 20px", background: C.dark, borderRadius: 12, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: C.accent, fontFamily: "Georgia, serif" }}>{totalDone}/10</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.darkInk, fontFamily: "system-ui" }}>Modules completed</div>
          <div style={{ fontSize: 12, color: C.darkInk2, fontFamily: "system-ui", marginTop: 2 }}>Complete all items in a module to mark it done</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
        {/* Module list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MODULES.map(m => {
            const mc = checks[m.id] || {};
            const done = m.items.filter(i => mc[i]).length;
            const pct = Math.round((done / m.items.length) * 100);
            const complete = pct === 100;
            return (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${activeModule === m.id ? C.accent : C.line}`, background: activeModule === m.id ? "#FEF5E7" : C.paper, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${complete ? C.green : activeModule === m.id ? C.accent : C.line2}`, background: complete ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {complete && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  {!complete && <span style={{ fontSize: 10, fontWeight: 700, color: activeModule === m.id ? C.accent : C.ink3, fontFamily: "system-ui" }}>{m.num}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: activeModule === m.id ? C.accent : C.ink, fontFamily: "system-ui", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: C.ink3, fontFamily: "system-ui" }}>{done}/{m.items.length} done</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active module */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, fontFamily: "system-ui", fontWeight: 600 }}>MODULE {mod.num}</div>
            <div style={{ flex: 1, height: 6, background: C.bg2, borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${modProgress}%`, background: modProgress === 100 ? C.green : C.accent, borderRadius: 100, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: modProgress === 100 ? C.green : C.ink2, fontFamily: "system-ui" }}>{modProgress}%</div>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "system-ui", marginBottom: 20, marginTop: 0 }}>{mod.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mod.items.map(item => {
              const checked = !!modChecks[item];
              return (
                <label key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: checked ? "#EAFAF1" : C.bg, border: `1px solid ${checked ? "#A9DFBF" : C.line}`, transition: "all 0.15s" }}>
                  <div onClick={() => toggle(activeModule, item)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? C.green : C.line2}`, background: checked ? C.green : C.paper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer", transition: "all 0.15s" }}>
                    {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span onClick={() => toggle(activeModule, item)} style={{ fontSize: 14, color: checked ? "#1E8449" : C.ink, fontFamily: "system-ui", lineHeight: 1.5, textDecoration: checked ? "line-through" : "none" }}>{item}</span>
                </label>
              );
            })}
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={save} variant={saved ? "accent" : "primary"} size="sm">
              <Icon name="save" size={14} color="#fff" /> {saved ? "Saved!" : "Save progress"}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── EMERGENCY CONTACTS ────────────────────────────────────────
const CONTACT_CATEGORIES = ["Medical", "Legal", "Financial", "Family", "Care Facility", "Government / Agency", "Other"];

const Contacts = ({ data, onSave }) => {
  const [contacts, setContacts] = useState(data || []);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "", phone: "", email: "", notes: "", category: "Medical", priority: false });

  const save = (updated) => { onSave(updated); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const updated = [...contacts, { ...newContact, id: Date.now().toString() }];
    setContacts(updated);
    save(updated);
    setNewContact({ name: "", role: "", phone: "", email: "", notes: "", category: "Medical", priority: false });
    setAdding(false);
  };

  const remove = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    save(updated);
  };

  const priority = contacts.filter(c => c.priority);
  const rest = contacts.filter(c => !c.priority);

  const catColor = (cat) => ({ Medical: "#2471A3", Legal: C.accent, Financial: "#27AE60", Family: "#8E44AD", "Care Facility": "#C0392B", "Government / Agency": C.ink2, Other: C.ink3 }[cat] || C.ink3);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <SectionHeader eyebrow="Emergency Contacts" title="Who to call — and when" />
        <Btn onClick={() => setAdding(true)} size="sm">
          <Icon name="plus" size={14} color="#fff" /> Add contact
        </Btn>
      </div>

      {/* Built-in resources */}
      <Card style={{ marginBottom: 20, background: C.dark }}>
        <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: C.darkInk2, fontFamily: "system-ui", fontWeight: 600, marginBottom: 14 }}>Always-available resources</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            { name: "Eldercare Locator", phone: "1-800-677-1116", role: "Free local resource finder" },
            { name: "Medicare Helpline", phone: "1-800-633-4227", role: "Medicare questions" },
            { name: "Social Security", phone: "1-800-772-1213", role: "SSA notifications + benefits" },
            { name: "VA Benefits", phone: "1-800-827-1000", role: "Veterans benefits" },
          ].map(r => (
            <div key={r.name} style={{ padding: "12px 14px", background: "#2A2720", borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.darkInk, fontFamily: "system-ui" }}>{r.name}</div>
              <div style={{ fontSize: 13, color: C.accent, fontFamily: "system-ui", fontWeight: 600, margin: "2px 0" }}>{r.phone}</div>
              <div style={{ fontSize: 11, color: C.darkInk2, fontFamily: "system-ui" }}>{r.role}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add contact form */}
      {adding && (
        <Card style={{ marginBottom: 20, border: `2px solid ${C.accent}` }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "system-ui" }}>New contact</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <Input label="Name *" value={newContact.name} onChange={v => setNewContact(c => ({ ...c, name: v }))} placeholder="Dr. Jane Smith" />
            <Input label="Role / relationship" value={newContact.role} onChange={v => setNewContact(c => ({ ...c, role: v }))} placeholder="Primary care physician" />
            <Input label="Phone *" value={newContact.phone} onChange={v => setNewContact(c => ({ ...c, phone: v }))} placeholder="(555) 000-0000" />
            <Input label="Email" value={newContact.email} onChange={v => setNewContact(c => ({ ...c, email: v }))} placeholder="dr.smith@clinic.com" />
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.ink2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "system-ui", display: "block", marginBottom: 6 }}>Category</label>
              <select value={newContact.category} onChange={e => setNewContact(c => ({ ...c, category: e.target.value }))}
                style={{ border: `1px solid ${C.line2}`, borderRadius: 10, padding: "11px 16px", fontSize: 15, fontFamily: "system-ui", color: C.ink, background: C.paper, width: "100%" }}>
                {CONTACT_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
              <input type="checkbox" id="priority" checked={newContact.priority} onChange={e => setNewContact(c => ({ ...c, priority: e.target.checked }))} />
              <label htmlFor="priority" style={{ fontSize: 14, color: C.ink, fontFamily: "system-ui", cursor: "pointer" }}>Mark as priority contact</label>
            </div>
          </div>
          <Textarea label="Notes" value={newContact.notes} onChange={v => setNewContact(c => ({ ...c, notes: v }))} placeholder="Best time to call, what they handle, any important details..." rows={2} />
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={addContact} size="sm">Save contact</Btn>
            <Btn onClick={() => setAdding(false)} variant="ghost" size="sm">Cancel</Btn>
          </div>
        </Card>
      )}

      {contacts.length === 0 && !adding && (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, fontFamily: "system-ui", marginBottom: 8 }}>No contacts yet</div>
          <div style={{ fontSize: 14, color: C.ink2, fontFamily: "system-ui", marginBottom: 20 }}>Add the doctors, attorneys, and advisors your family needs to reach in a crisis.</div>
          <Btn onClick={() => setAdding(true)} size="sm"><Icon name="plus" size={14} color="#fff" /> Add your first contact</Btn>
        </Card>
      )}

      {priority.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, fontFamily: "system-ui", fontWeight: 600, marginBottom: 12 }}>Priority contacts</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {priority.map(c => (
              <ContactCard key={c.id} contact={c} onRemove={remove} catColor={catColor} />
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink3, fontFamily: "system-ui", fontWeight: 600, marginBottom: 12 }}>All contacts</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {rest.map(c => (
              <ContactCard key={c.id} contact={c} onRemove={remove} catColor={catColor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ContactCard = ({ contact, onRemove, catColor }) => (
  <Card style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: catColor(contact.category), fontFamily: "system-ui", background: catColor(contact.category) + "18", padding: "2px 8px", borderRadius: 100 }}>{contact.category}</span>
      </div>
      <button onClick={() => onRemove(contact.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, padding: 4, display: "flex" }}>
        <Icon name="trash" size={14} color={C.ink3} />
      </button>
    </div>
    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "system-ui", marginBottom: 2 }}>{contact.name}</div>
    {contact.role && <div style={{ fontSize: 13, color: C.ink2, fontFamily: "system-ui", marginBottom: 8 }}>{contact.role}</div>}
    <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "system-ui" }}>{contact.phone}</div>
    {contact.email && <div style={{ fontSize: 13, color: C.ink3, fontFamily: "system-ui", marginTop: 2 }}>{contact.email}</div>}
    {contact.notes && <div style={{ marginTop: 10, padding: "8px 10px", background: C.bg2, borderRadius: 8, fontSize: 12, color: C.ink2, fontFamily: "system-ui", lineHeight: 1.5 }}>{contact.notes}</div>}
  </Card>
);

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [userData, setUserData] = useState({ organizer: {}, checklists: {}, contacts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadData(STORAGE_KEY);
      if (saved) {
        setUser(saved.user);
        setUserData(saved.data || { organizer: {}, checklists: {}, contacts: [] });
      }
      setLoading(false);
    })();
  }, []);

  const onAuth = async (u) => {
    setUser(u);
    const existing = await loadData(`${STORAGE_KEY}_${u.userKey}`);
    const data = existing || { organizer: {}, checklists: {}, contacts: [] };
    setUserData(data);
    await saveData(STORAGE_KEY, { user: u, data });
  };

  const saveSection = useCallback(async (section, value) => {
    const updated = { ...userData, [section]: value };
    setUserData(updated);
    await saveData(STORAGE_KEY, { user, data: updated });
    if (user?.userKey) await saveData(`${STORAGE_KEY}_${user.userKey}`, updated);
  }, [userData, user]);

  const onLogout = async () => {
    await deleteData(STORAGE_KEY);
    setUser(null);
    setUserData({ organizer: {}, checklists: {}, contacts: [] });
    setActiveNav("dashboard");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Logo size="lg" />
    </div>
  );

  if (!user) return <AuthScreen onAuth={onAuth} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "system-ui, sans-serif" }}>
      <Nav active={activeNav} setActive={setActiveNav} onLogout={onLogout} userName={user.name} />
      <main style={{ flex: 1, padding: "40px 48px", maxWidth: 1000, minHeight: "100vh", overflowY: "auto" }}>
        {activeNav === "dashboard" && <Dashboard userData={userData} setActive={setActiveNav} />}
        {activeNav === "organizer" && <Organizer data={userData.organizer} onSave={v => saveSection("organizer", v)} />}
        {activeNav === "checklists" && <Checklists data={userData.checklists} onSave={v => saveSection("checklists", v)} />}
        {activeNav === "contacts" && <Contacts data={userData.contacts} onSave={v => saveSection("contacts", v)} />}
      </main>
    </div>
  );
}
