import { GithubIcon, Linkedin, MessageCircle, Sparkles, Twitter } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Expert } from "./ExpertToggle";
import { socket } from "@/Api/socket";

interface ChatHeaderProps {
  currentExpert: Expert;
}

export function ChatHeader({ currentExpert }: ChatHeaderProps) {
  const expertNames = {
    hitesh: "Hitesh Choudhary",
    piyush: "Piyush Garg"
  };

  const expertGradients = {
    hitesh: "from-hitesh to-hitesh-glow",
    piyush: "from-piyush to-piyush-glow"
  };

  return (
    <header className="flex items-center justify-between p-6 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-gradient-to-r ${expertGradients[currentExpert]} shadow-lg`}>
          <MessageCircle onClick={()=>{
              socket.emit('client-message', "hello");
              console.log('on')
            }} className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Chat with {expertNames[currentExpert]}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-powered tech expert
          </p>
        </div>
        <div className="flex gap-4 ml-5">
          <a target="_blank" href="https://x.com/Bhojane_Adi"><Twitter /></a>
          <a target="_blank" href="https://www.linkedin.com/in/aditya-bhojane-2b0412257/"><Linkedin /></a>   
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}