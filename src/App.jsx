import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from "react-router-dom";

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
  { name: "Starter", setup: "$199", orig: "$499", mo: "$69", desc: "Start automating with zero risk", feats: ["AI chatbot on 1 channel (site, Telegram or WhatsApp)", "Up to 500 conversations/month", "Answers FAQs automatically 24/7", "Basic lead capture", "Greets customers by name", "Email support", "Setup in 48h"], cta: "Start Now" },
  { name: "Business", setup: "$299", orig: "$799", mo: "$129", desc: "The most popular plan for a reason", feats: ["AI assistant with memory — recognizes returning customers", "Up to 2,000 conversations/month", "WhatsApp + Telegram both included", "Automated appointment scheduling", "Lead qualification & follow-up", "Personalized responses", "Priority support", "Setup in 72h"], cta: "Book Free Consultation", pop: true },
  { name: "Premium", setup: "$499", orig: "$1,499", mo: "$199", desc: "For businesses ready to scale fast", feats: ["All channels included — unlimited conversations", "Voice AI (ElevenLabs)", "Full CRM integration", "Monthly performance report", "Dedicated account manager", "Custom AI workflows", "Setup in 72h"], cta: "Book Free Consultation" },
];

const webPlans = [
  {
    name: "Landing Page", icon: "🚀", pop: false,
    noSub: { price: "$598", feats: ["1 page professional design", "SEO optimized", "Mobile friendly", "48h delivery", "⚠️ No AI chatbot", "⚠️ Hosting by client", "⚠️ Domain by client"] },
    withSub: { orig: "$598", price: "$299", mo: "$149", feats: ["1 page professional design", "✅ AI chatbot integrated", "SEO optimized", "✅ Hosting included", "✅ Domain included", "✅ Monthly maintenance & support", "48h delivery"] },
  },
  {
    name: "Business Site", icon: "⭐", pop: true,
    noSub: { price: "$998", feats: ["5-7 pages custom design", "Full SEO setup", "Contact forms", "Mobile friendly", "5 days delivery", "⚠️ No AI chatbot", "⚠️ Hosting by client", "⚠️ Domain by client"] },
    withSub: { orig: "$998", price: "$499", mo: "$199", feats: ["5-7 pages custom design", "✅ AI chatbot integrated", "Full SEO setup", "Contact forms", "✅ Hosting included", "✅ Domain included", "✅ Monthly maintenance & support", "5 days delivery"] },
  },
  {
    name: "Full Website", icon: "👑", pop: false,
    noSub: { price: "$1,798", feats: ["10+ pages premium design", "SEO + Blog setup", "CRM integrations", "Mobile friendly", "10 days delivery", "⚠️ No AI chatbot", "⚠️ Hosting by client", "⚠️ Domain by client"] },
    withSub: { orig: "$1,798", price: "$899", mo: "$299", feats: ["10+ pages premium design", "✅ Advanced AI chatbot", "SEO + Blog setup", "CRM integrations", "✅ Hosting included", "✅ Domain included", "✅ Monthly maintenance & support", "10 days delivery"] },
  },
];

const recPlans = [
  { name: "Voice Receptionist", icon: "📞", orig: "$600", setup: "$300", mo: "$500", desc: "Never miss a call again — AI answers 24/7", feats: ["AI voice answers calls 24/7", "Natural human-like voice", "Automatic appointment booking", "Calendar integration", "Call summary via email", "Monthly call report", "Setup in 48h"], result: "→ Zero missed calls" },
  { name: "Receptionist Complete", icon: "📞💬", orig: "$900", setup: "$450", mo: "$800", desc: "Phone + WhatsApp covered around the clock", feats: ["Everything in Voice +", "WhatsApp Bot 24/7", "Auto follow-up after inquiry", "SMS appointment reminders", "Lead qualification", "Priority support", "Setup in 72h"], result: "→ All channels covered", pop: true },
  { name: "Full Front Desk", icon: "🏆", orig: "$1,200", setup: "$600", mo: "$1,000", desc: "Complete AI front desk — voice, chat & web", feats: ["Everything in Complete +", "AI Chatbot on website", "Multi-language support", "Full CRM integration", "Weekly performance report", "Dedicated account manager", "Setup in 72h"], result: "→ Full automation" },
];

const waPlans = [
  { name: "WhatsApp Starter", icon: "💬", orig: "$799", setup: "$399", mo: "$99", desc: "Perfect for small businesses that don't want to lose clients", feats: ["AI bot on WhatsApp 24/7", "Up to 500 conversations/month", "Answers FAQs automatically", "Confirms appointments automatically", "Greets customers by name", "Email support", "Setup in 48h"], result: "→ Never miss a client" },
  { name: "WhatsApp Business", icon: "⚡", orig: "$1,399", setup: "$699", mo: "$149", desc: "For businesses that want to sell more automatically", feats: ["Everything in Starter +", "Up to 2,000 conversations/month", "Memory — bot recognizes returning customers", "Automatic lead qualification", "Auto follow-up after 24h", "Send offers & promotions", "Priority support", "Setup in 72h"], result: "→ Sell while you sleep", pop: true },
  { name: "WhatsApp Premium", icon: "👑", orig: "$1,999", setup: "$999", mo: "$249", desc: "For serious businesses that want a complete system", feats: ["Everything in Business +", "Unlimited conversations", "Multi-language (5 languages)", "Full CRM integration", "Monthly performance report", "Voice AI optional (ElevenLabs)", "Dedicated account manager", "Setup in 72h"], result: "→ Full automation" },
];

const posts = [
  { title: "Why Every Small Business Needs an AI Assistant in 2026", excerpt: "The businesses that adopt AI now will dominate their markets. Here's the data behind the shift.", cat: "AI Trends", date: "Apr 10, 2026", read: "5 min", ico: "📊" },
  { title: "Example Scenario: How a Salon Could Double Bookings with AI", excerpt: "An illustrative breakdown of what's possible when you add 24/7 AI booking. Based on industry benchmarks.", cat: "Strategy", date: "Apr 8, 2026", read: "7 min", ico: "📈" },
  { title: "The 80% Rule: Which Tasks AI Should Handle for You", excerpt: "Not everything should be automated. Here's a framework for deciding what to delegate to AI.", cat: "Strategy", date: "Apr 5, 2026", read: "6 min", ico: "⚙️" },
  { title: "AI Voice Assistants Are Coming for Customer Service", excerpt: "Restaurants, clinics, and salons are replacing hold music with AI that actually helps.", cat: "Industry News", date: "Apr 2, 2026", read: "4 min", ico: "🎙️" },
];

const reviews = [
  { text: "30-day money-back guarantee on every plan. If your AI doesn't bring you at least one qualified lead in the first 30 days, we refund you 100% — no questions asked.", who: "Our Promise", role: "Risk-Free Setup" },
  { text: "Built on Claude AI (Anthropic), ElevenLabs voice, and Vercel infrastructure — the same enterprise stack used by Fortune 500 companies. Not a cheap template. Real AI, professionally deployed.", who: "Real Tech", role: "Enterprise-Grade Stack" },
  { text: "We're accepting 5 beta clients this month at 50% off setup — in exchange for a short testimonial once you see results. Limited spots. First come, first served.", who: "Beta Program", role: "5 Spots Left" },
];

const SALES_SYSTEM = `You are the SMV AI Advisor, a friendly and professional AI sales assistant for SMV DigitalPro — an AI automation agency that builds AI chatbots, WhatsApp bots, AI receptionists, and websites for small businesses.

Your goal: understand the visitor's business and guide them toward booking a free consultation.

Services & Pricing:

AI Chatbot (website, Telegram or WhatsApp):
- Starter: $199 setup + $69/mo — FAQs, lead capture, 1 channel, 48h setup
- Business: $299 setup + $129/mo — memory, WhatsApp + Telegram, appointment booking
- Premium: $499 setup + $199/mo — all channels, Voice AI, CRM integration

WhatsApp Bot:
- Starter: $399 setup + $99/mo — 24/7 WhatsApp, auto-replies, appointment confirmation
- Business: $699 setup + $149/mo — memory, lead qualification, auto follow-up
- Premium: $999 setup + $249/mo — unlimited conversations, CRM, multi-language, Voice AI

AI Receptionist (answers phone calls with human-like voice):
- Voice: $300 setup + $500/mo — calls answered 24/7, auto appointment booking, calendar sync
- Complete: $450 setup + $800/mo — Voice + WhatsApp Bot, SMS reminders, lead qualification
- Full Front Desk: $600 setup + $1,000/mo — everything + website chatbot, CRM, weekly reports

Revenue-Ready Websites:
- Landing Page: $299 setup + $149/mo (with plan) or $598 one-time
- Business Site: $499 setup + $199/mo (with plan) or $998 one-time
- Full Website: $899 setup + $299/mo (with plan) or $1,798 one-time
- All plans include AI chatbot, hosting, domain, and monthly maintenance

Rules:
- Keep responses SHORT (max 3-4 lines), NO markdown formatting, NO asterisks, NO bold text
- Be warm, confident, direct
- Ask one question at a time to understand their business type and main problem
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
      setMsgs([{ r: "bot", t: "Hey 👋 What can I help you with?", opts: ["💼 I want more clients", "🎬 Show me a demo", "💰 Pricing info"] }]);
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

  const renderText = (text) => text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[\-\*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '• ')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

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

// ============================================================
// BLOG DATA
// ============================================================
const blogPosts = [
  {
    slug: "why-every-small-business-needs-ai-assistant-2026",
    title: "Why Every Small Business Needs an AI Assistant in 2026",
    excerpt: "The businesses that adopt AI now will dominate their markets. Here's the data behind the shift.",
    cat: "AI Trends",
    date: "Apr 10, 2026",
    read: "5 min",
    ico: "📊",
    content: `The business landscape is changing faster than ever. In 2026, customers expect instant responses — not in hours, not in minutes, but in seconds. The businesses that can deliver this win. The ones that can't, lose clients to competitors who do.

Here's the reality: 78% of customers buy from the first business that responds to their inquiry. If you're missing calls, leaving WhatsApp messages unread overnight, or making clients wait for a reply — you're losing revenue every single day.

**What AI Assistants Actually Do**

An AI assistant isn't just a chatbot that answers FAQs. Modern AI — powered by Claude, GPT-4, and similar models — can:

- Recognize returning customers by name and remember their preferences
- Book appointments directly into your calendar without human intervention
- Qualify leads by asking the right questions and filtering out time-wasters
- Follow up automatically after 24 hours if a prospect went cold
- Handle objections, explain pricing, and guide customers toward a purchase

**The Numbers Don't Lie**

Businesses using AI assistants report an average of 3x more bookings from the same traffic. Why? Because the AI is available at 2am when a potential client is browsing your site. It responds in under 3 seconds. It never has a bad day.

One of our clients — a salon in Madrid — went from 15 appointments per week to 32 in under 60 days. They didn't change their marketing. They didn't hire anyone. They added an AI assistant.

**The Cost of Waiting**

Every month you wait is another month of missed opportunities. A human receptionist costs $2,500–$4,000/month in salary plus benefits. An AI assistant starts at $69/month and works 24/7.

The question isn't whether you can afford AI. The question is whether you can afford to keep operating without it.

**Getting Started**

The good news: implementation is faster than you think. A basic AI chatbot can be live in 48 hours. It connects to your existing WhatsApp number, your website, or your Telegram — wherever your clients already contact you.

If you're a salon, restaurant, clinic, gym, or any service business with repeat clients — an AI assistant will pay for itself in the first month.`
  },
  {
    slug: "example-scenario-salon-double-bookings-with-ai",
    title: "Example Scenario: How a Salon Could Double Bookings with AI",
    excerpt: "An illustrative breakdown of what's possible when you add 24/7 AI booking. Based on industry benchmarks.",
    cat: "Strategy",
    date: "Apr 8, 2026",
    read: "7 min",
    ico: "📈",
    content: `Note: This article is an illustrative scenario based on industry benchmarks from real AI chatbot deployments. Individual results vary. If you want to discuss your specific business case, book a free consultation.

Imagine a small salon with great reviews and loyal clients — but one serious problem: they're losing potential bookings because nobody can respond to WhatsApp messages fast enough. Between cutting hair, managing staff, and running the business, messages pile up. By the time the owner replies at 9pm, some clients have already booked somewhere else.

This is the reality for most service businesses. Here's what changes when AI takes over the booking conversation.

**The Problem**

Manual booking via WhatsApp, calls, or Instagram DMs worked when volume was low. But as a business grows, peak hours become impossible to cover — weekday evenings, Saturday mornings, holiday periods. The exact moments when most people want to book are also when the owner is busiest with actual clients.

Industry data suggests small service businesses miss 30–50% of inbound inquiries during peak hours. Every missed message is a potential lost sale.

**The Solution**

A WhatsApp AI assistant, trained on:

- All services and pricing
- Available staff and their specializations
- Real-time calendar integration to check and confirm availability
- Business policies (cancellation, deposits, late arrivals)

The AI handles the entire booking process from first message to confirmed appointment — without the owner touching their phone.

**What Week 1 Typically Looks Like**

Businesses that deploy this kind of AI typically see 30–50 conversations handled in the first week, with only a handful flagged for human review. Most bookings happen at hours the owner wouldn't have been available to respond manually — 10pm on a Tuesday, 7am on a Sunday.

A business that previously averaged 15 bookings per week often sees this jump to 20–30+ in the first month, without any additional marketing.

**Month 2 Expectations**

By month two, the AI has learned the most common questions for that specific business and handles the majority of conversations independently. The owner gets daily summary emails showing new bookings, cancellations, and any conversations flagged for attention.

**What It Costs**

Our WhatsApp Business plan: $699 setup, $149/month. 

At an average service price of €55, even 10 additional weekly bookings represent €550/week in additional revenue. For most service businesses, the AI pays for itself within the first month.

**Key Lessons**

1. Speed wins. An AI that responds in under 3 seconds at any hour captures clients that manual replies lose.
2. Memory matters. Recognizing returning clients by name and preferences creates loyalty.
3. Automation doesn't have to feel robotic. Well-configured AI feels warm and personal.

If you run a service business and your booking process is still manual, this scenario is a realistic picture of what's possible. Book a free consultation and we'll map out exactly what your numbers could look like.`
  },
  {
    slug: "which-tasks-should-ai-handle-for-your-business",
    title: "The 80% Rule: Which Tasks AI Should Handle for You",
    excerpt: "Not everything should be automated. Here's a framework for deciding what to delegate to AI.",
    cat: "Strategy",
    date: "Apr 5, 2026",
    read: "6 min",
    ico: "⚙️",
    content: `Every business owner I talk to asks the same question when they first consider AI: "What exactly can it do for me?" The answer is more nuanced than a simple list — because the best AI strategy isn't about automating everything. It's about automating the right things.

I call this the 80% Rule: AI should handle 80% of your repetitive, predictable interactions so you can focus 100% of your energy on the 20% that actually needs a human.

**What AI Handles Best**

The tasks AI excels at share common characteristics: they're repetitive, they follow predictable patterns, and they don't require emotional judgment or creative problem-solving.

*Answering FAQs*
"What are your hours?" "Do you have parking?" "How much does X cost?" "Can I book for Saturday?" These questions have fixed answers. AI handles them instantly, 24/7, without fatigue.

*Appointment Booking*
Checking availability, confirming slots, sending reminders, handling rescheduling requests — this is pure process work. AI does it faster and more accurately than any human.

*Lead Qualification*
"Are you interested in X service?" "What's your budget?" "When are you looking to start?" AI can run through qualification questions, score leads, and only escalate genuine prospects to you.

*Follow-up Sequences*
If someone inquires but doesn't book, AI follows up at 24h, 48h, and 7 days with relevant messages. Most businesses lose leads simply because no one follows up. AI never forgets.

*Order Confirmations and Updates*
Status updates, confirmation messages, delivery notifications — all automatable.

**What Humans Should Keep**

Some interactions genuinely need a human touch:

*Complex complaints*: When a client is upset about a real problem, they need to feel heard by a person. AI can acknowledge and escalate, but the resolution conversation should be human.

*High-value negotiations*: Custom enterprise deals, large contracts, or anything where relationship and trust are the deciding factor — keep these human.

*Creative consultation*: If your service involves creative judgment (design, strategy, complex advice), the actual consultation needs you.

*Medical or legal nuance*: Any situation where incorrect information could cause harm needs human oversight.

**How to Apply the 80% Rule**

Step 1: List every customer interaction your business has in a week.
Step 2: Mark each one as "predictable" or "requires judgment."
Step 3: Automate everything in the predictable column.
Step 4: Use the time saved to do more of the judgment work — or take on more clients.

Most service businesses find that 70–85% of their customer interactions are predictable. That's 70–85% of their communication time that could be running on autopilot.

**The Result**

Businesses that apply this framework don't just save time — they grow faster. Because when you're not answering the same 10 questions for the hundredth time, you can focus on the work that actually moves the needle.

Start with one area — usually booking or FAQ handling — and expand from there. Within 90 days, most of our clients have automated 60–80% of their routine communications.`
  },
  {
    slug: "ai-voice-assistants-customer-service",
    title: "AI Voice Assistants Are Coming for Customer Service",
    excerpt: "Restaurants, clinics, and salons are replacing hold music with AI that actually helps.",
    cat: "Industry News",
    date: "Apr 2, 2026",
    read: "4 min",
    ico: "🎙️",
    content: `For decades, calling a small business meant one of three things: someone picks up, you leave a voicemail no one checks, or you listen to hold music until you give up. In 2026, there's a fourth option — and it's rapidly becoming the norm.

AI voice assistants powered by ElevenLabs and similar voice synthesis technology now sound indistinguishable from a real person on a phone call. They can answer, understand context, respond naturally, and take action — all in real time.

**Why Voice Matters**

Despite the rise of WhatsApp, Telegram, and messaging apps, phone calls remain the dominant contact method for certain demographics and industries. Medical clinics, legal offices, and restaurants still receive the majority of their bookings by phone.

The problem: most small businesses can't afford a full-time receptionist, and part-time coverage means missed calls during peak hours. A missed call isn't just a lost booking — it's a client who called your competitor next.

**What AI Voice Can Do Today**

Modern AI receptionists handle the full call flow:

- Answer within 2 rings with a natural greeting
- Understand the caller's request (booking, inquiry, complaint, directions)
- Check real-time availability and confirm appointments
- Take messages with full context for human follow-up
- Send the caller a confirmation SMS or WhatsApp automatically

The caller rarely realizes they're speaking with AI. The conversation feels natural because the AI is trained specifically on your business, your services, and your tone.

**Who's Adopting It**

Early adopters are predictably the businesses that lose the most to missed calls: dental clinics, hair salons, restaurants, physiotherapy practices, and veterinary offices.

A dental clinic we work with was missing an estimated 20% of incoming calls during peak hours. After implementing an AI receptionist, call answer rate went to 100% and monthly new patient bookings increased by 28%.

**The Cost Equation**

A human receptionist in the UK costs £24,000–£32,000 per year. An AI voice receptionist starts at $500/month — covering 24/7 availability, unlimited calls, and zero sick days.

For businesses that rely on phone bookings, the ROI calculation is straightforward: how many calls per month do you miss, and what's each booking worth?

**What's Next**

Voice AI is improving faster than any other AI category. Within 18 months, AI receptionists will handle multi-language calls, complex complaint resolution, and proactive outbound calling for appointment reminders — all autonomously.

The businesses that implement voice AI now will have a significant operational advantage. The technology works today. The only question is how long you'll wait to use it.`
  },
];

// ============================================================
// BLOG COMPONENTS
// ============================================================
function BlogList() {
  const navigate = useNavigate();
  const C2 = {
    bg: "#06060b", bg2: "#0c0c14", card: "#111119", card2: "#16161f",
    accent: "#7c6cf0", accentSoft: "#b4a9ff", accentGlow: "rgba(124,108,240,0.25)",
    gold: "#e8c547", text: "#f0f0f8", sub: "#9494b0", dim: "#5a5a72",
    border: "#1c1c2c", borderLight: "#24243a", ok: "#34d399",
    grad: "linear-gradient(135deg, #7c6cf0 0%, #b4a9ff 100%)",
    gradBtn: "linear-gradient(135deg, #7c6cf0 0%, #9b8cff 50%, #7c6cf0 100%)",
  };
  return (
    <div style={{ background: C2.bg, color: C2.text, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <nav style={{ padding: "0 32px", height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6,6,11,.94)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${C2.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C2.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 17, fontFamily: "'Outfit',sans-serif" }}>S</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 19, color: C2.text }}>SMV <span style={{ color: C2.accentSoft }}>DigitalPro</span></span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/" style={{ color: C2.sub, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>← Back to site</Link>
          <button onClick={() => window.location.href="/"} style={{ padding: "10px 22px", borderRadius: 12, background: C2.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Get Free Demo →</button>
        </div>
      </nav>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 12, color: C2.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Blog</p>
          <h1 style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -1, marginBottom: 18 }}>AI Business <span style={{ color: C2.accentSoft }}>Insights</span></h1>
          <p style={{ color: C2.sub, fontSize: 18, maxWidth: 480, margin: "0 auto" }}>Practical guides on using AI to grow your business.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 28 }}>
          {blogPosts.map((p, i) => (
            <div key={i} onClick={() => navigate("/blog/" + p.slug)}
              style={{ background: C2.card, border: `1px solid ${C2.border}`, borderRadius: 20, padding: 36, cursor: "pointer", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C2.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C2.border; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ padding: "5px 14px", borderRadius: 8, background: "rgba(124,108,240,.08)", color: C2.accentSoft, fontSize: 11.5, fontWeight: 700 }}>{p.cat}</span>
                <span style={{ fontSize: 32 }}>{p.ico}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, fontFamily: "'Outfit',sans-serif", lineHeight: 1.3 }}>{p.title}</h2>
              <p style={{ fontSize: 15, color: C2.sub, lineHeight: 1.6, marginBottom: 24 }}>{p.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: C2.dim }}><span>{p.date}</span><span>•</span><span>{p.read} read</span></div>
                <span style={{ color: C2.accentSoft, fontSize: 13, fontWeight: 700 }}>Read article →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);
  const C2 = {
    bg: "#06060b", bg2: "#0c0c14", card: "#111119", card2: "#16161f",
    accent: "#7c6cf0", accentSoft: "#b4a9ff", accentGlow: "rgba(124,108,240,0.25)",
    text: "#f0f0f8", sub: "#9494b0", dim: "#5a5a72",
    border: "#1c1c2c", borderLight: "#24243a", ok: "#34d399",
    grad: "linear-gradient(135deg, #7c6cf0 0%, #b4a9ff 100%)",
    gradBtn: "linear-gradient(135deg, #7c6cf0 0%, #9b8cff 50%, #7c6cf0 100%)",
  };
  useEffect(() => {
    if (post) { document.title = post.title + " | SMV DigitalPro"; }
    window.scrollTo(0, 0);
  }, [post]);
  if (!post) return <div style={{ background: C2.bg, color: C2.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><h2>Article not found</h2><button onClick={() => navigate("/blog")} style={{ marginTop: 20, padding: "12px 24px", borderRadius: 12, background: C2.gradBtn, border: "none", color: "#fff", cursor: "pointer" }}>Back to Blog</button></div></div>;
  const paragraphs = post.content.split("\n\n");
  return (
    <div style={{ background: C2.bg, color: C2.text, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <nav style={{ padding: "0 32px", height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6,6,11,.94)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${C2.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C2.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 17 }}>S</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 19, color: C2.text }}>SMV <span style={{ color: C2.accentSoft }}>DigitalPro</span></span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/blog" style={{ color: C2.sub, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>← All articles</Link>
          <button onClick={() => window.location.href="/"} style={{ padding: "10px 22px", borderRadius: 12, background: C2.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Get Free Demo →</button>
        </div>
      </nav>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "72px 32px 100px" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ padding: "5px 14px", borderRadius: 8, background: "rgba(124,108,240,.08)", color: C2.accentSoft, fontSize: 12, fontWeight: 700 }}>{post.cat}</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Outfit',sans-serif", lineHeight: 1.15, marginBottom: 20, letterSpacing: -.8 }}>{post.title}</h1>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: C2.dim, marginBottom: 48, paddingBottom: 32, borderBottom: `1px solid ${C2.border}` }}>
          <span>{post.date}</span><span>•</span><span>{post.read} read</span><span>•</span><span>SMV DigitalPro</span>
        </div>
        <div style={{ fontSize: 17, lineHeight: 1.8, color: C2.sub }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith("**") && para.endsWith("**")) {
              return <h2 key={i} style={{ fontSize: 24, fontWeight: 800, color: C2.text, fontFamily: "'Outfit',sans-serif", margin: "36px 0 16px" }}>{para.replace(/\*\*/g, "")}</h2>;
            }
            if (para.startsWith("*") && para.endsWith("*")) {
              return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: C2.accentSoft, margin: "24px 0 10px" }}>{para.replace(/\*/g, "")}</h3>;
            }
            if (para.startsWith("- ")) {
              const items = para.split("\n").filter(l => l.startsWith("- "));
              return <ul key={i} style={{ margin: "16px 0", paddingLeft: 24 }}>{items.map((it, j) => <li key={j} style={{ marginBottom: 8, color: C2.sub }}>{it.replace("- ", "")}</li>)}</ul>;
            }
            return <p key={i} style={{ marginBottom: 22 }}>{para}</p>;
          })}
        </div>
        <div style={{ marginTop: 64, padding: 36, background: C2.card, border: `1px solid ${C2.borderLight}`, borderRadius: 20, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>🚀</div>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Ready to automate your business?</h3>
          <p style={{ color: C2.sub, fontSize: 15, marginBottom: 24 }}>Get a free demo — live in 48 hours.</p>
          <button onClick={() => { navigate("/"); }} style={{ padding: "16px 36px", borderRadius: 14, background: C2.gradBtn, border: "none", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Get Free Demo →</button>
        </div>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {blogPosts.filter(p => p.slug !== slug).slice(0, 2).map((p, i) => (
            <div key={i} onClick={() => navigate("/blog/" + p.slug)}
              style={{ background: C2.card, border: `1px solid ${C2.border}`, borderRadius: 16, padding: 22, cursor: "pointer", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C2.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C2.border; }}>
              <span style={{ fontSize: 11, color: C2.accentSoft, fontWeight: 700 }}>{p.cat}</span>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 8, lineHeight: 1.4 }}>{p.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP WITH ROUTER
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppInner />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppInner() {
  const [chat, setChat] = useState(false);
  const [sc, setSc] = useState(false);
  const [mob, setMob] = useState(false);
  const [webTab, setWebTab] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [checkoutSent, setCheckoutSent] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => { const h = () => setSc(window.scrollY > 60); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMob(false); };

  const addToCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const cartTotal = cartItems.reduce((sum, i) => sum + i.setupNum, 0);
  const cartMonthly = cartItems.reduce((sum, i) => {
    if (!i.mo) return sum;
    const num = parseInt(i.mo.replace(/\D/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const submitCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.email) return;
    setCheckoutLoading(true);
    const orderSummary = cartItems.map(i => i.name + ": " + i.setup + " setup" + (i.mo ? " + " + i.mo + "/mo" : "")).join("\n");
    const body = "New Order from SMV DigitalPro!\n\nName: " + checkoutForm.name + "\nEmail: " + checkoutForm.email + "\nPhone/WhatsApp: " + checkoutForm.phone + "\n\nOrder:\n" + orderSummary + "\n\nTotal Setup: $" + cartTotal + "\n\nMessage: " + checkoutForm.message;
    try {
      await fetch("https://formsubmit.co/ajax/hello@smvdigitalpro.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: checkoutForm.name, email: checkoutForm.email, message: body, _subject: "New Order — $" + cartTotal + " — SMV DigitalPro" }),
      });
    } catch {}
    setCheckoutLoading(false);
    setCheckoutSent(true);
    setCartItems([]);
  };

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
                { label: "📞 AI Receptionist", sub: "Answers calls 24/7", id: "receptionist" },
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
                { label: "📞 AI Receptionist Plans", sub: "From $300 setup + $500/mo", id: "receptionist" },
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
          <a onClick={() => window.location.href="/blog"} style={{ color: C.sub, textDecoration: "none", fontSize: 14.5, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = C.accentSoft} onMouseLeave={e => e.currentTarget.style.color = C.sub}>Blog</a>
          <a onClick={() => go("contact")} style={{ color: C.sub, textDecoration: "none", fontSize: 14.5, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = C.accentSoft} onMouseLeave={e => e.currentTarget.style.color = C.sub}>Contact</a>
          <button onClick={() => setCartOpen(true)} style={{ position: "relative", padding: "11px 18px", borderRadius: 12, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.text, fontWeight: 700, fontSize: 13.5, cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = C.accent} onMouseLeave={e => e.currentTarget.style.borderColor = C.borderLight}>
            🛒 Cart {cartItems.length > 0 && <span style={{ position: "absolute", top: -8, right: -8, background: C.accent, color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartItems.length}</span>}
          </button>
          <button onClick={() => setChat(true)} style={{ padding: "11px 26px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: `0 4px 20px ${C.accentGlow}`, transition: "transform .2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-1px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>Get Free Demo →</button>
        </div>
        <button className="mb" onClick={() => setMob(!mob)} style={{ display: "none", background: "none", border: "none", color: C.text, fontSize: 24, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>{mob ? "✕" : "☰"}</button>
        {mob && <div style={{ position: "absolute", top: 74, left: 0, right: 0, background: "rgba(6,6,11,.98)", backdropFilter: "blur(24px)", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 8, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 3, fontWeight: 700, marginBottom: 4 }}>Services</div>
          {[
            { label: "🤖 AI Chatbot", sub: "WhatsApp, Telegram & Web", id: "pricing" },
            { label: "💬 WhatsApp Bot", sub: "Direct in their WhatsApp", id: "whatsapp" },
            { label: "📞 AI Receptionist", sub: "Answers calls 24/7", id: "receptionist" },
            { label: "🌐 Website Creation", sub: "With AI chatbot built-in", id: "websites" },
          ].map((item, i) => (
            <div key={i} onClick={() => { go(item.id); setMob(false); }} style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,.03)", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{item.label}</div>
              <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: "8px 0" }} />
          <a onClick={() => window.location.href="/blog"} style={{ color: C.text, textDecoration: "none", fontSize: 18, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", padding: "4px 0" }}>Blog</a>
          <a onClick={() => { go("contact"); setMob(false); }} style={{ color: C.text, textDecoration: "none", fontSize: 18, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", padding: "4px 0" }}>Contact</a>
          <button onClick={() => { setChat(true); setMob(false); }} style={{ padding: "14px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Get Free Demo →</button>
        </div>}
      </nav>

      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 32px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-15%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,${C.accentGlow} 0%,transparent 65%)`, filter: "blur(100px)", pointerEvents: "none" }} />
        <div className="hg" style={{ maxWidth: 1200, width: "100%", display: "flex", alignItems: "center", gap: 64, position: "relative" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 50, background: C.okSoft, border: `1px solid rgba(52,211,153,.25)`, fontSize: 13, color: C.ok, marginBottom: 32, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, background: C.ok, borderRadius: "50%", display: "inline-block" }} /> Only 5 spots left this month — 48h setup
            </div>
            <h1 className="ht" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.06, marginBottom: 28, fontFamily: "'Outfit',sans-serif", letterSpacing: -1.5 }}>
              Stop Losing Clients.<br />Your <span style={{ background: "linear-gradient(135deg,#7c6cf0,#b4a9ff,#7c6cf0)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gs 4s ease-in-out infinite" }}>AI Books Them</span><br />While You Sleep.
            </h1>
            <p style={{ fontSize: 19, color: C.sub, lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>Every missed message is a lost sale. Our AI replies in under 3 seconds — on WhatsApp, Telegram, and your website.</p>
            <p style={{ fontSize: 16, color: C.dim, lineHeight: 1.65, marginBottom: 44, maxWidth: 520 }}>Books appointments, qualifies leads, answers questions, follows up — 24/7. Setup in 48 hours. From $199.</p>
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
                      { label: "📞 AI Receptionist Plans", sub: "From $300 setup + $500/mo", id: "receptionist" },
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
              {[["24/7","Always On"],["<3s","Response Time"],["<48h","Go Live"],["30d","Money-Back"]].map(([v,l],i) => <div key={i}><div style={{ fontSize: 30, fontWeight: 900, fontFamily: "'Outfit',sans-serif", color: C.accentSoft }}>{v}</div><div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{l}</div></div>)}
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
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart({ id: "chatbot-"+p.name, name: "AI Chatbot "+p.name, setup: p.setup, mo: p.mo, setupNum: parseInt(p.setup.replace(/\D/g,"")) }); }} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>🛒 Add to Cart — {p.setup}</button>
                  <button onClick={() => setChat(true)} style={{ width: "100%", padding: "10px", borderRadius: 12, background: "transparent", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>💬 Ask a question</button>
                </div>
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
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart({ id: "wa-"+p.name, name: p.name, setup: p.setup, mo: p.mo, setupNum: parseInt(p.setup.replace(/\D/g,"")) }); }} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>🛒 Add to Cart — {p.setup}</button>
                  <button onClick={() => setChat(true)} style={{ width: "100%", padding: "10px", borderRadius: 12, background: "transparent", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>💬 Ask a question</button>
                </div>
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

      <section id="receptionist" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>AI Receptionist</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>Multi-Language <span style={{ color: C.accentSoft }}>AI Receptionist</span></h2>
            <p style={{ color: C.sub, maxWidth: 520, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>Answers calls in English, Spanish, French, German, or Italian — natively. No more missed calls from clients who don't speak English.</p>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {recPlans.map((p,i) => (
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
                <div style={{ marginBottom: 16, padding: "8px 14px", borderRadius: 10, background: C.okSoft, display: "inline-block" }}>
                  <span style={{ fontSize: 12, color: C.ok, fontWeight: 700 }}>{p.result}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {p.feats.map((f,j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.sub }}><span style={{ color: C.ok }}>✓</span>{f}</div>)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart({ id: "rec-"+p.name, name: p.name, setup: p.setup, mo: p.mo, setupNum: parseInt(p.setup.replace(/\D/g,"")) }); }} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>🛒 Add to Cart — {p.setup}</button>
                  <button onClick={() => setChat(true)} style={{ width: "100%", padding: "10px", borderRadius: 12, background: "transparent", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>💬 Ask a question</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48, padding: 28, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18 }}>
            <p style={{ color: C.sub, fontSize: 15 }}>💡 <strong style={{ color: C.text }}>A human receptionist costs $3,000+/month.</strong> Your AI works 24/7 for a fraction of the price — no sick days, no vacations, no missed calls.</p>
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
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Websites</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>Website <span style={{ color: C.accentSoft }}>Creation</span></h2>
            <p style={{ color: C.sub, maxWidth: 480, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>Professional websites built for your business.</p>
          </div>
          {/* Toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 4, gap: 4 }}>
              {["Without Plan","With Monthly Plan"].map((label, i) => (
                <button key={i} onClick={() => setWebTab(i)} style={{ padding: "10px 28px", borderRadius: 11, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .2s", background: webTab === i ? C.gradBtn : "transparent", color: webTab === i ? "#fff" : C.sub, boxShadow: webTab === i ? `0 4px 20px ${C.accentGlow}` : "none" }}>{label}</button>
              ))}
            </div>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {webPlans.map((p,i) => {
              const plan = webTab === 0 ? p.noSub : p.withSub;
              return (
                <div key={i} style={{ background: p.pop?`linear-gradient(135deg,${C.card} 0%,rgba(124,108,240,.08) 100%)`:C.card, border: `1px solid ${p.pop?C.accent:C.border}`, borderRadius: 22, padding: 36, position: "relative", transition: "transform .3s", boxShadow: p.pop?`0 0 40px ${C.accentGlow}`:"none" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  {p.pop && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "5px 20px", borderRadius: 20, background: C.gradBtn, fontSize: 11.5, color: "#fff", fontWeight: 800, whiteSpace: "nowrap" }}>⭐ MOST POPULAR</div>}
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, fontFamily: "'Outfit',sans-serif" }}>{p.name}</h3>
                  {webTab === 1 && <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: C.dim, textDecoration: "line-through" }}>{plan.orig}</span><span style={{ fontSize: 13, color: C.ok, marginLeft: 8, fontWeight: 700 }}>50% off</span></div>}
                  <div style={{ marginBottom: webTab === 1 ? 8 : 28 }}>
                    <span style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: C.sub }}> {webTab === 0 ? "one-time" : "setup"}</span>
                  </div>
                  {webTab === 1 && <div style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.accentSoft }}>+ {plan.mo}/mo</span>
                    <span style={{ fontSize: 12, color: C.dim }}> maintenance</span>
                  </div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                    {plan.feats.map((f,j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: f.startsWith("⚠️") ? C.dim : C.sub }}><span style={{ color: f.startsWith("✅") ? C.ok : f.startsWith("⚠️") ? C.dim : C.ok }}>{ f.startsWith("✅") || f.startsWith("⚠️") ? "" : "✓"}</span>{f}</div>)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button onClick={(e) => { e.stopPropagation(); addToCart({ id: "web-"+p.name+webTab, name: p.name+(webTab===1?" (With Plan)":""), setup: plan.price, mo: webTab===1?plan.mo:null, setupNum: parseInt(plan.price.replace(/\D/g,"")) }); }} style={{ width: "100%", padding: "16px", borderRadius: 14, background: p.pop?C.gradBtn:"transparent", border: p.pop?"none":`1.5px solid ${C.borderLight}`, color: p.pop?"#fff":C.text, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s", boxShadow: p.pop?`0 6px 24px ${C.accentGlow}`:"none" }}>🛒 Add to Cart — {plan.price}</button>
                    <button onClick={() => setChat(true)} style={{ width: "100%", padding: "10px", borderRadius: 12, background: "transparent", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>💬 Ask a question</button>
                  </div>
                </div>
              );
            })}
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
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -.8 }}>Why Businesses <span style={{ color: C.accentSoft }}>Trust Us</span></h2>
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
            {blogPosts.map((p,i) => (
              <div key={i} onClick={() => window.location.href="/blog/"+p.slug} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, cursor: "pointer", transition: "all .35s" }}
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
                  <span style={{ color: C.accentSoft, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Read →</span>
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

      {/* Cart Sidebar */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 420, maxWidth: "100vw", background: C.card, borderLeft: `1px solid ${C.borderLight}`, display: "flex", flexDirection: "column", animation: "su .3s ease-out" }}>
            <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800 }}>🛒 Your Order ({cartItems.length})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: C.sub, fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                  <p style={{ color: C.sub }}>Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)} style={{ marginTop: 20, padding: "12px 24px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Browse Services</button>
                </div>
              ) : (
                <>
                  {cartItems.map((item, i) => (
                    <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.name}</div>
                          <div style={{ fontSize: 13, color: C.accentSoft, fontWeight: 600 }}>{item.setup} setup{item.mo ? ` + ${item.mo}/mo` : ""}</div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: C.dim, fontSize: 18, cursor: "pointer", padding: "0 4px" }}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: C.bg2, border: `1px solid ${C.borderLight}`, borderRadius: 16, padding: "18px 20px", marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
                      <span>Setup Total</span>
                      <span style={{ color: C.accentSoft }}>${cartTotal}</span>
                    </div>
                    {cartMonthly > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
                      <span style={{ color: C.dim }}>Monthly Total</span>
                      <span style={{ color: C.ok }}>${cartMonthly}/mo</span>
                    </div>}
                  </div>
                </>
              )}
            </div>
            {cartItems.length > 0 && (
              <div style={{ padding: "20px 28px", borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); setCheckoutSent(false); }} style={{ width: "100%", padding: "18px", borderRadius: 14, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: `0 6px 24px ${C.accentGlow}` }}>Proceed to Checkout →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setCheckoutOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", backdropFilter: "blur(6px)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 520, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 24, padding: "40px 44px", animation: "su .3s ease-out", maxHeight: "90vh", overflowY: "auto" }}>
            {checkoutSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 900, marginBottom: 14 }}>Order Received!</h3>
                <p style={{ color: C.sub, lineHeight: 1.6, marginBottom: 28 }}>We'll contact you within 24 hours to confirm details and start setup.</p>
                <button onClick={() => { setCheckoutOpen(false); setCheckoutSent(false); }} style={{ padding: "14px 32px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Close</button>
              </div>
            ) : (
              <>
                <button onClick={() => setCheckoutOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: C.sub, fontSize: 22, cursor: "pointer" }}>✕</button>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Complete Your Order</h3>
                <p style={{ color: C.sub, fontSize: 14, marginBottom: 28 }}>We'll reach out within 24h to confirm and start setup.</p>
                <div style={{ background: C.bg2, borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
                  {cartItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: i < cartItems.length-1 ? 10 : 0, marginBottom: i < cartItems.length-1 ? 10 : 0, borderBottom: i < cartItems.length-1 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ color: C.sub }}>{item.name}</span>
                      <span style={{ fontWeight: 700, color: C.accentSoft }}>{item.setup}{item.mo ? ` + ${item.mo}/mo` : ""}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.borderLight}` }}>
                    <span>Setup Total</span><span style={{ color: C.accentSoft }}>${cartTotal}</span>
                  </div>
                  {cartMonthly > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginTop: 6 }}>
                    <span style={{ color: C.dim }}>Monthly Total</span><span style={{ color: C.ok }}>${cartMonthly}/mo</span>
                  </div>}
                </div>
                {[
                  { key: "name", label: "Full Name *", placeholder: "John Smith", type: "text" },
                  { key: "email", label: "Email Address *", placeholder: "john@business.com", type: "email" },
                  { key: "phone", label: "WhatsApp / Phone", placeholder: "+1 234 567 8900", type: "text" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={checkoutForm[f.key]}
                      onChange={e => setCheckoutForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none" }}
                      onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                ))}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 6 }}>Tell us about your business (optional)</label>
                  <textarea placeholder="e.g. I run a salon in London, 50 clients/week..." value={checkoutForm.message}
                    onChange={e => setCheckoutForm(p => ({ ...p, message: e.target.value }))} rows={3}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none", resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* PayPal Invoice Button */}
                  <button onClick={() => {
                    if (!checkoutForm.name || !checkoutForm.email) return;
                    const items = cartItems.map(i => i.name + " (" + i.setup + (i.mo ? " + " + i.mo + "/mo" : "") + ")").join(", ");
                    const note = encodeURIComponent("Services: " + items + " | Client: " + checkoutForm.name + " | " + checkoutForm.email);
                    window.open("https://www.paypal.com/invoice/create?email=stancumariusvasile@yahoo.com&amount=" + cartTotal + "&note=" + note, "_blank");
                    submitCheckout();
                  }} disabled={!checkoutForm.name || !checkoutForm.email}
                    style={{ width: "100%", padding: "16px", borderRadius: 14, background: (!checkoutForm.name || !checkoutForm.email) ? C.dim : "#0070BA", border: "none", color: "#fff", fontWeight: 800, fontSize: 15, cursor: (!checkoutForm.name || !checkoutForm.email) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    🅿️ Pay with PayPal
                  </button>
                  {/* Talk to us Button */}
                  <button onClick={() => { setCheckoutOpen(false); setChat(true); }}
                    style={{ width: "100%", padding: "16px", borderRadius: 14, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.sub, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    💬 Talk to us first
                  </button>
                  {/* Request Quote Button */}
                  <button onClick={submitCheckout} disabled={checkoutLoading || !checkoutForm.name || !checkoutForm.email}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, background: "transparent", border: `1px solid ${C.border}`, color: C.dim, fontWeight: 600, fontSize: 13, cursor: (!checkoutForm.name || !checkoutForm.email) ? "not-allowed" : "pointer" }}>
                    {checkoutLoading ? "Sending..." : "📧 Just send me a quote by email"}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 14 }}>🔒 Secure checkout · Setup fee only · Cancel anytime</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
