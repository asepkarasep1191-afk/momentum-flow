import { useQuery } from "@tanstack/react-query";
import { estimatedSecurity, fetchTokenSecurity } from "@/lib/security";
import type { TokenRow } from "@/lib/types";

export function useSecurity(token: TokenRow | null) {
  return useQuery({
    queryKey: ["security", token?.id],
    enabled: Boolean(token) && token?.source === "dex" && Boolean(token?.ca),
    initialData: token?.security,
    queryFn: async () => {
      if (!token) throw new Error("No token");
      if (token.security?.source === "goplus") return token.security;
      try {
        return await fetchTokenSecurity({
          data: { chain: token.chain, address: token.ca },
        });
      } catch {
        const sells = token.buys24h + token.sells24h;
        const sellShare = sells > 0 ? Math.min((token.sells24h / sells) * 100, 40) : 15;
        return estimatedSecurity(token.liquidity, sellShare);
      }
    },
    staleTime: 120_000,
  });
}
