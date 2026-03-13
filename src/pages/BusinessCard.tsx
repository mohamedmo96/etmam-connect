import { useEffect, useMemo, useRef, useState } from "react";
import profilePhoto from "@/assets/profile-photo.png";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  RotateCw, Globe, Linkedin, MessageCircle, Mail, Phone, MapPin,
  UserPlus, Share2, Settings, Heart, Award, Briefcase, GraduationCap,
  Languages, Loader2, Zap, Download,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardData } from "@/hooks/useCardData";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const BusinessCard = ({ overrideData }: { overrideData?: any } = {}) => {
const [flipped, setFlipped] = useState(false);
const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
const [showInstallHelp, setShowInstallHelp] = useState(false);

const isIOS = useMemo(
  () => /iphone|ipad|ipod/i.test(window.navigator.userAgent),
  []
);

const isAndroid = useMemo(
  () => /android/i.test(window.navigator.userAgent),
  []
);

const isMobile = useMemo(() => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
}, []);

useEffect(() => {
  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    setDeferredPrompt(e as BeforeInstallPromptEvent);
  };

  const handleAppInstalled = () => {
    setDeferredPrompt(null);
    setShowInstallHelp(false);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
}, []);
  const { lang, setLang, t } = useLanguage();
const { data: fetchedData, isLoading } = useCardData(!overrideData);
  const cardData = overrideData || fetchedData;
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-300, 300], [1.5, -1.5]), { stiffness: 120, damping: 50 });
  const rotateY2 = useSpring(useTransform(x, [-300, 300], [-1.5, 1.5]), { stiffness: 120, damping: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || flipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const d = cardData || {} as any;
const name = lang === "ar" ? (d.name_ar || "") : (d.name_en || "");
const title = lang === "ar" ? (d.title_ar || "") : (d.title_en || "");
const company = lang === "ar" ? (d.company_ar || "") : (d.company_en || "");
  const about = lang === "ar" ? (d.about_ar || "محلل أعمال شغوف بالتقنية وتحسين العمليات") : (d.about_en || "Passionate Business Analyst with expertise in bridging the gap between business needs and technology solutions.");
  const locationText = lang === "ar" ? (d.location_ar || "السليمانية، الرياض") : (d.location_en || "Sulaymaniyah, Riyadh 12242");
  const phoneNum = d.phone || "+966 560 303 813";
  const emailAddr = d.email || "mahmoud@etmam.com";
  const websiteUrl = d.website_url || "https://etmam.com";
  const linkedinUrl = d.linkedin_url || "https://linkedin.com";
  const publicProfileUrl = d.public_profile_url || "";
const qrValue = d.qr_code_value || publicProfileUrl || window.location.href;
  const skills = Array.isArray(d.skills) ? d.skills : ["Business Analysis", "Requirements Gathering", "Process Optimization", "Stakeholder Management", "Agile Methodology", "Data Analysis"];
  const experience = Array.isArray(d.experience) ? d.experience : [{ title_en: "Business Analyst", title_ar: "محلل أعمال", company_en: "Etmam for Information Technology", company_ar: "إتمام لتقنية المعلومات" }];
  const education = Array.isArray(d.education) ? d.education : [{ degree_en: "Bachelor's Degree", degree_ar: "بكالوريوس", field_en: "Business Information Systems", field_ar: "نظم معلومات إدارية" }];
const defaultAvatarUrl = "https://bahaswager.runasp.net/e69cbbf7-9815-4a2d-a5e9-f0c74a61ec37.png";
const avatarSrc = d.avatar_url || defaultAvatarUrl;
  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${d.name_en || "Mahmoud Abdelrahman"}\nTITLE:${d.title_en || "Business Analyst"}\nORG:${d.company_en || "Etmam"}\nTEL:${phoneNum}\nEMAIL:${emailAddr}\nURL:${websiteUrl}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${(d.name_en || "contact").replace(/\s/g, "_")}.vcf`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: name, text: `${name} - ${title}`, url: window.location.href });
    }
  };

  const handleInstallCard = async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    return;
  }

  setShowInstallHelp(true);
};

if (!overrideData && isLoading) {    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  // Decorative corner component
  const Corner = ({ className }: { className: string }) => (
    <div className={`absolute h-6 w-6 ${className}`}>
      <div className="absolute h-full w-[1px] bg-gradient-to-b from-primary/30 to-transparent" />
      <div className="absolute h-[1px] w-full bg-gradient-to-r from-primary/30 to-transparent" />
    </div>
  );

  return (
<div className="relative z-10 min-h-[100svh] overflow-x-hidden px-3 py-4 sm:flex sm:items-center sm:justify-center">
        {/* Top controls removed - integrated into card header */}

    {/* Card */}
<div
  ref={cardRef}
  className="mx-auto w-full max-w-[420px] max-sm:h-[calc(100svh-2rem)]"
  style={{ perspective: "1200px" }}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
      <motion.div
  className="relative max-sm:h-full"
          style={{ transformStyle: "preserve-3d", rotateX: flipped ? 0 : rotateX, rotateY: flipped ? 180 : rotateY2 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.68, -0.15, 0.27, 1.15] }}
        >
          {/* ===== FRONT ===== */}
  <motion.div
  className="glass-card w-full overflow-hidden max-sm:h-full max-sm:overflow-y-auto max-sm:overflow-x-hidden"
            style={{ backfaceVisibility: "hidden" }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top accent header with controls */}
            <div className="relative h-14 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              {/* Left: Settings */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Link to="/login" className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.08] transition-all hover:border-primary/40 hover:bg-primary/15">
                  <Settings size={16} className="text-foreground" />
                </Link>
              </div>
              {/* Right: Language + Flip */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex h-9 items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/[0.08] px-3 transition-all hover:border-primary/40 hover:bg-primary/15">
                  <Languages size={14} className="text-foreground" />
                  <span className="text-[11px] font-bold text-foreground">{lang === "en" ? "عربي" : "EN"}</span>
                </button>
                <button onClick={() => setFlipped(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 transition-all hover:bg-primary/25 hover:border-primary/50">
                  <RotateCw size={15} className="text-primary" />
                </button>
              </div>
            </div>

            {/* Background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/[0.04] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-primary/[0.03] blur-3xl" />

            <div className="flex flex-col items-center px-6 pb-5 pt-2">
              {/* Avatar */}
              <motion.div
                className="relative mb-4"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 18 }}
              >
                <div className="absolute -inset-[4px] rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                <div className="absolute -inset-[4px] rounded-full border border-primary/20" />
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-background">
<img
  src={avatarSrc}
  alt={name}
  className="h-full w-full object-cover"
  onError={(e) => {
    e.currentTarget.src = defaultAvatarUrl;
  }}
/>                </div>
              </motion.div>

              {/* Name & Title & Company */}
              <motion.h1
                className="mb-1.5 text-center text-[22px] font-extrabold leading-tight tracking-tight text-foreground"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {name}
              </motion.h1>

              <motion.div
                className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              >
                <Briefcase size={12} className="text-primary" />
                <span className="text-[12px] font-bold text-primary">{title}</span>
              </motion.div>

              <motion.p
                className="mb-5 text-center text-[11px] font-semibold text-foreground/70"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {company}
              </motion.p>

              {/* Quick Actions */}
              <motion.div
                className="mb-5 flex w-full items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  { icon: Globe, href: websiteUrl, label: lang === "ar" ? "الموقع" : "Web" },
                  { icon: Linkedin, href: linkedinUrl, label: lang === "ar" ? "لينكدإن" : "LinkedIn" },
                  { icon: MessageCircle, href: d.whatsapp_url || "#", label: lang === "ar" ? "واتساب" : "Chat" },
                  { icon: Mail, href: `mailto:${emailAddr}`, label: lang === "ar" ? "بريد" : "Email" },
                  { icon: Phone, href: `tel:${phoneNum}`, label: lang === "ar" ? "اتصال" : "Call" },
                ].map(({ icon: Icon, href, label }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.93 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-secondary/20 transition-all duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                      <Icon size={16} className="text-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground transition-colors group-hover:text-primary/80">{label}</span>
                  </motion.a>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="mb-4 flex w-full items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/40" />
                <div className="h-1 w-1 rounded-full bg-primary/25" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/40" />
              </div>

              {/* Contact Cards - compact */}
              <div className="mb-4 w-full space-y-2">
                <motion.a
                  href={`tel:${phoneNum}`}
                  className="flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/15 px-4 py-2.5 transition-all hover:border-primary/25 hover:bg-secondary/25"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 text-start">
                    <p className="text-[10px] font-extrabold tracking-[0.08em] text-primary">{t("call")}</p>
                    <p className="text-[13px] font-bold text-foreground" dir="ltr" style={{ textAlign: lang === "ar" ? "right" : "left" }}>{phoneNum}</p>
                  </div>
                </motion.a>

                <motion.a
                  href={`mailto:${emailAddr}`}
                  className="flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/15 px-4 py-2.5 transition-all hover:border-primary/25 hover:bg-secondary/25"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 text-start">
                    <p className="text-[10px] font-extrabold tracking-[0.08em] text-primary">{t("email")}</p>
                    <p className="text-[13px] font-bold text-foreground" dir="ltr" style={{ textAlign: lang === "ar" ? "right" : "left" }}>{emailAddr}</p>
                  </div>
                </motion.a>

                <motion.div
                  className="flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/15 px-4 py-2.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 text-start">
                    <p className="text-[10px] font-extrabold tracking-[0.08em] text-primary">{t("location")}</p>
                    <p className="text-[13px] font-bold text-foreground">{locationText}</p>
                  </div>
                </motion.div>
              </div>

              {/* QR Code - smaller */}
         <motion.div
  className="mb-4 flex flex-col items-center"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
    {t("scan_linkedin")}
  </p>
  <div className="rounded-xl border border-border/25 bg-secondary/10 p-2.5">
    <QRCodeSVG
      value={qrValue}
      size={70}
      bgColor="transparent"
      fgColor="hsl(210, 100%, 55%)"
    />
  </div>
</motion.div>
              {/* Actions */}
           <motion.div
  className="flex w-full items-center gap-2"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  <motion.button
    onClick={handleSaveContact}
    className="save-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold text-primary-foreground"
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
  >
    <UserPlus size={15} />
    {lang === "ar" ? "حفظ جهة الاتصال" : "Save Contact"}
  </motion.button>

  <motion.button
    onClick={handleInstallCard}
    className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-border/40 bg-secondary/20 transition-all hover:border-primary/30 hover:bg-primary/10"
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.95 }}
    title={lang === "ar" ? "إضافة للشاشة الرئيسية" : "Add to Home Screen"}
  >
    <Download size={15} className="text-foreground/70" />
  </motion.button>

  <motion.button
    onClick={handleShare}
    className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-border/40 bg-secondary/20 transition-all hover:border-primary/30 hover:bg-primary/10"
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Share2 size={15} className="text-foreground/70" />
  </motion.button>
</motion.div>
            </div>

            {/* Bottom accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </motion.div>

          {/* ===== BACK ===== */}
        <div
  className="glass-card absolute inset-0 w-full overflow-y-auto overflow-x-hidden scrollbar-none max-sm:h-full"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <Corner className="left-3 top-3" />
            <Corner className="right-3 top-3 rotate-90" />
            <Corner className="bottom-3 left-3 -rotate-90" />
            <Corner className="bottom-3 right-3 rotate-180" />
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            {/* Glows for life */}
            <div className="pointer-events-none absolute -right-10 top-20 h-52 w-52 rounded-full bg-primary/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 rounded-full bg-primary/[0.05] blur-3xl" />
            <div className="pointer-events-none absolute right-10 bottom-20 h-36 w-36 rounded-full bg-primary/[0.04] blur-2xl" />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 h-32 w-64 rounded-full bg-primary/[0.06] blur-3xl" />

            {/* Back header with controls */}
            <div className="relative h-14 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              {/* Left: Settings */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Link to="/login" className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.08] transition-all hover:border-primary/40 hover:bg-primary/15">
                  <Settings size={16} className="text-foreground" />
                </Link>
              </div>
              {/* Right: Language + Flip back */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex h-9 items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/[0.08] px-3 transition-all hover:border-primary/40 hover:bg-primary/15">
                  <Languages size={14} className="text-foreground" />
                  <span className="text-[11px] font-bold text-foreground">{lang === "en" ? "عربي" : "EN"}</span>
                </button>
                <button onClick={() => setFlipped(false)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 transition-all hover:bg-primary/25 hover:border-primary/50">
                  <RotateCw size={15} className="text-primary" />
                </button>
              </div>
            </div>

            <div className="px-8 pb-10 pt-6">
              {/* Mini header */}
              <motion.div
                className="mb-8 flex items-center gap-4 rounded-2xl border border-border/25 bg-secondary/15 p-4"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: flipped ? 1 : 0, x: flipped ? 0 : -15 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-primary/30 shadow-lg shadow-primary/10">
                  <img src={d.avatar_url || profilePhoto} alt={name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-[17px] font-extrabold text-foreground">{name}</p>
                  <p className="text-[14px] font-bold text-primary">{title}</p>
                </div>
              </motion.div>

              {/* About */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.3, duration: 0.35 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <Heart size={20} className="text-primary" />
                  </div>
                  <h2 className="text-[17px] font-extrabold text-foreground">{t("about_me")}</h2>
                </div>
                <p className="rounded-2xl border border-border/25 bg-secondary/10 p-5 text-[14px] leading-[1.9] font-medium text-foreground/90">
                  {about}
                </p>
              </motion.div>

              {/* Skills */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.4, duration: 0.35 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <Award size={20} className="text-primary" />
                  </div>
                  <h2 className="text-[17px] font-extrabold text-foreground">{t("skills")}</h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill: string, i: number) => (
                    <motion.span
                      key={i}
                      className="rounded-xl border border-primary/20 bg-primary/[0.08] px-4 py-2 text-[13px] font-bold text-primary"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: flipped ? 1 : 0, scale: flipped ? 1 : 0.9 }}
                      transition={{ delay: 0.45 + i * 0.04, duration: 0.2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/40" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/40" />
              </div>

              {/* Experience */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.6, duration: 0.35 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <Briefcase size={20} className="text-primary" />
                  </div>
                  <h2 className="text-[17px] font-extrabold text-foreground">{t("experience")}</h2>
                </div>
                <div className="space-y-3">
                  {experience.map((exp: any, i: number) => (
                    <div key={i} className="relative rounded-2xl border border-border/25 bg-secondary/10 p-4 ps-5">
                      <div className="absolute inset-y-3 start-0 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/20" />
                      <p className="text-[15px] font-bold text-foreground">{lang === "ar" ? exp.title_ar : exp.title_en}</p>
                      <p className="mt-1 text-[13px] font-medium text-foreground/60">{lang === "ar" ? exp.company_ar : exp.company_en}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Education */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.7, duration: 0.35 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <GraduationCap size={20} className="text-primary" />
                  </div>
                  <h2 className="text-[17px] font-extrabold text-foreground">{t("education")}</h2>
                </div>
                <div className="space-y-3">
                  {education.map((edu: any, i: number) => (
                    <div key={i} className="relative rounded-2xl border border-border/25 bg-secondary/10 p-4 ps-5">
                      <div className="absolute inset-y-3 start-0 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/20" />
                      <p className="text-[15px] font-bold text-foreground">{lang === "ar" ? edu.degree_ar : edu.degree_en}</p>
                      <p className="mt-1 text-[13px] font-medium text-foreground/60">{lang === "ar" ? edu.field_ar : edu.field_en}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
  <motion.p
  className="mt-3 pb-2 text-center text-[8px] font-medium tracking-[0.3em] uppercase text-muted-foreground/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Powered by  Codexa
      </motion.p>


      {showInstallHelp && (
  <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-4 sm:items-center">
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="w-full max-w-md rounded-2xl border border-border bg-background p-5 text-start shadow-2xl"
    >
      <h3 className="mb-3 text-lg font-bold text-foreground">
        {lang === "ar" ? "إضافة الكارت للشاشة الرئيسية" : "Add Card to Home Screen"}
      </h3>

      {isIOS ? (
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>{lang === "ar" ? "1. افتح الصفحة في متصفح Safari" : "1. Open this page in Safari"}</p>
          <p>{lang === "ar" ? "2. اضغط زر المشاركة" : "2. Tap the Share button"}</p>
          <p>{lang === "ar" ? "3. اختر إضافة إلى الشاشة الرئيسية" : "3. Choose Add to Home Screen"}</p>
          <p>{lang === "ar" ? "4. اضغط إضافة" : "4. Tap Add"}</p>
        </div>
      ) : isAndroid ? (
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>{lang === "ar" ? "1. افتح الصفحة في متصفح Chrome" : "1. Open this page in Chrome"}</p>
          <p>{lang === "ar" ? "2. اضغط القائمة" : "2. Tap the menu"}</p>
          <p>{lang === "ar" ? "3. اختر إضافة إلى الشاشة الرئيسية أو تثبيت التطبيق" : "3. Choose Add to Home Screen or Install App"}</p>
          <p>{lang === "ar" ? "4. اضغط إضافة أو تثبيت" : "4. Tap Add or Install"}</p>
        </div>
      ) : (
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>
            {lang === "ar"
              ? "استخدم قائمة المتصفح ثم اختر إضافة إلى الشاشة الرئيسية إذا كانت متاحة."
              : "Use your browser menu and choose Add to Home Screen if available."}
          </p>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={() => setShowInstallHelp(false)}
          className="rounded-xl border border-border px-4 py-2 text-sm text-foreground"
        >
          {lang === "ar" ? "إغلاق" : "Close"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>

  );
};

export default BusinessCard;
