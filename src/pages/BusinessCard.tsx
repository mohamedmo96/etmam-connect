import { useState, useRef } from "react";
import profilePhoto from "@/assets/profile-photo.png";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  RotateCw, Globe, Linkedin, MessageCircle, Mail, Phone, MapPin,
  UserPlus, Share2, Settings, Heart, Award, Briefcase, GraduationCap,
  Languages, Loader2, ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardData } from "@/hooks/useCardData";

const BusinessCard = () => {
  const [flipped, setFlipped] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { data: cardData, isLoading } = useCardData();
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
  const about = lang === "ar" ? (d.about_ar || "محلل أعمال شغوف بالتقنية") : (d.about_en || "Passionate Business Analyst with expertise in bridging the gap between business needs and technology solutions.");
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
    a.href = url;
    a.download = `${(d.name_en || "contact").replace(/\s/g, "_")}.vcf`;
    a.click();
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      {/* Top controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed left-4 right-4 top-4 z-20 flex items-center justify-between"
      >
        <Link to="/login" className="icon-btn">
          <Settings size={18} className="text-muted-foreground" />
        </Link>
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="icon-btn gap-1.5 !px-3">
          <Languages size={16} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{lang === "en" ? "عربي" : "EN"}</span>
        </button>
      </motion.div>

      {/* Card */}
      <div
        ref={cardRef}
        className="w-full max-w-[420px]"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            rotateX: flipped ? 0 : rotateX,
            rotateY: flipped ? 180 : rotateY2,
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ===== FRONT ===== */}
          <motion.div
            className="glass-card w-full overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {/* Flip button */}
            <div className="flex items-center justify-between p-5">
              <button onClick={() => setFlipped(true)} className="icon-btn">
                <RotateCw size={16} className="text-muted-foreground" />
              </button>
              <div className="flex items-center gap-1.5 text-muted-foreground/50">
                <ExternalLink size={12} />
                <span className="text-[10px] font-medium tracking-widest uppercase">Digital Card</span>
              </div>
            </div>

            <div className="flex flex-col items-center px-8 pb-8">
              {/* Company Logo */}
              <motion.div
                className="mb-7 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/40" />
                <div className="flex flex-col items-center">
                  <span className="text-[22px] font-bold tracking-[0.2em] text-primary">
                    ETMAM
                  </span>
                  <span className="text-[9px] font-medium tracking-[0.25em] text-muted-foreground/60" style={{ fontFamily: "var(--font-ar)" }}>
                    إتمام لتقنية المعلومات
                  </span>
                </div>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/40" />
              </motion.div>

              {/* Avatar */}
              <motion.div
                className="glow-border mb-7 h-[120px] w-[120px] overflow-hidden rounded-full"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 150, damping: 20 }}
              >
                <img src={d.avatar_url || profilePhoto} alt={name} className="h-full w-full object-cover" />
              </motion.div>

              {/* Name & Title */}
              <motion.h1
                className="mb-1.5 text-center text-[22px] font-bold leading-tight text-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {name}
              </motion.h1>
              <motion.p
                className="mb-1 text-center text-[15px] font-semibold text-primary"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {title}
              </motion.p>
              <motion.p
                className="mb-7 text-center text-[13px] text-muted-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {company}
              </motion.p>

              {/* Social Icons */}
              <motion.div
                className="mb-8 flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { icon: Globe, href: websiteUrl, label: "Website" },
                  { icon: Linkedin, href: linkedinUrl, label: "LinkedIn" },
                  { icon: MessageCircle, href: d.whatsapp_url || "#", label: "WhatsApp" },
                  { icon: Mail, href: `mailto:${emailAddr}`, label: "Email" },
                ].map(({ icon: Icon, href, label }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn !rounded-2xl !p-3"
                    aria-label={label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} className="text-foreground/80" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Contact Details */}
              <div className="mb-8 w-full space-y-3">
                <motion.a
                  href={`tel:${phoneNum}`}
                  className="contact-row"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <div className="section-icon shrink-0 !h-10 !w-10 !rounded-full">
                    <Phone size={17} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">{t("call")}</p>
                    <p className="text-sm font-medium text-foreground" dir="ltr">{phoneNum}</p>
                  </div>
                </motion.a>
                <motion.div
                  className="contact-row"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="section-icon shrink-0 !h-10 !w-10 !rounded-full">
                    <MapPin size={17} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">{t("location")}</p>
                    <p className="text-sm font-medium text-foreground">{locationText}</p>
                  </div>
                </motion.div>
              </div>

              {/* QR Code */}
              <motion.div
                className="mb-8 flex w-full flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {t("scan_linkedin")}
                </p>
                <div className="rounded-2xl border border-border/40 bg-secondary/15 p-4">
                  <QRCodeSVG value={linkedinUrl} size={110} bgColor="transparent" fgColor="hsl(217, 91%, 60%)" />
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex w-full items-center gap-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={handleSaveContact}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
                  whileHover={{ y: -1, boxShadow: "0 8px 30px hsl(217 91% 60% / 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus size={17} />
                  {t("save_contact")}
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  className="icon-btn !p-3.5"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={18} className="text-muted-foreground" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* ===== BACK ===== */}
          <div
            className="glass-card absolute inset-0 w-full overflow-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="flex items-center justify-between p-5">
              <button onClick={() => setFlipped(false)} className="icon-btn">
                <RotateCw size={16} className="text-muted-foreground" />
              </button>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">Profile</span>
            </div>

            <div className="px-7 pb-8">
              {/* Mini profile header */}
              <motion.div
                className="mb-6 flex items-center gap-3.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: flipped ? 1 : 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="h-12 w-12 overflow-hidden rounded-xl border border-glass-border/20">
                  <img src={d.avatar_url || profilePhoto} alt={name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{name}</p>
                  <p className="text-xs text-primary">{title}</p>
                </div>
              </motion.div>

              {/* About */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.3, duration: 0.35 }}
              >
                <div className="section-header">
                  <div className="section-icon"><Heart size={15} className="text-primary" /></div>
                  <h2 className="section-title">{t("about_me")}</h2>
                </div>
                <p className="rounded-2xl border border-border/30 bg-secondary/15 p-4 text-[13px] leading-[1.7] text-muted-foreground">
                  {about}
                </p>
              </motion.div>

              {/* Skills */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.4, duration: 0.35 }}
              >
                <div className="section-header">
                  <div className="section-icon"><Award size={15} className="text-primary" /></div>
                  <h2 className="section-title">{t("skills")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, i: number) => (
                    <motion.span
                      key={i}
                      className="skill-badge"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: flipped ? 1 : 0, scale: flipped ? 1 : 0.9 }}
                      transition={{ delay: 0.45 + i * 0.05, duration: 0.25 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

              {/* Experience */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                transition={{ delay: 0.6, duration: 0.35 }}
              >
                <div className="section-header">
                  <div className="section-icon"><Briefcase size={15} className="text-primary" /></div>
                  <h2 className="section-title">{t("experience")}</h2>
                </div>
                <div className="space-y-2.5">
                  {experience.map((exp: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/30 bg-secondary/15 px-4 py-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">
                          {lang === "ar" ? exp.title_ar : exp.title_en}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {lang === "ar" ? exp.company_ar : exp.company_en}
                        </p>
                      </div>
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
                <div className="section-header">
                  <div className="section-icon"><GraduationCap size={15} className="text-primary" /></div>
                  <h2 className="section-title">{t("education")}</h2>
                </div>
                <div className="space-y-2.5">
                  {education.map((edu: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/30 bg-secondary/15 px-4 py-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">
                          {lang === "ar" ? edu.degree_ar : edu.degree_en}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {lang === "ar" ? edu.field_ar : edu.field_en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer watermark */}
      <motion.p
        className="fixed bottom-4 left-0 right-0 text-center text-[10px] tracking-widest text-muted-foreground/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        POWERED BY ETMAM
      </motion.p>
    </div>
  );
};

export default BusinessCard;
