import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import BusinessCard from "./BusinessCard";
import { useEffect } from "react";
const WEBSITE = 1;
const LINKEDIN = 2;
const WHATSAPP = 3;

const getSocialUrl = (links: any[] = [], platform: number) => {
  const item = links.find((x) => Number(x.platform) === platform);
  return item?.url || "";
};

const mapPublicProfileToCardData = (profile: any) => {
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
    public_profile_url: profile.publicProfileUrl || "",
    qr_code_value: profile.qrCodeValue || profile.publicProfileUrl || "",
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
          description_en: x.DescriptionEn || "",
          description_ar: x.DescriptionAr || "",
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
  };
};

const ClientCard = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: cardData, isLoading, isError } = useQuery({
    queryKey: ["public-profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await api.get(`/Auth/public-profile/${userId}`);
      return mapPublicProfileToCardData(response.data.data);
    },
  });

  useEffect(() => {
  if (!cardData) return;

  document.title = "MyCard";

  let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (!appleTitleMeta) {
    appleTitleMeta = document.createElement("meta");
    appleTitleMeta.setAttribute("name", "apple-mobile-web-app-title");
    document.head.appendChild(appleTitleMeta);
  }
  appleTitleMeta.setAttribute("content", "MyCard");

  let themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) {
    themeMeta = document.createElement("meta");
    themeMeta.setAttribute("name", "theme-color");
    document.head.appendChild(themeMeta);
  }
  themeMeta.setAttribute("content", "#081225");

  let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (!appleTouchIcon) {
    appleTouchIcon = document.createElement("link");
    appleTouchIcon.setAttribute("rel", "apple-touch-icon");
    document.head.appendChild(appleTouchIcon);
  }
  appleTouchIcon.setAttribute("href", "/icons/mycard-180.png");
}, [cardData]);
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !cardData) {
    return (
      <div className="flex min-h-screen items-center justify-center text-foreground">
        Profile not found
      </div>
    );
  }

  return (
    <>
      <BusinessCard overrideData={cardData} />
    </>
  );
};

export default ClientCard;