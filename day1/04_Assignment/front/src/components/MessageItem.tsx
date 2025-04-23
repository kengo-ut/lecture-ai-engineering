// components/MessageItem.tsx
import { Message } from "@/gen/schema";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn("flex items-start gap-3", {
        "justify-end": isUser,
      })}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-destructive text-white">A</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn("rounded-lg p-3 max-w-[80%]", {
          "bg-secondary": isUser,
          "bg-muted": !isUser && !isAssistant,
          "bg-destructive text-white": isAssistant,
        })}
      >
        {isUser ? (
          <div>{message.content}</div>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
