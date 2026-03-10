import { useState, useRef } from "react";
import profilePhoto from "@/assets/profile-photo.png";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  RotateCw, Globe, Linkedin, MessageCircle, Mail, Phone, MapPin,
  UserPlus, Share2, Settings, Heart, Award, Briefcase, GraduationCap,
  Languages, Loader2, Zap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardData } from "@/hooks/useCardData";

const BusinessCard = ({ overrideData }: { overrideData?: any } = {}) => {
  const [flipped, setFlipped] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { data: fetchedData, isLoading } = useCardData();
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
  const name = lang === "ar" ? (d.name_ar || "محمود عبدالرحمن") : (d.name_en || "Mahmoud Abdelrahman");
  const title = lang === "ar" ? (d.title_ar || "محلل أعمال") : (d.title_en || "Business Analyst");
  const company = lang === "ar" ? (d.company_ar || "إتمام لتقنية المعلومات") : (d.company_en || "Etmam for Information Technology");
  const about = lang === "ar" ? (d.about_ar || "محلل أعمال شغوف بالتقنية وتحسين العمليات") : (d.about_en || "Passionate Business Analyst with expertise in bridging the gap between business needs and technology solutions.");
  const locationText = lang === "ar" ? (d.location_ar || "السليمانية، الرياض") : (d.location_en || "Sulaymaniyah, Riyadh 12242");
  const phoneNum = d.phone || "+966 560 303 813";
  const emailAddr = d.email || "mahmoud@etmam.com";
  const websiteUrl = d.website_url || "https://etmam.com";
  const linkedinUrl = d.linkedin_url || "https://linkedin.com";
  const skills = Array.isArray(d.skills) ? d.skills : ["Business Analysis", "Requirements Gathering", "Process Optimization", "Stakeholder Management", "Agile Methodology", "Data Analysis"];
  const experience = Array.isArray(d.experience) ? d.experience : [{ title_en: "Business Analyst", title_ar: "محلل أعمال", company_en: "Etmam for Information Technology", company_ar: "إتمام لتقنية المعلومات" }];
  const education = Array.isArray(d.education) ? d.education : [{ degree_en: "Bachelor's Degree", degree_ar: "بكالوريوس", field_en: "Business Information Systems", field_ar: "نظم معلومات إدارية" }];

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

  if (isLoading) {
    return (
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
    <div className="relative z-10 flex h-[100dvh] items-center justify-center overflow-hidden px-3">
      {/* Top controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed left-3 right-3 top-2 z-20 flex items-center justify-between"
      >
        <Link to="/login" className="icon-btn">
          <Settings size={18} className="text-foreground/80" />
        </Link>
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="icon-btn gap-1.5 !px-3">
          <Languages size={16} className="text-foreground/80" />
          <span className="text-xs font-semibold text-foreground/80">{lang === "en" ? "عربي" : "EN"}</span>
        </button>
      </motion.div>

      {/* Card */}
      <div
        ref={cardRef}
        className="w-full max-w-[420px] max-h-[calc(100dvh-2rem)]"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d", rotateX: flipped ? 0 : rotateX, rotateY: flipped ? 180 : rotateY2 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.68, -0.15, 0.27, 1.15] }}
        >
          {/* ===== FRONT ===== */}
          <motion.div
            className="glass-card w-full overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top accent header */}
            <div className="relative h-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 top-2 flex items-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30" />
                <div className="h-1 w-1 rounded-full bg-primary/40" />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30" />
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button onClick={() => setFlipped(true)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 transition-all hover:bg-primary/20 hover:border-primary/50">
                  <RotateCw size={13} className="text-primary" />
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
                  <img src={d.avatar_url || profilePhoto} alt={name} className="h-full w-full object-cover" />
                </div>
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
                  <QRCodeSVG value={linkedinUrl} size={70} bgColor="transparent" fgColor="hsl(210, 100%, 55%)" />
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
                  {t("save_contact")}
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
            className="glass-card absolute inset-0 w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden scrollbar-none"
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

            <div className="flex items-center justify-between p-5 pb-0">
              <button onClick={() => setFlipped(false)} className="icon-btn">
                <RotateCw size={16} className="text-foreground/80" />
              </button>
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
        className="fixed bottom-4 left-0 right-0 text-center text-[9px] font-medium tracking-[0.3em] uppercase text-muted-foreground/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Powered by Etmam
      </motion.p>
    </div>
  );
};

export default BusinessCard;
