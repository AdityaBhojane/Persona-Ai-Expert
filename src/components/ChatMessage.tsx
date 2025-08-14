import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Expert } from "./ExpertToggle";
import hiteshAvatar from "@/assets/hitesh.png";
import piyushAvatar from "@/assets/piyush.png";
import { motion, AnimatePresence } from "framer-motion";
import { TypingAnimation } from "./ui/typing-animations";
import { useState, useEffect } from "react";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  expert?: Expert;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  showTypingAnimation?: boolean;
}

export function ChatMessage({ message, isTyping = false, showTypingAnimation = false }: ChatMessageProps) {
  const [showContent, setShowContent] = useState(!showTypingAnimation);
  const isUser = message.sender === "user";


  const expertAvatars = {
    hitesh: hiteshAvatar,
    piyush: piyushAvatar
  };

  const expertColors = {
    hitesh: "from-hitesh to-hitesh-glow",
    piyush: "from-piyush to-piyush-glow"
  };

  const expertNames = {
    hitesh: "Hitesh Choudhary",
    piyush: "Piyush Garg"
  };

  // Show content after avatar animation for bot messages
  useEffect(() => {
    if (!isUser && showTypingAnimation) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isUser, showTypingAnimation]);

  return (
    <motion.div
      className={cn(
        "flex gap-3 max-w-[80%] w-fit",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      layout
    >
      {/* Avatar with enhanced animations */}
      <motion.div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 shadow-lg relative",
          isUser 
            ? "border-chat-user bg-gradient-to-br from-chat-user to-primary-glow" 
            : message.expert 
              ? `border-${message.expert} bg-gradient-to-br ${expertColors[message.expert!]}`
              : "border-muted bg-muted"
        )}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1,
          ease: [0.68, -0.55, 0.265, 1.55] 
        }}
        whileHover={{ scale: 1.1 }}
      >
        {isUser ? (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <User className="w-5 h-5 text-chat-user-foreground" />
            </motion.div>
          </div>
        ) : message.expert ? (
          <>
            <motion.img 
              src={expertAvatars[message.expert]} 
              alt={expertNames[message.expert]}
              className="w-full h-full object-cover"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            {/* Expert indicator pulse */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Bot className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Message Bubble with enhanced animations */}
      <motion.div
        className={cn(
          "px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden",
          isUser 
            ? "bg-gradient-to-br from-chat-user to-primary-glow text-chat-user-foreground rounded-br-md border border-primary/20" 
            : "bg-chat-bot/90 text-chat-bot-foreground rounded-bl-md border border-border/50"
        )}
        initial={{ opacity: 0, scale: 0.8, x: isUser ? 20 : -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ 
          duration: 0.4,
          delay: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {/* Gradient overlay for user messages */}
        {isUser && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5,
              delay: 0.5,
              ease: "easeInOut"
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {isTyping ? (
            <motion.div
              key="typing"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-current rounded-full opacity-60"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4] 
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              <motion.span 
                className="text-xs opacity-70 ml-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {message.expert ? `${expertNames[message.expert]} is typing...` : "typing..."}
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {showTypingAnimation && !isUser && showContent ? (
                <TypingAnimation
                  text={message.content}
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  duration={0.03}
                  delay={0}
                />
              ) : (
                <motion.p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  initial={showTypingAnimation && !isUser ? { opacity: 0 } : {}}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.content}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}