import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RotateCw,
  Globe,
  Linkedin,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Share2,
  Settings,
  Sun,
  Heart,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const skills = [
  "Business Analysis",
  "Requirements Gathering",
  "Process Optimization",
  "Stakeholder Management",
  "Agile Methodology",
  "Data Analysis",
];

const BusinessCard = () => {
  const [flipped, setFlipped] = useState(false);

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Mahmoud Abdelrahman
TITLE:Business Analyst
ORG:Etmam for Information Technology
TEL:+966 560 303 813
EMAIL:mahmoud@etmam.com
ADR:;;السليمانية، الرياض 12242;Saudi Arabia
URL:https://etmam.com
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mahmoud_Abdelrahman.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Mahmoud Abdelrahman - Business Card",
        text: "Connect with Mahmoud Abdelrahman, Business Analyst at Etmam",
        url: window.location.href,
      });
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
      {/* Settings icon - outside card, top-left */}
      <Link
        to="/login"
        className="icon-btn fixed left-4 top-4 z-20"
        aria-label="Settings"
      >
        <Settings size={20} className="text-muted-foreground" />
      </Link>

      {/* Sun icon - outside card, top-right */}
      <button
        className="icon-btn fixed right-4 top-4 z-20"
        aria-label="Theme"
      >
        <Sun size={20} className="text-muted-foreground" />
      </button>

      {/* Card flip container */}
      <div
        className="w-full max-w-md"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ===== FRONT SIDE ===== */}
          <div
            className="glass-card w-full overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Flip button */}
            <div className="p-4">
              <button
                onClick={() => setFlipped(true)}
                className="icon-btn"
                aria-label="Flip card"
              >
                <RotateCw size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center px-8 pb-8">
              {/* Logo */}
              <div className="mb-6 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">إتمام</span>
                <div className="flex items-center text-primary">
                  <span className="text-xl font-bold tracking-wide">Etmam</span>
                  <div className="ml-1 flex flex-col gap-[2px]">
                    <div className="h-[2px] w-4 rounded bg-primary" />
                    <div className="h-[2px] w-3 rounded bg-primary" />
                    <div className="h-[2px] w-2 rounded bg-primary" />
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="glow-border mb-6 h-28 w-28 overflow-hidden rounded-full">
                <div className="flex h-full w-full items-center justify-center bg-secondary text-3xl font-bold text-primary">
                  MA
                </div>
              </div>

              {/* Info */}
              <h1 className="mb-1 text-2xl font-bold text-foreground">
                Mahmoud Abdelrahman
              </h1>
              <p className="mb-1 text-base font-semibold text-primary">
                Business Analyst
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Etmam for Information Technology
              </p>

              {/* Social Icons */}
              <div className="mb-8 flex gap-5">
                {[
                  { icon: Globe, label: "Website", href: "https://etmam.com" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                  { icon: MessageCircle, label: "Message", href: "#" },
                  { icon: Mail, label: "Email", href: "mailto:mahmoud@etmam.com" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn !p-3"
                    aria-label={label}
                  >
                    <Icon size={22} className="text-foreground" />
                  </a>
                ))}
              </div>

              {/* Contact Details */}
              <div className="mb-8 w-full space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-glass-border/30 bg-secondary/50">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Call
                    </p>
                    <p className="text-sm font-medium text-foreground">+966 560 303 813</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-glass-border/30 bg-secondary/50">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </p>
                    <p className="text-sm font-medium text-foreground">السليمانية، الرياض 12242</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-8 flex w-full flex-col items-center p-4">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Scan to connect on LinkedIn
                </p>
                <div className="rounded-xl bg-background/30 p-3">
                  <QRCodeSVG
                    value="https://linkedin.com/in/mahmoud-abdelrahman"
                    size={120}
                    bgColor="transparent"
                    fgColor="#3B82F6"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full items-center gap-3">
                <button
                  onClick={handleSaveContact}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
                >
                  <UserPlus size={18} />
                  Save Contact
                </button>
                <button
                  onClick={handleShare}
                  className="icon-btn !p-3"
                  aria-label="Share"
                >
                  <Share2 size={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* ===== BACK SIDE ===== */}
          <div
            className="glass-card absolute inset-0 w-full overflow-auto"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Flip button */}
            <div className="p-4">
              <button
                onClick={() => setFlipped(false)}
                className="icon-btn"
                aria-label="Flip back"
              >
                <RotateCw size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="px-8 pb-8">
              {/* About Me */}
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <Heart size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">About Me</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Passionate Business Analyst with expertise in bridging the gap
                  between business needs and technology solutions. Dedicated to
                  driving digital transformation and process optimization.
                </p>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-glass-border/40 to-transparent" />

              {/* Skills */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/40 px-4 py-1.5 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-glass-border/40 to-transparent" />

              {/* Experience */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Experience</h2>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Business Analyst</p>
                    <p className="text-xs text-muted-foreground">Etmam for Information Technology</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-glass-border/40 to-transparent" />

              {/* Education */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <GraduationCap size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Education</h2>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Bachelor's Degree</p>
                    <p className="text-xs text-muted-foreground">Business Information Systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
