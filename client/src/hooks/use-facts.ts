import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertVote } from "@shared/routes";

// GET /api/facts/today
export function useDailyFact() {
  return useQuery({
    queryKey: [api.facts.today.path],
    queryFn: async () => {
      const res = await fetch(api.facts.today.path);
      if (res.status === 404) return null; // Handle 404 gracefully
      if (!res.ok) throw new Error("Failed to fetch daily fact");
      return api.facts.today.responses[200].parse(await res.json());
    },
  });
}

// POST /api/votes
export function useVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vote: InsertVote) => {
      const res = await fetch(api.votes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vote),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.votes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit vote");
      }
      
      return api.votes.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Optimistically update the fact stats
      queryClient.setQueryData([api.facts.today.path], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          stats: data.stats,
          totalVotes: data.totalVotes,
        };
      });
    },
  });
}
