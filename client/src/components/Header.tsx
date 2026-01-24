import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export function Header() {
  return (
    <header className="py-8 md:py-12 flex flex-col items-center justify-center text-center px-4">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6 rotate-3"
      >
        <Lightbulb className="w-8 h-8 text-white" strokeWidth={2.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 mb-2 pb-2">
          Fun Fact of the Day
        </h1>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          One daily dose of curiosity to brighten your brain.
        </p>
      </motion.div>
    </header>
  );
}
