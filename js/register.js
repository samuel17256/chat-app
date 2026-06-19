function showToast(message, isSuccess = false) {
  if (document.querySelector(".toast")) return;

  const div = document.createElement("div");
  div.innerText = message;
  div.classList.add(
    "toast", "fixed", "top-5", "right-5",
    "text-white", "px-4", "py-2",
    "max-w-xs", "rounded-lg", "shadow-lg", "z-50",
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
    // Not logged in — stay on this page
  }
}
checkAuth();

const createAccountBtn = document.getElementById("createBtn");

createAccountBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const usernameInput = document.getElementById("username");
  const emailInput    = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const username = usernameInput.value.trim();
  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  // ── Client-side validation ──
  if (!username || !email || !password) {
    return showToast("Fill all inputs");
  }
  if (username.length < 6) {
    return showToast("Username must be at least 6 characters");
  }
  if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
    return showToast("Email must be valid");
  }
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[@#$%&]/.test(password) ||
    /\s/.test(password)
  ) {
    return showToast("Password must contain uppercase, lowercase, number and special character (@#$%&)");
  }

  createAccountBtn.disabled = true;
  createAccountBtn.innerText = "Creating...";

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      createAccountBtn.disabled = false;
      createAccountBtn.innerText = "Create Account";
      return showToast(data.error || "Registration failed");
    }

    showToast("Account created successfully!", true);
    usernameInput.value = "";
    emailInput.value    = "";
    passwordInput.value = "";

    setTimeout(() => {
      window.location.href = "gist.html";
    }, 1200);
  } catch (err) {
    createAccountBtn.disabled = false;
    createAccountBtn.innerText = "Create Account";
    showToast("Network error. Please try again.");
  }
});

// ── Toggle password visibility ──
const togglePasswordVisibilityBtn = document.getElementById("togglePasswordVisibility");
togglePasswordVisibilityBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const passwordInput = document.getElementById("password");
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  togglePasswordVisibilityBtn.textContent = isVisible ? "Show" : "Hide";
});