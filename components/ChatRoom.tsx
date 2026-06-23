"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { AuthUser } from "@/lib/auth";
import type { ChatMessage } from "@/models/Message";
import type { ClientToServerEvents, ServerToClientEvents } from "@/lib/socket-types";

interface ChatRoomProps {
  user: AuthUser;
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatRoom({ user }: ChatRoomProps) {
  const router = useRouter();
  const socketRef = useRef<AppSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket: AppSocket = io({ autoConnect: false });
    socketRef.current = socket;

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageDeleted", (msgId) => {
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    });

    socket.on("connect_error", () => {
      router.push("/login");
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [router]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !socketRef.current) return;

    socketRef.current.emit("sendMessage", text);
    setInput("");
  }

  function handleDelete(msgId: string) {
    socketRef.current?.emit("deleteMessage", msgId);
  }

  const initial = (user.username || user.email || "?")[0].toUpperCase();

  return (
    <div className="h-dvh flex justify-center bg-[#faf9f7]">
      <div className="flex flex-col w-full max-w-md h-dvh bg-white border-x border-gray-200">
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <span className="text-2xl text-[#9e6915] font-bold">GistMe</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9e6915] text-white text-sm font-medium flex items-center justify-center uppercase">
              {initial}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-[#9e6915] hover:text-[#cc830e] transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1 scroll-smooth">
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Today</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {messages.map((chat) => {
            const isMe = chat.senderEmail === user.email;
            const senderInitial = (chat.senderName || "?")[0].toUpperCase();

            return (
              <div
                key={chat._id}
                className={`flex items-end gap-2 mb-2 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center shrink-0 ${
                    isMe ? "bg-[#9e6915] text-white" : "bg-[#f5e9d3] text-[#7a500f]"
                  }`}
                >
                  {senderInitial}
                </div>
                <div
                  className={`max-w-[72%] text-xs leading-relaxed px-4 py-2.5 wrap-break-word ${
                    isMe
                      ? "bg-[#9e6915] text-white rounded-[18px] rounded-br-md"
                      : "bg-[#f0ece4] text-gray-800 rounded-[18px] rounded-bl-md"
                  }`}
                >
                  <span className="block text-[9px] font-bold opacity-60 mb-0.5">{chat.senderName}</span>
                  {chat.message}
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isMe ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    {formatTime(chat.createdAt)}
                  </span>
                  {isMe && (
                    <button
                      type="button"
                      onClick={() => handleDelete(chat._id)}
                      className="border-red-400 border px-2 py-0.5 rounded-lg text-red-100 mt-1 cursor-pointer block hover:bg-red-500 hover:text-white transition-colors text-[10px]"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="px-4 pb-6 pt-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 bg-[#faf9f7] border border-gray-200 rounded-full px-4 py-1.5 transition-all duration-200 focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              autoComplete="off"
              className="flex-1 bg-transparent outline-none text-xs text-gray-800 placeholder:text-gray-400 font-mono-custom py-1.5"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#9e6915] hover:bg-[#7a500f] active:scale-95 flex items-center justify-center shrink-0 transition-all duration-150"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
