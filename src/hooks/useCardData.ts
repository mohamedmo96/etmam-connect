import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type CardData = Tables<"card_data">;

export const useCardData = () => {
  return useQuery({
    queryKey: ["card_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("card_data")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateCardData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"card_data"> & { id: string }) => {
      const { data, error } = await supabase
        .from("card_data")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card_data"] });
    },
  });
};
