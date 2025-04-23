// components/ChatInterface.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Menu, Send } from "lucide-react";
import MessageItem from "@/components/MessageItem";
import {
  generateResponseApiChatResponsePost,
  retrieveMessagesApiChatSessionSessionIdGet,
  saveMessagesApiChatSessionSessionIdMessagesPost,
} from "@/gen/chat/chat";
import { Message } from "@/gen/schema";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";

interface ChatInterfaceProps {
  sessionId: string;
  title: string;
  toggleSidebar: () => void;
}

export default function ChatInterface({ sessionId, title, toggleSidebar }: ChatInterfaceProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const lastElementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // セッションのメッセージを取得
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await retrieveMessagesApiChatSessionSessionIdGet(sessionId);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch session messages:", error);
      }
    };

    if (sessionId) {
      fetchMessages();
    }
  }, [sessionId]);

  // フォーム送信後inputにフォーカスする
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  // 新しいメッセージが追加されたときに自動スクロール
  useEffect(() => {
    lastElementRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage: Message = {
      message_id: uuidv4(),
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };

    // ユーザーメッセージを表示
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      // messagesの最後4つとuserMessageを結合してAPIにリクエスト
      let newMessages = [...messages.slice(-4), userMessage];
      const response = await generateResponseApiChatResponsePost(newMessages);

      const assistantMessage: Message = {
        message_id: uuidv4(),
        role: "assistant",
        content: response.data.content,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      newMessages = [...newMessages, assistantMessage];
      await saveMessagesApiChatSessionSessionIdMessagesPost(sessionId, newMessages);
    } catch (error) {
      console.error("Failed to get response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center pl-4">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <Card className="h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold mb-2">会話を始めましょう</h3>
                  <p>質問や会話を入力してください。AIがお答えします。</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <MessageItem key={message.message_id} message={message} />
                ))}
                <div ref={lastElementRef} />
              </div>
            )}
          </ScrollArea>

          <Separator className="mb-6" />

          <CardContent>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力..."
                disabled={loading}
                className="flex-1"
                ref={inputRef}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
