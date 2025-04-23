// components/SessionSidebar.tsx
"use client";

import { Session } from "@/gen/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, X, MessageSquare } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "@/components/ui/separator";

interface SessionSidebarProps {
  sessions: Session[];
  activeSession: Session | null;
  setActiveSession: (session: Session) => void;
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: () => void;
}

export default function SessionSidebar({
  sessions,
  activeSession,
  setActiveSession,
  isOpen,
  onClose,
  onCreateSession,
}: SessionSidebarProps) {
  return (
    <>
      {/* オーバーレイ (モバイル用) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <div
        className={cn(
          "fixed md:relative z-50 h-full w-64 border-r bg-background transition-all duration-300 ease-in-out",
          isOpen ? "left-0" : "-left-64 md:left-0"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {/* 左側の操作ボタン */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button variant="outline" size="icon" onClick={onClose} aria-label="サイドバーを閉じる">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 右側のアクションボタン */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onCreateSession}
              aria-label="新しいセッションを作成"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <ModeToggle />
          </div>
        </div>

        <Separator />

        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-2 space-y-1">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <Button
                  key={session.session_id}
                  variant={activeSession?.session_id === session.session_id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveSession(session)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="truncate">{session.title}</span>
                </Button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <p>セッションがありません</p>
                <p className="mt-2">新しいセッションを作成してください</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
