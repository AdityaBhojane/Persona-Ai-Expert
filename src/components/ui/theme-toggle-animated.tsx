import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleAnimatedProps {
  variant?: "gif" | "circle-blur";
  start?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  className?: string;
}

export function ThemeToggleAnimated({
  variant = "circle-blur",
  start = "center",
  className
}: ThemeToggleAnimatedProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const getStartPosition = () => {
    switch (start) {
      case "top-left": return { x: "0%", y: "0%" };
      case "top-right": return { x: "100%", y: "0%" };
      case "bottom-left": return { x: "0%", y: "100%" };
      case "bottom-right": return { x: "100%", y: "100%" };
      default: return { x: "50%", y: "50%" };
    }
  };

  const toggleTheme = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = theme === "light" ? "dark" : "light";
    
    if (variant === "circle-blur") {
      // Create overlay element for animation
      const overlay = document.createElement("div");
      const { x, y } = getStartPosition();
      
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: ${newTheme === "dark" ? "#0a0a0a" : "#ffffff"};
        border-radius: 50%;
        transform: translate(${x}, ${y}) translate(-50%, -50%) scale(0);
        transform-origin: center;
        z-index: 9999;
        pointer-events: none;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      
      document.body.appendChild(overlay);
      
      // Trigger animation
      requestAnimationFrame(() => {
        overlay.style.transform = `translate(${x}, ${y}) translate(-50%, -50%) scale(3)`;
      });
      
      // Change theme mid-animation
      setTimeout(() => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }, 300);
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(overlay);
        setIsAnimating(false);
      }, 600);
    } else {
      // Simple gif-like animation
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      disabled={isAnimating}
      className={cn(
        "relative p-3 rounded-full border border-border bg-background/80 backdrop-blur-sm",
        "hover:bg-accent transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-lg hover:shadow-xl",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isAnimating ? { rotate: 360 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Sun className={cn(
          "absolute w-5 h-5 transition-all duration-300",
          theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        )} />
        <Moon className={cn(
          "absolute w-5 h-5 transition-all duration-300",
          theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        )} />
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}