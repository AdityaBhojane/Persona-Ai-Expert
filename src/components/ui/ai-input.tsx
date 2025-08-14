import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip, Smile } from "lucide-react";

interface AiInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function AiInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Ask anything...", 
  className 
}: AiInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <motion.div
      className={cn("relative w-full", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-end gap-2 p-3 rounded-2xl transition-all duration-300",
          "bg-background/80 backdrop-blur-sm shadow-lg",
          isFocused 
            ? "border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.2)]" 
            : "border-border/50 hover:border-border"
        )}
        layout
      >

        {/* Text Input */}
        <div className="flex-1 relative ">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full min-h-[20px] max-h-[120px] px-2 py-2 bg-transparent",
              "border-none outline-none resize-none text-sm",
              "placeholder:text-muted-foreground ",
              "disabled:opacity-100 disabled:cursor-not-allowed"
            )}
            rows={1}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 pb-2">

          <motion.button
            type="submit"
            disabled={!message.trim() || disabled}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              message.trim() && !disabled
                ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground"
            )}
            whileHover={message.trim() && !disabled ? { scale: 1.05 } : {}}
            whileTap={message.trim() && !disabled ? { scale: 0.95 } : {}}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}