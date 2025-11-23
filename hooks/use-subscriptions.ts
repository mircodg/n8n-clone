import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data, isLoading, ...rest } = useSubscriptions();
  const hasActiveSubscription =
    data?.activeSubscriptions && data.activeSubscriptions.length > 0;
  return { hasActiveSubscription, isLoading, ...rest };
};
