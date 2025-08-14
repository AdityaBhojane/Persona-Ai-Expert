import { useState, useRef, useEffect } from "react";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { ExpertToggle, Expert } from "./ExpertToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { socket } from "@/Api/socket";



export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentExpert, setCurrentExpert] = useState<Expert>("hitesh");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    socket.emit('client-message', {text:content, expert:currentExpert});
    socket.on("server-response", (msg) => {
      console.log(msg);
    });
    setMessages(prev => [...prev, { id: Date.now().toString(), content, sender: "user", timestamp: new Date() }]);
    setIsTyping(true);
  };

  useEffect(() => {
    socket.on("server-response", (msg) => {
      setIsTyping(false);
      console.log(msg)
      setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), content: msg.text, expert:msg.expert, sender: "bot", timestamp: new Date() }]);
    });
  }, []);

  const handleExpertChange = (expert: Expert) => {
    const previousExpert = currentExpert;
    setCurrentExpert(expert);

    if (previousExpert !== expert) {
      toast({
        title: "Expert switched!",
        description: `Now chatting with ${expert === 'hitesh' ? 'Hitesh Choudhary' : 'Piyush Garg'}`,
        duration: 2000,
      });

      // Add a system message about the switch
      const switchMessage: Message = {
        id: Date.now().toString(),
        content: `You're now chatting with ${expert === 'hitesh' ? 'Hitesh Choudhary' : 'Piyush Garg'}! 👋`,
        sender: "bot",
        expert: expert,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, switchMessage]);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <ChatHeader currentExpert={currentExpert} />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Expert Toggle */}
        <div className="p-4">
          <ExpertToggle
            currentExpert={currentExpert}
            onExpertChange={handleExpertChange}
          />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-4">
          <ScrollArea ref={scrollAreaRef} className="h-full overflow-hidden">
            <div className="space-y-4 pb-4 overflow-hidden">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow mb-4 animate-bounce-in">
                    <span className="text-2xl">👋</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Welcome to Expert Chat!
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Start a conversation with {currentExpert === 'hitesh' ? 'Hitesh Choudhary' : 'Piyush Garg'}.
                    Ask anything about web development, programming, or technology!
                  </p>
                </div>
              )}

              {messages.map((message, index) => {
                const isUser = message.sender === "user";
                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    showTypingAnimation={!isUser && index === messages.length - 1}
                  />
                );
              })}

              {isTyping && (
                <ChatMessage
                  message={{
                    id: "typing",
                    content: "",
                    sender: "bot",
                    expert: currentExpert,
                    timestamp: new Date()
                  }}
                  isTyping={true}
                />
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Input */}
        <div className="p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            placeholder={`Ask ${currentExpert === 'hitesh' ? 'Hitesh' : 'Piyush'} anything...`}
          />
        </div>
      </div>
    </div>
  );
}