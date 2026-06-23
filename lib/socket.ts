import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "@/lib/mongodb";
import { getTokenFromCookieHeader, verifyToken } from "@/lib/auth";
import { Message, toChatMessage } from "@/models/Message";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@/lib/socket-types";

export function initSocket(server: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
    server,
    {
      path: "/socket.io",
    }
  );

  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const token = getTokenFromCookieHeader(cookieHeader);

    if (!token) return next(new Error("Unauthorized"));

    const user = verifyToken(token);
    if (!user) return next(new Error("Invalid token"));

    socket.data.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    next();
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user;
    console.log(`🔌 ${user.username} connected`);

    try {
      await connectDB();
      const messages = await Message.find().sort({ createdAt: 1 }).limit(50).lean();
      socket.emit(
        "chatHistory",
        messages.map((msg) => ({
          _id: msg._id.toString(),
          message: msg.message,
          senderName: msg.senderName,
          senderEmail: msg.senderEmail,
          senderId: msg.senderId.toString(),
          createdAt: msg.createdAt.toISOString(),
        }))
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
    }

    socket.on("sendMessage", async (text) => {
      if (!text || typeof text !== "string" || text.trim() === "") return;

      try {
        await connectDB();
        const msg = await Message.create({
          message: text.trim(),
          senderName: user.username,
          senderEmail: user.email,
          senderId: user.id,
        });

        io.emit("message", toChatMessage(msg));
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("deleteMessage", async (msgId) => {
      try {
        await connectDB();
        const msg = await Message.findById(msgId);
        if (!msg) return;

        if (msg.senderId.toString() !== user.id.toString()) return;

        await Message.findByIdAndDelete(msgId);
        io.emit("messageDeleted", msgId);
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 ${user.username} disconnected`);
    });
  });

  return io;
}
