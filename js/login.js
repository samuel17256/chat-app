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
    setTimeout(() => div.remove(), 2000);
}

//load current user
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        return showToast("Fill all inputs");
    }

    const users = JSON.parse(localStorage.getItem("registered_users")) || [];
    const user  = users.find((u) => u.email === email && u.password === password);

    if (!user) {
        return showToast("Invalid email or password");
    }

    const session = { id: user.id, username: user.username, email: user.email };
    localStorage.setItem("current_user", JSON.stringify(session));

    showToast("Login successful", true);
    setTimeout(() => window.location.href = "gist.html", 100);
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