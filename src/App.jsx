import { useState, useEffect, useRef } from "react";

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const C = {
  bg: "#06060b", bg2: "#0c0c14", card: "#111119", card2: "#16161f",
  accent: "#7c6cf0", accentSoft: "#b4a9ff", accentGlow: "rgba(124,108,240,0.25)",
  gold: "#e8c547",
  text: "#f0f0f8", sub: "#9494b0", dim: "#5a5a72", border: "#1c1c2c", borderLight: "#24243a",
  ok: "#34d399", okSoft: "rgba(52,211,153,0.12)",
  grad: "linear-gradient(135deg, #7c6cf0 0%, #b4a9ff 100%)",
  gradBtn: "linear-gradient(135deg, #7c6cf0 0%, #9b8cff 50%, #7c6cf0 100%)",
};

const services = [
  { icon: "🤖", title: "AI Assistants That Sell", sub: "Turn every inquiry into revenue", desc: "Intelligent assistants on WhatsApp & Telegram that qualify leads, book appointments, answer questions, and follow up — automatically. They remember every customer and close deals while you sleep.", tags: ["Lead Qualification", "Auto-Booking", "24/7 Support", "CRM Sync"], result: "→ 3x more bookings" },
  { icon: "🧠", title: "AI Virtual Employee", sub: "20 hours back every week", desc: "A full-time digital assistant that handles your inbox, researches competitors, manages your calendar, monitors opportunities, and delivers a morning briefing with actionable insights every single day.", tags: ["Email Drafts", "Daily Briefings", "Opportunity Alerts", "Task Management"], result: "→ 20h saved/week" },
  { icon: "⚡", title: "Business Automations", sub: "Your business runs itself", desc: "Custom AI workflows that handle email sequences, social media posting, competitor monitoring, invoice processing, and reporting — all running on complete autopilot while you focus on growth.", tags: ["Email Flows", "Social Auto-Post", "Price Tracking", "Auto-Reports"], result: "→ 80% less manual work" },
  { icon: "🌐", title: "Revenue-Ready Websites", sub: "Websites that actually convert", desc: "Professional websites with integrated AI chatbots, conversion-optimized design, SEO that ranks, and free hosting. Not just a pretty page — a 24/7 client acquisition machine.", tags: ["Conversion Optimized", "AI Chatbot Built-In", "SEO Ready", "Free Hosting"], result: "→ 40% more leads" },
];

const plans = [
  { name: "Starter", setup: "$199", orig: "$499", mo: "$69", desc: "Start automating with zero risk", feats: ["AI chatbot on 1 channel (site, Telegram or WhatsApp)", "Answers FAQs automatically 24/7", "Basic lead capture", "Greets customers by name", "Email support", "Setup in 48h"], cta: "Start Now" },
  { name: "Business", setup: "$299", orig: "$799", mo: "$129", desc: "The most popular plan for a reason", feats: ["AI assistant with memory — recognizes returning customers", "WhatsApp + Telegram both included", "Automated appointment scheduling", "Lead qualification & follow-up", "Personalized responses", "Priority support", "Setup in 72h"], cta: "Start Free Trial", pop: true },
  { name: "Premium", setup: "$499", orig: "$1,499", mo: "$199", desc: "For businesses ready to scale fast", feats: ["All channels included — unlimited messages", "Voice AI (ElevenLabs)", "Full CRM integration", "Monthly performance report", "Dedicated account manager", "Custom AI workflows", "Setup in 5 days"], cta: "Contact pe Telegram" },
];

const webPlans = [
  { name: "Landing Page", icon: "🥉", orig: "$598", price: "$299", mo: "$29", desc: "Perfect for a single, high-converting page", feats: ["1 page professional design", "AI chatbot integrated", "SEO optimized", "Free hosting", "Mobile friendly", "48h delivery"], result: "→ Fast & effective" },
  { name: "Business Site", icon: "🥈", orig: "$998", price: "$499", mo: "$49", desc: "Complete online presence for your business", feats: ["5-7 pages custom design", "AI chatbot integrated", "Full SEO setup", "Contact forms", "Free hosting", "5 days delivery"], result: "→ Full presence", pop: true },
  { name: "Full Website", icon: "🥇", orig: "$1,798", price: "$899", mo: "$99", desc: "Premium website built to scale", feats: ["10+ pages premium design", "Advanced AI chatbot", "SEO + Blog setup", "CRM integrations", "Free hosting", "10 days delivery"], result: "→ Scale fast" },
];

const waPlans = [
  { name: "WhatsApp Starter", icon: "🟢", orig: "$799", setup: "$399", mo: "$99", desc: "Perfect for small businesses that dont want to lose clients", feats: ["AI bot on WhatsApp 24/7", "Answers FAQs automatically", "Confirms appointments automatically", "Greets customers by name", "Email support", "Setup in 48h"], result: "→ Never miss a client" },
  { name: "WhatsApp Business", icon: "🔵", orig: "$1,399", setup: "$699", mo: "$149", desc: "For businesses that want to sell more automatically", feats: ["Everything in Starter +", "Memory — bot recognizes returning customers", "Automatic lead qualification", "Auto follow-up after 24h", "Send offers & promotions", "Priority support", "Setup in 72h"], result: "→ Sell while you sleep", pop: true },
  { name: "WhatsApp Premium", icon: "🟣", orig: "$1,999", setup: "$999", mo: "$249", desc: "For serious businesses that want a complete system", feats: ["Everything in Business +", "Unlimited conversations", "Multi-language EN/ES/RO", "Full CRM integration", "Monthly performance report", "Voice AI optional (ElevenLabs)", "Dedicated account manager", "Setup in 5 days"], result: "→ Full automation" },
];

const posts = [
  { title: "Why Every Small Business Needs an AI Assistant in 2026", excerpt: "The businesses that adopt AI now will dominate their markets. Here's the data behind the shift.", cat: "AI Trends", date: "Apr 10, 2026", read: "5 min", ico: "📊" },
  { title: "Case Study: How a Salon Doubled Bookings with AI", excerpt: "From 15 to 32 appointments per week — without hiring anyone. A real implementation breakdown.", cat: "Case Study", date: "Apr 8, 2026", read: "7 min", ico: "📈" },
  { title: "The 80% Rule: Which Tasks AI Should Handle for You", excerpt: "Not everything should be automated. Here's a framework for deciding what to delegate to AI.", cat: "Strategy", date: "Apr 5, 2026", read: "6 min", ico: "⚙️" },
  { title: "AI Voice Assistants Are Coming for Customer Service", excerpt: "Restaurants, clinics, and salons are replacing hold music with AI that actually helps.", cat: "Industry News", date: "Apr 2, 2026", read: "4 min", ico: "🎙️" },
];

const reviews = [
  { text: "We went from missing 40% of calls to zero. The AI books appointments, sends reminders, even upsells our premium services. Revenue up 35% in 3 months.", who: "Maria G.", role: "Restaurant Owner, Madrid" },
  { text: "I was paying $2,400/month for a receptionist. Now the AI handles everything for $129/month and it never calls in sick. Best business decision this year.", who: "James K.", role: "Salon Owner, London" },
  { text: "My AI assistant drafts better emails than I do, monitors my competitors daily, and finds me freelance opportunities I'd never have seen. It's like having a genius intern.", who: "Ana R.", role: "Consultant, Bucharest" },
];

const SALES_SYSTEM = `You are the SMV AI Advisor, a friendly and professional AI sales assistant for SMV DigitalPro — an AI automation agency that builds chatbots, automations, and AI-powered websites for small businesses.

Your goal: understand the visitor's business and guide them toward booking a free consultation.

Services:
- AI Chatbot (WhatsApp & Telegram): Starter $199 setup + $69/mo, Business $299 setup + $129/mo, Premium $499 setup + $199/mo
- Revenue-Ready Websites: Landing Page $299, Business Site $499, Full Website $899 (optional maintenance +$29-99/mo)
- AI Virtual Employee: custom quote
- Business Automations: custom quote

Rules:
- Keep responses SHORT (max 3-4 lines), NO markdown formatting, NO asterisks, NO bold text
- Be warm, confident, direct
- Ask one question at a time
- When ready, collect name, email, WhatsApp for free consultation
- Contact: hello@smvdigitalpro.com | Telegram: @smvdigitalpro`;

const getDemoSystem = (type) => {
  const p = {
    salon: `You are Luna Beauty AI — friendly AI assistant for Luna Beauty Salon.
Services: Haircut $35, Color $75-120, Manicure $25, Facial $55, Spa Package $150.
Hours: Mon-Fri 9am-7pm, Sat 10am-5pm. Stylists: Ana, Maria, Sofia.
Help with bookings, prices, hours. Be friendly, use emojis. Always offer to book.`,
    restaurant: `You are Bella Vista AI — AI assistant for Bella Vista Restaurant.
Menu: Pasta Carbonara $18, Grilled Salmon $24, Pizza $16, Tiramisu $8.
Hours: Mon-Sun 12pm-10pm. Takes reservations.
Help with reservations, menu, specials. Be warm and welcoming.`,
    clinic: `You are MediCare AI — AI assistant for MediCare Clinic.
Services: General Consultation $80, Dental $120, Blood Test $65, Physio $90.
Hours: Mon-Fri 8am-6pm, Sat 9am-1pm.
Help patients book and learn about services. Be professional and caring.`,
    gym: `You are FitZone AI — AI assistant for FitZone Gym.
Memberships: Basic $29/mo, Standard $49/mo, Premium $79/mo.
Classes: Yoga, HIIT, Pilates. Hours: Mon-Fri 6am-10pm, Sat-Sun 8am-8pm.
Help with memberships, classes, fitness info. Be energetic and motivating.`,
    ecommerce: `You are ShopBot AI — AI assistant for an online store.
Free shipping over $50. Returns: 30 days. Delivery: 3-5 days standard, 1-2 days express +$12.
Help with orders, tracking, returns, product info. Be helpful and solution-focused.`,
    other: `You are BusinessBot AI — professional AI assistant for a local business.
Help with services, bookings, hours, and general inquiries.
Be professional, helpful, and friendly.`,
  };
  return p[type] || p.other;
};

function Bot({ open, toggle }) {
  const [msgs, setMsgs] = useState([]);
  const [history, setHistory] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("welcome");
  const [demoType, setDemoType] = useState(null);
  const end = useRef(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ r: "bot", t: "Hey! 👋 I'm the SMV AI Advisor.\n\nHow can I help you today?", opts: ["💼 I want more clients", "🎬 Show me a demo", "💰 Pricing info"] }]);
    }
  }, [open]);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const addBot = (text, opts = null) => setMsgs(p => [...p, { r: "bot", t: text, opts }]);
  const addUser = (text) => setMsgs(p => [...p, { r: "user", t: text }]);

  const callClaude = async (userMsg, system, hist) => {
    const newHist = [...hist, { role: "user", content: userMsg }];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 300, system, messages: newHist }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong, please try again!";
      return { reply, history: [...newHist, { role: "assistant", content: reply }] };
    } catch {
      return { reply: "Connection issue. Please try again! 🔄", history: newHist };
    }
  };

  const handleOption = async (opt) => {
    addUser(opt);
    const demoMap = { "💇 Salon / Spa": "salon", "🍕 Restaurant / Café": "restaurant", "🏥 Clinic / Medical": "clinic", "💪 Gym / Fitness": "gym", "🛒 E-commerce": "ecommerce", "🏢 Other Business": "other" };

    if (opt === "💼 I want more clients" || opt === "💰 Pricing info") {
      setMode("sales"); setLoading(true);
      const msg = opt === "💰 Pricing info" ? "Tell me about pricing" : "I want more clients";
      const { reply, history: h } = await callClaude(msg, SALES_SYSTEM, []);
      setHistory(h); setLoading(false); addBot(reply);
    } else if (opt === "🎬 Show me a demo") {
      setMode("demo-select");
      addBot("Pick your business type and I'll show you your AI assistant live! 🎬", ["💇 Salon / Spa", "🍕 Restaurant / Café", "🏥 Clinic / Medical", "💪 Gym / Fitness", "🛒 E-commerce", "🏢 Other Business"]);
    } else if (demoMap[opt]) {
      const type = demoMap[opt];
      setDemoType(type); setMode("demo"); setHistory([]); setLoading(true);
      const label = opt.split(" ").slice(1).join(" ");
      const { reply, history: h } = await callClaude("Hi! I'd like to know about your services.", getDemoSystem(type), []);
      setHistory(h); setLoading(false);
      addBot(`🎬 Demo: ${label} AI Assistant\n\nThis is exactly what your customers would experience!\n\n---\n\n${reply}`);
    } else if (opt === "🚀 I want this for my business!") {
      setMode("sales"); setHistory([]); setLoading(true);
      const { reply, history: h } = await callClaude("I just saw the demo and want this for my business!", SALES_SYSTEM, []);
      setHistory(h); setLoading(false); addBot(reply);
    } else if (opt === "🔄 Try another type") {
      setMode("demo-select"); setHistory([]);
      addBot("Pick another business type! 👇", ["💇 Salon / Spa", "🍕 Restaurant / Café", "🏥 Clinic / Medical", "💪 Gym / Fitness", "🛒 E-commerce", "🏢 Other Business"]);
    }
  };

  const send = async () => {
    if (!inp.trim() || loading) return;
    const text = inp.trim(); setInp("");
    addUser(text); setLoading(true);
    const system = mode === "demo" ? getDemoSystem(demoType) : SALES_SYSTEM;
    const { reply, history: h } = await callClaude(text, system, history);
    setHistory(h); setLoading(false);
    const demoOpts = mode === "demo" && h.length > 6 ? ["🚀 I want this for my business!", "🔄 Try another type"] : null;
    addBot(reply, demoOpts);
  };

  const renderText = (text) => text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#{1,3} /g, '');

  if (!open) return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      <div style={{ background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "12px 18px", maxWidth: 240, boxShadow: `0 8px 30px rgba(0,0,0,.4)`, animation: "su .4s ease-out .5s both" }}>
        <p style={{ color: C.text, fontSize: 13, lineHeight: 1.5, margin: 0 }}>Want to automate your business with AI? 🚀</p>
      </div>
      <button onClick={toggle} style={{ width: 68, height: 68, borderRadius: 20, background: C.gradBtn, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: `0 8px 40px ${C.accentGlow}`, animation: "pg 2.5s ease-in-out infinite", transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>💬</button>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, width: 400, maxWidth: "calc(100vw - 32px)", height: 580, maxHeight: "calc(100vh - 56px)", background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 24, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 9999, boxShadow: `0 24px 80px rgba(0,0,0,.6), 0 0 60px ${C.accentGlow}`, animation: "su .3s ease-out" }}>
      <div style={{ background: C.grad, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{mode === "demo" ? "🎬 Live Demo Mode" : "SMV AI Advisor"}</div>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: 11.5, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, background: "#34d399", borderRadius: "50%", display: "inline-block" }} />{mode === "demo" ? "Experience your AI" : "Online — replies instantly"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {mode !== "welcome" && <button onClick={() => { setMode("welcome"); setHistory([]); setMsgs([]); }} style={{ background: "rgba(255,255,255,.12)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>← Back</button>}
          <button onClick={toggle} style={{ background: "rgba(255,255,255,.12)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "88%", padding: "12px 16px", borderRadius: m.r === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.r === "user" ? C.accent : C.card2, color: "#fff", fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{renderText(m.t)}</div>
            </div>
            {m.opts && <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, paddingLeft: 4 }}>
              {m.opts.map((o, j) => <button key={j} onClick={() => handleOption(o)} style={{ padding: "12px 18px", borderRadius: 14, border: `1.5px solid ${C.accent}`, background: "rgba(124,108,240,0.06)", color: C.accentSoft, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .25s", textAlign: "left" }}
                onMouseEnter={e => { e.target.style.background = C.accent; e.target.style.color = "#fff"; }}
                onMouseLeave={e => { e.target.style.background = "rgba(124,108,240,0.06)"; e.target.style.color = C.accentSoft; }}>{o}</button>)}
            </div>}
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 5, padding: "10px 16px", background: C.card2, borderRadius: 18, width: "fit-content" }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.sub, animation: `td 1.4s ease-in-out ${i*.2}s infinite` }} />)}</div>}
        <div ref={end} />
      </div>
      <div style={{ padding: "14px 18px 18px", borderTop: `1px solid ${C.border}`, background: C.card }}>
        {mode === "demo" && <p style={{ fontSize: 11, color: C.accent, marginBottom: 8, fontWeight: 600 }}>🎬 Type as if you're a real customer</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={mode === "demo" ? "Ask anything as a customer..." : "Type a message..."} disabled={loading}
            style={{ flex: 1, padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none" }}
            onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
          <button onClick={send} disabled={loading} style={{ padding: "14px 20px", borderRadius: 14, background: C.gradBtn, border: "none", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>→</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [chat, setChat] = useState(false);
  const [sc, setSc] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 60); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMob(false); };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        ::selection{background:${C.accent};color:#fff}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.accent};border-radius:4px}
        @keyframes pg{0%,100%{box-shadow:0 8px 40px ${C.accentGlow}}50%{box-shadow:0 8px 60px rgba(124,108,240,.4)}}
        @keyframes su{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes td{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes gs{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @media(max-width:820px){.dk{display:none!important}.mb{display:flex!important}.hg{flex-direction:column!important;gap:40px!important}.sg{grid-template-columns:1fr!important}.pg{grid-template-columns:1fr!important}.bg{grid-template-columns:1fr!important}.stg{grid-template-columns:repeat(2,1fr)!important}.ht{font-size:38px!important}.sp{padding:70px 20px!important}.hv{display:none!important}}
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "0 32px", height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", background: sc ? "rgba(6,6,11,.94)" : "transparent", backdropFilter: sc ? "blur(24px)" : "none", borderBottom: sc ? `1px solid ${C.border}` : "none", transition: "all .35s" }}>
        <div onClick={() => go("hero")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 17, fontFamily: "'Outfit',sans-serif" }}>S</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 19, color: C.text }}>SMV <span style={{ color: C.accentSoft }}>DigitalPro</span></span>
        </div>
        <div className="dk" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {/* Services cu dropdown */}
          <div style={{ position: "relative" }}
            onMouseEnter={e => e.currentTarget.querySelector('.srv-drop').style.display = 'block'}
            onMouseLeave={e => e.currentTarget.querySelector('.srv-drop').style.display = 'none'}>
            <a style={{ color: C.sub, textDecoration: "none", fontSize: 14.5, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", transition: "color .2s", display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = C.accentSoft}
              onMouseLeave={e => e.currentTarget.style.color = C.sub}>
              Services <span style={{ fontSize: 10 }}>▾</span>
            </a>
            <div className="srv-drop" style={{ display: "none", position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 8, zIndex: 999 }}>
              <div style={{ background: "rgba(17,17,25,.98)", border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "8px", minWidth: 220, backdropFilter: "blur(24px)", boxShadow: `0 16px 48px rgba(0,0,0,.5)` }}>
              {[
                { label: "🤖 AI Chatbot", sub: "WhatsApp, Telegram & Web", id: "pricing" },
                { label: "💬 WhatsApp Bot", sub: "Direct in their WhatsApp", id: "whatsapp" },
                { label: "🌐 Website Creation", sub: "With AI chatbot built-in", id: "websites" },
              ].map((item, i) => (
                <div key={i} onClick={() => go(item.id)}
                  style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `rgba(124,108,240,.12)`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
              </div>
            </div>
          </div>
          {/* Rest of nav links */}
          {/* Pricing dropdown */}
          <div style={{ position: "relative" }}
            onMouseEnter={e => e.currentTarget.querySelector('.price-drop').style.display = 'block'}
            onMouseLeave={e => e.currentTarget.querySelector('.price-drop').style.display = 'none'}>
            <a style={{ color: C.sub, textDecoration: "none", fontSize: 14.5, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", transition: "color .2s", display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = C.accentSoft}
              onMouseLeave={e => e.currentTarget.style.color = C.sub}>
              Pricing <span style={{ fontSize: 10 }}>▾</span>
            </a>
            <div className="price-drop" style={{ display: "none", position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 8, zIndex: 999 }}>
              <div style={{ background: "rgba(17,17,25,.98)", border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "8px", minWidth: 220, backdropFilter: "blur(24px)", boxShadow: `0 16px 48px rgba(0,0,0,.5)` }}>
              {[
                { label: "🤖 AI Chatbot Plans", sub: "From $199 setup + $69/mo", id: "pricing" },
                { label: "💬 WhatsApp Bot Plans", sub: "From $399 setup + $99/mo", id: "whatsapp" },
                { label: "🌐 Website Plans", sub: "From $299 one-time", id: "websites" },
              ].map((item, i) => (
                <div key={i} onClick={() => go(item.id)}
                  style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `rgba(124,108,240,.12)`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
              </div>
            </div>
          </div>
          {["blog","contact"].map(l => <a key={l} onClick={() => go(l)} style={{ color: C.sub, textDecoration: "none", fontSize: 14.5, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = C.accentSoft} onMouseLeave={e => e.target.style.color = C.sub}>{l}</a>)}
          <button onClick={() => setChat(true)} style={{ padding: "11px 26px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: `0 4px 20px ${C.accentGlow}`, transition: "transform .2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-1px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>Get Free Demo →</button>
        </div>
        <button className="mb" onClick={() => setMob(!mob)} style={{ display: "none", background: "none", border: "none", color: C.text, fontSize: 24, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>{mob ? "✕" : "☰"}</button>
        {mob && <div style={{ position: "absolute", top: 74, left: 0, right: 0, background: "rgba(6,6,11,.98)", backdropFilter: "blur(24px)", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 22, borderBottom: `1px solid ${C.border}` }}>
          {["services","pricing","blog","contact"].map(l => <a key={l} onClick={() => go(l)} style={{ color: C.text, textDecoration: "none", fontSize: 18, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{l}</a>)}
          <button onClick={() => { setChat(true); setMob(false); }} style={{ padding: "14px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Get Free Demo →</button>
        </div>}
      </nav>

      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 32px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-15%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,${C.accentGlow} 0%,transparent 65%)`, filter: "blur(100px)", pointerEvents: "none" }} />
        <div className="hg" style={{ maxWidth: 1200, width: "100%", display: "flex", alignItems: "center", gap: 64, position: "relative" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 50, background: C.okSoft, border: `1px solid rgba(52,211,153,.25)`, fontSize: 13, color: C.ok, marginBottom: 32, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, background: C.ok, borderRadius: "50%", display: "inline-block" }} /> Now accepting new clients — 48h setup
            </div>
            <h1 className="ht" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.06, marginBottom: 28, fontFamily: "'Outfit',sans-serif", letterSpacing: -1.5 }}>
              Get More Clients<br />With an <span style={{ background: "linear-gradient(135deg,#7c6cf0,#b4a9ff,#7c6cf0)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gs 4s ease-in-out infinite" }}>AI Employee</span><br />That Never Sleeps
            </h1>
            <p style={{ fontSize: 19, color: C.sub, lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>Stop losing clients because you can't reply instantly. Your AI responds in seconds — every time.</p>
            <p style={{ fontSize: 16, color: C.dim, lineHeight: 1.65, marginBottom: 44, maxWidth: 520 }}>We build AI assistants that handle messages, book appointments, qualify leads, and follow up with customers — 24/7 on WhatsApp & Telegram.</p>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 60 }}>
              <button onClick={() => setChat(true)} style={{ padding: "21px 46px", borderRadius: 16, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 800, fontSize: 17, cursor: "pointer", boxShadow: `0 8px 40px ${C.accentGlow}`, transition: "transform .2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-3px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>Get Your AI Demo →</button>
              <div style={{ position: "relative" }}
                onMouseEnter={e => e.currentTarget.querySelector('.vp-drop').style.display = 'block'}
                onMouseLeave={e => e.currentTarget.querySelector('.vp-drop').style.display = 'none'}>
                <button style={{ padding: "21px 46px", borderRadius: 16, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.text, fontWeight: 700, fontSize: 17, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; }}>
                  View Pricing <span style={{ fontSize: 12 }}>▾</span>
                </button>
                <div className="vp-drop" style={{ display: "none", position: "absolute", top: "100%", left: 0, paddingTop: 8, zIndex: 999 }}>
                  <div style={{ background: "rgba(17,17,25,.98)", border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "8px", minWidth: 220, backdropFilter: "blur(24px)", boxShadow: `0 16px 48px rgba(0,0,0,.5)` }}>
                    {[
                      { label: "🤖 AI Chatbot Plans", sub: "From $199 setup + $69/mo", id: "pricing" },
                      { label: "💬 WhatsApp Bot Plans", sub: "From $399 setup + $99/mo", id: "whatsapp" },
                      { label: "🌐 Website Plans", sub: "From $299 one-time", id: "websites" },
                    ].map((item, i) => (
                      <div key={i} onClick={() => go(item.id)}
                        style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", transition: "background .2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = `rgba(124,108,240,.12)`}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{item.label}</div>
                        <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="stg" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              {[["24/7","Always On"],["92%","Automated"],["<48h","Go Live"],["3x","More Bookings"]].map(([v,l],i) => <div key={i}><div style={{ fontSize: 30, fontWeight: 900, fontFamily: "'Outfit',sans-serif", color: C.accentSoft }}>{v}</div><div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{l}</div></div>)}
            </div>
          </div>
          <div className="hv" style={{ flex: .7, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 320, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 22, padding: 24, animation: "fl 6s ease-in-out infinite", position: "relative", boxShadow: `0 20px 60px rgba(0,0,0,.4), 0 0 40px ${C.accentGlow}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🤖</div>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>Luna Beauty AI</div><div style={{ fontSize: 11, color: C.ok }}>● Active now</div></div>
              </div>
              {[["u","Hi! Can I book for Saturday?"],["b","Welcome back Sarah! 💇‍♀️ Ana has Saturday at 10 AM and 2 PM. Which works better?"],["u","2 PM please!"],["b","Done! ✅ Booked with Ana, Sat 2 PM. Reminder coming Friday. See you!"]].map(([r,t],i) => (
                <div key={i} style={{ display: "flex", justifyContent: r==="u"?"flex-end":"flex-start", marginBottom: 10 }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: r==="u"?"16px 16px 3px 16px":"16px 16px 16px 3px", background: r==="u"?C.accent:C.card2, color: "#fff", fontSize: 12.5, lineHeight: 1.5 }}>{t}</div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 12, padding: "8px 12px", borderRadius: 10, background: C.okSoft, border: `1px solid rgba(52,211,153,.2)`, fontSize: 11, color: C.ok, fontWeight: 600 }}>✨ Remembers 1,200+ customers automatically</div>
              <div style={{ position: "absolute", top: 14, right: -20, padding: "7px 16px", borderRadius: 12, background: C.gradBtn, fontSize: 12, color: "#fff", fontWeight: 800, whiteSpace: "nowrap" }}>+32 bookings this week</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "44px 32px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 4, marginBottom: 22, fontWeight: 600 }}>Built on enterprise-grade AI</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", alignItems: "center", opacity: .35 }}>
            {["Claude AI","Telegram","WhatsApp","ElevenLabs","Vercel","n8n"].map(n => <span key={n} style={{ fontSize: 16, fontWeight: 700, color: C.sub, fontFamily: "'Outfit',sans-serif" }}>{n}</span>)}
          </div>
        </div>
      </section>

      <section id="services" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>What We Build</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>AI Solutions That <span style={{ color: C.accentSoft }}>Drive Revenue</span></h2>
          </div>
          <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {services.map((s,i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, transition: "all .35s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${C.accentGlow}`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ fontSize: 40 }}>{s.icon}</div>
                  <span style={{ padding: "5px 14px", borderRadius: 8, background: C.okSoft, color: C.ok, fontSize: 12, fontWeight: 700 }}>{s.result}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.accent, marginBottom: 14, fontWeight: 600 }}>{s.sub}</p>
                <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.6, marginBottom: 18 }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
                  {s.tags.map((f,j) => <span key={j} style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(124,108,240,.08)", color: C.accentSoft, fontSize: 11.5, fontWeight: 600 }}>{f}</span>)}
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <span onClick={() => setChat(true)} style={{ color: C.accentSoft, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Learn more →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Pricing</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>AI Chatbot <span style={{ color: C.accentSoft }}>Packages</span></h2>
            <p style={{ color: C.sub, maxWidth: 480, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>No hidden fees. Cancel anytime. First 3 clients get 50% off setup.</p>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {plans.map((p,i) => (
              <div key={i} style={{ background: p.pop?`linear-gradient(135deg,${C.card} 0%,rgba(124,108,240,.08) 100%)`:C.card, border: `1px solid ${p.pop?C.accent:C.border}`, borderRadius: 22, padding: 36, position: "relative", transition: "transform .3s", boxShadow: p.pop?`0 0 40px ${C.accentGlow}`:"none" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {p.pop && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "5px 20px", borderRadius: 20, background: C.gradBtn, fontSize: 11.5, color: "#fff", fontWeight: 800, whiteSpace: "nowrap" }}>⭐ MOST POPULAR</div>}
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: C.sub, marginBottom: 24 }}>{p.desc}</p>
                <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: C.dim, textDecoration: "line-through" }}>{p.orig}</span><span style={{ fontSize: 13, color: C.ok, marginLeft: 8, fontWeight: 700 }}>50% off</span></div>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>{p.setup}</span>
                  <span style={{ fontSize: 14, color: C.sub }}> setup + </span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: C.accentSoft }}>{p.mo}</span>
                  <span style={{ fontSize: 13, color: C.sub }}>/mo</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {p.feats.map((f,j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.sub }}><span style={{ color: C.ok }}>✓</span>{f}</div>)}
                </div>
                <button onClick={() => p.name === "Premium" ? window.open("https://t.me/smvdigitalpro","_blank") : setChat(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>{p.cta}</button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48, padding: 28, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18 }}>
            <p style={{ color: C.sub, fontSize: 15 }}>🛡️ <strong style={{ color: C.text }}>30-Day Money Back Guarantee</strong> — Not happy with the monthly service? We refund your subscription. Setup fee is non-refundable.</p>
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => setChat(true)} style={{ padding: "14px 32px", borderRadius: 14, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.sub, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentSoft; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.sub; }}>
              💬 Have questions? Chat with our AI →
            </button>
          </div>
        </div>
      </section>

      <section id="websites" style={{ padding: "110px 32px", background: `linear-gradient(180deg,${C.bg} 0%,${C.bg2} 50%,${C.bg} 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Websites</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>Website <span style={{ color: C.accentSoft }}>Creation</span></h2>
            <p style={{ color: C.sub, maxWidth: 480, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>Professional websites with AI chatbot built-in. One-time setup, no hidden fees.</p>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {webPlans.map((p,i) => (
              <div key={i} style={{ background: p.pop?`linear-gradient(135deg,${C.card} 0%,rgba(124,108,240,.08) 100%)`:C.card, border: `1px solid ${p.pop?C.accent:C.border}`, borderRadius: 22, padding: 36, position: "relative", transition: "transform .3s", boxShadow: p.pop?`0 0 40px ${C.accentGlow}`:"none" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {p.pop && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "5px 20px", borderRadius: 20, background: C.gradBtn, fontSize: 11.5, color: "#fff", fontWeight: 800, whiteSpace: "nowrap" }}>⭐ MOST POPULAR</div>}
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: C.sub, marginBottom: 24 }}>{p.desc}</p>
                <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: C.dim, textDecoration: "line-through" }}>{p.orig}</span><span style={{ fontSize: 13, color: C.ok, marginLeft: 8, fontWeight: 700 }}>50% off</span></div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: C.sub }}> one-time</span>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 13, color: C.dim }}>+ </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.accentSoft }}>{p.mo}/mo</span>
                  <span style={{ fontSize: 12, color: C.dim }}> maintenance (optional)</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {p.feats.map((f,j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.sub }}><span style={{ color: C.ok }}>✓</span>{f}</div>)}
                </div>
                <button onClick={() => setChat(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>Get Started — {p.price} →</button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => setChat(true)} style={{ padding: "14px 32px", borderRadius: 14, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.sub, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentSoft; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.sub; }}>
              💬 Have questions? Chat with our AI →
            </button>
          </div>
        </div>
      </section>

      <section id="whatsapp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>WhatsApp</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>WhatsApp <span style={{ color: C.accentSoft }}>AI Bot</span></h2>
            <p style={{ color: C.sub, maxWidth: 480, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>Your AI assistant directly in your customers WhatsApp — where they already talk to you.</p>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {waPlans.map((p,i) => (
              <div key={i} style={{ background: p.pop?`linear-gradient(135deg,${C.card} 0%,rgba(124,108,240,.08) 100%)`:C.card, border: `1px solid ${p.pop?C.accent:C.border}`, borderRadius: 22, padding: 36, position: "relative", transition: "transform .3s", boxShadow: p.pop?`0 0 40px ${C.accentGlow}`:"none" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {p.pop && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "5px 20px", borderRadius: 20, background: C.gradBtn, fontSize: 11.5, color: "#fff", fontWeight: 800, whiteSpace: "nowrap" }}>⭐ MOST POPULAR</div>}
                <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: C.sub, marginBottom: 24 }}>{p.desc}</p>
                <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: C.dim, textDecoration: "line-through" }}>{p.orig}</span><span style={{ fontSize: 13, color: C.ok, marginLeft: 8, fontWeight: 700 }}>50% off</span></div>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>{p.setup}</span>
                  <span style={{ fontSize: 14, color: C.sub }}> setup + </span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: C.accentSoft }}>{p.mo}</span>
                  <span style={{ fontSize: 13, color: C.sub }}>/mo</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {p.feats.map((f,j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.sub }}><span style={{ color: C.ok }}>✓</span>{f}</div>)}
                </div>
                <button onClick={() => setChat(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>Get Started — {p.setup} →</button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => setChat(true)} style={{ padding: "14px 32px", borderRadius: 14, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.sub, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentSoft; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.sub; }}>
              💬 Have questions? Chat with our AI →
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(180deg,${C.bg} 0%,${C.bg2} 50%,${C.bg} 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -.8 }}>Real Businesses, <span style={{ color: C.accentSoft }}>Real Results</span></h2>
          </div>
          <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {reviews.map((r,i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 32, marginBottom: 18, color: C.accentSoft }}>❝</div>
                <p style={{ color: C.sub, lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>{r.who[0]}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{r.who}</div><div style={{ fontSize: 12, color: C.dim }}>{r.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>AI News & <span style={{ color: C.accentSoft }}>Strategy</span></h2>
          </div>
          <div className="bg" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {posts.map((p,i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, cursor: "pointer", transition: "all .35s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ padding: "5px 14px", borderRadius: 8, background: "rgba(124,108,240,.08)", color: C.accentSoft, fontSize: 11.5, fontWeight: 700 }}>{p.cat}</span>
                  <span style={{ fontSize: 28 }}>{p.ico}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, fontFamily: "'Outfit',sans-serif", lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, marginBottom: 16 }}>{p.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.dim }}><span>{p.date}</span><span>•</span><span>{p.read}</span></div>
                  <span onClick={() => setChat(true)} style={{ color: C.accentSoft, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 28, padding: "70px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center,${C.accentGlow} 0%,transparent 65%)`, opacity: .2, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>Stop Losing Clients.<br /><span style={{ color: C.accentSoft }}>Start Automating Today.</span></h2>
              <p style={{ color: C.sub, fontSize: 18, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 40px" }}>Book a free consultation and go live in 48 hours.</p>
              <button onClick={() => setChat(true)} style={{ padding: "22px 48px", borderRadius: 16, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 900, fontSize: 18, cursor: "pointer", boxShadow: `0 8px 40px ${C.accentGlow}`, transition: "transform .2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-3px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>Start Getting Clients →</button>
              <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 48 }}>
                {[["📧","Email","hello@smvdigitalpro.com","mailto:hello@smvdigitalpro.com"],["💬","Telegram","@smvdigitalpro","https://t.me/smvdigitalpro"],["🔗","Upwork","SMV DigitalPro","https://www.upwork.com/freelancers/smvdigitalpro"],["🎯","Fiverr","smvdigitalpro","https://www.fiverr.com/smvdigitalpro"]].map(([ic,l,v,href],i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none", transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}><div style={{ fontSize: 20, marginBottom: 4 }}>{ic}</div><div style={{ fontSize: 11, color: C.dim, fontWeight: 600 }}>{l}</div><div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{v}</div></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: "48px 32px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 12 }}>S</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14, color: C.text }}>SMV DigitalPro</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 18 }}>
          {[["https://instagram.com/smvdigitalpro","M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"],["https://tiktok.com/@smvdigitalpro","M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"],["https://linkedin.com/company/smvdigitalpro","M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"]].map(([href,path],i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${C.border}`, transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = "rgba(124,108,240,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={C.sub}><path d={path}/></svg>
            </a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: C.dim }}>© 2026 SMV DigitalPro · AI-Powered Digital Agency</p>
      </footer>

      <Bot open={chat} toggle={() => setChat(!chat)} />
    </div>
  );
}
