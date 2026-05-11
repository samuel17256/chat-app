const currentUser = JSON.parse(localStorage.getItem("current_user"));

// ── Auth check ──
if (!currentUser) {
  window.location.href = "login.html";
} else {
  document.getElementById("profileAvatar").innerText =
    currentUser.username[0].toUpperCase();
}

// ── Logout — only clears session, registered_users stays intact ──
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("current_user");
  window.location.href = "login.html";
});

// ── Render chats ──
function displayChats() {
  const storedChats = JSON.parse(localStorage.getItem("chats")) || [];
  const chatCard = document.getElementById("chatCard");
  chatCard.innerHTML = "";

  if (storedChats.length === 0) return;

  storedChats.forEach((chat) => {
    const isMe = chat.sender === currentUser.username;
    const initial = chat.sender?.charAt(0).toUpperCase() || "?";
    const time = new Date(chat.date || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const row = document.createElement("div");
    row.className = `flex items-end gap-2 mb-2 ${isMe ? "flex-row-reverse" : ""}`;

    row.innerHTML = `
            <div class="w-6 h-6 rounded-full text-[10px] flex items-center justify-center shrink-0
                ${isMe ? "bg-[#9e6915] text-white" : "bg-[#f5e9d3] text-[#7a500f]"}">
                ${initial}
            </div>
            <div class="max-w-[72%] text-xs leading-relaxed px-4 py-2.5 wrap-break-word
                ${
                  isMe
                    ? "bg-[#9e6915] text-white rounded-[18px] rounded-br-md"
                    : "bg-[#f0ece4] text-gray-800 rounded-[18px] rounded-bl-md"
                }">
                ${chat.message}
                <span class="block text-[10px] mt-1 text-right ${isMe ? "text-white/60" : "text-gray-400"}">
                    ${time}
                </span>
              ${isMe ? `<button class="btn-delete border-red-600 border px-2 rounded-lg text-red-50" data-id="${chat.id}">Delete</button>` : ""}
            </div>
        `;

    chatCard.appendChild(row);
  });

  const container = document.getElementById("chatContainer");
  container.scrollTop = container.scrollHeight;
}

// ── Send message ──
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let storedChats = JSON.parse(localStorage.getItem("chats")) || [];
  const chatInput = document.getElementById("yourChats");
  const message = chatInput.value.trim();

  if (message === "") return;

  storedChats.push({
    id: storedChats.length + 1,
    message: message,
    sender: currentUser.username,
    date: new Date().getTime(),
  });

  localStorage.setItem("chats", JSON.stringify(storedChats));

  chatInput.value = "";
  displayChats();
});

// ── Delete message ──
document.getElementById("chatCard").addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-delete")) return;

  const id = Number(e.target.dataset.id);
  let storedChats = JSON.parse(localStorage.getItem("chats")) || [];

  storedChats = storedChats.filter((chat) => chat.id !== id);
  localStorage.setItem("chats", JSON.stringify(storedChats));

  displayChats();
});

// ── Enter key to send ──
document.getElementById("yourChats").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// ── Init ──
displayChats();
