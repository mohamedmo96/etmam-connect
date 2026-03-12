import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const usePublicProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async () => {
      const response = await api.get(`/Auth/public-profile/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
};