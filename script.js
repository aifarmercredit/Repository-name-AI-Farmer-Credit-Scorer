const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const nameGroup = document.getElementById("nameGroup");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const passwordIcon = document.getElementById("passwordIcon");
const formOptions = document.getElementById("formOptions");
const authSubmit = document.getElementById("authSubmit");
const authSubmitText = document.getElementById("authSubmitText");
const submitIcon = document.getElementById("submitIcon");
const authMessage = document.getElementById("authMessage");
const switchAuthMode = document.getElementById("switchAuthMode");
const switchText = document.getElementById("switchText");
const googleLogin = document.getElementById("googleLogin");
const forgotPassword = document.getElementById("forgotPassword");

let authMode = new URLSearchParams(window.location.search).get("mode") === "signup" ? "signup" : "signin";

function showMessage(message, type = "error") {
    authMessage.textContent = message;
    authMessage.style.color = type === "success" ? "#2f6b3f" : type === "info" ? "#46703a" : "#b3402f";
}

function setLoading(loading) {
    authSubmit.disabled = loading;
    submitIcon.className = loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-arrow-right";
    authSubmitText.textContent = loading ? (authMode === "signup" ? "Creating account…" : "Signing in…") : (authMode === "signup" ? "Create account" : "Sign in");
}

function updateAuthMode() {
    const creatingAccount = authMode === "signup";
    authTitle.textContent = creatingAccount ? "Create account" : "Welcome back";
    authSubtitle.textContent = creatingAccount ? "Create an account to start your AI-powered credit assessment." : "Sign in to continue to your AI-powered credit assessment.";
    nameGroup.style.display = creatingAccount ? "flex" : "none";
    fullName.required = creatingAccount;
    formOptions.style.display = creatingAccount ? "none" : "flex";
    password.autocomplete = creatingAccount ? "new-password" : "current-password";
    password.placeholder = creatingAccount ? "Create a password (8+ characters)" : "Enter your password";
    switchText.textContent = creatingAccount ? "Already have an account?" : "Don't have an account?";
    switchAuthMode.textContent = creatingAccount ? "Sign in" : "Create account";
    authSubmitText.textContent = creatingAccount ? "Create account" : "Sign in";
    authMessage.textContent = "";
}

async function api(path, body) {
    const response = await fetch(path, {
        method: body ? "POST" : "GET",
        credentials: "same-origin",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    return data;
}

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userEmail = email.value.trim();
    const userPassword = password.value;
    if (!userEmail || !userPassword) return showMessage("Please enter your email and password.");
    if (authMode === "signup" && !fullName.value.trim()) return showMessage("Please enter your full name.");
    if (authMode === "signup" && userPassword.length < 8) return showMessage("Password must be at least 8 characters.");
    try {
        setLoading(true);
        const result = await api(authMode === "signup" ? "/api/auth/signup" : "/api/auth/signin", { fullName: fullName.value.trim(), email: userEmail, password: userPassword });
        password.value = "";
        showMessage(`Signed in as ${result.user.email}. Opening your dashboard…`, "success");
        setTimeout(() => window.location.replace("dashboard.html"), 500);
    } catch (error) {
        showMessage(error.message);
    } finally {
        setLoading(false);
    }
});

switchAuthMode.addEventListener("click", () => {
    authMode = authMode === "signin" ? "signup" : "signin";
    password.value = "";
    updateAuthMode();
});

passwordToggle.addEventListener("click", () => {
    const visible = password.type === "password";
    password.type = visible ? "text" : "password";
    passwordIcon.className = visible ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
});

googleLogin.addEventListener("click", () => window.location.assign("/api/auth/google"));
forgotPassword.addEventListener("click", () => showMessage("Password reset needs an email provider. Contact the site administrator for now.", "info"));

async function checkSession() {
    const error = new URLSearchParams(window.location.search).get("auth_error");
    if (error) { showMessage(error); history.replaceState({}, "", window.location.pathname); return; }
    try { await api("/api/auth/session"); window.location.replace("dashboard.html"); } catch { /* Signed out is the normal first-visit state. */ }
}

document.addEventListener("DOMContentLoaded", () => { updateAuthMode(); checkSession(); });
