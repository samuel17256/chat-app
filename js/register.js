import { 
  auth, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged 
} from "./firebase-config.js";

const createAccountBtn = document.getElementById("createBtn");

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
    setTimeout(() => div.remove(), 2000);
}

// Redirect logged-in users
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "gist.html";
    }
});

createAccountBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const emailInput    = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passwordInput.value;

    // ── Validation ──
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
        password.length < 8        ||
        !/[A-Z]/.test(password)    ||
        !/[a-z]/.test(password)    ||
        !/\d/.test(password)        ||
        !/[@#$%&]/.test(password)  ||
        /\s/.test(password)
    ) {
        return showToast("Password must contain uppercase, lowercase, number and special character (@#$%&)");
    }

    // Disable button to prevent double clicks
    createAccountBtn.disabled = true;
    createAccountBtn.innerText = "Creating...";

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Update display name with username
            return updateProfile(userCredential.user, {
                displayName: username
            });
        })
        .then(() => {
            showToast("Account created successfully!", true);
            usernameInput.value = "";
            emailInput.value    = "";
            passwordInput.value = "";
            
            // Redirect after toast
            setTimeout(() => {
                window.location.href = "gist.html";
            }, 1500);
        })
        .catch((error) => {
            createAccountBtn.disabled = false;
            createAccountBtn.innerText = "Create Account";
            
            let userFriendlyMessage = error.message;
            if (error.code === "auth/email-already-in-use") {
                userFriendlyMessage = "Email already exists";
            } else if (error.code === "auth/invalid-email") {
                userFriendlyMessage = "Email must be valid";
            } else if (error.code === "auth/weak-password") {
                userFriendlyMessage = "Password is too weak";
            }
            showToast(userFriendlyMessage);
        });
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