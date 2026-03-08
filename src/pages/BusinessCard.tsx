import { useState, useRef } from "react";
import profilePhoto from "@/assets/profile-photo.png";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  RotateCw, Globe, Linkedin, MessageCircle, Mail, Phone, MapPin,
  UserPlus, Share2, Settings, Heart, Award, Briefcase, GraduationCap,
  Languages, Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardData } from "@/hooks/useCardData";

const BusinessCard = () => {
  const [flipped, setFlipped] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { data: cardData, isLoading } = useCardData();
  const cardRef = useRef<HTMLDivElement>(null);

  // Very subtle 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-300, 300], [2, -2]), { stiffness: 150, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-2, 2]), { stiffness: 150, damping: 40 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || flipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Use DB data or fallback
  const d = cardData || {} as any;
  const name = lang === "ar" ? d.name_ar : d.name_en || "Mahmoud Abdelrahman";
  const title = lang === "ar" ? d.title_ar : d.title_en || "Business Analyst";
  const company = lang === "ar" ? d.company_ar : d.company_en || "Etmam for Information Technology";
  const about = lang === "ar" ? d.about_ar : d.about_en || "";
  const locationText = lang === "ar" ? d.location_ar : d.location_en || "";
  const phone = d.phone || "+966 560 303 813";
  const email = d.email || "mahmoud@etmam.com";
  const websiteUrl = d.website_url || "https://etmam.com";
  const linkedinUrl = d.linkedin_url || "https://linkedin.com";
  const skills = Array.isArray(d.skills) ? d.skills : ["Business Analysis", "Requirements Gathering", "Process Optimization", "Stakeholder Management", "Agile Methodology", "Data Analysis"];
  const experience = Array.isArray(d.experience) ? d.experience : [];
  const education = Array.isArray(d.education) ? d.education : [];

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${d.name_en || "Mahmoud Abdelrahman"}\nTITLE:${d.title_en || "Business Analyst"}\nORG:${d.company_en || "Etmam"}\nTEL:${phone}\nEMAIL:${email}\nURL:${websiteUrl}\nEND:VCARD`;
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

  const initials = (d.name_en || "MA").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
      {/* Top controls */}
      <Link to="/login" className="icon-btn fixed left-4 top-4 z-20">
        <Settings size={20} className="text-muted-foreground" />
      </Link>
      <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="icon-btn fixed right-4 top-4 z-20">
        <Languages size={20} className="text-muted-foreground" />
      </button>

      {/* 3D Card container */}
      <div
        ref={cardRef}
        className="w-full max-w-md"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            rotateX: flipped ? 0 : rotateX,
            rotateY: flipped ? 180 : rotateY,
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* ===== FRONT ===== */}
          <motion.div
            className="glass-card w-full overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="p-4">
              <button onClick={() => setFlipped(true)} className="icon-btn">
                <RotateCw size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col items-center px-8 pb-8">
              {/* Company Logo */}
              <motion.div
                className="mb-8 flex flex-col items-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative flex items-center gap-3">
                  {/* Decorative left line */}
                  <div className="flex flex-col items-end gap-[3px]">
                    <div className="h-[1.5px] w-8 rounded-full bg-gradient-to-r from-transparent to-primary/60" />
                    <div className="h-[1.5px] w-5 rounded-full bg-gradient-to-r from-transparent to-primary/40" />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold tracking-widest text-primary" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" }}>
                      ETMAM
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium tracking-[0.3em] text-muted-foreground/70">
                      إتمام لتقنية المعلومات
                    </span>
                  </div>

                  {/* Decorative right line */}
                  <div className="flex flex-col items-start gap-[3px]">
                    <div className="h-[1.5px] w-8 rounded-full bg-gradient-to-l from-transparent to-primary/60" />
                    <div className="h-[1.5px] w-5 rounded-full bg-gradient-to-l from-transparent to-primary/40" />
                  </div>
                </div>
              </motion.div>

              {/* Avatar with glow animation */}
              <motion.div
                className="glow-border mb-6 h-28 w-28 overflow-hidden rounded-full"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <img src={d.avatar_url || profilePhoto} alt={name} className="h-full w-full object-cover" />
              </motion.div>

              {/* Info with stagger */}
              <motion.h1
                className="mb-1 text-2xl font-bold text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {name}
              </motion.h1>
              <motion.p
                className="mb-1 text-base font-semibold text-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {title}
              </motion.p>
              <motion.p
                className="mb-6 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {company}
              </motion.p>

              {/* Social Icons */}
              <motion.div
                className="mb-8 flex gap-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                {[
                  { icon: Globe, href: websiteUrl },
                  { icon: Linkedin, href: linkedinUrl },
                  { icon: MessageCircle, href: d.whatsapp_url || "#" },
                  { icon: Mail, href: `mailto:${email}` },
                ].map(({ icon: Icon, href }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn !p-3"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={22} className="text-foreground" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Contact Details */}
              <div className="mb-8 w-full space-y-4">
                <motion.div
                  className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-5 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ x: 5, borderColor: "hsl(var(--primary) / 0.5)" }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-glass-border/30 bg-secondary/50">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("call")}</p>
                    <p className="text-sm font-medium text-foreground">{phone}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-5 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  whileHover={{ x: 5, borderColor: "hsl(var(--primary) / 0.5)" }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-glass-border/30 bg-secondary/50">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("location")}</p>
                    <p className="text-sm font-medium text-foreground">{locationText}</p>
                  </div>
                </motion.div>
              </div>

              {/* QR Code */}
              <motion.div
                className="mb-8 flex w-full flex-col items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("scan_linkedin")}
                </p>
                <motion.div
                  className="rounded-xl bg-background/30 p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <QRCodeSVG value={linkedinUrl} size={120} bgColor="transparent" fgColor="#3B82F6" />
                </motion.div>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex w-full items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <motion.button
                  onClick={handleSaveContact}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(var(--primary) / 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus size={18} />
                  {t("save_contact")}
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  className="icon-btn !p-3"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={20} className="text-muted-foreground" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* ===== BACK ===== */}
          <div
            className="glass-card absolute inset-0 w-full overflow-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Top accent gradient */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            
            <div className="p-4">
              <button onClick={() => setFlipped(false)} className="icon-btn">
                <RotateCw size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="px-8 pb-8">
              {/* About */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 10 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Heart size={16} className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{t("about_me")}</h2>
                </div>
                <p className="rounded-xl border border-border/50 bg-secondary/20 p-4 text-sm leading-relaxed text-muted-foreground">
                  {about}
                </p>
              </motion.div>

              {/* Skills */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 10 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Award size={16} className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{t("skills")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, i: number) => (
                    <motion.span
                      key={i}
                      className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 8 }}
                      transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Experience */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 10 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Briefcase size={16} className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{t("experience")}</h2>
                </div>
                <div className="space-y-3">
                  {experience.map((exp: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-sm shadow-primary/50" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {lang === "ar" ? exp.title_ar : exp.title_en}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lang === "ar" ? exp.company_ar : exp.company_en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Education */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 10 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap size={16} className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{t("education")}</h2>
                </div>
                <div className="space-y-3">
                  {education.map((edu: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-sm shadow-primary/50" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {lang === "ar" ? edu.degree_ar : edu.degree_en}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
    </div>
  );
};

export default BusinessCard;
