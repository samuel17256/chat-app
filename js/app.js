let currentUser = null;
const socket = io();

// ── Auth Guard: verify session ──
async function initAuth() {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }
    const data = await res.json();
    currentUser = data.user;

    const name = currentUser.username || currentUser.email || "?";
    document.getElementById("profileAvatar").innerText = name[0].toUpperCase();
  } catch {
    window.location.href = "login.html";
  }
}

// ── Logout ──
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    window.location.href = "login.html";
  }
});

// ── Render a single chat bubble ──
function renderMessage(chat, prepend = false) {
  const chatCard = document.getElementById("chatCard");
  const isMe = chat.senderEmail === currentUser.email;
  const initial = (chat.senderName || "?")[0].toUpperCase();
  const time = new Date(chat.createdAt || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const row = document.createElement("div");
  row.className = `flex items-end gap-2 mb-2 ${isMe ? "flex-row-reverse" : ""}`;
  row.dataset.id = chat._id;

  row.innerHTML = `
    <div class="w-6 h-6 rounded-full text-[10px] flex items-center justify-center shrink-0
      ${isMe ? "bg-[#9e6915] text-white" : "bg-[#f5e9d3] text-[#7a500f]"}">
      ${initial}
    </div>
    <div class="max-w-[72%] text-xs leading-relaxed px-4 py-2.5 wrap-break-word
      ${isMe
        ? "bg-[#9e6915] text-white rounded-[18px] rounded-br-md"
        : "bg-[#f0ece4] text-gray-800 rounded-[18px] rounded-bl-md"}">
      <span class="block text-[9px] font-bold opacity-60 mb-0.5">${chat.senderName}</span>
      ${chat.message}
      <span class="block text-[10px] mt-1 text-right ${isMe ? "text-white/60" : "text-gray-400"}">
        ${time}
      </span>
      ${isMe ? `<button class="btn-delete border-red-400 border px-2 py-0.5 rounded-lg text-red-100 mt-1 cursor-pointer block hover:bg-red-500 hover:text-white transition-colors text-[10px]" data-id="${chat._id}">Delete</button>` : ""}
    </div>
  `;

  if (prepend) {
    chatCard.prepend(row);
  } else {
    chatCard.appendChild(row);
  }

  // Scroll to latest message
  const container = document.getElementById("chatContainer");
  container.scrollTop = container.scrollHeight;
}

// ── Socket.io Events ──

// Receive chat history on connection
socket.on("chatHistory", (messages) => {
  const chatCard = document.getElementById("chatCard");
  chatCard.innerHTML = "";
  messages.forEach((msg) => renderMessage(msg));
});

// Receive a new real-time message
socket.on("message", (msg) => {
  renderMessage(msg);
});

// Handle real-time message deletion
socket.on("messageDeleted", (msgId) => {
  const row = document.querySelector(`[data-id="${msgId}"]`);
  if (row) row.remove();
});

// Handle socket auth error
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
  window.location.href = "login.html";
});

// ── Send Message ──
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const chatInput = document.getElementById("yourChats");
  const message = chatInput.value.trim();
  if (!message || !currentUser) return;

  socket.emit("sendMessage", message);
  chatInput.value = "";
});

// ── Delete Message ──
document.getElementById("chatCard").addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-delete")) return;
  const msgId = e.target.dataset.id;
  socket.emit("deleteMessage", msgId);
});

// ── Enter key to send ──
document.getElementById("yourChats").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// ── Initialize ──
initAuth();
