"use strict";

/* =====================================================
SUPABASE
===================================================== */

const SUPABASE_URL =
"https://xcevtpkrasvevwyvvdjq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH";

const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

/* =====================================================
ELEMENTS
===================================================== */

const loader = document.getElementById("loader");

const navbar = document.getElementById("navbar");

const menuBtn = document.getElementById("menuBtn");

const navMenu = document.getElementById("navMenu");

const loginCard = document.getElementById("loginCard");

const registerCard = document.getElementById("registerCard");

const dashboardCard = document.getElementById("dashboardCard");

const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");

const googleLogin = document.getElementById("googleLogin");

const googleRegister = document.getElementById("googleRegister");

const logoutBtn = document.getElementById("logoutBtn");

const showRegister = document.getElementById("showRegister");

const showLogin = document.getElementById("showLogin");

const forgotPassword =
document.getElementById("forgotPassword");

const loginMessage =
document.getElementById("loginMessage");

const registerMessage =
document.getElementById("registerMessage");

const userName =
document.getElementById("userName");

const userEmail =
document.getElementById("userEmail");

const avatar =
document.getElementById("avatar");

const verificationStatus =
document.getElementById("verificationStatus");

const toast =
document.getElementById("toast");

const toastText =
document.getElementById("toastText");

const closeToast =
document.getElementById("closeToast");

/* =====================================================
LOADER
===================================================== */

window.addEventListener("load", () => {

setTimeout(() => {

    if (loader) {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

    }

}, 700);

});

/* =====================================================
TOAST
===================================================== */

function showToast(message) {

if (!toast) return;

toastText.textContent = message;

toast.classList.add("show");

setTimeout(() => {

    toast.classList.remove("show");

}, 4000);

}

if (closeToast) {

closeToast.addEventListener("click", () => {

    toast.classList.remove("show");

});

}

/* =====================================================
MESSAGES
===================================================== */

function setMessage(element, message) {

if (element) {
    element.textContent = message;
}

}

/* =====================================================
MOBILE MENU
===================================================== */

if (menuBtn && navMenu) {

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});

}

document.querySelectorAll("#navMenu a")
.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});

/* =====================================================
NAVBAR SCROLL
===================================================== */

window.addEventListener("scroll", () => {

if (!navbar) return;

if (window.scrollY > 50) {

    navbar.classList.add("scrolled");

} else {

    navbar.classList.remove("scrolled");

}

});

/* =====================================================
PASSWORD VISIBILITY
===================================================== */

document
.querySelectorAll("[data-toggle]")
.forEach(button => {

    button.addEventListener("click", () => {

        const inputId =
            button.getAttribute("data-toggle");

        const input =
            document.getElementById(inputId);

        if (!input) return;

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "🙈";

        } else {

            input.type = "password";
            button.textContent = "👁";

        }

    });

});

/* =====================================================
SHOW LOGIN / REGISTER
===================================================== */

if (showRegister) {

showRegister.addEventListener("click", () => {

    loginCard.classList.add("hidden");

    registerCard.classList.remove("hidden");

    setMessage(loginMessage, "");

});

}

if (showLogin) {

showLogin.addEventListener("click", () => {

    registerCard.classList.add("hidden");

    loginCard.classList.remove("hidden");

    setMessage(registerMessage, "");

});

}

/* =====================================================
EMAIL REGISTER
===================================================== */

if (registerForm) {

registerForm.addEventListener("submit", async event => {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    setMessage(
        registerMessage,
        "Creating your account..."
    );


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {
                data: {
                    full_name: name
                }
            }

        });


    if (error) {

        setMessage(
            registerMessage,
            error.message
        );

        return;

    }


    if (data.user) {

        setMessage(
            registerMessage,
            "Account created successfully. Check your email if verification is required."
        );

        document.getElementById("registerForm").reset();

    }

});

}

/* =====================================================
EMAIL LOGIN
===================================================== */

if (loginForm) {

loginForm.addEventListener("submit", async event => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    setMessage(
        loginMessage,
        "Signing in..."
    );


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        setMessage(
            loginMessage,
            error.message
        );

        return;

    }


    setMessage(
        loginMessage,
        "Login successful."
    );

    showDashboard(data.user);

});

}

/* =====================================================
GOOGLE LOGIN
===================================================== */

async function loginWithGoogle() {

const { error } =
    await supabaseClient.auth.signInWithOAuth({

        provider: "google",

        options: {
            redirectTo: window.location.origin
        }

    });


if (error) {

    showToast(
        "Google login failed: " + error.message
    );

}

}

if (googleLogin) {

googleLogin.addEventListener(
    "click",
    loginWithGoogle
);

}

if (googleRegister) {

googleRegister.addEventListener(
    "click",
    loginWithGoogle
);

}

/* =====================================================
FORGOT PASSWORD
===================================================== */

if (forgotPassword) {

forgotPassword.addEventListener("click", async event => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();


    if (!email) {

        showToast(
            "Enter your email address first."
        );

        return;

    }


    const { error } =
        await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    window.location.origin
            }
        );


    if (error) {

        showToast(error.message);

        return;

    }


    showToast(
        "Password reset instructions have been sent to your email."
    );

});

}

/* =====================================================
SHOW DASHBOARD
===================================================== */

function showDashboard(user) {

if (!user) return;

loginCard.classList.add("hidden");

registerCard.classList.add("hidden");

dashboardCard.classList.remove("hidden");


const metadata =
    user.user_metadata || {};


const name =
    metadata.full_name ||
    metadata.name ||
    user.email?.split("@")[0] ||
    "Farmer";


userName.textContent = name;

userEmail.textContent =
    user.email || "";


avatar.textContent =
    name.charAt(0).toUpperCase();


verificationStatus.textContent =
    "Your identity has not been verified yet.";


showToast(
    "Welcome, " + name + "!"
);

}

/* =====================================================
LOGOUT
===================================================== */

if (logoutBtn) {

logoutBtn.addEventListener("click", async () => {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        showToast(error.message);

        return;

    }


    dashboardCard.classList.add("hidden");

    loginCard.classList.remove("hidden");

    loginForm.reset();

    showToast("You have been signed out.");

    document
        .getElementById("analysis")
        .scrollIntoView({
            behavior: "smooth"
        });

});

}

/* =====================================================
AUTH STATE
===================================================== */

supabaseClient.auth.onAuthStateChange(
(event, session) => {

    if (session && session.user) {

        showDashboard(session.user);

    } else {

        dashboardCard.classList.add("hidden");

        loginCard.classList.remove("hidden");

    }

}

);

/* =====================================================
PROFILE
===================================================== */

const profileBtn =
document.getElementById("profileBtn");

if (profileBtn) {

profileBtn.addEventListener("click", () => {

    showToast(
        "Personal profile page will be connected next."
    );

});

}

/* =====================================================
FAYDA VERIFICATION
===================================================== */

const verifyBtn =
document.getElementById("verifyBtn");

if (verifyBtn) {

verifyBtn.addEventListener("click", () => {

    showToast(
        "Fayda identity verification will be connected through the approved verification API."
    );

});

}

/* =====================================================
AI ANALYSIS
===================================================== */

const analysisBtn =
document.getElementById("analysisBtn");

if (analysisBtn) {

analysisBtn.addEventListener("click", () => {

    showToast(
        "AI Farmer Credit Analysis is ready for the Python ML API."
    );

});

}

/* =====================================================
CONTACT FORM
===================================================== */

const contactForm =
document.getElementById("contactForm");

if (contactForm) {

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    showToast(
        "Thank you. Your message is ready to be sent."
    );

    contactForm.reset();

});

}

/* =====================================================
ACTIVE NAV
===================================================== */

const sections =
document.querySelectorAll("section[id]");

const links =
document.querySelectorAll("#navMenu a");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

    const top =
        section.offsetTop - 150;

    if (window.scrollY >= top) {

        current =
            section.getAttribute("id");

    }

});


links.forEach(link => {

    link.classList.remove("active");

    if (
        link.getAttribute("href") ===
        "#" + current
    ) {

        link.classList.add("active");

    }

});

});

/* =====================================================
STARTUP MESSAGE
===================================================== */

console.log(
"🌾 AI Farmer Credit Scorer initialized."
);

console.log(
"🔐 Authentication handled by Supabase Auth."
);

console.log(
"🛡️ Fayda verification integration is prepared for approved API connection."
);
