import { useDailyFact } from "@/hooks/use-facts";
import { Header } from "@/components/Header";
import { FactCard } from "@/components/FactCard";
import { VotingSection } from "@/components/VotingSection";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: fact, isLoading, isError, refetch } = useDailyFact();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-heading text-xl text-muted-foreground animate-pulse">
          Digging up something cool...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="bg-destructive/10 p-6 rounded-3xl mb-6">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Brain Freeze.</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't fetch today's fact. It might be too mind-blowing for the internet to handle right now.
        </p>
        <Button onClick={() => refetch()} variant="default" size="lg" className="rounded-xl font-bold">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Fallback for empty state or null response
  if (!fact) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">No Fact Found</h2>
        <p className="text-muted-foreground">
          Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden selection:bg-primary/20">
      <div className="container mx-auto max-w-4xl px-4">
        <Header />
        
        <main className="space-y-12">
          <FactCard 
            content={fact.content} 
            category={fact.category}
            imageUrl={fact.imageUrl}
            source={fact.source}
          />

          <div className="relative">
            {/* Decorative elements behind voting section */}
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-yellow-300 rounded-full blur-3xl opacity-20 -z-10 animate-pulse" />
            <div className="absolute top-1/3 right-0 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-20 -z-10 animate-pulse delay-700" />
            
            <VotingSection 
              factId={fact.id} 
              initialStats={fact.stats} 
              totalVotes={fact.totalVotes}
            />
          </div>
        </main>

        <footer className="text-center text-sm text-muted-foreground/40 mt-20 font-heading">
          © {new Date().getFullYear()} Fun Fact of the Day. Stay curious!
        </footer>
      </div>
    </div>
  );
}
