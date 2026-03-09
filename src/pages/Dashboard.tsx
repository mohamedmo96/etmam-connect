import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Save, Eye, User, Phone, Globe, Award, Briefcase, GraduationCap,
  Plus, X, Loader2, Check, Languages, Camera, Upload, Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardData, useUpdateCardData } from "@/hooks/useCardData";
import { useClientStatus, useIsAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const { data: cardData, isLoading } = useCardData();
  const updateCard = useUpdateCardData();

  const [form, setForm] = useState<Record<string, any>>({});
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  const allSkills = [
    // Business & Management
    "Business Analysis", "Requirements Gathering", "Process Optimization",
    "Stakeholder Management", "Agile Methodology", "Data Analysis",
    "Project Management", "Program Management", "Portfolio Management",
    "Scrum", "Kanban", "Lean Six Sigma", "PRINCE2", "PMP",
    "JIRA", "Confluence", "Trello", "Asana", "Monday.com",
    "Strategic Planning", "Business Strategy", "Business Development",
    "Operations Management", "Supply Chain Management", "Logistics",
    "Risk Management", "Change Management", "Crisis Management",
    "Product Management", "Product Strategy", "Product Roadmap",
    "Vendor Management", "Procurement", "Contract Management",
    "Performance Management", "KPI Development", "OKRs",
    // Data & Analytics
    "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL",
    "Power BI", "Tableau", "Looker", "Google Analytics", "Mixpanel",
    "Excel", "Google Sheets", "VBA", "Macros",
    "Python", "R", "MATLAB", "SPSS", "SAS",
    "Data Visualization", "Data Modeling", "Data Mining",
    "Data Engineering", "ETL", "Data Warehousing", "Big Data",
    "Apache Spark", "Hadoop", "Kafka", "Airflow",
    "Statistics", "Predictive Analytics", "Prescriptive Analytics",
    "A/B Testing", "Hypothesis Testing", "Regression Analysis",
    // AI & Machine Learning
    "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Computer Vision", "Reinforcement Learning", "Neural Networks",
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn",
    "Artificial Intelligence", "Generative AI", "LLMs", "ChatGPT", "Prompt Engineering",
    "MLOps", "Model Deployment", "Feature Engineering",
    // Software Development
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Svelte",
    "Node.js", "Express.js", "Next.js", "Nest.js",
    "Java", "Spring Boot", "Kotlin", "Scala",
    "C#", ".NET", "ASP.NET", "C++", "C",
    "Go", "Rust", "Ruby", "Ruby on Rails", "PHP", "Laravel",
    "Swift", "Objective-C", "iOS Development", "Android Development",
    "React Native", "Flutter", "Dart", "Xamarin",
    "HTML", "CSS", "SASS", "Tailwind CSS", "Bootstrap",
    "REST API", "GraphQL", "gRPC", "WebSockets", "Microservices",
    "API Integration", "API Design", "Swagger", "Postman",
    "Git", "GitHub", "GitLab", "Bitbucket", "Version Control",
    "System Design", "System Architecture", "Software Architecture",
    "Design Patterns", "SOLID Principles", "Clean Code",
    "Full Stack Development", "Frontend Development", "Backend Development",
    // Cloud & DevOps
    "Cloud Computing", "AWS", "Azure", "Google Cloud", "Oracle Cloud",
    "DevOps", "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI",
    "Docker", "Kubernetes", "Terraform", "Ansible", "Puppet",
    "Linux", "Bash", "Shell Scripting", "Windows Server",
    "Networking", "DNS", "Load Balancing", "CDN",
    "Serverless", "Lambda", "Cloud Functions",
    "Site Reliability Engineering", "Infrastructure as Code",
    "Monitoring", "Grafana", "Prometheus", "Datadog", "New Relic",
    // Cybersecurity
    "Cybersecurity", "Information Security", "Network Security",
    "Penetration Testing", "Ethical Hacking", "Vulnerability Assessment",
    "SIEM", "SOC", "Incident Response", "Threat Intelligence",
    "Identity & Access Management", "Zero Trust", "Encryption",
    "Compliance", "GDPR", "ISO 27001", "SOC 2", "HIPAA",
    // Design & UX
    "UI/UX Design", "User Research", "UX Research", "User Stories",
    "Wireframing", "Prototyping", "Mockups",
    "Figma", "Adobe XD", "Sketch", "InVision",
    "Adobe Photoshop", "Adobe Illustrator", "Adobe After Effects",
    "Graphic Design", "Visual Design", "Interaction Design",
    "Design Thinking", "Design Systems", "Responsive Design",
    "Accessibility", "WCAG", "Usability Testing",
    "Motion Design", "Animation", "Video Editing",
    "Brand Design", "Logo Design", "Typography",
    // Marketing & Sales
    "Digital Marketing", "Content Marketing", "SEO", "SEM",
    "Google Ads", "Facebook Ads", "LinkedIn Ads", "TikTok Marketing",
    "Social Media Marketing", "Social Media Management",
    "Email Marketing", "Marketing Automation", "HubSpot", "Mailchimp",
    "Copywriting", "Content Writing", "Technical Writing", "Blogging",
    "Public Relations", "Media Relations", "Brand Management",
    "Market Research", "Competitive Analysis", "SWOT Analysis",
    "Growth Hacking", "Conversion Optimization", "Funnel Optimization",
    "Influencer Marketing", "Affiliate Marketing", "Partnership Marketing",
    "CRM", "Salesforce", "HubSpot CRM", "Zoho CRM",
    "Sales Strategy", "B2B Sales", "B2C Sales", "Inside Sales",
    "Lead Generation", "Account Management", "Customer Success",
    "Negotiation", "Cold Calling", "Sales Presentations",
    // Finance & Accounting
    "Financial Analysis", "Financial Modeling", "Financial Planning",
    "Budgeting", "Forecasting", "Cash Flow Management",
    "Accounting", "Bookkeeping", "IFRS", "GAAP",
    "Auditing", "Internal Audit", "External Audit",
    "Investment Analysis", "Portfolio Management", "Risk Assessment",
    "Tax Planning", "Tax Compliance", "Corporate Finance",
    "Mergers & Acquisitions", "Due Diligence", "Valuation",
    "Blockchain", "Cryptocurrency", "DeFi", "Smart Contracts",
    // HR & People
    "Human Resources", "Talent Acquisition", "Recruitment",
    "Onboarding", "Employee Engagement", "Employee Relations",
    "Compensation & Benefits", "Payroll", "HRIS",
    "Training & Development", "Learning & Development",
    "Organizational Development", "Culture Building",
    "Diversity & Inclusion", "Employer Branding",
    // System Analysis & ERP
    "System Analysis", "Business Process Reengineering", "BPMN",
    "ERP Systems", "SAP", "Oracle ERP", "Microsoft Dynamics",
    "Digital Transformation", "IT Governance", "ITIL",
    "Enterprise Architecture", "TOGAF", "Solution Architecture",
    // Quality & Testing
    "Quality Assurance", "Quality Control", "Testing",
    "Manual Testing", "Automation Testing", "Selenium",
    "Cypress", "Jest", "Unit Testing", "Integration Testing",
    "Performance Testing", "Load Testing", "JMeter",
    "Documentation", "Technical Documentation", "SOP",
    // Soft Skills
    "Communication", "Leadership", "Problem Solving",
    "Critical Thinking", "Analytical Thinking", "Creative Thinking",
    "Teamwork", "Collaboration", "Cross-functional Collaboration",
    "Presentation Skills", "Public Speaking", "Storytelling",
    "Emotional Intelligence", "Adaptability", "Resilience",
    "Conflict Resolution", "Time Management", "Decision Making",
    "Mentoring", "Coaching", "Team Building",
    // Engineering & Construction
    "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
    "Chemical Engineering", "Industrial Engineering",
    "AutoCAD", "SolidWorks", "CATIA", "Revit", "BIM",
    "Construction Management", "Structural Analysis", "MEP",
    // Healthcare
    "Healthcare Management", "Clinical Research", "Pharmaceutical",
    "Medical Devices", "Health Informatics", "Telemedicine",
    "Patient Care", "Public Health", "Epidemiology",
    // Education
    "Curriculum Development", "Instructional Design", "E-Learning",
    "Teaching", "Tutoring", "Educational Technology",
    // Legal
    "Legal Research", "Contract Law", "Corporate Law",
    "Intellectual Property", "Regulatory Compliance", "Litigation",
    // Languages
    "Arabic", "English", "French", "Spanish", "German",
    "Chinese", "Japanese", "Korean", "Hindi", "Portuguese",
    "Translation", "Interpretation", "Localization",
  ];

  const currentSkills = Array.isArray(form.skills) ? form.skills : [];

  const filteredSuggestions = useMemo(() => {
    if (!newSkill.trim()) return [];
    const query = newSkill.toLowerCase();
    return allSkills
      .filter(s => s.toLowerCase().includes(query) && !currentSkills.includes(s))
      .slice(0, 6);
  }, [newSkill, currentSkills]);

  const selectSuggestion = (skill: string) => {
    const skills = [...currentSkills, skill];
    handleChange("skills", skills);
    setNewSkill("");
    setShowSuggestions(false);
    skillInputRef.current?.focus();
  };

  useEffect(() => {
    if (cardData) {
      setForm({ ...cardData });
    }
  }, [cardData]);

  // Check client expiration
  const { data: clientStatus } = useClientStatus();
  const isClientExpired = clientStatus && (!clientStatus.is_active || new Date(clientStatus.expires_at) < new Date());
  const { data: isAdminUser } = useIsAdmin();

  if (!user) {
    navigate("/login");
    return null;
  }

  if (isClientExpired && !isAdminUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 relative z-10">
        <Clock className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">
          {lang === "ar" ? "انتهت صلاحية حسابك" : "Your subscription has expired"}
        </h1>
        <p className="text-muted-foreground text-center">
          {lang === "ar" ? "يرجى التواصل مع المسؤول لتجديد الاشتراك" : "Please contact your administrator to renew your subscription"}
        </p>
        <button onClick={async () => { await signOut(); navigate("/login"); }} className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
        </button>
      </div>
    );
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(lang === "ar" ? "يرجى رفع صورة (JPG, PNG, WEBP)" : "Please upload an image (JPG, PNG, WEBP)");
      return;
    }
    
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Add cache buster
      const avatarUrl = `${publicUrl}?t=${Date.now()}`;
      handleChange("avatar_url", avatarUrl);
      
      // Auto-save
      if (form.id) {
        await updateCard.mutateAsync({ ...form, avatar_url: avatarUrl, id: form.id } as any);
        toast.success(lang === "ar" ? "تم رفع الصورة بنجاح" : "Photo uploaded successfully");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
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
                {/* Avatar Upload */}
                <div className="md:col-span-2 flex flex-col items-center gap-3 mb-2">
                  <label className={labelClass}>{lang === "ar" ? "الصورة الشخصية" : "Profile Photo"}</label>
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-secondary/30">
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {uploading ? (
                        <Loader2 size={20} className="animate-spin text-primary" />
                      ) : (
                        <Camera size={20} className="text-primary" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <Upload size={12} />
                    {uploading
                      ? (lang === "ar" ? "جاري الرفع..." : "Uploading...")
                      : (lang === "ar" ? "رفع صورة" : "Upload Photo")}
                  </button>
                </div>
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
                <div className="relative mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={skillInputRef}
                      className={inputClass}
                      placeholder={t("add_skill")}
                      value={newSkill}
                      onChange={(e) => { setNewSkill(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (filteredSuggestions.length > 0) {
                            selectSuggestion(filteredSuggestions[0]);
                          } else {
                            addSkill();
                          }
                        }
                      }}
                    />
                    {/* Suggestions dropdown */}
                    <AnimatePresence>
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/20"
                        >
                          {filteredSuggestions.map((skill, i) => (
                            <button
                              key={skill}
                              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(skill); }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-start text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              <Plus size={14} className="shrink-0 text-primary/50" />
                              <span>{skill}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={addSkill} className="icon-btn shrink-0 !p-3">
                    <Plus size={18} className="text-primary" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill: string, i: number) => (
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
