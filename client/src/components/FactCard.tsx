import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FactCardProps {
  content: string;
  category: string;
  imageUrl: string | null;
  source: string | null;
}

export function FactCard({ content, category, imageUrl, source }: FactCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl border border-border/40"
    >
      {imageUrl && (
        <div className="relative h-64 md:h-80 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={imageUrl} 
            alt="Fact illustration" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-6 z-20">
             <Badge className="bg-white/90 text-primary hover:bg-white text-xs font-bold shadow-md backdrop-blur-sm px-3 py-1">
               {category.toUpperCase()}
             </Badge>
          </div>
        </div>
      )}

      <div className="p-8 md:p-10 relative">
        {!imageUrl && (
           <div className="absolute top-8 right-8 text-primary/10">
             <Sparkles size={120} strokeWidth={1} />
           </div>
        )}
        
        {!imageUrl && (
          <Badge variant="outline" className="mb-6 border-primary/20 text-primary font-bold tracking-wider">
            {category.toUpperCase()}
          </Badge>
        )}

        <h2 className="relative z-10 text-2xl md:text-4xl font-heading font-bold text-foreground leading-tight">
          {content}
        </h2>

        {source && (
          <div className="mt-6 flex items-center text-sm text-muted-foreground font-medium">
            <Info className="w-4 h-4 mr-2 text-primary/60" />
            <span className="truncate max-w-[200px] md:max-w-md">Source: {source}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
