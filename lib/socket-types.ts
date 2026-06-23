import type { ChatMessage } from "@/models/Message";

export interface ServerToClientEvents {
  chatHistory: (messages: ChatMessage[]) => void;
  message: (msg: ChatMessage) => void;
  messageDeleted: (msgId: string) => void;
}

export interface ClientToServerEvents {
  sendMessage: (text: string) => void;
  deleteMessage: (msgId: string) => void;
}

export interface SocketData {
  user: {
    id: string;
    username: string;
    email: string;
  };
}
