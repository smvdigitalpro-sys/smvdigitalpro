import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#06060b", bg2: "#0c0c14", card: "#111119", card2: "#16161f",
  accent: "#7c6cf0", accentSoft: "#b4a9ff", accentGlow: "rgba(124,108,240,0.25)",
  gold: "#e8c547", goldSoft: "rgba(232,197,71,0.12)",
  text: "#f0f0f8", sub: "#9494b0", dim: "#5a5a72", border: "#1c1c2c", borderLight: "#24243a",
  ok: "#34d399", okSoft: "rgba(52,211,153,0.12)",
  grad: "linear-gradient(135deg, #7c6cf0 0%, #b4a9ff 100%)",
  gradBtn: "linear-gradient(135deg, #7c6cf0 0%, #9b8cff 50%, #7c6cf0 100%)",
};

const services = [
  { icon: "🤖", title: "AI Assistants That Sell", sub: "Turn every inquiry into revenue", desc: "Intelligent assistants on WhatsApp & Telegram that qualify leads, book appointments, answer questions, and follow up — automatically. They remember every customer and close deals while you sleep.", tags: ["Lead Qualification", "Auto-Booking", "24/7 Support", "CRM Sync"], price: "$69", per: "/mo", result: "→ 3x more bookings" },
  { icon: "🧠", title: "AI Virtual Employee", sub: "20 hours back every week", desc: "A full-time digital assistant that handles your inbox, researches competitors, manages your calendar, monitors opportunities, and delivers a morning briefing with actionable insights every single day.", tags: ["Email Drafts", "Daily Briefings", "Opportunity Alerts", "Task Management"], price: "$89", per: "/mo", result: "→ 20h saved/week" },
  { icon: "⚡", title: "Business Automations", sub: "Your business runs itself", desc: "Custom AI workflows that handle email sequences, social media posting, competitor monitoring, invoice processing, and reporting — all running on complete autopilot while you focus on growth.", tags: ["Email Flows", "Social Auto-Post", "Price Tracking", "Auto-Reports"], price: "$150", per: " setup", result: "→ 80% less manual work" },
  { icon: "🌐", title: "Revenue-Ready Websites", sub: "Websites that actually convert", desc: "Professional websites with integrated AI chatbots, conversion-optimized design, SEO that ranks, and free hosting. Not just a pretty page — a 24/7 client acquisition machine.", tags: ["Conversion Optimized", "AI Chatbot Built-In", "SEO Ready", "Free Hosting"], price: "$150", per: " setup", result: "→ 40% more leads" },
];

const plans = [
  { name: "Starter", setup: "$99", orig: "$200", mo: "$69", desc: "Start automating with zero risk", feats: ["AI chatbot on 1 channel", "500 messages/month", "Basic lead capture", "Email support", "48h setup"], cta: "Start Now" },
  { name: "Business", setup: "$199", orig: "$400", mo: "$129", desc: "The most popular plan for a reason", feats: ["AI assistant with memory", "WhatsApp + Telegram", "Automated scheduling", "Lead qualification", "Personalized responses", "Priority support"], cta: "Start Free Trial", pop: true },
  { name: "Premium", setup: "$349", orig: "$700", mo: "$199", desc: "For businesses ready to scale fast", feats: ["All channels included", "Voice AI (ElevenLabs)", "CRM integrations", "Monthly performance report", "Dedicated account manager", "Custom workflows"], cta: "Book a Call" },
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

/* ─── CHATBOT ─── */
function Bot({ open, toggle }) {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState("init");
  const [lead, setLead] = useState({});
  const end = useRef(null);

  useEffect(() => { if (open && msgs.length === 0) startConvo(); }, [open]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const add = useCallback((r, t, opts = null, delay = 600) => {
    if (r === "bot") {
      setTyping(true);
      setTimeout(() => { setMsgs(p => [...p, { r, t, opts }]); setTyping(false); }, delay);
    } else {
      setMsgs(p => [...p, { r, t }]);
    }
  }, []);

  const startConvo = () => {
    add("bot", "Hey! I help businesses get more clients automatically using AI. 🚀\n\nI can show you how to automate your customer messages, bookings, and support — 24/7, without hiring anyone.\n\nWhat brings you here today?", [
      "I want more clients",
      "Show me a demo",
      "I need pricing info",
    ]);
    setStep("intro");
  };

  const handle = useCallback((opt) => {
    add("user", opt);

    const flows = {
      // INTRO
      "I want more clients": () => {
        setStep("biz-type");
        add("bot", "Great — that's exactly what we do. 💰\n\nTo recommend the best solution, I need to understand your business.\n\nWhat type of business do you run?", [
          "Restaurant / Café",
          "Salon / Spa",
          "Consulting / Freelance",
          "E-commerce / Shop",
          "Other",
        ], 700);
      },
      "Show me a demo": () => {
        setStep("demo");
        add("bot", "Perfect! Let me show you the power of AI in action. 🎬\n\nImagine this chatbot is the AI assistant for a beauty salon called Luna. Go ahead — ask it anything a real customer would.\n\nTry one of these:", [
          "I want to book a haircut",
          "What are your prices?",
          "When are you open?",
        ], 700);
      },
      "I need pricing info": () => {
        setStep("pricing");
        add("bot", "Smart to check pricing early. Here's our structure:\n\n🟢 Starter — $69/mo\nAI chatbot, 1 channel, basic automation\n\n🔵 Business — $129/mo ⭐\nFull AI assistant with memory, 2 channels, auto-scheduling\n\n🟣 Premium — $199/mo\nAll channels, voice AI, CRM, dedicated manager\n\n🏆 Full Agency — $229-299/mo\nWebsite + chatbot + automations + everything\n\n🎁 First 5 clients get 50% off setup fees.\n\nWant me to recommend the best plan for your business?", [
          "Recommend a plan for me",
          "Show me a demo first",
          "I'm ready — let's start",
        ], 700);
      },

      // BUSINESS TYPE
      "Restaurant / Café": () => handleBizType("restaurant"),
      "Salon / Spa": () => handleBizType("salon"),
      "Consulting / Freelance": () => handleBizType("consulting"),
      "E-commerce / Shop": () => handleBizType("ecommerce"),
      "Other": () => handleBizType("other"),

      // DEMO
      "I want to book a haircut": () => {
        add("bot", "Of course! ✂️ Welcome to Luna Beauty.\n\nHere's our availability this week:\n\n📅 Tuesday — 2:00 PM, 4:30 PM\n📅 Wednesday — 10:00 AM, 1:00 PM\n📅 Friday — 11:00 AM, 3:00 PM, 5:00 PM\n\nWhich day and time works best for you?", [
          "Tuesday 4:30 PM",
          "Friday 3:00 PM",
        ], 700);
      },
      "Tuesday 4:30 PM": () => demoBook("Tuesday", "4:30 PM", "Haircut", "$35"),
      "Friday 3:00 PM": () => demoBook("Friday", "3:00 PM", "Haircut", "$35"),
      "What are your prices?": () => {
        add("bot", "Here's our menu at Luna Beauty: 💅\n\n✂️ Haircut — $35\n🎨 Color & Highlights — $75–120\n💅 Manicure — $25\n🧖‍♀️ Facial Treatment — $55\n💆 Full Spa Package — $150\n\n🎁 VIP Loyalty: every 5th visit → 20% off\n\nI automatically track each client's visit history and send reminders when they're due. Want to book something?", [
          "I want to book a haircut",
          "This is impressive!",
        ], 700);
      },
      "When are you open?": () => {
        add("bot", "Luna Beauty hours: 🕐\n\nMon–Fri: 9:00 AM – 7:00 PM\nSaturday: 10:00 AM – 5:00 PM\nSunday: Closed\n\nRight now I see 4 available slots this week. In a real setup, this syncs with the business's actual calendar in real-time.\n\nWant to book a slot?", [
          "I want to book a haircut",
          "This is impressive!",
        ], 700);
      },
      "This is impressive!": () => {
        setStep("post-demo");
        add("bot", "Thanks! And this is just a simple demo. 🎯\n\nFor a real business, the AI:\n\n✅ Remembers every customer by name\n✅ Knows their preferences and history\n✅ Sends automatic reminders\n✅ Follows up after appointments\n✅ Upsells relevant services\n✅ Works 24/7 on WhatsApp & Telegram\n\nWant to see what this could look like for YOUR business?", [
          "Yes — let's talk about my business",
          "What does it cost?",
        ], 700);
      },

      // POST-DEMO
      "Yes — let's talk about my business": () => {
        setStep("biz-type");
        add("bot", "Let's figure out the perfect setup for you.\n\nWhat type of business do you run?", [
          "Restaurant / Café",
          "Salon / Spa",
          "Consulting / Freelance",
          "E-commerce / Shop",
          "Other",
        ], 600);
      },
      "What does it cost?": () => handle("I need pricing info"),
      "Recommend a plan for me": () => {
        setStep("biz-type");
        add("bot", "To recommend the right plan, let me understand your business.\n\nWhat type of business do you run?", [
          "Restaurant / Café",
          "Salon / Spa",
          "Consulting / Freelance",
          "E-commerce / Shop",
          "Other",
        ], 600);
      },

      // AUTOMATION GOALS
      "Customer messages & support": () => handleGoal("support"),
      "Booking & appointments": () => handleGoal("booking"),
      "Lead capture & follow-up": () => handleGoal("leads"),
      "Email & social media": () => handleGoal("content"),
      "All of the above": () => handleGoal("all"),

      // VOLUME
      "1-10": () => handleVolume("1-10"),
      "10-30": () => handleVolume("10-30"),
      "30-100": () => handleVolume("30-100"),
      "100+": () => handleVolume("100+"),

      // LEAD CAPTURE
      "I'm ready — let's start": () => askName(),
      "Yes, let's do it": () => askName(),
      "Send me details": () => askName(),
      "Get my free consultation": () => askName(),

      // CONTACT
      "Talk to team": () => {
        add("bot", "Here's how to reach us directly:\n\n📧 hello@smvdigitalpro.com\n💬 Telegram: @smvdigitalpro\n🔗 Upwork: SMV DigitalPro\n\nWe respond within 2 hours during business hours.\n\nOr I can collect your info and we'll reach out to you — what's easier?", [
          "Collect my info",
          "I'll email you",
        ], 600);
      },
      "Collect my info": () => askName(),
      "I'll email you": () => {
        add("bot", "Perfect! Send us a quick email at:\n\n📧 hello@smvdigitalpro.com\n\nJust mention what type of business you have and what you want to automate. We'll reply with a custom plan within 24 hours.\n\nIs there anything else I can help with?", [
          "Show me a demo",
          "I need pricing info",
        ], 600);
      },

      // SHOW ME DEMO FROM OTHER PLACES
      "Show me a demo first": () => handle("Show me a demo"),
    };

    const fn = flows[opt];
    if (fn) fn();
    else {
      add("bot", "I'd love to help with that! The fastest way is to chat with our team directly or let me collect your details for a free consultation.\n\nWhat would you prefer?", [
        "Collect my info",
        "Talk to team",
      ], 600);
    }
  }, [add, lead]);

  const handleBizType = (type) => {
    const names = { restaurant: "restaurant", salon: "salon", consulting: "consulting business", ecommerce: "e-commerce store", other: "business" };
    setLead(p => ({ ...p, bizType: type }));
    setStep("volume");
    add("bot", `A ${names[type]} — great. We've delivered real results for ${names[type]} owners just like you. 💪\n\nQuick question: roughly how many client inquiries do you get per week?\n\nThis helps me estimate your potential ROI.`, [
      "1-10",
      "10-30",
      "30-100",
      "100+",
    ], 700);
  };

  const handleVolume = (vol) => {
    setLead(p => ({ ...p, volume: vol }));
    const lostMap = {
      "1-10": "You're not just missing messages — you're losing real paying clients every week. Even at low volume, every missed inquiry is money walking away. Most small businesses lose $500-2,000/month from slow replies alone. An AI assistant captures every single one.",
      "10-30": "You're not just missing messages — you're losing real paying clients every week. At that volume, 5-10 potential customers slip away every month from slow or missed replies. Businesses like yours typically see a 35% jump in bookings after adding AI.",
      "30-100": "You're not just missing messages — you're losing real paying clients every week. At that volume, competitors who respond faster are winning your customers right now. Our AI responds in under 10 seconds, every message, every channel, around the clock.",
      "100+": "You're not just missing messages — you're losing real paying clients every week. At 100+ per week, manual handling is costing you thousands in lost revenue every month. This is where AI delivers the fastest ROI — most clients see payback within 2 weeks.",
    };
    setStep("goal");
    add("bot", lostMap[vol] + "\n\nMost businesses don't realize how many clients they lose until they automate.\n\nWhat is the #1 thing you want to automate?", [
      "Customer messages & support",
      "Booking & appointments",
      "Lead capture & follow-up",
      "Email & social media",
      "All of the above",
    ], 800);
  };

  const handleGoal = (goal) => {
    setLead(p => ({ ...p, goal }));
    const recs = {
      support: { plan: "Business", price: "$129/mo", why: "With our Business plan, your AI handles all customer messages on WhatsApp + Telegram, remembers every conversation, and escalates to you only when needed." },
      booking: { plan: "Business", price: "$129/mo", why: "Our Business plan includes automated scheduling that syncs with your calendar. Customers book, reschedule, and get reminders — all automatically." },
      leads: { plan: "Premium", price: "$199/mo", why: "Our Premium plan captures leads across all channels, qualifies them with smart questions, follows up automatically, and pushes hot leads straight to your CRM." },
      content: { plan: "Starter + Automation", price: "$69/mo + setup", why: "Our Starter chatbot handles basic queries while a custom automation handles your email sequences and social media posting on autopilot." },
      all: { plan: "Full Agency Package", price: "$229–299/mo", why: "Our Full Agency Package gives you everything: website, AI chatbot with memory, automations, SEO, and monthly reports. One subscription for complete digital coverage." },
    };
    const r = recs[goal];
    setStep("recommend");
    add("bot", `Based on what you've told me, here's my recommendation:\n\n🎯 **${r.plan}** — ${r.price}\n\n${r.why}\n\n🎁 Early Bird Special: 50% off setup fee (only ${goal === "all" ? "2" : "3"} spots remaining)\n\nWe only onboard a limited number of clients each week to ensure quality — spots fill quickly.\n\nReady to get started? I just need a few details to set up your free consultation.`, [
      "Yes, let's do it",
      "I need more info",
      "Talk to team",
    ], 800);
  };

  const demoBook = (day, time, service, price) => {
    add("bot", `Confirmed! ✅\n\n📅 ${day} at ${time}\n💇 ${service}\n💰 ${price}\n⏱️ ~45 minutes\n\nI'll send you a WhatsApp reminder the evening before. And since I remember you're a returning client, I'll apply your loyalty points automatically.\n\nNotice how seamless that was? No phone tag, no waiting on hold, no missed bookings. This is what your business could have.\n\nWant to see what this would look like for YOUR business?`, [
      "Yes — let's talk about my business",
      "This is impressive!",
    ], 800);
  };

  const askName = () => {
    setStep("ask-name");
    add("bot", "Excellent! Let's get you set up. 🎯\n\nFirst — what's your name?", null, 500);
  };

  const send = useCallback(() => {
    if (!inp.trim()) return;
    const t = inp.trim(); setInp("");

    if (step === "ask-name") {
      add("user", t);
      setLead(p => ({ ...p, name: t }));
      setStep("ask-email");
      add("bot", `Nice to meet you, ${t}! 👋\n\nWhat's the best email to reach you?`, null, 500);
    } else if (step === "ask-email") {
      add("user", t);
      setLead(p => ({ ...p, email: t }));
      setStep("ask-whatsapp");
      add("bot", `Got it! One last thing — what's your WhatsApp number?\n\nThis way we can send you a live demo on your own phone.`, null, 500);
    } else if (step === "ask-whatsapp") {
      add("user", t);
      const finalLead = { ...lead, whatsapp: t };
      setLead(finalLead);
      setStep("done");
      add("bot", `You're all set, ${finalLead.name}! 🎉\n\nHere's what happens next:\n\n1️⃣ Our team reviews your requirements\n2️⃣ We prepare a custom AI demo for your business type\n3️⃣ You get a free 15-min consultation within 24 hours\n\n📧 ${finalLead.email}\n📱 ${finalLead.whatsapp}\n\nWe'll reach out on WhatsApp first. If there's anything else you want to know, I'm right here!\n\n— The SMV DigitalPro Team`, [
        "Show me a demo while I wait",
        "I have more questions",
      ], 700);
    } else {
      add("user", t);
      const l = t.toLowerCase();
      if (l.includes("price") || l.includes("cost") || l.includes("how much")) handle("I need pricing info");
      else if (l.includes("demo") || l.includes("show") || l.includes("try")) handle("Show me a demo");
      else if (l.includes("book") || l.includes("appointment")) handle("I want to book a haircut");
      else if (l.includes("service") || l.includes("what do you")) handle("I want more clients");
      else if (l.includes("contact") || l.includes("human") || l.includes("talk")) handle("Talk to team");
      else {
        add("bot", "Thanks for your message! I can help you explore how AI automation works for your specific business.\n\nWhat would you like to do?", [
          "I want more clients",
          "Show me a demo",
          "I need pricing info",
        ], 600);
      }
    }
  }, [inp, step, lead, add, handle]);

  const isInputStep = ["ask-name", "ask-email", "ask-whatsapp"].includes(step);
  const placeholder = step === "ask-name" ? "Your name..." : step === "ask-email" ? "your@email.com" : step === "ask-whatsapp" ? "+1 234 567 8900" : "Type a message...";

  if (!open) return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      <div style={{ background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "12px 18px", maxWidth: 240, boxShadow: `0 8px 30px rgba(0,0,0,.4)`, animation: "su .4s ease-out .5s both" }}>
        <p style={{ color: C.text, fontSize: 13, lineHeight: 1.5, margin: 0 }}>Want to automate your business with AI? 🚀</p>
      </div>
      <button onClick={toggle} style={{ width: 68, height: 68, borderRadius: 20, background: C.gradBtn, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: `0 8px 40px ${C.accentGlow}, 0 0 0 4px rgba(124,108,240,0.08)`, animation: "pg 2.5s ease-in-out infinite", transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>💬</button>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, width: 400, maxWidth: "calc(100vw - 32px)", height: 580, maxHeight: "calc(100vh - 56px)", background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 24, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 9999, boxShadow: `0 24px 80px rgba(0,0,0,.6), 0 0 60px ${C.accentGlow}`, animation: "su .3s ease-out" }}>
      <div style={{ background: C.grad, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: .3 }}>SMV AI Advisor</div>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: 11.5, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, background: "#34d399", borderRadius: "50%", display: "inline-block" }} /> Online — replies instantly</div>
          </div>
        </div>
        <button onClick={toggle} style={{ background: "rgba(255,255,255,.12)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "88%", padding: "12px 16px", borderRadius: m.r === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.r === "user" ? C.accent : C.card2, color: "#fff", fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-wrap", boxShadow: m.r === "user" ? `0 4px 16px ${C.accentGlow}` : "0 2px 8px rgba(0,0,0,.2)" }}>{m.t}</div>
            </div>
            {m.opts && <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, paddingLeft: 4 }}>
              {m.opts.map((o, j) => <button key={j} onClick={() => handle(o)} style={{ padding: "12px 18px", borderRadius: 14, border: `1.5px solid ${C.accent}`, background: "rgba(124,108,240,0.06)", color: C.accentSoft, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .25s", textAlign: "left", letterSpacing: .2 }}
                onMouseEnter={e => { e.target.style.background = C.accent; e.target.style.color = "#fff"; e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 4px 20px ${C.accentGlow}`; }}
                onMouseLeave={e => { e.target.style.background = "rgba(124,108,240,0.06)"; e.target.style.color = C.accentSoft; e.target.style.borderColor = C.accent; e.target.style.boxShadow = "none"; }}>{o}</button>)}
            </div>}
          </div>
        ))}
        {typing && <div style={{ display: "flex", gap: 5, padding: "10px 16px", background: C.card2, borderRadius: 18, width: "fit-content" }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.sub, animation: `td 1.4s ease-in-out ${i * .2}s infinite` }} />)}</div>}
        <div ref={end} />
      </div>
      <div style={{ padding: "14px 18px 18px", borderTop: `1px solid ${C.border}`, background: C.card }}>
        {isInputStep && <p style={{ fontSize: 11, color: C.dim, marginBottom: 8, paddingLeft: 4 }}>{step === "ask-name" ? "📝 Your name" : step === "ask-email" ? "📧 Your email address" : "📱 Your WhatsApp number"}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <input type={step === "ask-email" ? "email" : "text"} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={placeholder} style={{ flex: 1, padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${isInputStep ? C.accent : C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none", transition: "border-color .2s", boxShadow: isInputStep ? `0 0 0 3px ${C.accentGlow}` : "none" }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => { if (!isInputStep) e.target.style.borderColor = C.border; }} />
          <button onClick={send} style={{ padding: "14px 20px", borderRadius: 14, background: C.gradBtn, border: "none", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, transition: "transform .15s", boxShadow: `0 4px 16px ${C.accentGlow}` }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>→</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App() {
  const [chat, setChat] = useState(false);
  const [sc, setSc] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 60); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMob(false); };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${C.bg}}
        ::selection{background:${C.accent};color:#fff}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.accent};border-radius:4px}
        @keyframes pg{0%,100%{box-shadow:0 8px 40px ${C.accentGlow},0 0 0 4px rgba(124,108,240,.08)}50%{box-shadow:0 8px 60px rgba(124,108,240,.4),0 0 0 8px rgba(124,108,240,.1)}}
        @keyframes su{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes td{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes gs{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @media(max-width:820px){.dk{display:none!important}.mb{display:flex!important}.hg{flex-direction:column!important;gap:40px!important}.sg{grid-template-columns:1fr!important}.pg{grid-template-columns:1fr!important}.bg{grid-template-columns:1fr!important}.stg{grid-template-columns:repeat(2,1fr)!important}.ht{font-size:38px!important}.sp{padding:70px 20px!important}.hv{display:none!important}}
        @media(min-width:821px)and(max-width:1080px){.sg{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "0 32px", height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", background: sc ? "rgba(6,6,11,.94)" : "transparent", backdropFilter: sc ? "blur(24px) saturate(1.2)" : "none", borderBottom: sc ? `1px solid ${C.border}` : "none", transition: "all .35s" }}>
        <div onClick={() => go("hero")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 17, fontFamily: "'Outfit',sans-serif" }}>S</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 19, color: C.text, letterSpacing: -.3 }}>SMV <span style={{ color: C.accentSoft }}>DigitalPro</span></span>
        </div>
        <div className="dk" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {["services", "pricing", "blog", "contact"].map(l => <a key={l} onClick={() => go(l)} style={{ color: C.sub, textDecoration: "none", fontSize: 14.5, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", transition: "color .2s", letterSpacing: .2 }} onMouseEnter={e => e.target.style.color = C.accentSoft} onMouseLeave={e => e.target.style.color = C.sub}>{l}</a>)}
          <button onClick={() => setChat(true)} style={{ padding: "11px 26px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", letterSpacing: .3, boxShadow: `0 4px 20px ${C.accentGlow}`, transition: "transform .2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-1px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>Get Free Demo →</button>
        </div>
        <button className="mb" onClick={() => setMob(!mob)} style={{ display: "none", background: "none", border: "none", color: C.text, fontSize: 24, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>{mob ? "✕" : "☰"}</button>
        {mob && <div style={{ position: "absolute", top: 74, left: 0, right: 0, background: "rgba(6,6,11,.98)", backdropFilter: "blur(24px)", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 22, borderBottom: `1px solid ${C.border}` }}>
          {["services", "pricing", "blog", "contact"].map(l => <a key={l} onClick={() => go(l)} style={{ color: C.text, textDecoration: "none", fontSize: 18, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{l}</a>)}
          <button onClick={() => { setChat(true); setMob(false); }} style={{ padding: "14px", borderRadius: 12, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Get Free Demo →</button>
        </div>}
      </nav>

      {/* HERO */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 32px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-15%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,${C.accentGlow} 0%,transparent 65%)`, filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-25%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,.06) 0%,transparent 65%)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div className="hg" style={{ maxWidth: 1200, width: "100%", display: "flex", alignItems: "center", gap: 64, position: "relative" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 50, background: C.okSoft, border: `1px solid rgba(52,211,153,.25)`, fontSize: 13, color: C.ok, marginBottom: 32, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, background: C.ok, borderRadius: "50%", display: "inline-block", animation: "pg 2s ease-in-out infinite" }} /> Only 3 discounted spots left this week — next batch starts at full price
            </div>
            <h1 className="ht" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.06, marginBottom: 28, fontFamily: "'Outfit',sans-serif", letterSpacing: -1.5 }}>
              Get More Clients<br />With an{" "}
              <span style={{ background: "linear-gradient(135deg,#7c6cf0,#b4a9ff,#7c6cf0)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gs 4s ease-in-out infinite" }}>AI Employee</span>
              <br />That Never Sleeps
            </h1>
            <p style={{ fontSize: 19, color: C.sub, lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>Stop losing clients because you can't reply instantly. Your AI responds in seconds — every time.</p>
            <p style={{ fontSize: 16, color: C.dim, lineHeight: 1.65, marginBottom: 44, maxWidth: 520 }}>We build AI assistants that handle messages, book appointments, qualify leads, and follow up with customers — 24/7 on WhatsApp & Telegram. Fewer missed leads. More revenue. Zero extra hires.</p>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 60 }}>
              <button onClick={() => setChat(true)} style={{ padding: "21px 46px", borderRadius: 16, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 800, fontSize: 17, cursor: "pointer", boxShadow: `0 8px 40px ${C.accentGlow}`, transition: "transform .2s, box-shadow .2s", letterSpacing: .3 }} onMouseEnter={e => { e.target.style.transform = "translateY(-3px) scale(1.03)"; e.target.style.boxShadow = `0 12px 50px rgba(124,108,240,.4)`; }} onMouseLeave={e => { e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = `0 8px 40px ${C.accentGlow}`; }}>Get Your AI Demo →</button>
              <button onClick={() => go("pricing")} style={{ padding: "21px 46px", borderRadius: 16, background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.text, fontWeight: 700, fontSize: 17, cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.transform = "scale(1.03)"; }} onMouseLeave={e => { e.target.style.borderColor = C.borderLight; e.target.style.transform = "scale(1)"; }}>View Pricing</button>
            </div>
            <div className="stg" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              {[["24/7", "Always On"], ["92%", "Automated"], ["<2min", "To Deploy"], ["85%+", "Profit Margin"]].map(([v, l], i) => <div key={i}><div style={{ fontSize: 30, fontWeight: 900, fontFamily: "'Outfit',sans-serif", color: C.accentSoft, letterSpacing: -.5 }}>{v}</div><div style={{ fontSize: 12, color: C.dim, marginTop: 4, fontWeight: 500 }}>{l}</div></div>)}
            </div>
            <p style={{ marginTop: 20, fontSize: 12, color: C.dim, fontWeight: 500 }}>Follow us for AI tips & automation strategies →{" "}
              <a href="https://instagram.com/smvdigitalpro" target="_blank" rel="noopener noreferrer" style={{ color: C.accentSoft, textDecoration: "none", fontWeight: 600 }}>Instagram</a>{" · "}
              <a href="https://tiktok.com/@smvdigitalpro" target="_blank" rel="noopener noreferrer" style={{ color: C.accentSoft, textDecoration: "none", fontWeight: 600 }}>TikTok</a>
            </p>
          </div>
          <div className="hv" style={{ flex: .7, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 320, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 22, padding: 24, animation: "fl 6s ease-in-out infinite", position: "relative", boxShadow: `0 20px 60px rgba(0,0,0,.4), 0 0 40px ${C.accentGlow}` }}>
              <div style={{ position: "absolute", top: -1, left: 30, right: 30, height: 2, background: C.grad }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🤖</div>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>Luna Beauty AI</div><div style={{ fontSize: 11, color: C.ok }}>● Active now</div></div>
              </div>
              {[["u", "Hi! Can I book for Saturday?"], ["b", "Welcome back Sarah! 💇‍♀️ Ana has Saturday at 10 AM and 2 PM. Which works better?"], ["u", "2 PM please!"], ["b", "Done! ✅ Booked with Ana, Sat 2 PM. Reminder coming Friday. See you!"]].map(([r, t], i) => (
                <div key={i} style={{ display: "flex", justifyContent: r === "u" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: r === "u" ? "16px 16px 3px 16px" : "16px 16px 16px 3px", background: r === "u" ? C.accent : C.card2, color: "#fff", fontSize: 12.5, lineHeight: 1.5 }}>{t}</div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 12, padding: "8px 12px", borderRadius: 10, background: C.okSoft, border: `1px solid rgba(52,211,153,.2)`, fontSize: 11, color: C.ok, fontWeight: 600 }}>✨ Remembers 1,200+ customers automatically</div>
              <div style={{ position: "absolute", top: 14, right: -20, padding: "7px 16px", borderRadius: 12, background: C.gradBtn, boxShadow: `0 6px 24px ${C.accentGlow}`, fontSize: 12, color: "#fff", fontWeight: 800, letterSpacing: .3, whiteSpace: "nowrap" }}>+32 bookings this week</div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH BAR */}
      <section style={{ padding: "44px 32px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 4, marginBottom: 22, fontWeight: 600 }}>Built on enterprise-grade AI</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", alignItems: "center", opacity: .35 }}>
            {["Claude AI", "Telegram", "WhatsApp", "ElevenLabs", "Vercel", "n8n"].map(n => <span key={n} style={{ fontSize: 16, fontWeight: 700, color: C.sub, fontFamily: "'Outfit',sans-serif", letterSpacing: .5 }}>{n}</span>)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>What We Build</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>AI Solutions That <span style={{ color: C.accentSoft }}>Drive Revenue</span></h2>
            <p style={{ color: C.sub, maxWidth: 540, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>More clients, faster replies, fewer missed leads, less manual work — every service is built to deliver measurable results.</p>
          </div>
          <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {services.map((s, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, transition: "all .35s", cursor: "pointer", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${C.accentGlow}`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ fontSize: 40 }}>{s.icon}</div>
                  <span style={{ padding: "5px 14px", borderRadius: 8, background: C.okSoft, color: C.ok, fontSize: 12, fontWeight: 700 }}>{s.result}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, fontFamily: "'Outfit',sans-serif", letterSpacing: -.3 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.accent, marginBottom: 14, fontWeight: 600 }}>{s.sub}</p>
                <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.6, marginBottom: 18 }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
                  {s.tags.map((f, j) => <span key={j} style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(124,108,240,.08)", color: C.accentSoft, fontSize: 11.5, fontWeight: 600 }}>{f}</span>)}
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><span style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>{s.price}</span><span style={{ fontSize: 14, color: C.sub }}>{s.per}</span></div>
                  <span style={{ color: C.accentSoft, fontSize: 13, fontWeight: 600 }}>Learn more →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "110px 32px", background: `linear-gradient(180deg,${C.bg} 0%,${C.bg2} 50%,${C.bg} 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Simple Process</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -.8 }}>Live in <span style={{ color: C.accentSoft }}>48 Hours</span></h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[["01", "Tell Us Your Goals", "What do you sell, who are your customers, and what should the AI handle? One 15-minute call is all we need to design your system.", "🎯"], ["02", "We Build Everything", "We configure your AI assistant, train it on your business data, and deploy it on your channels. You approve, we launch. No technical work on your end.", "🔧"], ["03", "Watch Revenue Grow", "Your AI starts handling customers immediately. We monitor performance, optimize weekly, and you see results from day one.", "📈"]].map(([s, t, d, ic], i) => (
              <div key={i} style={{ flex: "1 1 300px", maxWidth: 340, textAlign: "center", padding: 32, background: C.card, borderRadius: 20, border: `1px solid ${C.border}` }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(124,108,240,.08)", border: `1.5px solid rgba(124,108,240,.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>{ic}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.accent, letterSpacing: 3, marginBottom: 10 }}>STEP {s}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, fontFamily: "'Outfit',sans-serif" }}>{t}</h3>
                <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Investment</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>Transparent <span style={{ color: C.accentSoft }}>Pricing</span></h2>
            <p style={{ color: C.sub, maxWidth: 480, margin: "0 auto", fontSize: 17 }}>Every plan pays for itself within the first month. Guaranteed.</p>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
            {plans.map(p => (
              <div key={p.name} style={{ background: p.pop ? `linear-gradient(180deg,rgba(124,108,240,.08) 0%,${C.card} 40%)` : C.card, border: `1.5px solid ${p.pop ? C.accent : C.border}`, borderRadius: 22, padding: "36px 30px", position: "relative", transition: "all .35s" }}
                onMouseEnter={e => { if (!p.pop) e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { if (!p.pop) e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                {p.pop && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", padding: "5px 18px", borderRadius: 20, background: C.gradBtn, color: "#fff", fontSize: 11.5, fontWeight: 800, letterSpacing: .5, boxShadow: `0 4px 16px ${C.accentGlow}` }}>Most Popular</div>}
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: C.dim, marginBottom: 22 }}>{p.desc}</p>
                <div style={{ marginBottom: 8 }}><span style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -1 }}>{p.mo}</span><span style={{ color: C.sub, fontSize: 15, fontWeight: 500 }}>/month</span></div>
                <div style={{ fontSize: 13, color: C.sub, marginBottom: 28 }}>One-time setup: <span style={{ color: C.ok, fontWeight: 700 }}>{p.setup}</span> <span style={{ textDecoration: "line-through", color: C.dim }}>{p.orig}</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {p.feats.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.text }}><span style={{ color: C.ok, fontSize: 15 }}>✓</span>{f}</div>)}
                </div>
                <button onClick={() => setChat(true)} style={{ width: "100%", padding: "18px", borderRadius: 14, background: p.pop ? C.gradBtn : "transparent", border: p.pop ? "none" : `1.5px solid ${C.borderLight}`, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: p.pop ? `0 6px 24px ${C.accentGlow}` : "none", transition: "all .25s", letterSpacing: .2 }} onMouseEnter={e => { if (!p.pop) { e.target.style.borderColor = C.accent; e.target.style.background = "rgba(124,108,240,.06)"; } e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { if (!p.pop) { e.target.style.borderColor = C.borderLight; e.target.style.background = "transparent"; } e.target.style.transform = "translateY(0)"; }}>{p.cta}</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, maxWidth: 1000, margin: "32px auto 0", background: C.goldSoft, border: `1.5px solid rgba(232,197,71,.25)`, borderRadius: 18, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ fontSize: 22 }}>🏆</span><span style={{ fontWeight: 800, fontFamily: "'Outfit',sans-serif", fontSize: 20 }}>Full Agency Package</span></div><p style={{ fontSize: 14, color: C.sub }}>Website + AI Chatbot + Automations + SEO + Monthly Reports — complete digital coverage.</p></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Outfit',sans-serif", color: C.gold, letterSpacing: -.5 }}>$229–299<span style={{ fontSize: 14, color: C.sub, fontWeight: 500 }}>/mo</span></div><div style={{ fontSize: 12, color: C.sub }}>Setup: <span style={{ color: C.ok, fontWeight: 700 }}>$599</span> <span style={{ textDecoration: "line-through", color: C.dim }}>$1,200</span></div></div>
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 32px", borderRadius: 16, background: "rgba(52,211,153,0.08)", border: `1.5px solid rgba(52,211,153,.2)` }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
              <span style={{ fontSize: 15, color: C.sub, fontWeight: 600, letterSpacing: .2 }}>30-day money-back guarantee. If it doesn't improve your workflow, you don't pay.</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "110px 32px", background: C.bg2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Results</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: -.8 }}>Real Businesses, <span style={{ color: C.accentSoft }}>Real Results</span></h2>
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {reviews.map((t, i) => (
              <div key={i} style={{ flex: "1 1 300px", maxWidth: 360, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32 }}>
                <div style={{ marginBottom: 16, fontSize: 16 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 15, color: C.text, lineHeight: 1.65, marginBottom: 24 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>{t.who[0]}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t.who}</div><div style={{ fontSize: 12, color: C.dim }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: C.accent, textTransform: "uppercase", letterSpacing: 4, marginBottom: 14, fontWeight: 700 }}>Insights</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>AI News & <span style={{ color: C.accentSoft }}>Strategy</span></h2>
          </div>
          <div className="bg" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {posts.map((p, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, cursor: "pointer", transition: "all .35s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ padding: "5px 14px", borderRadius: 8, background: "rgba(124,108,240,.08)", color: C.accentSoft, fontSize: 11.5, fontWeight: 700 }}>{p.cat}</span>
                  <span style={{ fontSize: 28 }}>{p.ico}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, fontFamily: "'Outfit',sans-serif", lineHeight: 1.3, letterSpacing: -.3 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, marginBottom: 16 }}>{p.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.dim }}><span>{p.date}</span><span>•</span><span>{p.read}</span></div>
                  <span style={{ color: C.accentSoft, fontSize: 12, fontWeight: 600 }}>Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="sp" style={{ padding: "110px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 28, padding: "70px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center,${C.accentGlow} 0%,transparent 65%)`, opacity: .2, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Outfit',sans-serif", marginBottom: 18, letterSpacing: -.8 }}>Stop Losing Clients.<br /><span style={{ color: C.accentSoft }}>Start Automating Today.</span></h2>
              <p style={{ color: C.sub, marginBottom: 40, fontSize: 18, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 40px" }}>Every day without AI is another day of missed messages, lost leads, and revenue left on the table. Book a free consultation and go live in 48 hours.</p>
              <button onClick={() => setChat(true)} style={{ padding: "22px 48px", borderRadius: 16, background: C.gradBtn, border: "none", color: "#fff", fontWeight: 900, fontSize: 18, cursor: "pointer", boxShadow: `0 8px 40px ${C.accentGlow}`, transition: "transform .2s, box-shadow .2s", letterSpacing: .3 }} onMouseEnter={e => { e.target.style.transform = "translateY(-3px) scale(1.04)"; e.target.style.boxShadow = `0 12px 50px rgba(124,108,240,.45)`; }} onMouseLeave={e => { e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = `0 8px 40px ${C.accentGlow}`; }}>Start Getting Clients →</button>
              <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 48 }}>
                {[
                  ["📧", "Email", "hello@smvdigitalpro.com", "mailto:hello@smvdigitalpro.com"],
                  ["💬", "Telegram", "@smvdigitalpro", "https://t.me/smvdigitalpro"],
                  ["🔗", "Upwork", "SMV DigitalPro", "https://www.upwork.com/freelancers/smvdigitalpro"],
                  ["🎯", "Fiverr", "smvdigitalpro", "https://www.fiverr.com/smvdigitalpro"],
                ].map(([ic, l, v, href], i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none", transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}><div style={{ fontSize: 20, marginBottom: 4 }}>{ic}</div><div style={{ fontSize: 11, color: C.dim, fontWeight: 600 }}>{l}</div><div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{v}</div></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 32px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 12 }}>S</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14, color: C.text }}>SMV DigitalPro</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 18 }}>
          {[
            ["https://instagram.com/smvdigitalpro", "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"],
            ["https://tiktok.com/@smvdigitalpro", "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"],
            ["https://linkedin.com/company/smvdigitalpro", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"],
          ].map(([href, path], i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${C.border}`, transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = "rgba(124,108,240,.1)"; e.currentTarget.style.boxShadow = `0 0 16px ${C.accentGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.boxShadow = "none"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={C.sub}><path d={path}/></svg>
            </a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: C.dim }}>© 2026 SMV DigitalPro · AI-Powered Digital Agency</p>
        <p style={{ fontSize: 11, color: C.dim, marginTop: 4, opacity: .7 }}>Built with AI • Powered by SMV DigitalPro</p>
      </footer>

      <Bot open={chat} toggle={() => setChat(!chat)} />
    </div>
  );
}
