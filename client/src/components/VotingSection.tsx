import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOTE_TYPES, type VoteType } from "@shared/schema";
import { useVote } from "@/hooks/use-facts";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface VotingSectionProps {
  factId: number;
  initialStats: Record<string, number>;
  totalVotes: number;
}

const BUTTON_CONFIG = [
  {
    type: VOTE_TYPES.OK,
    label: "Ok, well no big deal",
    emoji: "😐",
    color: "from-slate-200 to-slate-300",
    hoverColor: "hover:from-slate-300 hover:to-slate-400",
    textColor: "text-slate-700",
    barColor: "bg-slate-400"
  },
  {
    type: VOTE_TYPES.RADICAL,
    label: "Radical!",
    emoji: "🤘",
    color: "from-blue-400 to-cyan-400",
    hoverColor: "hover:from-blue-500 hover:to-cyan-500",
    textColor: "text-white",
    barColor: "bg-cyan-500"
  },
  {
    type: VOTE_TYPES.HOLY_COW,
    label: "Holy Cow on a Cracker!",
    emoji: "🐮",
    color: "from-orange-400 to-amber-400",
    hoverColor: "hover:from-orange-500 hover:to-amber-500",
    textColor: "text-white",
    barColor: "bg-orange-500"
  },
  {
    type: VOTE_TYPES.BUTTER_BACKSIDE,
    label: "Well, Butter My Backside...",
    emoji: "🧈",
    color: "from-violet-500 to-fuchsia-500",
    hoverColor: "hover:from-violet-600 hover:to-fuchsia-600",
    textColor: "text-white",
    barColor: "bg-fuchsia-500"
  },
];

export function VotingSection({ factId, initialStats, totalVotes }: VotingSectionProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [localStats, setLocalStats] = useState(initialStats);
  const [localTotal, setLocalTotal] = useState(totalVotes);
  
  const voteMutation = useVote();

  // Check local storage on mount
  useEffect(() => {
    const votedFactId = localStorage.getItem("daily_fact_voted_id");
    if (votedFactId === String(factId)) {
      setHasVoted(true);
    }
  }, [factId]);

  // Update local stats when props change (from other users)
  useEffect(() => {
    if (!voteMutation.isPending) {
      setLocalStats(initialStats);
      setLocalTotal(totalVotes);
    }
  }, [initialStats, totalVotes]);

  const handleVote = (type: VoteType) => {
    if (hasVoted) return;

    // Optimistic update
    setHasVoted(true);
    setLocalStats(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    setLocalTotal(prev => prev + 1);
    
    // Save to local storage
    localStorage.setItem("daily_fact_voted_id", String(factId));

    // Fire confetti for high excitement votes
    if (type === VOTE_TYPES.RADICAL || type === VOTE_TYPES.HOLY_COW || type === VOTE_TYPES.BUTTER_BACKSIDE) {
      const scalar = type === VOTE_TYPES.BUTTER_BACKSIDE ? 1.2 : 0.8;
      confetti({
        particleCount: 100 * scalar,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FF69B4', '#00BFFF']
      });
    }

    voteMutation.mutate({ factId, voteType: type });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-20 px-4">
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key="voting-buttons"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {BUTTON_CONFIG.map((btn, idx) => (
              <motion.button
                key={btn.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleVote(btn.type as VoteType)}
                className={cn(
                  "relative group overflow-hidden p-6 rounded-2xl shadow-lg border-2 border-transparent transition-all duration-200",
                  "bg-gradient-to-br text-left flex flex-col items-start justify-between min-h-[140px]",
                  btn.color,
                  btn.hoverColor
                )}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-125 duration-500">
                  <span className="text-6xl">{btn.emoji}</span>
                </div>
                <span className={cn("text-4xl mb-3 block shadow-sm", btn.textColor)}>
                  {btn.emoji}
                </span>
                <span className={cn("font-heading font-bold text-lg leading-tight relative z-10", btn.textColor)}>
                  {btn.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
          >
            <h3 className="text-2xl font-heading font-bold text-center mb-8 text-foreground">
              What Others Think
            </h3>
            
            <div className="space-y-6">
              {BUTTON_CONFIG.map((btn) => {
                const count = localStats[btn.type] || 0;
                const percentage = localTotal > 0 ? Math.round((count / localTotal) * 100) : 0;
                
                return (
                  <div key={btn.type} className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{btn.emoji}</span>
                        <span className="font-bold text-sm text-foreground/80">{btn.label}</span>
                      </div>
                      <span className="font-heading font-bold text-xl text-primary">{percentage}%</span>
                    </div>
                    
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className={cn("h-full rounded-full shadow-sm", btn.barColor)}
                      />
                    </div>
                    <div className="text-xs text-right mt-1 text-muted-foreground font-medium">
                      {count} {count === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground font-medium">
                Total votes: <span className="text-primary font-bold">{localTotal}</span>
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                Come back tomorrow for a new fact!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
