// src/hooks/useMyProfile.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await api.get("/Auth/my-profile");
      return response.data.data;
    },
  });
};