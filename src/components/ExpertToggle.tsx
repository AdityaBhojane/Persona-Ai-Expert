import { cn } from "@/lib/utils";
import hiteshAvatar from "@/assets/hitesh.png";
import piyushAvatar from "@/assets/piyush.png";
import { motion, AnimatePresence } from "framer-motion";
import { TypewriterEffect } from "./ui/typing-animations";

export type Expert = "hitesh" | "piyush";

interface ExpertToggleProps {
  currentExpert: Expert;
  onExpertChange: (expert: Expert) => void;
}

export function ExpertToggle({ currentExpert, onExpertChange }: ExpertToggleProps) {
  const experts = {
    hitesh: {
      name: "Hitesh Choudhary",
      title: "Web Development Expert",
      avatar: hiteshAvatar,
      gradient: "bg-gradient-to-r from-hitesh to-hitesh-glow",
      textColor: "text-hitesh-foreground"
    },
    piyush: {
      name: "Piyush Garg",
      title: "JavaScript & React Expert", 
      avatar: piyushAvatar,
      gradient: "bg-gradient-to-r from-piyush to-piyush-glow",
      textColor: "text-piyush-foreground"
    }
  };

  const expertTitles = {
    hitesh: ["Web Development Expert", "Full Stack Guru", "React Specialist"],
    piyush: ["JavaScript Expert", "React Native Pro", "Node.js Master"]
  };

  return (
    <motion.div 
      className="flex items-center gap-4 p-4 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {Object.entries(experts).map(([key, expert]) => {
        const isActive = currentExpert === key;
        return (
          <motion.button
            key={key}
            onClick={() => onExpertChange(key as Expert)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 relative overflow-hidden",
              "hover:scale-105 hover:shadow-lg"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            {/* Background with smooth transition */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-lg",
                isActive 
                  ? expert.gradient 
                  : "bg-muted hover:bg-accent"
              )}
              initial={false}
              animate={isActive ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Glow effect for active expert */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-lg opacity-50",
                    expert.gradient
                  )}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    opacity: [0, 0.3, 0] 
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              {/* Avatar */}
              <motion.div 
                className={cn(
                  "relative overflow-hidden rounded-full border-2 transition-all duration-300",
                  isActive ? "border-white/30 shadow-lg" : "border-border"
                )}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img 
                  src={expert.avatar} 
                  alt={expert.name}
                  className="w-12 h-12 object-cover"
                  initial={{ scale: 1.2, rotate: 0 }}
                  animate={{ 
                    scale: isActive ? 1 : 1,
                    rotate: isActive ? [0, 5, -5, 0] : 0 
                  }}
                  transition={{ 
                    scale: { duration: 0.3 },
                    rotate: { duration: 2, repeat: isActive ? Infinity : 0 }
                  }}
                />
                
                {/* Online indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: isActive ? 1 : 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-green-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Text content */}
              <div className="text-left">
                <motion.div 
                  className={cn(
                    "font-semibold text-sm transition-colors",
                    isActive ? expert.textColor : "text-foreground"
                  )}
                  layout
                >
                  {expert.name}
                </motion.div>
                <motion.div 
                  className={cn(
                    "text-xs transition-colors overflow-hidden",
                    isActive ? "text-white/80" : "text-muted-foreground"
                  )}
                  layout
                >
                  {isActive ? (
                    <TypewriterEffect
                      words={expertTitles[key as Expert]}
                      className="text-xs"
                      cursorClassName="text-white/60"
                      speed={80}
                      pauseDuration={2000}
                    />
                  ) : (
                    expert.title
                  )}
                </motion.div>
              </div>
            </div>

            {/* Ripple effect on click */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={isActive ? { 
                scale: [0, 1.2, 0],
                opacity: [0, 0.3, 0] 
              } : {}}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
}