import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const WEBSITE = 1;
const LINKEDIN = 2;
const WHATSAPP = 3;

const getSocialUrl = (links: any[] = [], platform: number) => {
  const item = links.find((x) => Number(x.platform) === platform);
  return item?.url || "";
};

const mapApiProfileToForm = (profile: any) => {
  if (!profile) return null;

  return {
    id: profile.profileId,
    user_id: profile.userId,

    name_en: profile.nameEn || "",
    name_ar: profile.nameAr || "",

    title_en: profile.titleEn || "",
    title_ar: profile.titleAr || "",

    company_en: profile.companyEn || "",
    company_ar: profile.companyAr || "",

    about_en: profile.aboutEn || "",
    about_ar: profile.aboutAr || "",

    phone: profile.contactPhone || "",
    email: profile.contactEmail || "",

    location_en: profile.locationEn || "",
    location_ar: profile.locationAr || "",

    avatar_url: profile.avatarUrl || "",
    cv_url: profile.cvUrl || "",

    website_url: getSocialUrl(profile.socialLinks, WEBSITE),
    linkedin_url: getSocialUrl(profile.socialLinks, LINKEDIN),
    whatsapp_url: getSocialUrl(profile.socialLinks, WHATSAPP),

    skills: Array.isArray(profile.skills)
      ? profile.skills.map((x: any) => x.nameEn || x.nameAr || "")
      : [],

    experience: Array.isArray(profile.experiences)
      ? profile.experiences.map((x: any) => ({
          title_en: x.titleEn || "",
          title_ar: x.titleAr || "",
          company_en: x.companyEn || "",
          company_ar: x.companyAr || "",
          description_en: x.descriptionEn || "",
          description_ar: x.descriptionAr || "",
          start_date: x.startDate || null,
          end_date: x.endDate || null,
          is_current: x.isCurrent || false,
          display_order: x.displayOrder || 0,
        }))
      : [],

    education: Array.isArray(profile.educations)
      ? profile.educations.map((x: any) => ({
          degree_en: x.degreeEn || "",
          degree_ar: x.degreeAr || "",
          field_en: x.fieldEn || "",
          field_ar: x.fieldAr || "",
          institution_en: x.institutionEn || "",
          institution_ar: x.institutionAr || "",
          start_date: x.startDate || null,
          end_date: x.endDate || null,
          display_order: x.displayOrder || 0,
        }))
      : [],

    is_public: profile.isPublic ?? true,

    is_subscription_active: profile.isSubscriptionActive ?? false,
    subscription_end_date: profile.subscriptionEndDate || null,
  };
};

const mapFormToApiPayload = (form: Record<string, any>) => {
  const socialLinks = [];

  if (form.website_url?.trim()) {
    socialLinks.push({
      platform: WEBSITE,
      url: form.website_url.trim(),
      displayOrder: 1,
      isVisible: true,
    });
  }

  if (form.linkedin_url?.trim()) {
    socialLinks.push({
      platform: LINKEDIN,
      url: form.linkedin_url.trim(),
      displayOrder: 2,
      isVisible: true,
    });
  }

  if (form.whatsapp_url?.trim()) {
    socialLinks.push({
      platform: WHATSAPP,
      url: form.whatsapp_url.trim(),
      displayOrder: 3,
      isVisible: true,
    });
  }

  return {
    nameEn: form.name_en || "",
    nameAr: form.name_ar || "",

    titleEn: form.title_en || "",
    titleAr: form.title_ar || "",

    companyEn: form.company_en || "",
    companyAr: form.company_ar || "",

    aboutEn: form.about_en || "",
    aboutAr: form.about_ar || "",

    contactPhone: form.phone || "",
    contactEmail: form.email || "",

    locationEn: form.location_en || "",
    locationAr: form.location_ar || "",

    avatarUrl: form.avatar_url || "",
    cvUrl: form.cv_url || "",

    isPublic: form.is_public ?? true,

    skills: Array.isArray(form.skills)
      ? form.skills
          .filter((x: string) => x?.trim())
          .map((x: string, index: number) => ({
            nameEn: x.trim(),
            nameAr: x.trim(),
            displayOrder: index + 1,
          }))
      : [],

    socialLinks,

    experiences: Array.isArray(form.experience)
      ? form.experience.map((x: any, index: number) => ({
          titleEn: x.title_en || "",
          titleAr: x.title_ar || "",
          companyEn: x.company_en || "",
          companyAr: x.company_ar || "",
          descriptionEn: x.description_en || "",
          descriptionAr: x.description_ar || "",
          startDate: x.start_date || null,
          endDate: x.end_date || null,
          isCurrent: x.is_current || false,
          displayOrder: x.display_order ?? index + 1,
        }))
      : [],

    educations: Array.isArray(form.education)
      ? form.education.map((x: any, index: number) => ({
          degreeEn: x.degree_en || "",
          degreeAr: x.degree_ar || "",
          fieldEn: x.field_en || "",
          fieldAr: x.field_ar || "",
          institutionEn: x.institution_en || "",
          institutionAr: x.institution_ar || "",
          startDate: x.start_date || null,
          endDate: x.end_date || null,
          displayOrder: x.display_order ?? index + 1,
        }))
      : [],
  };
};

export const useCardData = (enabled = true) => {
  return useQuery({
    queryKey: ["card-data"],
    enabled,
    queryFn: async () => {
      const response = await api.get("/Auth/my-profile");
      return mapApiProfileToForm(response.data.data);
    },
  });
};

export const useUpdateCardData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: Record<string, any>) => {
      const payload = mapFormToApiPayload(form);
      const response = await api.post("/Auth/complete-profile", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card-data"] });
    },
  });
};