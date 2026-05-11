const createAccountBtn = document.getElementById("createBtn");

function showToast(message) {
    if (document.querySelector(".toast")) return;

    const div = document.createElement("div");
    div.innerText = message;
    div.classList.add(
        "toast", "fixed", "top-5", "right-5",
        "bg-red-500", "text-white", "px-4", "py-2",
        "max-w-xs", "rounded-lg", "shadow-lg", "z-50"
    );
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

createAccountBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const username = document.getElementById("username");
    const email    = document.getElementById("email");
    const password = document.getElementById("password");

    // ── Validation ──
    if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
        return showToast("Fill all inputs");
    }

    if (username.value.trim().length < 6) {
        return showToast("Username must be at least 6 characters");
    }

    if (!email.value.includes("@") || !email.value.includes(".") || email.value.includes(" ")) {
        return showToast("Email must be valid");
    }

    if (
        password.value.length < 8        ||
        !/[A-Z]/.test(password.value)    ||
        !/[a-z]/.test(password.value)    ||
        !/\d/.test(password.value)        ||
        !/[@#$%&]/.test(password.value)  ||
        /\s/.test(password.value)
    ) {
        return showToast("Password must contain uppercase, lowercase, number and special character (@#$%&)");
    }

  
    const users = JSON.parse(localStorage.getItem("registered_users")) || [];

    const user = {
        id:       users.length + 1,
        username: username.value.trim(),
        email:    email.value.trim(),
        password: password.value,
    };

    if (users.some((u) => u.email === user.email)) {
        return showToast("Email already exists");
    }

    if (users.some((u) => u.username === user.username)) {
        return showToast("Username already exists");
    }

    // ── Save registered user ──
    users.push(user);
    localStorage.setItem("registered_users", JSON.stringify(users));

    // ── Auto-login: save session separately ──
    const session = { id: user.id, username: user.username, email: user.email };
    localStorage.setItem("current_user", JSON.stringify(session));

    username.value = "";
    email.value    = "";
    password.value = "";

    showToast("Account created successfully!", true);
    window.location.href = "login.html";
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