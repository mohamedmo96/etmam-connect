import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await api.get("/Auth/clients");
      return response.data.data;
    },
  });
};