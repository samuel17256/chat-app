import { 
  auth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "./firebase-config.js";

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

// Redirect logged-in users
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "gist.html";
    }
});

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        return showToast("Fill all inputs");
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showToast("Login successful", true);
            setTimeout(() => window.location.href = "gist.html", 500);
        })
        .catch((error) => {
            loginBtn.disabled = false;
            loginBtn.innerText = "Log In";
            
            let userFriendlyMessage = "Invalid email or password";
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                userFriendlyMessage = "Invalid email or password";
            } else if (error.code === "auth/invalid-email") {
                userFriendlyMessage = "Email must be valid";
            } else {
                userFriendlyMessage = error.message;
            }
            showToast(userFriendlyMessage);
        });
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