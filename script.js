/* =========================================================
   AI FARMER CREDIT SCORER — COMBINED JAVASCRIPT
   Home + Supabase Authentication + Dashboard
========================================================= */

/* ---------------- SUPABASE CONFIG ----------------
   Put your Supabase Project URL and Publishable key here.
   NEVER put a Supabase Secret/Service Role key in this file.
----------------------------------------------------- */
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL";
const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient =
  (window.supabase && SUPABASE_URL.startsWith("http") &&
   SUPABASE_PUBLISHABLE_KEY && !SUPABASE_PUBLISHABLE_KEY.startsWith("PASTE_"))
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

/* ---------------- PAGE NAVIGATION ---------------- */
const pages = {
  home: document.getElementById("page-home"),
  auth: document.getElementById("page-auth"),
  dashboard: document.getElementById("page-dashboard")
};

function showPage(page, mode = "signin") {
  Object.values(pages).forEach(p => p.hidden = true);
  if (!pages[page]) page = "home";
  pages[page].hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" });

  if (page === "auth") {
    window.authMode = mode === "signup" ? "signup" : "signin";
    if (typeof updateAuthMode === "function") updateAuthMode();
  }
  if (page === "dashboard" && typeof loadDashboardAccount === "function") {
    loadDashboardAccount();
  }
}

function navigateFromHash() {
  const raw = window.location.hash.replace(/^#/, "") || "home";
  const [page, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  if (page === "auth") showPage("auth", params.get("mode") || "signin");
  else if (page === "dashboard") showPage("dashboard");
  else showPage("home");
}
window.addEventListener("hashchange", navigateFromHash);

/* ---------------- HOME PAGE ---------------- */
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
}
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.innerHTML = `<i class="fa-solid fa-${open ? "xmark" : "bars"}"></i>`;
  });
}
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
});

/* Intercept old page links and keep everything in this index.html */
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute("href");
  if (href === "auth.html?mode=signin") {
    event.preventDefault(); location.hash = "auth?mode=signin";
  } else if (href === "auth.html?mode=signup") {
    event.preventDefault(); location.hash = "auth?mode=signup";
  } else if (href === "dashboard.html") {
    event.preventDefault(); location.hash = "dashboard";
  } else if (href === "index.html") {
    event.preventDefault(); location.hash = "home";
  }
});

const sections = [...document.querySelectorAll("#page-home main section[id]")];
window.addEventListener("scroll", () => {
  const current = sections.filter(s => s.offsetTop <= window.scrollY + 140).pop();
  document.querySelectorAll("#page-home .nav-links a[href^='#']").forEach(link => {
    link.classList.toggle("active", !!current && link.getAttribute("href") === `#${current.id}`);
  });
}, { passive: true });

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = document.getElementById("contactName");
    const name = input ? input.value.trim().split(" ")[0] : "";
    const status = document.getElementById("contactStatus");
    if (status) status.textContent = `Thanks${name ? `, ${name}` : ""}! Your message has been received.`;
    contactForm.reset();
  });
}

/* Live preview widget */
const acresRange = document.getElementById("acresRange");
const incomeRange = document.getElementById("incomeRange");
const historyRange = document.getElementById("historyRange");
const acresOut = document.getElementById("acresOut");
const incomeOut = document.getElementById("incomeOut");
const historyOut = document.getElementById("historyOut");
const previewScore = document.getElementById("previewScore");
const previewLabel = document.getElementById("previewLabel");

function updatePreview() {
  if (!acresRange || !incomeRange || !historyRange) return;
  const acres = Number(acresRange.value);
  const income = Number(incomeRange.value);
  const historyIndex = Number(historyRange.value);
  const historyLabels = ["Often late", "Occasionally late", "No history yet", "Always on time"];
  const historyScores = [0, 10, 12, 20];
  if (acresOut) acresOut.textContent = `${acres} acre${acres === 1 ? "" : "s"}`;
  if (incomeOut) incomeOut.textContent = `KSh ${income.toLocaleString()}`;
  if (historyOut) historyOut.textContent = historyLabels[historyIndex];
  let score = 35 + Math.min(acres * 1.5, 12) + Math.min(income / 5000, 18) + historyScores[historyIndex];
  score = Math.max(20, Math.min(95, Math.round(score)));
  if (previewScore) previewScore.textContent = score;
  if (previewLabel) previewLabel.textContent = score >= 75 ? "Strong readiness" : score >= 55 ? "Developing readiness" : "Needs improvement";
}
[acresRange, incomeRange, historyRange].filter(Boolean).forEach(i => i.addEventListener("input", updatePreview));
updatePreview();

/* ---------------- AUTH PAGE ---------------- */
window.authMode = new URLSearchParams(location.hash.split("?")[1] || "").get("mode") === "signup" ? "signup" : "signin";

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

function showAuthMessage(message, type = "error") {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = type === "success" ? "#2f6b3f" : type === "info" ? "#46703a" : "#b3402f";
}
function setLoading(loading) {
  if (!authSubmit) return;
  authSubmit.disabled = loading;
  if (submitIcon) submitIcon.className = loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-arrow-right";
  if (authSubmitText) authSubmitText.textContent = loading ? (window.authMode === "signup" ? "Creating account…" : "Signing in…") : (window.authMode === "signup" ? "Create account" : "Sign in");
}
function updateAuthMode() {
  const creating = window.authMode === "signup";
  if (!authTitle) return;
  authTitle.textContent = creating ? "Create account" : "Welcome back";
  authSubtitle.textContent = creating ? "Create an account to start your AI-powered credit assessment." : "Sign in to continue to your AI-powered credit assessment.";
  nameGroup.style.display = creating ? "flex" : "none";
  fullName.required = creating;
  formOptions.style.display = creating ? "none" : "flex";
  password.autocomplete = creating ? "new-password" : "current-password";
  password.placeholder = creating ? "Create a password (8+ characters)" : "Enter your password";
  switchText.textContent = creating ? "Already have an account?" : "Don't have an account?";
  switchAuthMode.textContent = creating ? "Sign in" : "Create account";
  authSubmitText.textContent = creating ? "Create account" : "Sign in";
  authMessage.textContent = "";
}
if (switchAuthMode) switchAuthMode.addEventListener("click", () => {
  window.authMode = window.authMode === "signin" ? "signup" : "signin";
  password.value = "";
  updateAuthMode();
});
if (passwordToggle) passwordToggle.addEventListener("click", () => {
  const visible = password.type === "password";
  password.type = visible ? "text" : "password";
  passwordIcon.className = visible ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
});

if (authForm) authForm.addEventListener("submit", async event => {
  event.preventDefault();
  const userEmail = email.value.trim();
  const userPassword = password.value;
  if (!supabaseClient) return showAuthMessage("Supabase is not configured. Add your Project URL and Publishable key in script.js.");
  if (!userEmail || !userPassword) return showAuthMessage("Please enter your email and password.");
  if (window.authMode === "signup" && !fullName.value.trim()) return showAuthMessage("Please enter your full name.");
  if (window.authMode === "signup" && userPassword.length < 8) return showAuthMessage("Password must be at least 8 characters.");

  try {
    setLoading(true);
    if (window.authMode === "signup") {
      const { data, error } = await supabaseClient.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
          data: { full_name: fullName.value.trim() },
          emailRedirectTo: window.location.href.split("#")[0] + "#dashboard"
        }
      });
      if (error) throw error;
      if (data.session) {
        showAuthMessage("Account created successfully. Opening your dashboard…", "success");
        setTimeout(() => location.hash = "dashboard", 500);
      } else {
        showAuthMessage("Account created. Check your email to confirm your account, then sign in.", "success");
      }
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email: userEmail, password: userPassword });
      if (error) throw error;
      if (data.session) {
        showAuthMessage("Sign in successful. Opening your dashboard…", "success");
        setTimeout(() => location.hash = "dashboard", 500);
      }
    }
  } catch (error) {
    showAuthMessage(error.message || "Authentication failed.");
  } finally {
    setLoading(false);
  }
});

if (googleLogin) googleLogin.addEventListener("click", async () => {
  if (!supabaseClient) return showAuthMessage("Supabase is not configured. Add your Project URL and Publishable key in script.js.");
  try {
    googleLogin.disabled = true;
    googleLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Connecting to Google…</span>';
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href.split("#")[0] + "#dashboard" }
    });
    if (error) throw error;
  } catch (error) {
    showAuthMessage(error.message || "Google sign in failed.");
    googleLogin.disabled = false;
    googleLogin.innerHTML = '<i class="fa-brands fa-google" style="color:#4285f4"></i><span>Continue with Google</span>';
  }
});

if (forgotPassword) forgotPassword.addEventListener("click", async () => {
  const userEmail = email.value.trim();
  if (!supabaseClient) return showAuthMessage("Supabase is not configured.");
  if (!userEmail) return showAuthMessage("Enter your email address first.");
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(userEmail, {
      redirectTo: window.location.href.split("#")[0] + "#auth?mode=signin"
    });
    if (error) throw error;
    showAuthMessage("Password reset email sent. Check your inbox.", "success");
  } catch (error) {
    showAuthMessage(error.message || "Could not send password reset email.");
  }
});

/* ---------------- DASHBOARD PAGE ---------------- */
const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const farmerName = document.getElementById("farmerName");
const avatar = document.getElementById("avatar");
const accountButton = document.getElementById("accountButton");
const accountDropdown = document.getElementById("accountDropdown");
const assessmentForm = document.getElementById("assessmentForm");
const livePreview = document.getElementById("livePreview");
const livePreviewScore = document.getElementById("livePreviewScore");

async function loadDashboardAccount() {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getUser();
  const user = data?.user;
  if (!user) {
    location.hash = "auth?mode=signin";
    return;
  }
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Farmer";
  const firstName = name.split(" ")[0];
  if (accountName) accountName.textContent = name;
  if (accountEmail) accountEmail.textContent = user.email || "";
  if (farmerName) farmerName.textContent = firstName;
  if (avatar) avatar.textContent = firstName.charAt(0).toUpperCase();
  const today = document.getElementById("today");
  if (today) today.textContent = new Intl.DateTimeFormat("en-ET", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
}

if (accountButton) accountButton.addEventListener("click", () => {
  const open = accountDropdown.classList.toggle("open");
  accountButton.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", event => {
  if (!event.target.closest(".account-menu") && accountDropdown) accountDropdown.classList.remove("open");
});

const signOut = document.getElementById("signOut");
if (signOut) signOut.addEventListener("click", async () => {
  if (supabaseClient) await supabaseClient.auth.signOut();
  location.hash = "home";
});

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelectorAll("#page-dashboard [data-scroll]").forEach(b => b.addEventListener("click", () => scrollToSection(b.dataset.scroll)));
document.querySelectorAll("#page-dashboard .nav-item").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#page-dashboard .nav-item").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  scrollToSection(button.dataset.target);
  closeSidebar();
}));

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
function closeSidebar() {
  sidebar?.classList.remove("open");
  overlay?.classList.remove("open");
}
const menuButton = document.getElementById("menuButton");
if (menuButton) menuButton.addEventListener("click", () => {
  sidebar?.classList.add("open");
  overlay?.classList.add("open");
});
overlay?.addEventListener("click", closeSidebar);

function calculateScore() {
  const acres = Number(document.getElementById("farmSize")?.value || 0);
  const years = Number(document.getElementById("yearsFarming")?.value || 0);
  const income = Number(document.getElementById("monthlyIncome")?.value || 0);
  const loan = Number(document.getElementById("loanBalance")?.value || 0);
  const history = document.getElementById("repaymentHistory")?.value || "";
  let score = 35;
  score += Math.min(acres * 1.5, 12) + Math.min(years * 2, 15) + Math.min(income / 5000, 18);
  score += ({ good: 20, fair: 10, new: 12, poor: 0 })[history] || 0;
  if (income > 0) score -= Math.min((loan / (income * 12)) * 12, 18);
  return Math.max(20, Math.min(95, Math.round(score)));
}
function formHasEnoughData() {
  return document.getElementById("farmSize")?.value && document.getElementById("monthlyIncome")?.value;
}
["farmSize","yearsFarming","monthlyIncome","loanBalance","repaymentHistory"].forEach(id => {
  const el = document.getElementById(id);
  el?.addEventListener("input", () => {
    if (formHasEnoughData()) {
      if (livePreview) livePreview.hidden = false;
      if (livePreviewScore) livePreviewScore.textContent = `${calculateScore()} / 100`;
    } else if (livePreview) livePreview.hidden = true;
  });
});
if (assessmentForm) assessmentForm.addEventListener("submit", event => {
  event.preventDefault();
  const score = calculateScore();
  const title = score >= 75 ? "Strong readiness" : score >= 55 ? "Developing readiness" : "Needs improvement";
  const message = score >= 75
    ? "Your farming experience, cash flow and repayment profile indicate good lending readiness."
    : score >= 55
    ? "You have a useful foundation. Better records and lower debt can strengthen your next application."
    : "Focus on reliable farm records, steady income and timely repayments before applying for a larger loan.";
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");
  const summaryScore = document.getElementById("summaryScore");
  if (resultTitle) resultTitle.textContent = title;
  if (resultMessage) resultMessage.textContent = message;
  if (summaryScore) summaryScore.textContent = `${score} / 100`;
  if (typeof animateScore === "function") animateScore(score);
  document.getElementById("resultCard")?.scrollIntoView({ behavior: "smooth" });
});
document.getElementById("recalculate")?.addEventListener("click", () => scrollToSection("assessment"));

/* ---------------- START ---------------- */
(async function init() {
  if (supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    const session = data?.session;
    if (session && location.hash === "#dashboard") {
      showPage("dashboard");
    } else {
      navigateFromHash();
    }
    supabaseClient.auth.onAuthStateChange((_event, sessionNow) => {
      if (sessionNow && location.hash === "#dashboard") showPage("dashboard");
    });
  } else {
    navigateFromHash();
  }
})();
