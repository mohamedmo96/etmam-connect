import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Lang, string>> = {
  // Card front
  save_contact: { en: "Save Contact", ar: "حفظ جهة الاتصال" },
  scan_linkedin: { en: "Scan to connect on LinkedIn", ar: "امسح للتواصل عبر لينكدإن" },
  call: { en: "Call", ar: "اتصال" },
  location: { en: "Location", ar: "الموقع" },
  // Card back
  about_me: { en: "About Me", ar: "نبذة عني" },
  skills: { en: "Skills", ar: "المهارات" },
  experience: { en: "Experience", ar: "الخبرات" },
  education: { en: "Education", ar: "التعليم" },
  // Login
  admin_login: { en: "Admin Login", ar: "تسجيل دخول المدير" },
  sign_in_subtitle: { en: "Sign in to access the dashboard", ar: "سجل دخولك للوصول إلى لوحة التحكم" },
  sign_in: { en: "Sign In", ar: "تسجيل الدخول" },
  back_to_card: { en: "Back to Card", ar: "العودة للكارت" },
  need_account: { en: "Need an account?", ar: "ليس لديك حساب؟" },
  sign_up: { en: "Sign up", ar: "إنشاء حساب" },
  // Dashboard
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  basic_info: { en: "Basic Info", ar: "المعلومات الأساسية" },
  contact_info: { en: "Contact Info", ar: "معلومات التواصل" },
  social_links: { en: "Social Links", ar: "روابط التواصل" },
  save_changes: { en: "Save Changes", ar: "حفظ التغييرات" },
  saving: { en: "Saving...", ar: "جاري الحفظ..." },
  saved: { en: "Saved successfully!", ar: "تم الحفظ بنجاح!" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  name: { en: "Name", ar: "الاسم" },
  title: { en: "Title", ar: "المسمى الوظيفي" },
  company: { en: "Company", ar: "الشركة" },
  about: { en: "About", ar: "نبذة" },
  phone: { en: "Phone", ar: "الهاتف" },
  email: { en: "Email", ar: "البريد" },
  website: { en: "Website", ar: "الموقع" },
  linkedin: { en: "LinkedIn", ar: "لينكدإن" },
  whatsapp: { en: "WhatsApp", ar: "واتساب" },
  english: { en: "English", ar: "إنجليزي" },
  arabic: { en: "Arabic", ar: "عربي" },
  view_card: { en: "View Card", ar: "عرض الكارت" },
  add_skill: { en: "Add Skill", ar: "إضافة مهارة" },
  remove: { en: "Remove", ar: "حذف" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string) => translations[key]?.[lang] || key;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
};
