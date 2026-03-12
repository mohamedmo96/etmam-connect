import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useClients = () => {
  return useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const response = await api.get("/Auth/clients");
      return response.data.data;
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      clientName: string;
      email: string;
      password: string;
      duration: number;
      unit: number;
    }) => {
      const response = await api.post("/Auth/create-client", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/Auth/delete-client/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });
};

export const useToggleClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const response = await api.put("/Auth/toggle-client", {
        userId: id,
        isActive: is_active,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });
};

export const useUpdateClientExpiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, expires_at }: { id: string; expires_at: string }) => {
      const response = await api.put("/Auth/update-client-expiry", {
        userId: id,
        expiresAt: expires_at,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });
};