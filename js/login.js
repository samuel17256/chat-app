function showToast(message, isSuccess = false) {
  if (document.querySelector(".toast")) return;

  const div = document.createElement("div");
  div.innerText = message;
  div.classList.add(
    "toast", "fixed", "top-5", "right-5",
    "text-white", "px-4", "py-2",
    "rounded-lg", "shadow-lg", "z-50",
    isSuccess ? "bg-green-500" : "bg-red-500"
  );
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

// Redirect already logged-in users
async function checkAuth() {
  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      window.location.href = "gist.html";
    }
  } catch {
    // Not logged in — stay
  }
}
checkAuth();

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    return showToast("Fill all inputs");
  }

  loginBtn.disabled = true;
  loginBtn.innerText = "Logging in...";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      loginBtn.disabled = false;
      loginBtn.innerText = "Log In";
      return showToast(data.error || "Login failed");
    }

    showToast("Login successful", true);
    setTimeout(() => {
      window.location.href = "gist.html";
    }, 500);
  } catch (err) {
    loginBtn.disabled = false;
    loginBtn.innerText = "Log In";
    showToast("Network error. Please try again.");
  }
});

// ── Toggle password visibility ──
const toggleBtn = document.getElementById("togglePasswordVisibility");
if (toggleBtn) {
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById("password");
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    toggleBtn.textContent = isVisible ? "Show" : "Hide";
  });
}