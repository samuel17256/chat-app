import { 
  auth, 
  db, 
  signOut, 
  onAuthStateChanged,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot
} from "./firebase-config.js";

let currentUser = null;
let unsubscribeChats = null;

// ── Auth check & Session initialization ──
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Unsubscribe from Firestore listeners if logged out
    if (unsubscribeChats) {
      unsubscribeChats();
      unsubscribeChats = null;
    }
    window.location.href = "login.html";
  } else {
    currentUser = user;
    const name = currentUser.displayName || currentUser.email || "?";
    document.getElementById("profileAvatar").innerText = name[0].toUpperCase();
    
    // Listen to messages in real-time
    listenToChats();
  }
});

// ── Logout ──
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error: ", error);
    });
});

// ── Render chats (Real-time listener) ──
function listenToChats() {
  const chatCard = document.getElementById("chatCard");
  const chatsQuery = query(collection(db, "chats"), orderBy("date", "asc"));

  unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
    chatCard.innerHTML = "";

    if (snapshot.empty) return;

    snapshot.forEach((docSnap) => {
      const chat = docSnap.data();
      const chatId = docSnap.id;
      
      const isMe = chat.senderEmail === currentUser.email;
      const senderName = chat.senderName || chat.sender || "User";
      const initial = senderName.charAt(0).toUpperCase() || "?";
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
              <span class="block text-[9px] font-bold opacity-60 mb-0.5">${senderName}</span>
              ${chat.message}
              <span class="block text-[10px] mt-1 text-right ${isMe ? "text-white/60" : "text-gray-400"}">
                  ${time}
              </span>
            ${isMe ? `<button class="btn-delete border-red-600 border px-2 rounded-lg text-red-50 mt-1 cursor-pointer block hover:bg-red-500 hover:text-white transition-colors" data-id="${chatId}">Delete</button>` : ""}
          </div>
      `;

      chatCard.appendChild(row);
    });

    const container = document.getElementById("chatContainer");
    container.scrollTop = container.scrollHeight;
  }, (error) => {
    console.error("Firestore error: ", error);
  });
}

// ── Send message ──
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const chatInput = document.getElementById("yourChats");
  const message = chatInput.value.trim();

  if (message === "" || !currentUser) return;

  addDoc(collection(db, "chats"), {
    message: message,
    senderName: currentUser.displayName || currentUser.email.split("@")[0],
    senderEmail: currentUser.email,
    date: new Date().getTime(),
  })
  .then(() => {
    chatInput.value = "";
  })
  .catch((error) => {
    console.error("Error sending message: ", error);
  });
});

// ── Delete message ──
document.getElementById("chatCard").addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-delete")) return;

  const chatId = e.target.dataset.id;
  
  deleteDoc(doc(db, "chats", chatId))
    .catch((error) => {
      console.error("Error deleting message: ", error);
    });
});

// ── Enter key to send ──
document.getElementById("yourChats").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
