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
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const BusinessCard = () => {
  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Mahmoud Abdelrahman
TITLE:Business Analyst
ORG:Etmam for Information Technology
TEL:+966 50 123 4567
EMAIL:mahmoud@etmam.com
ADR:;;Riyadh;Saudi Arabia
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
      <div className="glass-card w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link to="/login" className="icon-btn" aria-label="Admin login">
            <RotateCw size={18} className="text-muted-foreground" />
          </Link>
          <div className="icon-btn cursor-default opacity-50" aria-label="Theme">
            {/* Placeholder for theme toggle */}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-6 pb-6">
          {/* Logo */}
          <div className="mb-4 text-xl font-bold tracking-wider text-primary">
            ETMAM
          </div>

          {/* Avatar */}
          <div className="glow-border mb-4 h-24 w-24 overflow-hidden rounded-full">
            <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-primary">
              MA
            </div>
          </div>

          {/* Info */}
          <h1 className="mb-1 text-xl font-bold text-foreground">
            Mahmoud Abdelrahman
          </h1>
          <p className="mb-1 text-sm font-medium text-primary">
            Business Analyst
          </p>
          <p className="mb-5 text-xs text-muted-foreground">
            Etmam for Information Technology
          </p>

          {/* Social Icons */}
          <div className="mb-6 flex gap-4">
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
                className="icon-btn"
                aria-label={label}
              >
                <Icon size={18} className="text-muted-foreground" />
              </a>
            ))}
          </div>

          {/* Contact Details */}
          <div className="mb-6 w-full space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <Phone size={16} className="shrink-0 text-primary" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Call
                </p>
                <p className="text-sm text-foreground">+966 50 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <MapPin size={16} className="shrink-0 text-primary" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </p>
                <p className="text-sm text-foreground">Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="mb-6 flex w-full flex-col items-center rounded-xl bg-secondary/30 p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Scan to connect on LinkedIn
            </p>
            <div className="rounded-lg bg-foreground p-2">
              <QRCodeSVG
                value="https://linkedin.com/in/mahmoud-abdelrahman"
                size={100}
                bgColor="hsl(210, 40%, 96%)"
                fgColor="hsl(222, 47%, 7%)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full items-center gap-2">
            <button
              onClick={handleSaveContact}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
            >
              <UserPlus size={16} />
              Save Contact
            </button>
            <button
              onClick={handleShare}
              className="icon-btn"
              aria-label="Share"
            >
              <Share2 size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
