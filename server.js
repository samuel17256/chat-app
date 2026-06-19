require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gistme";
const JWT_SECRET = process.env.JWT_SECRET || "gistme_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ── Connect to MongoDB ──
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ── Mongoose Schemas ──
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 6 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

// ── Middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ── Auth Helper: Verify JWT from cookie ──
function verifyToken(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ── Auth Middleware ──
function requireAuth(req, res, next) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  req.user = user;
  next();
}

// ═══════════════════════════════════════════
// ── REST API Routes ──
// ═══════════════════════════════════════════

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Fill all inputs" });
    }

    if (username.trim().length < 6) {
      return res.status(400).json({ error: "Username must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email must be valid" });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[@#$%&]/.test(password) ||
      /\s/.test(password)
    ) {
      return res.status(400).json({
        error: "Password must contain uppercase, lowercase, number and special character (@#$%&)",
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) return res.status(400).json({ error: "Email already exists" });

    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) return res.status(400).json({ error: "Username already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Issue JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ message: "Account created successfully", username: user.username });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Fill all inputs" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful", username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// POST /api/auth/logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

// GET /api/auth/me — verify session for auth guard
app.get("/api/auth/me", requireAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

// Serve HTML pages (fallback routes)
app.get("/gist", (req, res) => res.sendFile(path.join(__dirname, "gist.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "register.html")));

// ═══════════════════════════════════════════
// ── Socket.io — Real-Time Chat ──
// ═══════════════════════════════════════════

// Socket.io Auth middleware
io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || "";
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) return next(new Error("Unauthorized"));

  try {
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", async (socket) => {
  const user = socket.user;
  console.log(`🔌 ${user.username} connected`);

  // Send last 50 messages on connection
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();

    socket.emit("chatHistory", messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }

  // Handle new message
  socket.on("sendMessage", async (text) => {
    if (!text || typeof text !== "string" || text.trim() === "") return;

    try {
      const msg = await Message.create({
        message: text.trim(),
        senderName: user.username,
        senderEmail: user.email,
        senderId: user.id,
      });

      // Broadcast to ALL connected clients
      io.emit("message", {
        _id: msg._id,
        message: msg.message,
        senderName: msg.senderName,
        senderEmail: msg.senderEmail,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Handle message deletion
  socket.on("deleteMessage", async (msgId) => {
    try {
      const msg = await Message.findById(msgId);
      if (!msg) return;

      // Only the sender can delete their own message
      if (msg.senderId.toString() !== user.id.toString()) return;

      await Message.findByIdAndDelete(msgId);

      // Broadcast deletion to all clients
      io.emit("messageDeleted", msgId);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 ${user.username} disconnected`);
  });
});

// ── Start Server ──
server.listen(PORT, () => {
  console.log(`🚀 GistMe server running at http://localhost:${PORT}`);
});
