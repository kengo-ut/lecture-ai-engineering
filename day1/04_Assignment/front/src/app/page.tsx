// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session } from "@/gen/schema";
import {
  retrieveSessionsApiChatSessionGet,
  createSessionApiChatSessionPost,
} from "@/gen/chat/chat";
import { Label } from "@radix-ui/react-dropdown-menu";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatInterface from "@/components/ChatInterface";
import SessionSidebar from "@/components/SessionSidebar";

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");

  // 画面サイズの監視
  useEffect(() => {
    const checkScreenSize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // セッションの取得
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await retrieveSessionsApiChatSessionGet();
        setSessions(response.data);

        // 初回読み込み時、セッションがあれば最初のセッションをアクティブにする
        if (response.data.length > 0 && !activeSession) {
          setActiveSession(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };

    fetchSessions();
  }, [activeSession]);

  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) return;

    try {
      const newSession = {
        session_id: uuidv4(),
        title: newSessionTitle,
        created_at: new Date().toISOString(),
      };
      const response = await createSessionApiChatSessionPost(newSession);
      console.log(response);

      setSessions((prev) => [...prev, newSession]);
      setActiveSession(newSession);
      setNewSessionTitle("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* セッションサイドバー */}
      <SessionSidebar
        sessions={sessions}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateSession={() => setIsCreateDialogOpen(true)}
      />

      {/* チャットインターフェース */}
      <div className="flex-1 flex flex-col h-screen pt-4">
        {activeSession ? (
          <ChatInterface
            sessionId={activeSession.session_id}
            title={activeSession.title}
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">セッションを選択または作成してください</h2>
              <p className="text-muted-foreground mb-8">
                左側のサイドバーからセッションを選択するか、新しいセッションを作成してください。
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>新しいセッションを作成</Button>
            </div>
          </div>
        )}
      </div>

      {/* セッション作成ダイアログ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいセッションを作成</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>セッションタイトル</Label>
            <Input
              id="session-title"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="セッションのタイトルを入力"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreateSession} disabled={!newSessionTitle.trim()}>
              作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
