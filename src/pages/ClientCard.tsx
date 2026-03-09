import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import BusinessCard from "./BusinessCard";

const ClientCard = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: cardData, isLoading } = useQuery({
    queryKey: ["card_data", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("card_data")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <BusinessCard overrideData={cardData} />;
};

export default ClientCard;
