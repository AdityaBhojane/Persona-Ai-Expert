import { AiInput } from "./ui/ai-input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Type your message..." }: ChatInputProps) {
  return (
    <AiInput
      onSendMessage={onSendMessage}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full border border-[#ccc] rounded-2xl shadow-lg shadow-blue-300/50"
    />
  );
}
