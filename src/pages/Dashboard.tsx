import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Save, Eye, User, Phone, Globe, Award, Briefcase, GraduationCap,
  Plus, X, Loader2, Check, Languages,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardData, useUpdateCardData } from "@/hooks/useCardData";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const { data: cardData, isLoading } = useCardData();
  const updateCard = useUpdateCardData();

  const [form, setForm] = useState<Record<string, any>>({});
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (cardData) {
      setForm({ ...cardData });
    }
  }, [cardData]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.id) return;
    try {
      await updateCard.mutateAsync(form as any);
      toast.success(t("saved"));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skills = Array.isArray(form.skills) ? [...form.skills] : [];
    skills.push(newSkill.trim());
    handleChange("skills", skills);
    setNewSkill("");
  };

  const removeSkill = (i: number) => {
    const skills = Array.isArray(form.skills) ? [...form.skills] : [];
    skills.splice(i, 1);
    handleChange("skills", skills);
  };

  const tabs = [
    { id: "basic", label: t("basic_info"), icon: User },
    { id: "contact", label: t("contact_info"), icon: Phone },
    { id: "social", label: t("social_links"), icon: Globe },
    { id: "skills", label: t("skills"), icon: Award },
    { id: "experience", label: t("experience"), icon: Briefcase },
    { id: "education", label: t("education"), icon: GraduationCap },
  ];

  const inputClass =
    "w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="relative z-10 min-h-screen px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-8 flex max-w-3xl items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-foreground">{t("dashboard")}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="icon-btn !p-2.5"
          >
            <Languages size={18} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate("/")} className="icon-btn !p-2.5">
            <Eye size={18} className="text-muted-foreground" />
          </button>
          <button
            onClick={async () => { await signOut(); navigate("/login"); }}
            className="icon-btn !p-2.5"
          >
            <LogOut size={18} className="text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mx-auto mb-6 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-auto max-w-3xl p-6 md:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "basic" && (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>{t("name")} ({t("english")})</label>
                  <input className={inputClass} value={form.name_en || ""} onChange={(e) => handleChange("name_en", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("name")} ({t("arabic")})</label>
                  <input className={inputClass} dir="rtl" value={form.name_ar || ""} onChange={(e) => handleChange("name_ar", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("title")} ({t("english")})</label>
                  <input className={inputClass} value={form.title_en || ""} onChange={(e) => handleChange("title_en", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("title")} ({t("arabic")})</label>
                  <input className={inputClass} dir="rtl" value={form.title_ar || ""} onChange={(e) => handleChange("title_ar", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("company")} ({t("english")})</label>
                  <input className={inputClass} value={form.company_en || ""} onChange={(e) => handleChange("company_en", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("company")} ({t("arabic")})</label>
                  <input className={inputClass} dir="rtl" value={form.company_ar || ""} onChange={(e) => handleChange("company_ar", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>{t("about")} ({t("english")})</label>
                  <textarea className={inputClass + " min-h-[80px]"} value={form.about_en || ""} onChange={(e) => handleChange("about_en", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>{t("about")} ({t("arabic")})</label>
                  <textarea className={inputClass + " min-h-[80px]"} dir="rtl" value={form.about_ar || ""} onChange={(e) => handleChange("about_ar", e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>{t("phone")}</label>
                  <input className={inputClass} value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("email")}</label>
                  <input className={inputClass} type="email" value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("location")} ({t("english")})</label>
                  <input className={inputClass} value={form.location_en || ""} onChange={(e) => handleChange("location_en", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("location")} ({t("arabic")})</label>
                  <input className={inputClass} dir="rtl" value={form.location_ar || ""} onChange={(e) => handleChange("location_ar", e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="grid gap-5">
                <div>
                  <label className={labelClass}>{t("website")}</label>
                  <input className={inputClass} value={form.website_url || ""} onChange={(e) => handleChange("website_url", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("linkedin")}</label>
                  <input className={inputClass} value={form.linkedin_url || ""} onChange={(e) => handleChange("linkedin_url", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{t("whatsapp")}</label>
                  <input className={inputClass} value={form.whatsapp_url || ""} onChange={(e) => handleChange("whatsapp_url", e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <div className="mb-4 flex gap-2">
                  <input
                    className={inputClass}
                    placeholder={t("add_skill")}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <button onClick={addSkill} className="icon-btn shrink-0 !p-3">
                    <Plus size={18} className="text-primary" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(form.skills) ? form.skills : []).map((skill: string, i: number) => (
                    <motion.span
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 rounded-full border border-primary/40 px-4 py-1.5 text-xs font-medium text-primary"
                    >
                      {skill}
                      <button onClick={() => removeSkill(i)}>
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-4">
                {(Array.isArray(form.experience) ? form.experience : []).map((exp: any, i: number) => (
                  <div key={i} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>{t("title")} ({t("english")})</label>
                      <input className={inputClass} value={exp.title_en || ""} onChange={(e) => {
                        const arr = [...(form.experience as any[])];
                        arr[i] = { ...arr[i], title_en: e.target.value };
                        handleChange("experience", arr);
                      }} />
                    </div>
                    <div>
                      <label className={labelClass}>{t("title")} ({t("arabic")})</label>
                      <input className={inputClass} dir="rtl" value={exp.title_ar || ""} onChange={(e) => {
                        const arr = [...(form.experience as any[])];
                        arr[i] = { ...arr[i], title_ar: e.target.value };
                        handleChange("experience", arr);
                      }} />
                    </div>
                    <div>
                      <label className={labelClass}>{t("company")} ({t("english")})</label>
                      <input className={inputClass} value={exp.company_en || ""} onChange={(e) => {
                        const arr = [...(form.experience as any[])];
                        arr[i] = { ...arr[i], company_en: e.target.value };
                        handleChange("experience", arr);
                      }} />
                    </div>
                    <div>
                      <label className={labelClass}>{t("company")} ({t("arabic")})</label>
                      <input className={inputClass} dir="rtl" value={exp.company_ar || ""} onChange={(e) => {
                        const arr = [...(form.experience as any[])];
                        arr[i] = { ...arr[i], company_ar: e.target.value };
                        handleChange("experience", arr);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-4">
                {(Array.isArray(form.education) ? form.education : []).map((edu: any, i: number) => (
                  <div key={i} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Degree ({t("english")})</label>
                      <input className={inputClass} value={edu.degree_en || ""} onChange={(e) => {
                        const arr = [...(form.education as any[])];
                        arr[i] = { ...arr[i], degree_en: e.target.value };
                        handleChange("education", arr);
                      }} />
                    </div>
                    <div>
                      <label className={labelClass}>Degree ({t("arabic")})</label>
                      <input className={inputClass} dir="rtl" value={edu.degree_ar || ""} onChange={(e) => {
                        const arr = [...(form.education as any[])];
                        arr[i] = { ...arr[i], degree_ar: e.target.value };
                        handleChange("education", arr);
                      }} />
                    </div>
                    <div>
                      <label className={labelClass}>Field ({t("english")})</label>
                      <input className={inputClass} value={edu.field_en || ""} onChange={(e) => {
                        const arr = [...(form.education as any[])];
                        arr[i] = { ...arr[i], field_en: e.target.value };
                        handleChange("education", arr);
                      }} />
                    </div>
                    <div>
                      <label className={labelClass}>Field ({t("arabic")})</label>
                      <input className={inputClass} dir="rtl" value={edu.field_ar || ""} onChange={(e) => {
                        const arr = [...(form.education as any[])];
                        arr[i] = { ...arr[i], field_ar: e.target.value };
                        handleChange("education", arr);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save Button */}
        <motion.div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateCard.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {updateCard.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {updateCard.isPending ? t("saving") : t("save_changes")}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
