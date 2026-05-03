import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3 w-full", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-8 w-8 shrink-0 rounded-md grid place-items-center",
          isUser ? "bg-muted text-foreground" : "bg-gradient-primary text-primary-foreground shadow-glow",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card text-card-foreground border border-border rounded-tl-sm",
        )}
      >
        <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-background/60 prose-pre:border prose-pre:border-border prose-code:text-primary-glow prose-headings:text-foreground prose-strong:text-foreground">
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 shrink-0 rounded-md grid place-items-center bg-gradient-primary text-primary-foreground shadow-glow">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
      </div>
    </div>
  );
}
