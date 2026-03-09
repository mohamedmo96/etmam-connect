import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Trash2, LogOut, Loader2, Shield, Clock, ToggleLeft, ToggleRight,
  Eye, Copy, Check, Users, Languages,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsAdmin, useClients, useCreateClient, useDeleteClient, useToggleClient, useUpdateClientExpiry } from "@/hooks/useAdmin";
import { toast } from "sonner";

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: clients, isLoading: loadingClients } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();
  const toggleClient = useToggleClient();
  const updateExpiry = useUpdateClientExpiry();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_name: "", email: "", password: "", duration: "1", unit: "day" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!user) { navigate("/login"); return null; }

  if (checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <Shield className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">
          {lang === "ar" ? "غير مصرح" : "Access Denied"}
        </h1>
        <p className="text-muted-foreground">
          {lang === "ar" ? "ليس لديك صلاحية الدخول لهذه الصفحة" : "You don't have permission to access this page"}
        </p>
        <button onClick={() => navigate("/")} className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          {lang === "ar" ? "العودة" : "Go Back"}
        </button>
      </div>
    );
  }

  const calcExpiry = () => {
    const now = new Date();
    const val = parseInt(form.duration) || 1;
    const multipliers: Record<string, number> = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    return new Date(now.getTime() + val * (multipliers[form.unit] || multipliers.day)).toISOString();
  };

  const handleCreate = async () => {
    if (!form.client_name || !form.email || !form.password) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error(lang === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    try {
      await createClient.mutateAsync({
        client_name: form.client_name,
        email: form.email,
        password: form.password,
        expires_at: calcExpiry(),
      });
      toast.success(lang === "ar" ? "تم إنشاء العميل بنجاح" : "Client created successfully");
      setForm({ client_name: "", email: "", password: "", duration: "1", unit: "day" });
      setShowForm(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(lang === "ar" ? `هل أنت متأكد من حذف "${name}"؟` : `Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteClient.mutateAsync(userId);
      toast.success(lang === "ar" ? "تم حذف العميل" : "Client deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const getStatus = (client: any) => {
                    if (!client.is_active) return { label: lang === "ar" ? "معطّل" : "Disabled", color: "text-muted-foreground" };
    if (isExpired(client.expires_at)) return { label: lang === "ar" ? "منتهي" : "Expired", color: "text-destructive" };
    return { label: lang === "ar" ? "نشط" : "Active", color: "text-primary" };
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const inputClass = "w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="relative z-10 min-h-screen px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-8 flex max-w-4xl items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            {lang === "ar" ? "لوحة تحكم الأدمن" : "Admin Panel"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="icon-btn !p-2.5">
            <Languages size={18} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate("/dashboard")} className="icon-btn !p-2.5">
            <Eye size={18} className="text-muted-foreground" />
          </button>
          <button onClick={async () => { await signOut(); navigate("/login"); }} className="icon-btn !p-2.5">
            <LogOut size={18} className="text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mx-auto mb-6 grid max-w-4xl gap-4 sm:grid-cols-3">
        {[
          { label: lang === "ar" ? "إجمالي العملاء" : "Total Clients", value: clients?.length || 0, icon: Users },
          { label: lang === "ar" ? "نشطين" : "Active", value: clients?.filter(c => c.is_active && !isExpired(c.expires_at)).length || 0, icon: Check },
          { label: lang === "ar" ? "منتهيين" : "Expired", value: clients?.filter(c => isExpired(c.expires_at)).length || 0, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-primary/10 p-3"><Icon size={20} className="text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Client Button */}
      <div className="mx-auto mb-6 max-w-4xl">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <UserPlus size={18} />
          {lang === "ar" ? "إضافة عميل جديد" : "Add New Client"}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mb-6 max-w-4xl overflow-hidden"
          >
            <div className="glass-card p-6">
              <h2 className="mb-5 text-lg font-bold text-foreground">
                {lang === "ar" ? "إنشاء عميل جديد" : "Create New Client"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>{lang === "ar" ? "اسم العميل" : "Client Name"}</label>
                  <input className={inputClass} value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} placeholder="Ahmed Ali" />
                </div>
                <div>
                  <label className={labelClass}>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                  <input className={inputClass} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="client@example.com" />
                </div>
                <div>
                  <label className={labelClass}>{lang === "ar" ? "كلمة المرور" : "Password"}</label>
                  <input className={inputClass} type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>{lang === "ar" ? "المدة" : "Duration"}</label>
                    <input className={inputClass} type="number" min="1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === "ar" ? "الوحدة" : "Unit"}</label>
                    <select className={inputClass} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                      <option value="minute">{lang === "ar" ? "دقيقة" : "Minute"}</option>
                      <option value="hour">{lang === "ar" ? "ساعة" : "Hour"}</option>
                      <option value="day">{lang === "ar" ? "يوم" : "Day"}</option>
                      <option value="month">{lang === "ar" ? "شهر" : "Month"}</option>
                      <option value="year">{lang === "ar" ? "سنة" : "Year"}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={createClient.isPending}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {createClient.isPending && <Loader2 size={16} className="animate-spin" />}
                  {lang === "ar" ? "إنشاء" : "Create"}
                </button>
                <button onClick={() => setShowForm(false)} className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/30">
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients List */}
      <div className="mx-auto max-w-4xl">
        {loadingClients ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !clients?.length ? (
          <div className="glass-card flex flex-col items-center py-16 text-center">
            <Users size={48} className="mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              {lang === "ar" ? "لا يوجد عملاء بعد" : "No clients yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => {
              const status = getStatus(client);
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-bold text-foreground truncate">{client.client_name}</h3>
                        <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{lang === "ar" ? "البريد:" : "Email:"}</span>
                          <span className="font-mono text-foreground">{client.client_email}</span>
                          <button onClick={() => handleCopy(client.client_email, `email-${client.id}`)} className="hover:text-primary">
                            {copiedId === `email-${client.id}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{lang === "ar" ? "ينتهي:" : "Expires:"} {formatDate(client.expires_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/card/${client.user_id}`)}
                        className="icon-btn !p-2.5"
                        title={lang === "ar" ? "عرض البطاقة" : "View Card"}
                      >
                        <Eye size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => toggleClient.mutate({ id: client.id, is_active: !client.is_active })}
                        className="icon-btn !p-2.5"
                        title={client.is_active ? (lang === "ar" ? "تعطيل" : "Disable") : (lang === "ar" ? "تفعيل" : "Enable")}
                      >
                        {client.is_active
                          ? <ToggleRight size={16} className="text-green-500" />
                          : <ToggleLeft size={16} className="text-muted-foreground" />}
                      </button>
                      <button
                        onClick={() => handleDelete(client.user_id, client.client_name)}
                        className="icon-btn !p-2.5"
                        title={lang === "ar" ? "حذف" : "Delete"}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
